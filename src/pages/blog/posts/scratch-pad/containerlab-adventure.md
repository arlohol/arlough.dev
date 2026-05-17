---
layout: /src/layouts/MarkdownPostLayout.astro
title: Containerlab Adventure
author: Arlo Hollingshad
description: My adventures with lab automation and ContainerLabs
image:
  url: ""
pubDate: 2026-10-15
tags:
  - containerlab
  - automation
languages:
  - strata
draft: true
---
## Problem 
I hate building labs. I love being able to test configuration changes and new features, but standing something up from scratch is not something I get a lot of value out of. Enter [Containerlabs](https://containerlab.dev). There's so much promise in being able to spin up a lab in a known state with just a few commands. The trick is getting to those commands.

## Goal
I want to be able to spin up a basic firewall lab. I'm not too ambitious about the topology, just starting off with an inside host, an outside host, and a firewall in the middle. 

## Story
The hosts are the easy part. Containerlabs can set up basic Linux hosts with everything I need. The real problem is the firewall. Containerizing a Palo Alto VM-Series firewall isn't trivial, even with all the great tooling that is out there. One of my favorite blogs, [Packetswitch.co.uk](https://www.packetswitch.co.uk/running-palo-alto-firewall-in-containerlab/) , has a post on exactly this. The devil is always in the details though. 

## Issues
I ran into a number of issues with this, and the lab still isn't in exactly the state I'd like, but I wanted to document some of the journey, so here's a bit of my adventure in case it helps anyone in the future.

---
### Issue 1: Nested Virtualization
My build environment is an Ubuntu 24.04 VM running on a Proxmox hypervisor. Inside that VM, I need to spin up a Development container, which then builds the final containerized target Virtual Machine (in my case a Palo Alto firewall). That means chasing down a bunch of nested virtualization settings. I'm not an expert on this, so it took me a fair amount of fiddling before I could even get the build to start. Turns out, I had to change some CPU settings and eventually got it running. Once that was resolved, I ran into my next issue.

> [!warning] Conclusion
> Your virtualization settings are going to be specific to the hardware and softwtare that you're using, so it's tricky to provide exact steps to resolve it. Check the settings for your particular situation and make sure you've got nested virtualization configured correctly and you're passing the right CPU settings down to your VM.

---
### Issue 2: Boxen
The first thing I tried to containerize the Palo Alto VM was [Boxen](https://github.com/carlmontanari/boxen/tree/main). I love the simplicity of this:
1. Install Boxen
2. Download .qcow2 file from Palo Alto
3. `boxen pack --disk <PA_VM-x.y.z.qcow2`
4. Profit!

However, things aren't so simple. After dealing with [[#Issue 1 Nested Virtualization|Issue 1]], I finally got Boxen to start the build container. Which almost immediately crashed out. I ended up setting a few flags to get more information, because by default, Boxen deletes the build/install logs after it packages the VM:
```
export BOXEN_LOG_LEVEL=debug
export BOXEN_DEV_MODE=1
```

These made sure that the logs were kept in the /tmp directory and I could get detailed information about what exactly crashed. Which was a lot. As far as I could tell, the main issue was that Boxen hasn't been updated in a few years and Palo Alto has changed something about the boot process since then that means Boxen just won't work with PAN-OS 12.1. 
#### Analysis
Here's how Boxen works at a high level:
1. Boxen spins up a *build* container.
2. Inside that build container, Boxen launches the VM and monitors the start up.
3. After start up and a brief (configurable) initial configuration, Boxen takes a snapshot of the VM and ports it to a fresh container
4. That second image is the containerized virtual machine

A lot of this relies on [Scrapli](https://github.com/scrapli/scrapligo), which makes sense, because both Scrapli and Boxen are developed and maintained by the amazing [Carl Montanari](https://github.com/carlmontanari). In the case of the Palo Alto firewalls, the issue is that the VM's boot process takes a long time and has a variety of "login" prompts that it cycles through before you even get to the official login prompt :
```
vm login: # False login
PA-HDF login: # Second false login
PA-VM login: # *Real login prompt*
```

Boxen has logic to handle this, but even with setting excessively long timeouts, I was getting issues with the build process not completing. Then, when I did get the build process to complete, my PA container wouldn't start. After a few days of this, I gave up and tried another tool to build the container.

> [!warning] Conclusion
> Boxen needs an update if it's going to handle PAN-OS 12.1, and I don't know enough about Scrapli or Go to do a deep dive. So before I take any more time on it, I want to try another tool.

### Issue 3: Pivot
I eventually noticed that Packetswitch listed two potential tools for packaging the firewall container. Boxen and VRNetlab. There two interesting repositories for VRNetLab, a fork by [SRL Labs](https://github.com/srl-labs/vrnetlab), and the other under [VRNetLab](https://github.com/vrnetlab/vrnetlab) on Github. I initially dismissed the fork, but it's a pretty active repo, and the aforementioned Carl Montanari seems to be linked with SRL Labs. The other reason, is that the SRL Labs fork has a builder for Palo Alto Firewalls. 

#### Analysis
If I'd read through the [README](https://github.com/srl-labs/vrnetlab/blob/master/README.md) of the SRL Labs fork, I would have seen much sooner that this is what I needed.

> [!warning] Conclusion
> Read the documentation. 😁

### Issue 4: More Fun with Virtualization
The advantage with VRNetLab is that the build settings are much more transparent than what was going on in Boxen, and there's a handy-dandy `launch.py` file I can tweak when something goes wrong. I got the container to build almost immediately, but it failed to boot when I deployed my lab.

Because I'm being difficult and using an un-tested version of PAN-OS, I had to make a few modifications to the launch file to get my container to boot properly. 
#### Modification 1: More CPU issues
The original file:
``` python
super(PAN_vm, self).__init__(
	username, 
	password, 
	disk_image=disk_image, 
	ram=6144, 
	cpu="host,level=9", 
	smp="2,sockets=1,cores=1")
```

My modifications
```python
super(PAN_vm, self).__init__(
	username, 
	password, 
	disk_image=disk_image, 
	ram=8192, 
	cpu="Nehalem", 
	smp="4,sockets=1,cores=4")
```
Pretty simple. PAN-OS 12.1 has higher hardware requirements than the documented supported versions, and I needed a more modern CPU setting than what was getting passed down from my host, otherwise I was getting kernel panics. There's probably a better way to fix this, but I want to configure firewalls, not adjust CPU settings all day.

#### Modification 2: 
Original code:
``` python
(ridx, match, res) = self.tn.expect(
	[
		b"Login incorrect",
		b"vm login:",
		b"PA-HDF login",
		b"PA-VM login:",
		b"[pP]assword:",
		b"Enter old password :",
		b"Enter new password :",
		b"Confirm password   :",
		b"admin@PA-VM>",
	],
	1,
)
if match:  # got a match!
	if ridx == 0:
		self.logger.debug("login incorrect, sleeping a bit")
		time.sleep(30)
	if ridx == 1:
		self.wait_write("", wait=None)
		time.sleep(30)
	elif ridx == 2:  # PA-HDF login
		self.wait_write("", wait=None)
		time.sleep(30)
	elif ridx == 3:  # login
		self.logger.debug("sending username 'admin'")
		self.wait_write("admin", wait=None)
	elif ridx == 4:
		self.logger.debug("sending password 'admin'")
		self.wait_write("admin", wait=None)
	elif ridx == 5:
		self.logger.debug("sending 'old' password 'admin'")
		self.wait_write("admin", wait=None)
	elif ridx == 6:
		self.logger.debug(f"sending 'new' password '{self.password}'")
		self.wait_write(self.password, wait=None)
	elif ridx == 7:
		self.logger.debug(f"confirming 'new' password '{self.password}'")
		self.wait_write(self.password, wait=None)
	elif ridx == 8:
		# run main config!
		self.bootstrap_config()
		self.startup_config()
		# close telnet connection
		self.tn.close()
		# startup time?
		startup_time = datetime.datetime.now() - self.start_time
		self.logger.info("Startup complete in: %s" % startup_time)
		# mark as running
		self.running = True
		return
```

```python
(ridx, match, res) = self.tn.expect(
	[
		b"Login incorrect",
		b"vm login:",
		b"PA-HDF login",
		b"PA-VM login:",
		b"[pP]assword:",
		b"Enter old password :",
		b"Enter new password :",
		b"Confirm password   :",
		b"admin@PA-VM>",
	],
	1,
)
if match:  # got a match!
	if ridx == 0:
		self.logger.debug("login incorrect, sleeping a bit")
		time.sleep(30)
	if ridx == 1:
		self.wait_write("\n", wait=None)
		time.sleep(30)
	elif ridx == 2:  # PA-HDF login
		self.wait_write("\n", wait=None)
		time.sleep(10)
	elif ridx == 3:  # login
		self.logger.debug("sending username 'admin'")
		self.wait_write("admin", wait=None)
	elif ridx == 4:
		self.logger.debug("sending password 'admin'")
		self.wait_write("admin", wait=None)
	elif ridx == 5:
		self.logger.debug("sending 'old' password 'admin'")
		self.wait_write("admin", wait=None)
	elif ridx == 6:
		self.logger.debug(f"sending 'new' password '{self.password}'")
		self.wait_write(self.password, wait=None)
	elif ridx == 7:
		self.logger.debug(f"confirming 'new' password '{self.password}'")
		self.wait_write(self.password, wait=None)
	elif ridx == 8:
		# run main config!
		self.bootstrap_config()
		self.startup_config()
		# close telnet connection
		self.tn.close()
		# startup time?
		startup_time = datetime.datetime.now() - self.start_time
		self.logger.info("Startup complete in: %s" % startup_time)
		# mark as running
		self.running = True
		return

```
This change is a bit more subtle. I was running into issues with timeouts, and when I looked at the logs, the PA-VMs were never getting past the `PA-HDF` login above. VRNetLab and Boxen use similar terminal monitoring to boot the VM and build the container. 
```
Telnet session was disconnected, restarting
```
When this happens during the firewall boot up, the entire container reboots, and I got into a boot loop. As far as I can tell, this is a feature of VRNetLab that when it detects an error with the QEMU process used for interacting with the VM (in this case over telnet), it assumes something is wrong and restarts the boot process. 

I modified `launch.py` to send a newline character instead of an empty string, and that seemed to keep the firewall container out of the boot loop.

>[!tip] Win!
>I finally have a PA-VM firewall booting in a container! Next steps: Get it into Containerlab.

### Issue 5: Containerlab Access
Containerlab does have [documentation around Palo Alto firewalls](https://containerlab.dev/manual/kinds/vr-pan/), but it's a little sparse on details for getting the container built. I initially started by copying the config from [Packetswitch](https://www.packetswitch.co.uk/running-palo-alto-firewall-in-containerlab/), but made a few modifications

### Issue 6: Containerlab Host NAT
```bash
sudo iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -d 172.20.20.0/24 -j MASQUERADE
```

```bash
sudo apt-get install iptables-persistent
```