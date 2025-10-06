---
layout: /src/layouts/MarkdownPostLayout.astro
title: NGFWE - 1.3 High Availability Configuration
author: Arlo Hollingshad
description: "This post covers High Availability configuration topics for the Palo Alto Networks NGFW Certified Engineer certification"
pubDate: 2025-07-20
image: 
  url: ""
tags:
  [
    "Strata NGFW", "NGFW Certified Engineer"
  ]
languages: ["strata"]
draft: true
---

## HA Overview
High-availability (HA) in firewalls is a massive topic that is easy to grasp at a high-level, but the details have a surprising amount of nuance. It's not the kind of nuance you want to be dealing with at 3 AM, so it's worth taking a little more time to discuss. Because of that, this post will be a little longer than most. 

### Concepts
1. **Active** - The firewall(s) currently passing traffic for the network. 
2. **Passive** - The firewall not passing traffic, held in reserve in case the Primary fails. This role is not present in Active/Active or Clustering configurations, where all devices are passing traffic. 
3. **Primary Firewall** - This is the *preferred* firewall. It does *not* have to be the device passing traffic, but it will be treated as the source of truth from a configuration perspective and will generally be the active device when the environment is healthy.
4. **Secondary Firewall** - This is the *backup* firewall. It can be Active, but will generally fail back to the Primary once it recovers from whatever error caused it to fail, depending on pre-emption settings. 

Any firewall will have 2 of these roles at any given time. It could be Active/Primary, Active/Secondary, Passive/Primary, or Passive/Secondary. Active/Passive describes the state of the firewall, while Primary/Secondary is an administrative designation. These generally align to the different HA states described in the different HA modes below.


## Link Types
Before we get too far into the different types of HA, let's talk about the different HA link types. Most firewall models will have dedicated HA interfaces, the VM series being a notable exception (virtual HA links must be manually configured as HA)
1. **HA1** - AKA, the *Control Link*. This link handles all the logistics of the HA connection, such as heartbeat, state information, management plane synchronization, and User ID (if needed). When a device changes HA state, that information is communicated or detected across the HA1 link. HA1 is a Layer 3 link and requires an IP address. This traffic is not encrypted by default so if the two firewalls are not directly connected, be sure to enable encryption on this link.
2. **HA2** - AKA, the *Data Link*. This link (if configured), carries information about traffic flows from the Active (or Primary) firewall to the Passive (or Secondary) firewall. HA2 is a Layer 2 link that carries information about:
  - Established sessions
  - Forwarding tables
  - ARP tables
  - Security Associations for VPN tunnels
If HA2 is not configured, session data will not be synchronized and existing sessions will drop and need to be re-established during failover, which will lead to longer failover times and potential application disruption. 
3. **HA3** - AKA *Packet Forwarding Link*. This is only used in Active/Active configurations and is used to send packets back and forth during session creation and to handle asymmetric traffic. For example, if FW1 owns a particular session, and FW2 receives a packet for that session, FW2 will send that packet to FW1 on HA3 for appropriate routing. HA3 is a Layer 2 link that does not support encryption, so avoid connecting HA3 to anything but the paired firewall whenever possible.
4. **HA4** - HA4 is only for clusters, and is used to perform session cache synchronization among the clustered devices. It is also a Layer 2 link. 
5. **Backup Links** - HA1, HA2, and HA4 all support backup links that can be used for redundancy if one fails. These are generally unused data interfaces on the firewall that are configured as *HA type* interfaces. HA3 does not support backup links. 
[This page](https://docs.paloaltonetworks.com/ngfw/administration/high-availability/ha-ports-on-palo-alto-networks-firewalls) can provide more information about which ports can be used for which links on the different hardware models. 

## Modes
High-Availability is broadly any mechanism used to increase the availability of the firewall after a failure. For the purposes of this exam, it involves using multiple firewalls to handle traffic, so that if one goes down, there's still a functioning device to protect the network. Strategies to accomplish this vary depending on the architecture, especially between cloud and on-premesis infrastructure. The different modes that can be used to accomplish this are:
1. Active/Passive - 2 devices. One device is handling all traffic, while the other waits in reserve
2. Active/Active - 2 devices. Both devices are handling traffic, with sessions split between the two devices
3. Clustering - 2 or more devices (depending on hardware, it could be up to 16). All devices are active, and sessions are synchronized across all devices in the cluster.

For cloud environments, clustering is not supported. High-Availability in the cloud is usually handled with auto-scaling and/or load balancers before and after the firewall(s). See Palo Alto's [Reference Architectures](https://www.paloaltonetworks.com/resources/reference-architectures) for more information on your specific scenario.

## Active/Passive
### Mode Overview
Active/Passive is the traditional mode for HA firewalls. One devices is active and passing all traffic, while the other waits in reserve. If the active firewall fails or detects a failure, the firewalls will *failover*. The Active firewall will move to an inactive state, and the Passive firewall will become Active.
### States
1. **Active** - Firewall is live and currently passing traffic
2. **Passive** - Firewall is ready and waiting in case the Active firewall fails
3. **Non-functional** - Firewall is down for some error or is recovering from that error. This can be a device  or monitored object failure, or a configuration mis-match.
4. **Suspended** - HA has been disabled on the firewall to prevent configuration sync or failover. It still participates in all the HA communication, but will not move to an Active state without being enabled by a user.
### Configuration
> #INCOMING
## Active/Active
### Mode Overview
Active/Active is a more complex HA mode where both firewalls are active and passing traffic at the same time. Each firewall manages its own session routing tables and will synchronize with its peer. Active/Active can be used in both Layer 3 and Virtual Wire environments.

Active/Active is almost never the recommended configuration. It is more difficult to configure, manage, and troubleshoot. While Active/Active can handle higher peak traffic loads than Active/Passive, you should never configure the network to assume throughput more than what one firewall can handle. Because if one device goes down, the remaining firewall will not be able to handle the load. 
> #### Caveats: 
> Firewalls in Active/Active cannot receive an IP address via DHCP, and only the Primary device will act as a DHCP relay. The Secondary device will drop all DHCP broadcasts.

### States
1. **Active/Primary** - Firewall is actively passing traffic, and will also connect to User ID agents and act as a DHCP server. It will also match NAT or PBF policies tagged with the Device-ID of the active-primary firewall.
2. **Active/Secondary** - Same as Active/Primary, but matches on NAT or PBF policies tagged with the Device-ID of the active-secondary firewall. It also cannot act as a DHCP relay, but can act as a DHCP server.
3. **Tentative** - Firewall that has encountered an error and is either in an errored state, or is recovering from an errored state. This can be a failure of the device or monitored link/object. While in this state, the firewall cannot own or start sessions. If it receives any sessions, it will forward them to the Active firewall across the HA3 link. In addition, while in this state, the firewall will synchronize its routing and session tables with the Active firewall and will not leave the *Tentative* state until the *Tentative Hold Timer* has expired. Without this timer, the firewall could enter an active state before the routing table or session table were synchronized, leading to asymmetric routing or dropped packets.
4. **Non-functional** - Same as the Active/Passive state. This should be considered hard down.
5. **Suspended** - Same as the Active/passive state. Could also be called *Disabled*.

### Configuration
> #INCOMINTG
## Clustering
> #INCOMING