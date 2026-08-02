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
