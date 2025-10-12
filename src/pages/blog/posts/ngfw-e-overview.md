---
layout: /src/layouts/MarkdownPostLayout.astro
title: NGFW Certified Engineer
author: Arlo Hollingshad
description: "Overview page for all content related to NGFW-E Exam preparation."
pubDate: 2025-06-23
image:
  url: ""
tags:
  [
    "Strata NGFW", "NGFW Certified Engineer"
  ]
languages: ["strata"]
draft: false
---

## Overview
When Palo Alto redid their certifications and moved from Beacon to Learn Center in 2025, the most valuable resource I had for studying for Palo Alto certs vanished. 
The study guides provided a one-stop shop for everything you needed to feel confident going into one of those exams (provided you could also do some lab work). I also loved
being able to study for those exams offline. The goal of this blog series is to document my journey through acquiring (or re-acquiring) a variety of Palo Alto certs, starting
with the NGFW Certified Engineer. I'll have posts for each of the major topics (1.1, 1.2, 2.1, etc.), as well as some labs I used to flesh out my knowledge. This page will
serve as the ToC for all the different sections.

## Blueprint
The full blueprint for this exam can be found [here](https://www.paloaltonetworks.com/content/dam/pan/en_US/assets/pdf/datasheets/education/ngfw-engineer-datasheet.pdf).

## Table of Contents
### Domain 1: PAN-OS Networking Configuration
1. [Interface Configuration](ngfw-e/1-ngfw-e-interface-configuration)
2. [Zone Configuration](ngfw-e/2-ngfw-e-zone-configuration)
3. High Availability Configuration
  - Part 1 - [HA Concepts and Overview](ngfw-e/3-ngfw-e-ha-overview)
  - Part 2 - [Active/Passive HA](ngfw-e/3-ngfw-e-ha-ap)
  - Part 3 - [Active/Active HA](ngfw-e/3-ngfw-e-ha-aa)
  - Part 4 - [Clustering](ngfw-e/3-ngfw-e-ha-c)
4. Routing Configuration
5. GlobalProtect Configuration
6. VPN Tunnel Configuration

### Domain 2: PAN-OS Device Setting Configuration
1. Authentication Roles, Profiles, and Sequences
2. VSYS Configuration
3. Logging Configuration
4. Software upgrades
5. Certificate Configuration
6. On-Premesis and Cloud Identity Engine User-ID Configuration
7. Web-Proxy on PAN-OS

### Domain 3: Integration and Automation
1. Deployment Options
2. APIs to Automate Deployment
3. 3rd Party Deployment Options
4. On-Premesis Centralized Management
5. ACC Dashboard and Custom Report Configuration

## Other References
As mentioned in the blueprint, there are a few other official places you can look for help with these things:
- [Palo Alto Networks TechDocs](https://docs.paloaltonetworks.com/)
- [Palo Alto Networks Resource Center](https://www.paloaltonetworks.com/resources)
- [Palo Alto Networks Cyberpedia](https://www.paloaltonetworks.com/cyberpedia)
- [Palo Alto Networks Knowledge Base](https://knowledgebase.paloaltonetworks.com/)
- [Palo Alto Networks Unit 42](https://unit42.paloaltonetworks.com/)

The utility of these sources may vary depending on topic, and if you're looking for extra help, I recommend the [Palo Alto Networks subreddit](https://www.reddit.com/r/paloaltonetworks/) and [Discord Server](https://discord.gg/vENbnGN5Yn) (not official PANW resources).

