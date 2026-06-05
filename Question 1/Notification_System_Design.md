# Stage 1

## Core Actions the Notification Platform Should Support
- Fetch all notifications for a user
- Fetch unread notifications
- Mark a notification as read
- Mark all notifications as read
- Delete a notification
- Send a notification (admin use)
- Get unread notification count

## REST API Endpoints

### 1. Get All Notifications
**GET** `/api/v1/notifications`

**Headers:**
```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "type": "Placement",
      "message": "Google is hiring!",
      "isRead": false,
      "createdAt": "2026-06-05T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

### 2. Get Unread Count
**GET** `/api/v1/notifications/unread/count`

**Headers:**
```json
{ "Authorization": "Bearer <token>" }
```

**Response (200):**
```json
{ "success": true, "unreadCount": 5 }
```

### 3. Mark One Notification as Read
**PATCH** `/api/v1/notifications/:id/read`

**Headers:**
```json
{ "Authorization": "Bearer <token>" }
```

**Response (200):**
```json
{ "success": true, "message": "Notification marked as read" }
```

### 4. Mark All Notifications as Read
**PATCH** `/api/v1/notifications/read-all`

**Headers:**
```json
{ "Authorization": "Bearer <token>" }
```

**Response (200):**
```json
{ "success": true, "message": "All notifications marked as read" }
```

### 5. Delete a Notification
**DELETE** `/api/v1/notifications/:id`

**Headers:**
```json
{ "Authorization": "Bearer <token>" }
```

**Response (200):**
```json
{ "success": true, "message": "Notification deleted" }
```

### 6. Send Notification (Admin)
**POST** `/api/v1/notifications`

**Headers:**
```json
{
  "Authorization": "Bearer <admin-token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "studentId": "uuid",
  "type": "Placement",
  "message": "Google is hiring!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "studentId": "uuid",
    "type": "Placement",
    "message": "Google is hiring!",
    "isRead": false,
    "createdAt": "2026-06-05T10:00:00Z"
  }
}
```

## Real-Time Notification Mechanism

**Choice: WebSockets via Socket.io**

- When student logs in → `socket.join(studentId)`
- When notification is created → `socket.to(studentId).emit('new_notification', data)`
- Frontend listens and shows toast/badge instantly

**Why WebSockets:**
- Bi-directional, low latency, instant delivery
- No repeated HTTP requests hitting the DB
- Scales with Redis Pub/Sub adapter for multiple servers

---

# Stage 2

## Database Choice: PostgreSQL

**Why PostgreSQL:**
- Structured relational data (students linked to notifications)
- ACID compliant — no notification is ever lost
- Supports indexing and partitioning for large scale
- Powerful for complex filters (by type, date range, read status)

## DB Schema

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  studentId UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type VARCHAR(50) CHECK (type IN ('Placement', 'Result', 'Event')) NOT NULL,
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

## Problems at Scale (50,000 students, 5,000,000 notifications)

| Problem | Solution |
|---|---|
| Slow queries without indexes | Add composite indexes |
| Table too large | Partition by date monthly |
| Too many DB reads | Add Redis caching layer |
| Old data wasting space | Archive notifications older than 6 months |

## SQL Queries

```sql
-- Get all notifications for a student (paginated)
SELECT id, type, message, isRead, createdAt
FROM notifications
WHERE studentId = $1
ORDER BY createdAt DESC
LIMIT 20 OFFSET $2;

-- Get unread count
SELECT COUNT(*)
FROM notifications
WHERE studentId = $1 AND isRead = FALSE;

-- Mark one as read
UPDATE notifications
SET isRead = TRUE
WHERE id = $1 AND studentId = $2;

-- Mark all as read
UPDATE notifications
SET isRead = TRUE
WHERE studentId = $1 AND isRead = FALSE;

-- Delete a notification
DELETE FROM notifications
WHERE id = $1 AND studentId = $2;

-- Insert a notification
INSERT INTO notifications (studentId, type, message)
VALUES ($1, $2, $3)
RETURNING *;
```

---

# Stage 3

## Is the Original Query Accurate?

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;
```

**Problems:**
- `SELECT *` fetches all columns — wasteful
- No `LIMIT` — could return millions of rows
- No index on these columns — causes full table scan at 5M rows

**Fixed Query:**
```sql
SELECT id, type, message, createdAt
FROM notifications
WHERE studentId = 1042 AND isRead = FALSE
ORDER BY createdAt DESC
LIMIT 20;
```

**Performance before fix:** O(n) full table scan — very slow
**After index + LIMIT:** O(log n) — dramatically faster

