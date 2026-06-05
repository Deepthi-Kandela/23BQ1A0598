# Campus Hiring Evaluation - Backend
### AffordMed Technologies | Notification System Design

## About
This repository contains my solution for the AffordMed Campus Hiring Backend Evaluation.

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
- `Notification_System_Design.md` — Design document covering all 6 stages
- `priority_inbox.js` — Working code for Stage 6 Priority Inbox
- `screenshot.png` — Output screenshot of Priority Inbox

## Tech Stack
- **Language:** JavaScript (Node.js)
- **Database:** PostgreSQL
- **Caching:** Redis
- **Real-time:** WebSockets (Socket.io)
- **Queue:** Message Queue (BullMQ)

## Stage 6 Output
Priority scoring formula:
- Placement → weight 3 (highest)
- Result → weight 2
- Event → weight 1 (lowest)

Score = (type_weight × 1000) - age_in_hours
