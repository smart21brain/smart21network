// Content of the search-engine landing pages. Edit the text here, then run: npm run web:prep
const SITE = 'https://smart21network.smart21brain.com';
const NOTE_TM = 'Cisco, CCNA, IOS and Packet Tracer are trademarks of Cisco Systems, Inc. MikroTik and RouterOS are trademarks of MikroTik. Smart21network is an independent product by Smart21Brain and is not affiliated with or endorsed by them.';

const pages = [
{
  slug: 'network-simulator', nav: 'Network simulator',
  title: 'Free Online Network Simulator – Routers, Switches, MikroTik',
  desc: 'Free online network simulator. Build topologies with routers, switches, MikroTik and Wi-Fi, use Cisco IOS and RouterOS commands and watch packets travel.',
  h1: 'Free online network simulator for routers, switches, MikroTik and Wi-Fi',
  lead: 'Smart21network runs in your browser. Drag devices onto the canvas, cable them together, configure them from a real-looking command line and watch every packet travel hop by hop. You can start without an account and without installing anything.',
  sections: [
    { h2: 'What you can build', list: [
      'Small office and home networks with routers, switches, access points and PCs',
      'Campus designs with VLANs, trunks, spanning tree and EtherChannel',
      'Routed networks with static routes, RIP, EIGRP, OSPF and BGP',
      'Internet-style labs with NAT, DHCP, DNS and web servers',
      'Secured networks with ACLs, port security, DHCP snooping and firewall zones',
      'Wireless networks with signal loss, interference, WPA2 passwords and guest SSIDs' ] },
    { h2: 'Start in three steps', ol: [
      'Open the simulator and drag a router, a switch and two PCs onto the canvas.',
      'Cable them together, then click a device to open its command line or settings.',
      'Run a ping and watch the packet move across the topology, one hop at a time.' ] },
    { h2: 'Two command-line styles', p: 'Network devices speak the language you will meet on real equipment. Cisco-style devices accept IOS commands such as show ip route and switchport mode trunk. MikroTik devices accept RouterOS commands such as /ip address add and /ip firewall nat add. You learn the commands, and the simulator shows you the result.' },
    { h2: 'Check your work and keep learning', p: 'The simulator comes with goals and exams so you can check whether your network does what it should, and an AI assistant that explains errors and suggests what to try next. When there is no internet, the assistant switches to a built-in offline tutor.' },
    { h2: 'Laptop, tablet and phone', p: 'Smart21network works on laptops, tablets and phones. Use the Install app option in your browser and it keeps working offline after the first load.' }
  ],
  faq: [
    ['Is Smart21network free?', 'Yes. You can use the simulator for free in your browser.'],
    ['Do I need to create an account?', 'No. You can open the simulator and start building straight away. Accounts are only needed for the optional school features such as classes and assignments.'],
    ['Does it replace real equipment?', 'No. It simulates networks so you can practise and learn safely. Real hardware can behave differently, so use the simulator for practice and understanding.'],
    ['Does it work offline?', 'Yes. Install it from your browser and it keeps working without internet. The AI assistant needs internet, and without it you get the built-in offline tutor.']
  ],
  related: ['mikrotik-simulator', 'ccna-lab-practice', 'packet-tracer-alternative', 'vlan-lab']
},
{
  slug: 'mikrotik-simulator', nav: 'MikroTik simulator',
  title: 'MikroTik RouterOS Simulator Online (Free) – Smart21network',
  desc: 'Practise MikroTik RouterOS in your browser: addresses, routes, DHCP server and NAT masquerade on simulated MikroTik routers, free, no install.',
  h1: 'MikroTik RouterOS simulator that runs in your browser',
  lead: 'Practise the RouterOS command line without a physical router. Add MikroTik routers to a topology, give them addresses, set up DHCP and NAT, and test the result with ping, all inside Smart21network.',
  sections: [
    { h2: 'What you can practise', list: [
      'Assigning IP addresses to interfaces with /ip address add',
      'Static routes and a default route with /ip route add',
      'A DHCP server for your LAN with /ip dhcp-server',
      'Source NAT with masquerade using /ip firewall nat add',
      'Firewall rules with /ip firewall',
      'Mixing MikroTik routers with Cisco-style switches and routers in one topology' ] },
    { h2: 'Example: a simple office router', p: 'Router ether1 faces the internet and ether2 faces the office. These are the kind of commands you can type in the simulator:',
      code: ['/ip address add address=192.168.88.1/24 interface=ether2', '/ip route add dst-address=0.0.0.0/0 gateway=10.0.0.1', '/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade', '/ping 10.0.0.1'] },
    { h2: 'How close is it to RouterOS?', p: 'The command syntax follows RouterOS, so the habits you build carry over to real MikroTik devices. The simulator covers the common routing, addressing, DHCP, NAT and firewall tasks. It is a learning tool, so some advanced RouterOS features are not simulated.' },
    { h2: 'Learn with a goal', p: 'Set a goal such as "every PC can reach the web server" and use ping and the packet animation to find out what is missing. The AI assistant can explain a mistake in plain language.' }
  ],
  faq: [
    ['Is this the real RouterOS?', 'No. It is a simulator that follows RouterOS command syntax for common tasks so you can practise safely.'],
    ['Can I mix MikroTik and Cisco-style devices?', 'Yes. You can build one topology that contains both and test traffic between them.'],
    ['Do I need to install anything?', 'No. It runs in your browser, and you can also install it as an app.'],
    ['Does the simulator replace Winbox or real hardware?', 'No. It is for practice and learning. Use real devices for production work.']
  ],
  related: ['network-simulator', 'nat-acl-firewall-lab', 'ccna-lab-practice'],
  note: NOTE_TM
},
{
  slug: 'packet-tracer-alternative', nav: 'Packet Tracer alternative',
  title: 'Packet Tracer Alternative: Free Browser Network Simulator',
  desc: 'Looking for a Packet Tracer alternative? Smart21network is a free browser network simulator with Cisco IOS and MikroTik commands, no install needed.',
  h1: 'A free Packet Tracer alternative that runs in your browser',
  lead: 'If you want to practise networking but do not want to install a large program, Smart21network gives you a network simulator in a browser tab. It also works on tablets and phones, and installs as an app when you want it offline.',
  sections: [
    { h2: 'What Smart21network offers', list: [
      'Runs in the browser, with an Install app option for offline use',
      'Routers, switches, access points, PCs, MikroTik routers and firewalls',
      'Cisco-style IOS commands and MikroTik RouterOS commands',
      'VLANs, trunks, STP, EtherChannel, OSPF, EIGRP, RIP, BGP, HSRP/VRRP, NAT, ACLs and IPv6',
      'Packet-by-packet animation so you can see where a packet is dropped',
      'Goals and exams, an AI assistant and an offline tutor' ] },
    { h2: 'Who it suits', p: 'Students who study on a laptop, tablet or phone, teachers who want learners to start in seconds, and anyone who wants to try an idea quickly. It is a good way to rehearse commands before working on real equipment.' },
    { h2: 'Good to know', p: 'Smart21network is its own simulator with its own file format. It is built for learning and covers the most common features, and some advanced features of real devices are not simulated. See the list of limits in the project notes before you rely on a feature.' }
  ],
  faq: [
    ['Is it free?', 'Yes, you can use it for free.'],
    ['Does it need installation?', 'No. Open it in a browser. You can also install it from the browser menu.'],
    ['Can I use it on a phone or tablet?', 'Yes. It is designed to work on laptops, tablets and phones.'],
    ['Is it made by Cisco?', 'No. Smart21network is made by Smart21Brain and is not affiliated with Cisco.']
  ],
  related: ['network-simulator', 'ccna-lab-practice', 'mikrotik-simulator'],
  note: NOTE_TM
},
{
  slug: 'ccna-lab-practice', nav: 'CCNA lab practice',
  title: 'CCNA Lab Practice Online – VLAN, OSPF, NAT, ACL Labs',
  desc: 'Practise CCNA-level labs online: VLANs, trunks, OSPF, NAT, ACLs, STP, EtherChannel and more with Cisco-style commands in a free browser simulator.',
  h1: 'CCNA-level lab practice you can do in a browser',
  lead: 'Networking is learned by typing commands and fixing mistakes. Smart21network lets you practise the topics taught in CCNA-level courses on any device, as often as you like.',
  sections: [
    { h2: 'Topics you can practise', list: [
      'VLANs and trunks, access ports, inter-switch links',
      'Spanning tree (STP) and EtherChannel',
      'Static routing, RIP, EIGRP, OSPF and BGP basics',
      'NAT with overload, DHCP and DNS',
      'Standard and extended ACLs',
      'Port security and DHCP snooping',
      'HSRP and VRRP first-hop redundancy',
      'IPv6 addressing and static routes',
      'SNMP and syslog on Cisco-style devices' ] },
    { h2: 'A practice routine that works', ol: [
      'Pick one topic, for example OSPF between three routers.',
      'Build the topology from memory and configure it.',
      'Use show commands to verify, then test with ping.',
      'Break something on purpose and troubleshoot it.',
      'Use a goal or exam to check that you finished the task.' ] },
    { h2: 'Learn the show commands', p: 'Verification is half of networking. Practise show vlan, show ip route, show ip ospf neighbor, show ip nat translations and the other show commands until reading the output feels natural.' }
  ],
  faq: [
    ['Will this guarantee I pass an exam?', 'No tool can guarantee that. Smart21network gives you free hands-on practice with the same kinds of tasks, which helps you learn.'],
    ['Which commands does it support?', 'Cisco IOS-style commands for switching, routing, NAT, ACLs, security and redundancy, plus MikroTik RouterOS commands.'],
    ['Can I practise on my phone?', 'Yes. It works on laptops, tablets and phones.'],
    ['Is it official Cisco software?', 'No. It is an independent simulator by Smart21Brain.']
  ],
  related: ['vlan-lab', 'ospf-lab', 'nat-acl-firewall-lab', 'network-simulator'],
  note: NOTE_TM
},
{
  slug: 'vlan-lab', nav: 'VLAN lab',
  title: 'VLAN and Trunk Lab Online – Practise Switch Configuration',
  desc: 'Practise VLANs, access ports, trunks, STP and EtherChannel on simulated switches in your browser. Free VLAN lab with example commands.',
  h1: 'VLAN and trunk lab: practise switch configuration online',
  lead: 'VLANs split one physical switch into several separate networks. In this lab you create VLANs, assign ports, build a trunk and prove that the separation works, all in the simulator.',
  sections: [
    { h2: 'Lab goal', p: 'Two departments share one switch. Sales PCs go in VLAN 10 and Support PCs go in VLAN 20. PCs in the same VLAN can reach each other and PCs in different VLANs cannot, until a router joins them.' },
    { h2: 'Example commands', p: 'On a Cisco-style switch:', code: ['vlan 10', ' name SALES', 'vlan 20', ' name SUPPORT', 'interface fa0/1', ' switchport mode access', ' switchport access vlan 10', 'interface gi0/1', ' switchport mode trunk', 'end', 'show vlan brief'] },
    { h2: 'Things to try', list: [
      'Ping between two PCs in the same VLAN, then between different VLANs, and watch where the packet stops',
      'Connect two switches with a trunk and extend the VLANs across both',
      'Look at spanning tree (STP) and see which port is blocked in a loop',
      'Bundle two links with EtherChannel',
      'Turn on port security and DHCP snooping' ] }
  ],
  faq: [
    ['What is a VLAN?', 'A VLAN is a logical network inside a switch. Devices in different VLANs cannot talk directly without a router.'],
    ['What is a trunk?', 'A trunk is a link that carries traffic for several VLANs between switches.'],
    ['Can I do this without a real switch?', 'Yes. The simulator behaves like a switch so you can practise the commands safely.']
  ],
  related: ['ccna-lab-practice', 'ospf-lab', 'network-simulator']
},
{
  slug: 'ospf-lab', nav: 'OSPF lab',
  title: 'OSPF Lab Online – Practise Dynamic Routing in Your Browser',
  desc: 'Practise OSPF, RIP, EIGRP and BGP routing on simulated routers. Free OSPF lab with example commands and verification steps.',
  h1: 'OSPF lab: practise dynamic routing online',
  lead: 'Dynamic routing protocols let routers share routes automatically. In this lab you connect routers, turn on OSPF and verify that every network can reach every other network.',
  sections: [
    { h2: 'Lab goal', p: 'Three routers in a row each have a LAN. Configure OSPF area 0 so all LANs can ping each other without any static routes.' },
    { h2: 'Example commands', p: 'On each Cisco-style router (adjust the networks to your addressing):', code: ['router ospf 1', ' router-id 1.1.1.1', ' network 10.0.12.0 0.0.0.255 area 0', ' network 192.168.1.0 0.0.0.255 area 0', 'end', 'show ip ospf neighbor', 'show ip route'] },
    { h2: 'Then compare protocols', list: [
      'Replace OSPF with RIP and compare the routing tables',
      'Try EIGRP on the same topology',
      'Use static routes and a default route for small networks',
      'Explore eBGP between two autonomous systems, with network and redistribute connected' ] }
  ],
  faq: [
    ['Why is my OSPF neighbour not forming?', 'Check that interfaces are up, that both routers use the same area and that the network statements match the interface addresses.'],
    ['Does it support BGP?', 'Yes, basic eBGP and iBGP. Advanced policy features such as route-maps and communities are not simulated.'],
    ['Does it support IPv6 routing?', 'IPv6 addresses and static routes are supported. OSPFv3 is not.']
  ],
  related: ['ccna-lab-practice', 'vlan-lab', 'network-simulator']
},
{
  slug: 'nat-acl-firewall-lab', nav: 'NAT, ACL and firewall lab',
  title: 'NAT, ACL and Firewall Lab Online – Free Network Practice',
  desc: 'Practise NAT overload, access lists and ASA-style firewall zones on simulated routers in your browser. Free lab with example commands.',
  h1: 'NAT, ACL and firewall lab you can practise online',
  lead: 'Almost every network shares one public address and filters traffic. In this lab you set up NAT overload, write an access list and see how a firewall treats traffic between zones.',
  sections: [
    { h2: 'NAT overload example', p: 'Share one outside address between all inside PCs:', code: ['access-list 1 permit 192.168.10.0 0.0.0.255', 'interface gi0/0', ' ip nat inside', 'interface gi0/1', ' ip nat outside', 'ip nat inside source list 1 interface gi0/1 overload', 'end', 'show ip nat translations'] },
    { h2: 'Access list example', p: 'Allow web traffic and block everything else from one subnet:', code: ['access-list 101 permit tcp 192.168.10.0 0.0.0.255 any eq 80', 'access-list 101 deny ip any any', 'interface gi0/0', ' ip access-group 101 in'] },
    { h2: 'Firewall zones', p: 'ASA-style firewall devices let you name interfaces and give them security levels, so traffic from a higher level to a lower level is allowed and the reverse is blocked unless you permit it. The simulator models this in a simplified way, which is enough to understand the idea.' },
    { h2: 'MikroTik too', p: 'On MikroTik routers, practise source NAT with /ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade.' }
  ],
  faq: [
    ['What does NAT overload do?', 'It lets many private addresses share one public address by tracking each connection with a port number.'],
    ['How do I test an ACL?', 'Ping or browse from a PC and check the access list counters with show access-lists.'],
    ['Is the firewall the real thing?', 'It is a simplified model of ASA-style behaviour for learning.']
  ],
  related: ['mikrotik-simulator', 'ccna-lab-practice', 'network-simulator']
},
{
  slug: 'wifi-network-simulator', nav: 'Wi-Fi network simulator',
  title: 'Wi-Fi Network Simulator – Signal, Interference and WPA2',
  desc: 'Simulate Wi-Fi networks in your browser: access points, signal loss, interference, WPA2 passwords and guest SSIDs. Free and no install.',
  h1: 'Wi-Fi network simulator: signal, interference and security',
  lead: 'Wireless problems are hard to see. In Smart21network you place access points and clients and see how distance, walls and interference change the connection.',
  sections: [
    { h2: 'What you can explore', list: [
      'Where to place an access point so every client gets a signal',
      'How distance and interference reduce signal quality',
      'Setting a WPA2 password and seeing a client with the wrong password fail to join',
      'Creating a guest SSID separate from the main network',
      'Joining Wi-Fi clients to a wired network with switches and routers' ] },
    { h2: 'Try this', ol: [
      'Add an access point and three wireless clients at different distances.',
      'Watch which clients connect and which lose signal.',
      'Set a WPA2 password on the main network and add a guest SSID.',
      'Ping from a wireless client to a wired server.' ] }
  ],
  faq: [
    ['Does it simulate real radio physics?', 'It models signal loss and interference in a simplified way, which is enough to learn the ideas.'],
    ['Can wireless clients reach wired devices?', 'Yes. Connect the access point to a switch or router and test with ping.']
  ],
  related: ['network-simulator', 'nat-acl-firewall-lab']
},
{
  slug: 'network-simulator-for-schools', nav: 'For schools',
  title: 'Network Simulator for Schools – Classes, Assignments, Exams',
  desc: 'A network simulator for teachers and students: goals, exams, classes, assignments with deadlines, submissions and a teacher dashboard.',
  h1: 'A network simulator for schools and training centres',
  lead: 'Teachers can set networking tasks and see who finished them. Students practise on the devices they already have, at school or at home.',
  sections: [
    { h2: 'For students', list: [
      'Open it in a browser on a laptop, tablet or phone',
      'Practise with goals and exams that check the network for you',
      'Ask the AI assistant when you are stuck, and use the offline tutor when there is no internet' ] },
    { h2: 'For teachers', p: 'An optional school server adds accounts, cloud saves, classes, assignments with deadlines, submissions and a teacher dashboard. A school or training centre can run it on its own computer.' },
    { h2: 'Low-bandwidth friendly', p: 'After the first load, the installed app works offline. That helps in places where internet is slow or expensive.' }
  ],
  faq: [
    ['Does the school server cost anything?', 'The software is free to run. You provide the computer that hosts it.'],
    ['Can students use it at home?', 'Yes. The simulator works in any browser, and the school features work when the student connects to your school server.']
  ],
  related: ['network-simulator', 'ccna-lab-practice']
},
{
  slug: 'ai-network-assistant', nav: 'AI network assistant',
  title: 'AI Network Assistant – Troubleshoot Your Network Lab',
  desc: 'Ask an AI assistant about VLANs, routing, NAT and MikroTik while you build. It can see your topology and works offline with a built-in tutor.',
  h1: 'An AI assistant that understands your network lab',
  lead: 'Stuck on a ping that will not work? The assistant in Smart21network can look at your topology, explain what is wrong and suggest the next command to try.',
  sections: [
    { h2: 'What it helps with', list: [
      'Explaining command output and error messages',
      'Finding why two devices cannot reach each other',
      'Suggesting the commands for a VLAN, OSPF, NAT or DHCP setup',
      'Answering networking questions in English or Kiswahili' ] },
    { h2: 'Works online and offline', p: 'When you are online, answers come from Workers AI. When you are offline, or the AI cannot be reached, a built-in tutor answers from stored knowledge and tells you that you are using offline AI.' }
  ],
  faq: [
    ['Does the AI see my network?', 'It can use your topology as context when you choose to share it, so its advice can be specific.'],
    ['What if I have no internet?', 'The offline tutor answers common networking questions without internet.']
  ],
  related: ['network-simulator', 'ccna-lab-practice']
}
];