## Should You Index Every Column?

**No — bad advice. Reasons:**
- Every INSERT/UPDATE/DELETE must also update every index → slower writes
- More disk space consumed
- Query planner gets confused with too many indexes

**Only index columns you actually filter/sort by:**
```sql
CREATE INDEX idx_notifications_student_read_date
ON notifications(studentId, isRead, createdAt DESC);
```

## Query: Students Who Got Placement Notification in Last 7 Days

```sql
SELECT DISTINCT s.id, s.name, s.email
FROM students s
JOIN notifications n ON s.id = n.studentId
WHERE n.type = 'Placement'
  AND n.createdAt >= NOW() - INTERVAL '7 days';
```

---

# Stage 4

## Problem
Notifications fetched on every page load → DB getting overwhelmed.

## Solutions and Tradeoffs

### 1. Redis Caching (Recommended)
- Cache notifications per student: key = `notifications:{studentId}`
- TTL: 60 seconds, invalidate when new notification arrives
- **Benefit:** 90% fewer DB reads
- **Tradeoff:** Slight data staleness

### 2. Pagination (Must-have)
- Always use LIMIT/OFFSET — never fetch all at once
- **Benefit:** Each query is small and fast
- **Tradeoff:** Multiple API calls for more data

### 3. WebSocket Push (Replace Polling)
- Server pushes notification to client in real time
- No need for client to request on every page load
- **Benefit:** Eliminates most read traffic
- **Tradeoff:** WebSocket connection management overhead

### 4. DB Indexing
- Composite index on (studentId, isRead, createdAt)
- **Benefit:** Queries stay fast even at millions of rows
- **Tradeoff:** Slightly slower writes

| Strategy | Benefit | Tradeoff |
|---|---|---|
| Redis Cache | 90% fewer DB reads | Slight staleness |
| Pagination | Limits query size | Multiple requests |
| WebSocket Push | No polling needed | Connection overhead |
| DB Indexing | Fast queries at scale | Slower writes |

---

# Stage 5

## Shortcomings of Original Implementation

```
for student_id in student_ids:
    send_email(student_id, message)
    save_to_db(student_id, message)
    push_to_app(student_id, message)
```

**Problems:**
- Sequential loop over 50,000 students — extremely slow
- If send_email fails at student 20,000 → remaining 30,000 missed
- No retry mechanism
- DB save and email tightly coupled — partial failure causes inconsistency
- No way to track who was notified

## Should DB Save and Email Happen Together?

**No — they must be decoupled:**
- DB save happens first (source of truth, always succeeds)
- Email is a side effect pushed to a message queue
- If email fails → queue retries automatically
- DB record exists regardless of email success

## Redesigned Pseudocode Using Message Queue

```
function notify_all(student_ids: array, message: string):

    # Step 1: Bulk insert ALL notifications to DB in one query
    bulk_insert_to_db(student_ids, message)

    # Step 2: Push each student as a job into the queue
    for student_id in student_ids:
        queue.push({
            job: "send_notification",
            student_id: student_id,
            message: message,
            retries_left: 3
        })

# Worker process (multiple workers run in parallel):
function worker():
    job = queue.pop()
    try:
        send_email(job.student_id, job.message)
        push_to_app(job.student_id, job.message)
        mark_job_complete(job.id)
    except Exception as e:
        if job.retries_left > 0:
            queue.push({ ...job, retries_left: job.retries_left - 1 })
        else:
            log_permanently_failed(job.student_id, e)
```

**Benefits:**
- Bulk DB insert = single fast query
- Queue handles retries automatically
- Workers run in parallel = 50,000 notifications sent fast
- Failed emails do not block others
- Full audit log of successes and failures

---

# Stage 6

## Priority Inbox Approach

**Priority Score Formula:**
```
score = (type_weight x 1000) - age_in_hours
```

**Type Weights:**
- Placement = 3 (highest)
- Result = 2
- Event = 1 (lowest)

**How scoring works:**
- Placement notifications always rank above Result and Event
- Within the same type, newer notifications score higher
- A very old Placement can be beaten by a very recent Placement

## Maintaining Top 10 Efficiently as New Notifications Arrive

**Use a Min-Heap of size N:**
- On new notification → compute its score
- If score > heap minimum → replace minimum, re-heapify
- Time complexity: O(log N) per new notification

**Or use Redis Sorted Set:**
```
ZADD notifications:priority:studentId <score> <notificationId>
ZREVRANGE notifications:priority:studentId 0 9
```
- O(log N) insert, O(N) retrieval — very efficient at scale
