---
layout: /src/layouts/MarkdownPostLayout.astro
title: XSIAM Certified Engineer
author: Arlo Hollingshad
description: "Overview page for all content related to XSIAM-E Exam preparation."
pubDate: 2025-10-07
image:
  url: "../images/xsiam-e.png"
tags:
  [
    "XSIAM Certified Engineer"
  ]
languages: ["cortexXSIAM"]
draft: true
---

## Overview
Similar to to my adventures going for the [NGFW Certified Engineer exam](ngfw-e-overview), I'm also pursuing the XSIAM Certified Engineer and Certified Analyst Certifications. This will be the ToC for the blueprint I'm using for the engineer exam, and I'll share any other labs/work I do at the bottom.

If you're not familiar with the new certification structure, the Engineer exam is designed for individuals who are configuring and deploying XSIAM rather than operating it on a daily basis. Because the role of a SOC analyst is very different than that of a security/network engineer, these certifications are split into two, although there is a lot of overlap. 

## Blueprint
Similarly to the NGFW-E exam, the learning path is also on the data sheet linked [here](https://www.paloaltonetworks.com/content/dam/pan/en_US/assets/pdf/datasheets/education/xsiam-engineer-datasheet.pdf)

## Table of Contents
### Domain 1: Planning and Installation
1. Evaluate the existing IT infrastructure and security posture to align with XSIAM architecture
2. Evaluate deployment requirements, objectives, and resources
  a. Hardware
  b. Software
  c. Data sources
  d. Integrations
3. Identify communication requirements for XSIAM components
4. Install and configure Cortex XSIAM components
  a. Agents
  b. Broker VM
  c. Engine
5. Configure user roles, permissions, and access controls
### Domain 2: Integration and Automation
1. Onboard data sources (e.g., endpoint, network, cloud, identity)
2. Configure automation and feed integrations (e.g., messaging, SIEM, authentication, threat
intelligence feeds)
3. Implement and maintain Marketplace content packs
4. Manage automation workflow
  a. Plan
  b. Playbook tasks
  c. Customize
  d. Debug
### Domain 3: Content Optimization
1. Deploy parsing rules for unique data formats
2. Deploy data modeling rules for data normalization
3. Manage detection rules to align with provided requirements
  a. Correlation
  b. Indicators of compromise (IOCs) and behavioral indicators of compromise (BIOCs)
  c. Indicator rules
  d. Scoring rules
  e. Attack Surface Management (ASM) rules
4. Manage incident and alert layout
5. Create custom dashboards and reporting templates
### Domain 4: Maintenance and Troubleshooting
1. Manage exception and exclusion configurations
2. Manage XSIAM software component updates (e.g., content, XDR agent, XDR collector, Broker VM)
3. Troubleshoot data management issues (e.g., data ingestion, normalization, parsing)
4. Troubleshoot Cortex XSIAM components (e.g., agents, integrations, playbooks)

## Other References
As mentioned in the blueprint, there are a few other official places you can look for help with these things:
- [Palo Alto Networks TechDocs](https://docs.paloaltonetworks.com/)
- [Palo Alto Networks Resource Center](https://www.paloaltonetworks.com/resources)
- [Palo Alto Networks Cyberpedia](https://www.paloaltonetworks.com/cyberpedia)
- [Palo Alto Networks Knowledge Base](https://knowledgebase.paloaltonetworks.com/)
- [Palo Alto Networks Unit 42](https://unit42.paloaltonetworks.com/)

The utility of these sources may vary depending on topic, and if you're looking for extra help, I recommend the [Palo Alto Networks subreddit](https://www.reddit.com/r/paloaltonetworks/) and [Discord Server](https://discord.gg/vENbnGN5Yn) (not official PANW resources).

