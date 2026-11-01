export type Language = 'hi' | 'en';

export const translations = {
  hi: {
    appTitle: 'ROUTER MASTER PRO',
    appSubtitle: 'सरल और पेशेवर राउटर कंट्रोल सॉफ्टवेयर',
    connectionMode: 'कनेक्शन मोड',
    demoMode: 'डेमो मोड',
    liveMode: 'वास्तविक राउटर (लाइव)',
    connectedTo: 'कनेक्टेड',
    notConnected: 'डिस्कनेक्टेड',
    connect: 'राउटर से कनेक्ट करें',
    disconnect: 'डिस्कनेक्ट करें',
    reboot: 'राउटर रीबूट करें',
    rebootConfirm: 'क्या आप सचमुच राउटर को रीबूट करना चाहते हैं? इसमें लगभग 60 सेकंड लगेंगे।',
    rebooting: 'राउटर रीबूट हो रहा है...',
    
    // Login / Connect
    loginHeader: 'राउटर लॉगिन और कनेक्शन',
    routerIp: 'राउटर IP एड्रेस',
    routerModel: 'राउटर मॉडल',
    username: 'एडमिन यूज़रनेम',
    password: 'पासवर्ड',
    port: 'पोर्ट',
    protocol: 'प्रोटोकॉल',
    connecting: 'कनेक्ट हो रहा है...',
    authenticating: 'प्रमाणीकरण हो रहा है...',
    connectSuccess: 'राउटर से सफलतापूर्वक कनेक्ट हो गया!',
    connectFailed: 'कनेक्शन विफल! कृपया IP, यूज़रनेम और पासवर्ड जांचें।',
    quickPresets: 'त्वरित डिफ़ॉल्ट भरें',
    dualBandSupported: 'डुअल बैंड समर्थित (2.4GHz + 5GHz)',
    singleBandOnly: 'केवल सिंगल बैंड (2.4GHz)',
    liveModeNote: 'लाइव मोड में आपका डिवाइस सीधे लोकल राउटर IP पर सुरक्षित कमांड भेजेगा।',
    demoModeNote: 'डेमो मोड में आप बिना वास्तविक राउटर को प्रभावित किए सभी फीचर्स का परीक्षण कर सकते हैं।',

    // Tabs
    tabWifi: 'Wi-Fi कॉन्फ़िगरेशन',
    tabDevices: 'कनेक्टेड डिवाइस और ब्लॉकिंग',
    tabStatus: 'राउटर सिस्टम जानकारी',

    // Wi-Fi Config
    bandModeTitle: 'बैंड मोड चयन',
    bandModeDesc: 'राउटर की फ्रीक्वेंसी क्षमता के अनुसार मोड चुनें',
    singleBandMode: 'सिंगल बैंड मोड (2.4GHz)',
    dualBandMode: 'डुअल बैंड मोड (2.4GHz + 5GHz अलग)',
    smartConnectTitle: 'स्मार्ट कनेक्ट (Unified SSID)',
    smartConnectDesc: '2.4GHz और 5GHz दोनों के लिए एक ही नाम और पासवर्ड रखें, राउटर खुद बैंड चुनेगा।',
    
    // 2.4GHz
    wifi24Title: '2.4GHz वाई-फाई सेटिंग्स',
    wifi24Desc: 'लंबी रेंज और सामान्य उपकरणों के लिए उपयुक्त',
    // 5GHz
    wifi5Title: '5GHz वाई-फाई सेटिंग्स',
    wifi5Desc: 'अल्ट्रा-फास्ट स्पीड और कम लेटेंसी के लिए उपयुक्त',
    
    ssidName: 'Wi-Fi नाम (SSID)',
    wifiPassword: 'Wi-Fi पासवर्ड',
    securityMode: 'सुरक्षा प्रकार (Security)',
    channel: 'चैनल (Channel)',
    channelWidth: 'बैंडविड्थ (Channel Width)',
    hideSsid: 'SSID छिपाएं (Hide SSID)',
    txPower: 'ट्रांसमिट पावर (Tx Power)',
    showPassword: 'दिखाएं',
    hidePassword: 'छिपाएं',
    saveChanges: 'राउटर पर बदलाव लागू करें',
    savingChanges: 'राउटर पर सेटिंग्स भेजी जा रही हैं...',
    applyWifiSuccess: 'Wi-Fi सेटिंग्स सफलतापूर्वक राउटर पर अपडेट हो गईं!',

    // Verification Modal
    verifyingTitle: 'राउटर पुष्टि प्रक्रिया',
    step1: '1. राउटर को नया कॉन्फ़िगरेशन पेलोड भेजना...',
    step2: '2. राउटर फर्मवेयर द्वारा स्वीकृति और सत्यापन की प्रतीक्षा...',
    step3: '3. वास्तविक पुष्टि प्राप्त हुई! सेटिंग्स सहेजी गईं।',
    verificationFailed: 'राउटर ने बदलाव की पुष्टि नहीं की। पुरानी सेटिंग्स बरकरार रखी गई हैं।',
    close: 'बंद करें',

    // Connected Devices
    connectedDevicesTitle: 'कनेक्टेड डिवाइसों की सूची',
    connectedDevicesCount: 'सक्रिय डिवाइस',
    refreshList: 'रिफ्रेश करें',
    deviceName: 'डिवाइस का नाम',
    ipAddress: 'IP एड्रेस',
    macAddress: 'MAC एड्रेस',
    band: 'बैंड',
    signal: 'सिग्नल',
    action: 'कार्रवाई',
    blockDevice: 'ब्लॉक करें',
    unblockDevice: 'अनब्लॉक करें',
    deviceBlockedBadge: 'ब्लॉक किया गया',
    noDevicesConnected: 'कोई डिवाइस कनेक्टेड नहीं है',
    
    // MAC Blocking
    macBlockingTitle: 'MAC एड्रेस ब्लॉकिंग (एक्सेस कंट्रोल)',
    macBlockingDesc: 'अवांछित उपकरणों का इंटरनेट तुरंत बंद करने के लिए उनका MAC एड्रेस ब्लॉक करें।',
    manualBlockInput: 'नया MAC एड्रेस मैन्युअल ब्लॉक करें',
    manualBlockPlaceholder: 'जैसे AA:BB:CC:DD:EE:FF',
    addBlockBtn: 'ब्लॉक सूची में जोड़ें',
    blockedDevicesTitle: 'ब्लॉक किए गए उपकरण (Blacklist)',
    noBlockedDevices: 'वर्तमान में कोई डिवाइस ब्लॉक नहीं है।',
    blockingInProgress: 'डिवाइस ब्लॉक हो रहा है...',
    unblockingInProgress: 'डिवाइस अनब्लॉक हो रहा है...',
    blockSuccess: 'डिवाइस को सफलतापूर्वक ब्लॉक कर दिया गया!',
    unblockSuccess: 'डिवाइस को अनब्लॉक कर दिया गया!',

    // System Status
    systemTitle: 'राउटर विवरण एवं स्थिति',
    hardwareModel: 'मॉडल',
    firmwareVer: 'फर्मवेयर वर्शन',
    hardwareVer: 'हार्डवेयर वर्शन',
    uptime: 'अप-टाइम',
    wanStatus: 'इंटरनेट (WAN) स्थिति',
    wanIp: 'WAN IP एड्रेस',
    lanIp: 'LAN IP एड्रेस',
    cpuUsage: 'CPU उपयोग',
    memoryUsage: 'रैम उपयोग',
    primaryDns: 'प्राइमरी DNS',
    
    // Live note
    browserCorsNoticeTitle: 'लाइव मोड सूचना',
    browserCorsNotice: 'ब्राउज़र सुरक्षा नियमों (Private Network Access) के कारण, यदि आपका राउटर सीधे वेब से उत्तर नहीं देता, तो ROUTER MASTER PRO वास्तविक राउटर से पुष्ट उत्तर मिलने पर ही सेटिंग्स बदलेगा। यदि कोई कनेक्शन समस्या आती है, तो त्रुटि स्पष्ट रूप से दिखाई जाएगी।'
  },
  en: {
    appTitle: 'ROUTER MASTER PRO',
    appSubtitle: 'Simple & Professional Router Control Software',
    connectionMode: 'Connection Mode',
    demoMode: 'Demo Mode',
    liveMode: 'Live Router Mode',
    connectedTo: 'Connected',
    notConnected: 'Disconnected',
    connect: 'Connect to Router',
    disconnect: 'Disconnect',
    reboot: 'Reboot Router',
    rebootConfirm: 'Are you sure you want to reboot the router? This will take approximately 60 seconds.',
    rebooting: 'Rebooting router...',
    
    // Login / Connect
    loginHeader: 'Router Login & Connection',
    routerIp: 'Router IP Address',
    routerModel: 'Router Model',
    username: 'Admin Username',
    password: 'Password',
    port: 'Port',
    protocol: 'Protocol',
    connecting: 'Connecting...',
    authenticating: 'Authenticating...',
    connectSuccess: 'Successfully connected to router!',
    connectFailed: 'Connection failed! Please verify IP address, username and password.',
    quickPresets: 'Load Defaults',
    dualBandSupported: 'Dual-Band Supported (2.4GHz + 5GHz)',
    singleBandOnly: 'Single-Band Only (2.4GHz)',
    liveModeNote: 'In Live Mode, direct commands are dispatched to your physical router gateway.',
    demoModeNote: 'In Demo Mode, simulate full management without altering any actual hardware.',

    // Tabs
    tabWifi: 'Wi-Fi Configuration',
    tabDevices: 'Connected Devices & Blocking',
    tabStatus: 'Router System Status',

    // Wi-Fi Config
    bandModeTitle: 'Band Mode Selection',
    bandModeDesc: 'Select operating frequency mode according to router hardware capabilities',
    singleBandMode: 'Single Band Mode (2.4GHz)',
    dualBandMode: 'Dual Band Mode (2.4GHz + 5GHz Separate)',
    smartConnectTitle: 'Smart Connect (Unified SSID)',
    smartConnectDesc: 'Use unified SSID and password for both 2.4GHz and 5GHz. Router automatically steers devices.',
    
    // 2.4GHz
    wifi24Title: '2.4GHz Wi-Fi Settings',
    wifi24Desc: 'Best for maximum range and compatibility',
    // 5GHz
    wifi5Title: '5GHz Wi-Fi Settings',
    wifi5Desc: 'Best for high-speed throughput and low latency',
    
    ssidName: 'Wi-Fi Name (SSID)',
    wifiPassword: 'Wi-Fi Password',
    securityMode: 'Security Mode',
    channel: 'Channel',
    channelWidth: 'Channel Width',
    hideSsid: 'Hide SSID (Broadcast Off)',
    txPower: 'Transmit Power',
    showPassword: 'Show',
    hidePassword: 'Hide',
    saveChanges: 'Apply Changes to Router',
    savingChanges: 'Sending configuration to router...',
    applyWifiSuccess: 'Wi-Fi configuration successfully verified and updated on router!',

    // Verification Modal
    verifyingTitle: 'Router Verification Handshake',
    step1: '1. Transmitting configuration payload to router gateway...',
    step2: '2. Waiting for router firmware acknowledgment and integrity check...',
    step3: '3. Router confirmed changes! Settings committed to NVRAM.',
    verificationFailed: 'Router failed to acknowledge changes. Previous settings retained.',
    close: 'Close',

    // Connected Devices
    connectedDevicesTitle: 'Connected Devices List',
    connectedDevicesCount: 'Active Devices',
    refreshList: 'Refresh List',
    deviceName: 'Device Name',
    ipAddress: 'IP Address',
    macAddress: 'MAC Address',
    band: 'Band',
    signal: 'Signal',
    action: 'Action',
    blockDevice: 'Block Device',
    unblockDevice: 'Unblock Device',
    deviceBlockedBadge: 'Blocked',
    noDevicesConnected: 'No devices currently connected',
    
    // MAC Blocking
    macBlockingTitle: 'MAC Address Blocking (Access Control)',
    macBlockingDesc: 'Instantly cut internet access for unauthorized devices by blocking their MAC address.',
    manualBlockInput: 'Block MAC Address Manually',
    manualBlockPlaceholder: 'e.g. AA:BB:CC:DD:EE:FF',
    addBlockBtn: 'Add to Blocklist',
    blockedDevicesTitle: 'Blocked Devices (Blacklist)',
    noBlockedDevices: 'No devices are currently blocked.',
    blockingInProgress: 'Blocking device on router...',
    unblockingInProgress: 'Unblocking device on router...',
    blockSuccess: 'Device MAC address has been blocked on router!',
    unblockSuccess: 'Device MAC address has been unblocked!',

    // System Status
    systemTitle: 'Router System Details',
    hardwareModel: 'Model',
    firmwareVer: 'Firmware Version',
    hardwareVer: 'Hardware Version',
    uptime: 'System Uptime',
    wanStatus: 'Internet (WAN) Status',
    wanIp: 'WAN IP Address',
    lanIp: 'LAN IP Address',
    cpuUsage: 'CPU Load',
    memoryUsage: 'RAM Usage',
    primaryDns: 'Primary DNS',
    
    // Live note
    browserCorsNoticeTitle: 'Live Mode Diagnostics',
    browserCorsNotice: 'Under browser Private Network Access rules, if communicating directly with local IP 192.168.1.1, ROUTER MASTER PRO verifies authentic router responses before updating state. If unreachable, full diagnostics are provided.'
  }
};
