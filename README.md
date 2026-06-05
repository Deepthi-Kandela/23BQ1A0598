23BQ1A0598 - Campus Hiring Evaluation - Backend
### Deepthi Kandela | AffordMed Technologies

---

## Repository Structure
23BQ1A0598/
├── Question1/
│   ├── Notification_System_Design.md
│   ├── priority_inbox.js
│   └── screenshot(310).png
└── Question2/
├── vehicle_scheduler.js
└── screenshot(298).png

---

# Question 1 - Campus Notification System

## Problem Statement
Design and implement a REST API notification system for a campus hiring platform. The system should support real-time notifications, persistent storage, query optimization, caching strategies, bulk notifications, and a priority inbox.

## Stages Completed

| Stage | Topic | Status |
|---|---|---|
| Stage 1 | REST API Design + Real-time Notifications | ✅ |
| Stage 2 | Database Design + SQL Queries | ✅ |
| Stage 3 | Query Optimization + Indexing | ✅ |
| Stage 4 | Caching + Performance Strategy | ✅ |
| Stage 5 | Reliable Bulk Notification System | ✅ |
| Stage 6 | Priority Inbox Implementation | ✅ |

## Files
| File | Description |
|---|---|
| `Notification_System_Design.md` | Complete design document for all 6 stages |
| `priority_inbox.js` | Working code for Stage 6 Priority Inbox |
| `screenshot.png` | Output screenshot of Priority Inbox |

## Tech Stack
- **Language:** JavaScript (Node.js)
- **Database:** PostgreSQL
- **Caching:** Redis
- **Real-time:** WebSockets (Socket.io)
- **Queue:** Message Queue (BullMQ)

## Stage 6 - Priority Inbox Algorithm

**Scoring Formula:**
score = (type_weight × 1000) - age_in_hours

**Type Weights:**
- Placement = 3 (highest priority)
- Result = 2 (medium priority)
- Event = 1 (lowest priority)

## How to Run
```bash
cd Question1
node priority_inbox.js
```

---

# Question 2 - Vehicle Maintenance Scheduler Microservice

## Problem Statement
A logistics company needs to schedule vehicle maintenance tasks across multiple depots. Each depot has a limited number of mechanic-hours available per day. Each vehicle task has a duration (hours needed) and an impact score (importance). The goal is to maximize the total impact score without exceeding the mechanic-hour budget per depot.

## Algorithm Used
**Dynamic Programming - 0/1 Knapsack**

- Each vehicle task = one item
- Duration = weight
- Impact = value
- MechanicHours = knapsack capacity

## Files
| File | Description |
|---|---|
| `vehicle_scheduler.js` | Knapsack algorithm implementation |
| `screenshot.png` | Output screenshot showing selected tasks per depot |

## Tech Stack
- **Language:** JavaScript (Node.js)
- **Algorithm:** Dynamic Programming (0/1 Knapsack)

## Depot Data
| Depot ID | Mechanic Hours |
|---|---|
| 1 | 60 |
| 2 | 135 |
| 3 | 188 |
| 4 | 97 |
| 5 | 164 |

**Total Vehicles:** 30 tasks available for scheduling

## How the Algorithm Works

Build DP table of size (n+1) x (budget+1)
For each vehicle task:

If it fits in remaining budget → choose max of (take it) or (skip it)
If it doesnt fit → skip it


Backtrack through DP table to find selected tasks
Repeat for each depot with its own budget


**Time Complexity:** O(n × W)
**Space Complexity:** O(n × W)

## How to Run
```bash
cd Question2
node vehicle_scheduler.js
```

---

## Tech Stack Summary
| Technology | Usage |
|---|---|
| JavaScript (Node.js) | Primary language |
| PostgreSQL | Relational database |
| Redis | Caching layer |
| Socket.io | Real-time WebSockets |
| BullMQ | Message queue |
| Dynamic Programming | Knapsack algorithm |

---

## Author
**Deepthi Kandela**
Roll Number: 23BQ1A0598
AffordMed Campus Hiring Evaluation - Backend
