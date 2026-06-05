# Question 2 - Vehicle Maintenance Scheduler Microservice

## Problem Statement
A logistics company needs to schedule vehicle maintenance tasks across multiple depots. Each depot has a limited number of mechanic-hours available per day. Each vehicle task has a duration (hours needed) and an impact score (importance). The goal is to maximize the total impact score without exceeding the mechanic-hour budget per depot.

## Algorithm Used
**Dynamic Programming - 0/1 Knapsack**

This is a classic knapsack problem:
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

## Data
**Depots:**
| Depot ID | Mechanic Hours |
|---|---|
| 1 | 60 |
| 2 | 135 |
| 3 | 188 |
| 4 | 97 |
| 5 | 164 |

**Total Vehicles:** 30 tasks available for scheduling

## How the Algorithm Works
