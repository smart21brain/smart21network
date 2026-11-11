# Smart21network

Network simulator by Smart21Brain: routers, switches, MikroTik, Wi-Fi, firewalls and PCs, with Cisco IOS and RouterOS command lines, packet-by-packet simulation, goals and exams, and an AI assistant.

## Run it
* **In a browser:** open `index.html` (or `smart21network-standalone.html`).
* **Desktop app:** `npm install` then `npm start`. Build the Windows installer with `npm run build`.
* **Offline fonts:** `npm install` copies the Poppins and Nunito fonts into `fonts/` (needs internet once).
* **Phone / tablet:** serve this folder over HTTPS and "Install app" from the browser (PWA, works offline), or build an Android app, see `ANDROID.md`.

## What the simulator knows
Switching (VLANs, trunks, STP, EtherChannel, port security, DHCP snooping), routing (static, RIP, EIGRP, OSPF, **BGP**), **HSRP / VRRP**, **IPv6** (addresses, neighbour discovery, static routes, ping), NAT, ACLs, DHCP/DNS/HTTP, **syslog**, **SNMP** (get, walk, traps), **ASA-style firewall zones**, and **Wi-Fi** (signal loss, interference, WPA2 passwords, guest SSID).

## School server
`npm run server` starts `server/s21-server.js` on port 8787: accounts, cloud saves, classes, assignments with deadlines, submissions and a teacher dashboard. In the app: **Plus → Cloud and class**. See `server/README.md`.

## Known limits
* IPv6: no router advertisements / SLAAC, no OSPFv3 or IPv6 ACLs, no traceroute. Static routing only.
* BGP: eBGP and iBGP with `network`, `redistribute connected`, `next-hop-self`; no route-maps, communities, MED or local-preference.
* HSRP/VRRP: one group per interface; HSRP interface tracking only (no VRRP tracking); IOS devices only.
* SNMP is v2c read-only plus traps. Syslog and SNMP are IOS devices only (not MikroTik).
* Firewall: simplified ASA behaviour (`nameif`, `security-level`, extended ACLs, `inspect icmp`); no object groups or twice-NAT.
* The AI assistant needs internet and a reachable server (see Settings → AI server address).
