# Risklyzer

A full-stack SOC analyst dashboard for prioritizing vulnerabilities, mapping incidents to the Cyber Kill Chain, scoring phishing threats, attributing likely threat actors, and hardening authentication — built as a capstone project alongside a 6-month cybersecurity training program.

Rather than wrapping existing security tools, each feature implements its own scoring/classification logic based on concepts from the curriculum (CVSS, the Cyber Kill Chain, social engineering red flags, threat actor profiling, and AAA/MFA principles), applied to a working full-stack application.

---

## Tech Stack

- **Frontend:** React, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT via httpOnly cookies, bcrypt password hashing
- **Testing:** Postman (API), manual browser testing (frontend)

---

## Features

| # | Feature | Status |
|---|---|---|
| 1 | [Vulnerability Risk Prioritizer](#feature-1-vulnerability-risk-prioritizer) | ✅ Complete |
| 2 | Kill Chain Mapper | 🔲 Planned |
| 3 | Phishing Red-Flag Scorer | 🔲 Planned |
| 4 | Threat Actor Attribution Engine | 🔲 Planned |
| 5 | Auth/MFA Hardening | 🔲 Planned |

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster (or local MongoDB instance)

### Setup

```bash
git clone <your-repo-url>
cd riskalyzer

# Backend
cd server
npm install
# Create a .env file (see .env.example) with:
# PORT=5000
# MONGO_URI=your-mongodb-connection-string
# JWT_SECRET=your-secret-key
npx nodemon server.js

# Frontend (separate terminal)
cd ../client
npm install
npm run dev
```

The app will be running at `http://localhost:5173` (frontend) with the API on `http://localhost:5000`.

---

## Architecture

riskalyzer/
├── client/ React frontend (Vite)
├── server/
│ ├── models/ Mongoose schemas
│ ├── controllers/ Request handling logic
│ ├── routes/ API route definitions
│ ├── services/ Business logic (scoring, classification engines)
│ ├── middleware/ Auth protection
│ └── config/ Database connection

Each feature follows the same layered pattern: **model → service (business logic) → controller → route**, keeping scoring/classification logic decoupled and testable independent of Express.

---

## Feature 1: Vulnerability Risk Prioritizer

### Problem
Most vulnerability scanners rank findings purely by CVSS base score. In practice, this is a poor prioritization signal — a high-CVSS vulnerability on an isolated internal system is often less urgent than a moderate-CVSS vulnerability that is internet-facing, actively exploited, and affects sensitive data. Risk-based vulnerability management addresses this by weighing multiple contextual factors, not just severity in isolation.

### What it does
Users submit vulnerabilities with five attributes: CVSS base score, asset criticality, network exposure, exploit availability, and data sensitivity of the affected system. The application computes a weighted **Priority Score** for each vulnerability and ranks them accordingly, so the highest real-world risk surfaces first — not just the highest CVSS number.

### Scoring model
Each vulnerability is scored using:

Priority Score = (CVSS × 0.30) + (Asset Criticality × 0.25) + (Exploit Availability × 0.25) + (Exposure × 0.10) + (Data Sensitivity × 0.10)

Categorical factors are converted to a 0–10 scale before weighting, for example:

| Exploit Availability | Score |
|---|---|
| None known | 0 |
| PoC exists | 3 |
| Actively exploited | 7 |

CVSS and Exploit Availability are weighted highest (0.30 / 0.25) because they most directly reflect real-world attack likelihood; Exposure and Data Sensitivity are weighted lower (0.10 each) since they influence *impact* rather than *likelihood*, and shouldn't outweigh whether a vulnerability is actually being exploited.

### Tech
- MongoDB schema with enum-based validation on categorical fields
- Express REST API (`/api/vulns`) with full CRUD
- Scoring logic isolated in a standalone service module, decoupled from request handling
- React dashboard with a ranked table and a per-vulnerability score breakdown view showing each factor's raw value, weight, and contribution to the final score

## Feature 2: Kill Chain Mapper

### Problem
Incident reports are usually written as narratives — a timeline of what happened, in prose. That format is readable, but it doesn't make it obvious *where in an attack's progression defenders actually detected it*, or how many stages passed before anyone noticed. The Cyber Kill Chain (Lockheed Martin) is the standard framework for breaking an attack into 7 sequential stages — Reconnaissance, Weaponization, Delivery, Exploitation, Installation, Command & Control, and Actions on Objectives — specifically so defenders can identify detection gaps after the fact.

### What it does
Users create an incident and log a series of timestamped events describing what happened. Each event is classified into a Kill Chain stage, either manually selected or suggested automatically from the event's free-text description via a keyword-matching engine. Each event also records whether it was detected *at the time* it occurred, versus only discovered in hindsight — which lets the tool calculate how many stages an attack progressed through before detection.

Events can optionally be linked to a specific vulnerability record from the Vulnerability Risk Prioritizer, connecting the two features rather than treating them as isolated tools.

### Stage-suggestion engine
Rather than calling an external NLP/ML service, event descriptions are matched against a hand-built keyword list per stage (e.g., "phishing," "attachment," and "sent" suggest *Delivery*; "beacon," "c2," and "reverse shell" suggest *Command and Control*). The stage with the most keyword matches is returned as the suggestion; on a tie, the earlier stage in the kill chain wins, which is the more conservative assumption. This is a simple heuristic, not true natural language processing — the tradeoff is transparency and predictability over the ability to catch novel phrasing, which felt like the right fit here given the suggestion is always shown alongside the analyst's own manual selection, not used in place of it.

### Detection gap analysis
Each incident's timeline visually distinguishes events detected in real time from events only identified after the fact, and surfaces a summary such as "attack progressed through 3 stage(s) before detection." This mirrors a standard post-incident review question in real SOC/IR practice: not just *what* happened, but *when did we actually notice*.

### Multi-incident dashboard
A separate overview page aggregates event counts per stage across every incident in the system, rendered as a bar chart — a quick answer to "which stage do we most often fail to catch attacks at, across our incident history."

### Tech
- MongoDB schema with embedded sub-documents (events live inside their parent incident, since they're always read/written together and never queried independently)
- Stage-classification logic isolated in its own service module, following the same pattern as the vulnerability scoring engine
- Express REST API supporting nested resource routes (`/api/incidents/:id/events/:eventId`) for operating on individual events within a parent incident
- React timeline visualization with inline event editing (re-running the classifier if the description changes) and a `recharts` bar chart for the aggregate dashboard


