---
layout: /src/layouts/MarkdownPostLayout.astro
title: NGFWE - 1.3.2 High Availability Active/Passive
author: Arlo Hollingshad
description: "This post covers High Availability Active/Passive mode for the Palo Alto Networks NGFW Certified Engineer certification"
pubDate: 2025-10-07
image: 
  url: ""
tags:
  [
    "Strata NGFW", "NGFW Certified Engineer", "High-Availability"
  ]
languages: ["strata"]
draft: true
---

# Active/Passive
## Mode Overview
Active/Passive is the traditional mode for HA firewalls. One devices is active and passing all traffic, while the other waits in reserve. If the active firewall fails or detects a failure, the firewalls will *failover*. The Active firewall will move to an inactive state, and the Passive firewall will become Active.
## States
1. **Active** - Firewall is live and currently passing traffic
2. **Passive** - Firewall is ready and waiting in case the Active firewall fails
3. **Non-functional** - Firewall is down for some error or is recovering from that error. This can be a device  or monitored object failure, or a configuration mis-match.
4. **Suspended** - HA has been disabled on the firewall to prevent configuration sync or failover. It still participates in all the HA communication, but will not move to an Active state without being enabled by a user.
## Configuration
> #INCOMING

# Clustering
> #INCOMING