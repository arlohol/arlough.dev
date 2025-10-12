---
layout: /src/layouts/MarkdownPostLayout.astro
title: NGFWE - 1.3.3 High Availability Active/Active
author: Arlo Hollingshad
description: "This post covers High Availability Active/Active mode for the Palo Alto Networks NGFW Certified Engineer certification"
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

# Active/Active
## Mode Overview
Active/Active is a more complex HA mode where both firewalls are active and passing traffic at the same time. Each firewall manages its own session routing tables and will synchronize with its peer. Active/Active can be used in both Layer 3 and Virtual Wire environments.

Active/Active is almost **never** the recommended configuration. It is more difficult to configure, manage, and troubleshoot. While Active/Active can handle higher peak traffic loads than Active/Passive, you should never configure the network to assume throughput more than what one firewall can handle. Because if one device goes down, the remaining firewall will not be able to handle the load. 
> ### Caveats: 
> - Firewalls in Active/Active cannot receive an IP address via DHCP, and only the Primary device will act as a DHCP relay. The Secondary device will drop all DHCP broadcasts.
> - Firewalls in the cloud do not currently support Active/Active configuration 

## States
1. **Active/Primary** - Firewall is actively passing traffic, and will also connect to User ID agents and act as a DHCP server. It will also match NAT or PBF policies tagged with the Device-ID of the active-primary firewall.
2. **Active/Secondary** - Same as Active/Primary, but matches on NAT or PBF policies tagged with the Device-ID of the active-secondary firewall. It also cannot act as a DHCP relay, but can act as a DHCP server.
3. **Tentative** - Firewall that has encountered an error and is either in an errored state, or is recovering from an errored state. This can be a failure of the device or monitored link/object. While in this state, the firewall cannot own or start sessions. If it receives any sessions, it will forward them to the Active firewall across the HA3 link. In addition, while in this state, the firewall will synchronize its routing and session tables with the Active firewall and will not leave the *Tentative* state until the *Tentative Hold Timer* has expired. Without this timer, the firewall could enter an active state before the routing table or session table were synchronized, leading to asymmetric routing or dropped packets.
4. **Non-functional** - Same as the Active/Passive state. This should be considered hard down.
5. **Suspended** - Same as the Active/passive state. Could also be called *Disabled*.

## Concepts


## Configuration
> #INCOMING