const sw = {
  slug: 'sw', lang: 'sw', nav: 'Kiswahili',
  title: 'Simulator ya Mtandao wa Kompyuta Bure – Smart21network',
  desc: 'Smart21network ni simulator ya mtandao bure kwenye kivinjari: jenga mtandao wa router, switch, MikroTik na Wi-Fi, tumia amri za Cisco na RouterOS.',
  h1: 'Simulator ya mtandao wa kompyuta bure: router, switch, MikroTik na Wi-Fi',
  lead: 'Smart21network inafanya kazi kwenye kivinjari chako. Buruta vifaa kwenye turubai, viunganishe kwa nyaya, viwekee mipangilio kwa mstari wa amri unaofanana na wa kweli, kisha uone pakiti zikisafiri kutoka kifaa kimoja hadi kingine.',
  sections: [
    { h2: 'Unaweza kujenga nini', list: [
      'Mitandao ya ofisi na nyumbani yenye router, switch, access point na kompyuta',
      'VLAN, trunk, STP na EtherChannel',
      'Uelekezaji wa static, RIP, EIGRP, OSPF na BGP',
      'NAT, ACL na firewall, pamoja na DHCP na DNS',
      'Mtandao wa Wi-Fi: nguvu ya mawimbi, kuingiliana, nenosiri la WPA2 na SSID ya wageni',
      'Amri za Cisco IOS na MikroTik RouterOS' ] },
    { h2: 'Jinsi ya kuanza', ol: [
      'Fungua simulator na uweke router, switch na kompyuta mbili kwenye turubai.',
      'Viunganishe kwa nyaya kisha bofya kifaa ili kufungua mstari wa amri.',
      'Tuma ping na uone pakiti ikisafiri hatua kwa hatua.' ] },
    { h2: 'Kwa wanafunzi na walimu', p: 'Kuna malengo na mitihani ya kukagua kazi yako, na msaidizi wa AI anayeelezea makosa. Shule inaweza pia kutumia seva ya shule ya hiari kwa madarasa, kazi za nyumbani na dashibodi ya mwalimu.' }
  ],
  faq: [
    ['Je, ni bure?', 'Ndiyo, unaweza kuitumia bure kwenye kivinjari.'],
    ['Je, inahitaji intaneti?', 'Baada ya kuipakia mara ya kwanza na kuiweka kama programu, inafanya kazi bila intaneti. Msaidizi wa AI anahitaji intaneti, na bila intaneti unatumia AI ya nje ya mtandao.'],
    ['Je, inaweza kuchukua nafasi ya vifaa halisi?', 'Hapana. Ni kwa mazoezi na kujifunza. Vifaa halisi vinaweza kufanya kazi tofauti kidogo.'],
    ['Je, inafanya kazi kwenye simu?', 'Ndiyo, kwenye kompyuta, tableti na simu.']
  ],
  related: ['network-simulator', 'ccna-lab-practice', 'vlan-lab']
};
module.exports = { SITE, pages, sw };
