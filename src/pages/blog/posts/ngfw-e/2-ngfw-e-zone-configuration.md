---
layout: /src/layouts/MarkdownPostLayout.astro
title: NGFWE - 1.2 Zone Configuration
author: Arlo Hollingshad
description: "This post covers zone configuration topics for the Palo Alto Networks NGFW Certified Engineer certification"
image:
  url: ""
#   alt: "Screenshot of NeonMint, a modern and minimalist web template built with Astro and TailwindCSS. It displays various sections such as blog, portfolio, work experience, and Markdown guide, in both light and dark modes with mint green accents."
pubDate: 2025-10-05
tags:
  [
    "Strata NGFW", "NGFW Certified Engineer", "Routing"
  ]
languages: ["strata"]
draft: false
---
## Overview
We're going to move through this section pretty quickly. This post covers basic configuration and usage of the different zone types.
**Layer 2** and **Layer 3** are the most common, but you'll need to know them all for the exam. It's important to remember that these are *security* constructs, not networking ones. Even though they have networking names, they don't define traffic behavior. This differs from other firewall vendors (notably ASA), where you can define a destination by its "zone". However, on ASA the "zone" is just the name for an interface. On Palo Alto, the same zone can be applied to multiple interfaces.

### 1. Layer 2
The layer 2 zone only applies to traffic that is intra-VLAN. If the traffic hits L3 at any point on the firewall, the L3 zone takes over.

### 2. Layer 3
This is far and away the most common zone type. L3 zones are applied to all L3 interfaces, as well as VLAN interfaces, and tunnel interfaces.

### 3. Virtual Wire
Usually used in a LAN-to-WAN type design, your virtual wire interfaces will always have a zone applied. V-Wire interfaces are always paired together, so most of the time
the default policy on a vwire is to allow intra-zone and deny inter-zone traffic. If you want to write more specific policies, you can still do so based on IP, App, Service, etc.

### 4. Tap
Remember, Tap interfaces don't have any security control over traffic, it's read-only. Tap zones must be applied to Tap interfaces, but it is mostly used for generating custom alerts or logs. 

### 5. Tunnel 
I'll be honest, I hadn't ever really thought about this zone type until writing this post. Tunnel zones are specifically used for [Tunnel Content Inspection](https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-networking-admin/tunnel-content-inspection), where the firewall can inspect the content of cleartext tunnels. This, along with the Tunnel Inspection policy, allows you to create security policy specifically for encapsulated traffic that is separate from how the security policy for the tunnel traffic. 

For example, say I'm tunneling DNS over GRE, and I want to block DNS traffic to a specific DNS server through the tunnel. Using tunnel zones would allow me to write a security policy to block that specific DNS traffic whenever it flows through the GRE tunnel. The firewall does this by creating two different sessions, an outer session and inner session. The outer session is inspected by the standard Security Policy, and the inner session is inspected by the Tunnel Inspection policy.

I don't see cleartext tunnels used much anymore, but I think this is worth calling out in case it comes up on the exam. You may not have seen it in the wild. Tunnel Inspection doesn't work on encrypted traffic, so no luck with VPNs or other encrypted tunnels. It's personally notable as the first feature that's completely new to me as part of my studies for this test. 😁

