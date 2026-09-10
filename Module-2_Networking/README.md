# Willowbrook General Hospital — Enterprise Network Design

A multi-site hospital network built and configured in Cisco Packet Tracer, demonstrating multi-area OSPF, VLAN segmentation, WLAN deployment, and layered ACL-based security across a main campus and two satellite clinics.

**Module 2 Networking Capstone** — designed, built, and documented end-to-end, including live troubleshooting of real configuration issues.

---

## Overview

Willowbrook General Hospital needed a network that could:
- Connect a main campus and two satellite clinics over WAN links
- Segment traffic by department (Reception, Doctors, Nursing, Pharmacy, Radiology, Administration)
- Provide guest Wi-Fi for patients/visitors that is fully isolated from clinical systems
- Restrict access to Electronic Health Records (EHR) to only the staff who clinically need it
- Host a public-facing patient portal without exposing the internal network

This repo contains the full design rationale, final configuration record, and the Packet Tracer file itself.

## Topology

```
                         [ISP Router] --- Internet (simulated)
                              |
                        +-----------+
                        |  R-MAIN   |  <-- Area 0 (backbone)
                        +-----------+
                          /        \
                    Serial       Serial
                       |               |
                 +-----------+   +-----------+
                 | R-ClinicA |   | R-ClinicB |   <-- ABRs
                 +-----------+   +-----------+
                    Area 1           Area 2
                       |               |
                 [SW-ClinicA]    [SW-ClinicB]
                  /   |   \       /   |   \
             Reception Doctors Nursing Guest   (same pattern per clinic)
```

Main campus hosts 7 department VLANs, an internal EHR server, and a DMZ-hosted patient portal. Each clinic hosts a reduced 4-VLAN set (Reception, Doctors, Nursing, Guest).

*(See `/screenshots/topology.png` for the full Packet Tracer canvas.)*

## Skills Demonstrated

- **Routing:** Multi-area OSPF with route summarization at each ABR; static default routing to a simulated ISP
- **Switching:** VLAN segmentation, 802.1Q trunking, router-on-a-stick inter-VLAN routing
- **Wireless:** WPA2/AES-secured guest SSIDs across three sites, non-overlapping channel planning (1/6/11)
- **Security:** Standard/extended/named ACLs, VTY hardening, role-based access control, DMZ design with anti-spoofing
- **Addressing:** VLSM-based IP plan across WAN links, department VLANs, and server subnets
- **Troubleshooting:** Diagnosed and resolved real OSPF adjacency failures, ACL ordering bugs, and interface-processing issues (details below)

## Architecture Decisions

| Decision | Reasoning |
|---|---|
| WAN links placed in Area 0, not the clinic's local area | Makes each clinic router a true ABR, enabling `area range` summarization |
| Servers static, staff/guest devices on DHCP | Servers are referenced directly by IP in ACLs; DHCP is more realistic and reduces manual config for end devices |
| Reception & Administration excluded from EHR access | Neither role has a direct clinical need to touch patient records |
| ICMP permitted to EHR/Portal only for specific subnets | Enables demonstrable, testable evidence in the lab; a real deployment might omit this entirely |
| ACL121 (anti-spoofing) placed at the true ISP-facing edge | The only interface where spoofed internal-source packets can be reliably identified and dropped |

## Security Summary

| Control | Scope | Purpose |
|---|---|---|
| VTY ACL (access-list 10) | All 3 routers | Only the IT Admin subnet (172.20.60.0/24) can SSH into any router |
| GUEST-ISOLATION | All 3 sites | Guest Wi-Fi can reach the internet but no internal subnet, anywhere |
| EHR-ACCESS | Main hospital, applied to Server VLAN | Only Doctors/Nursing/Pharmacy (any site) reach the EHR server, HTTPS only |
| ACL111 / ACL112 (DMZ) | Main hospital, DMZ subinterface | Public reaches the patient portal via HTTPS only; ICMP restricted to Admin |
| ACL121 (anti-spoofing) | ISP-facing interface | Drops inbound packets forging an internal, loopback, or multicast source address |



## Lessons Learned

A few of the real issues hit during the build — kept honest rather than cleaned up, since the debugging is as much the point as the final config:

- **A forgotten `no passive-interface` line silently blocked an entire OSPF adjacency** — everything else about the config was correct, which made it a good reminder to double-check passive-interface state whenever a new link is added to an existing router.
- **A single-character typo in an OSPF `network` statement** (`.255` instead of `.5`) produced a symptom identical to a real adjacency failure — reinforced the value of checking exact IPs character-by-character before assuming a design flaw.
- **ACLs applied to a bare router-on-a-stick parent interface filtered nothing**, since that interface has no IP processing at all in this design — everything lives on the subinterfaces. Two redundant ACLs were removed once this was understood, rather than relocated.
- **Named ACLs append new lines to the bottom** — adding permit lines after an existing `deny ip any any` made them unreachable. Fixed by rebuilding the ACL cleanly rather than inserting at line numbers, given time constraints.
- **A "failed" ping wasn't always a bug** — one ACL was deliberately restricting ICMP to the Admin subnet only; the fix was retesting from the correct device, not changing the configuration.


## How to Open

1. Download `Willowbrook_Hospital.pkt`
2. Open in [Cisco Packet Tracer](https://www.netacad.com/courses/packet-tracer) (free with a Cisco Networking Academy account)
3. See `doc.pdf` for the full design rationale and configuration reference

