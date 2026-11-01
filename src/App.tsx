import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  ConnectModal 
} from './components/ConnectModal';
import { 
  WifiSettings 
} from './components/WifiSettings';
import { 
  ConnectedDevices 
} from './components/ConnectedDevices';
import { 
  SystemStatus 
} from './components/SystemStatus';
import { 
  VerificationModal 
} from './components/VerificationModal';
import { 
  RouterService 
} from './services/routerService';
import { 
  ConnectionCredentials, 
  RouterProfile, 
  RouterSystemStatus, 
  RouterWifiConfig, 
  ConnectedDevice, 
  BlockedMacEntry 
} from './types/router';
import { 
  SUPPORTED_ROUTERS, 
  getRouterById 
} from './data/routerModels';
import { 
  translations, 
  Language 
} from './translations/i18n';
import { 
  Radio, 
  Wifi, 
  Laptop2, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  RotateCw,
  Power,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('hi');
  const t = translations[lang];

  // Connection State
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<ConnectionCredentials | null>(null);
  const [currentRouter, setCurrentRouter] = useState<RouterProfile | null>(null);

  // Router Internal Data
  const [systemStatus, setSystemStatus] = useState<RouterSystemStatus | null>(null);
  const [wifiConfig, setWifiConfig] = useState<RouterWifiConfig | null>(null);
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [blockedList, setBlockedList] = useState<BlockedMacEntry[]>([]);

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'wifi' | 'devices' | 'status'>('wifi');
  const [connectModalOpen, setConnectModalOpen] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  // Verification Handshake Modal State
  const [verificationModalOpen, setVerificationModalOpen] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<number>(1);
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const [verificationComplete, setVerificationComplete] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<boolean>(false);
  const [verificationErrorMsg, setVerificationErrorMsg] = useState<string>('');
  const [verificationTitle, setVerificationTitle] = useState<string>('');

  // Pending changes storage for state commitment only after verification
  const [isSavingWifi, setIsSavingWifi] = useState<boolean>(false);
  const [isProcessingDevices, setIsProcessingDevices] = useState<boolean>(false);

  // Reboot confirmation modal
  const [rebootModalOpen, setRebootModalOpen] = useState<boolean>(false);
  const [isRebooting, setIsRebooting] = useState<boolean>(false);

  // Toast / Status notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Connect Handler
  const handleConnect = async (creds: ConnectionCredentials) => {
    setIsConnecting(true);
    setConnectError(null);
    try {
      const result = await RouterService.connect(creds);
      setCredentials(creds);
      setCurrentRouter(getRouterById(creds.modelId));
      setSystemStatus(result.systemStatus);
      setWifiConfig(result.wifiConfig);
      setDevices(result.devices);
      setBlockedList(result.blockedList);
      setIsConnected(true);
      setConnectModalOpen(false);
      showToast(t.connectSuccess, 'success');
    } catch (err: any) {
      setConnectError(err.message || t.connectFailed);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect Handler
  const handleDisconnect = () => {
    setIsConnected(false);
    setCredentials(null);
    setCurrentRouter(null);
    setSystemStatus(null);
    setWifiConfig(null);
    setDevices([]);
    setBlockedList([]);
    showToast(lang === 'hi' ? 'राउटर डिस्कनेक्ट कर दिया गया।' : 'Disconnected from router.', 'success');
  };

  // Apply Wi-Fi Changes with strict verification requirement:
  // "वास्तविक बदलाव तभी दिखाओ जब राउटर से सफलतापूर्वक पुष्टि हो जाए।"
  const handleApplyWifiChanges = async (newConfig: RouterWifiConfig) => {
    if (!credentials) return;

    setIsSavingWifi(true);
    setVerificationTitle(t.verifyingTitle);
    setVerificationStep(1);
    setVerificationMessage(t.step1);
    setVerificationComplete(false);
    setVerificationError(false);
    setVerificationErrorMsg('');
    setVerificationModalOpen(true);

    try {
      const verified = await RouterService.applyWifiSettingsWithVerification(
        credentials,
        newConfig,
        (step, msg) => {
          setVerificationStep(step);
          setVerificationMessage(msg);
        }
      );

      if (verified) {
        // Only update UI state after successful confirmation!
        setWifiConfig(newConfig);
        setVerificationComplete(true);
        showToast(t.applyWifiSuccess, 'success');
      }
    } catch (err: any) {
      setVerificationError(true);
      setVerificationErrorMsg(err.message || t.verificationFailed);
      showToast(err.message || t.verificationFailed, 'error');
    } finally {
      setIsSavingWifi(false);
    }
  };

  // Block Device MAC
  const handleBlockDevice = async (device: ConnectedDevice) => {
    if (!credentials) return;

    setIsProcessingDevices(true);
    setVerificationTitle(lang === 'hi' ? 'डिवाइस ब्लॉकिंग सत्यापन' : 'Device Blocking Verification');
    setVerificationStep(1);
    setVerificationMessage(`MAC [${device.mac}] को ब्लॉक करने की प्रक्रिया शुरू...`);
    setVerificationComplete(false);
    setVerificationError(false);
    setVerificationModalOpen(true);

    try {
      const blockedEntry = await RouterService.blockDevice(credentials, device, (step, msg) => {
        setVerificationStep(step);
        setVerificationMessage(msg);
      });

      // Update state only after verification!
      setBlockedList(prev => [...prev.filter(b => b.mac !== device.mac), blockedEntry]);
      // Update device blocked badge
      setDevices(prev => prev.map(d => d.mac === device.mac ? { ...d, isBlocked: true } : d));

      setVerificationComplete(true);
      showToast(t.blockSuccess, 'success');
    } catch (err: any) {
      setVerificationError(true);
      setVerificationErrorMsg(err.message || 'डिवाइस ब्लॉक करने में विफल।');
    } finally {
      setIsProcessingDevices(false);
    }
  };

  // Unblock Device MAC
  const handleUnblockDevice = async (mac: string) => {
    if (!credentials) return;

    setIsProcessingDevices(true);
    setVerificationTitle(lang === 'hi' ? 'डिवाइस अनब्लॉकिंग सत्यापन' : 'Device Unblocking Verification');
    setVerificationStep(1);
    setVerificationMessage(`MAC [${mac}] को अनब्लॉक करने की प्रक्रिया...`);
    setVerificationComplete(false);
    setVerificationError(false);
    setVerificationModalOpen(true);

    try {
      const unblocked = await RouterService.unblockDevice(credentials, mac, (step, msg) => {
        setVerificationStep(step);
        setVerificationMessage(msg);
      });

      if (unblocked) {
        setBlockedList(prev => prev.filter(b => b.mac.toLowerCase() !== mac.toLowerCase()));
        setDevices(prev => prev.map(d => d.mac.toLowerCase() === mac.toLowerCase() ? { ...d, isBlocked: false } : d));
        setVerificationComplete(true);
        showToast(t.unblockSuccess, 'success');
      }
    } catch (err: any) {
      setVerificationError(true);
      setVerificationErrorMsg(err.message || 'अनब्लॉक करने में विफल।');
    } finally {
      setIsProcessingDevices(false);
    }
  };

  // Manual MAC Block
  const handleManualBlock = async (mac: string, name?: string) => {
    if (!credentials) return;

    setIsProcessingDevices(true);
    setVerificationTitle(lang === 'hi' ? 'मैन्युअल MAC ब्लॉकिंग' : 'Manual MAC Blocking');
    setVerificationStep(1);
    setVerificationMessage(`MAC [${mac}] को राउटर फ़ायरवॉल में जोड़ना...`);
    setVerificationComplete(false);
    setVerificationError(false);
    setVerificationModalOpen(true);

    try {
      const blockedEntry = await RouterService.blockDevice(credentials, { mac, name }, (step, msg) => {
        setVerificationStep(step);
        setVerificationMessage(msg);
      });

      setBlockedList(prev => [...prev.filter(b => b.mac !== mac), blockedEntry]);
      setDevices(prev => prev.map(d => d.mac === mac ? { ...d, isBlocked: true } : d));
      setVerificationComplete(true);
      showToast(t.blockSuccess, 'success');
    } catch (err: any) {
      setVerificationError(true);
      setVerificationErrorMsg(err.message || 'MAC ब्लॉक करने में विफल।');
    } finally {
      setIsProcessingDevices(false);
    }
  };

  // Refresh Connected Devices
  const handleRefreshDevices = async () => {
    if (!credentials) return;
    setIsProcessingDevices(true);
    try {
      const result = await RouterService.connect(credentials);
      setDevices(result.devices);
      showToast(lang === 'hi' ? 'डिवाइस सूची रीफ़्रेश हो गई।' : 'Device list updated.', 'success');
    } catch (err) {
      // ignore
    } finally {
      setIsProcessingDevices(false);
    }
  };

  // Reboot Router
  const handleConfirmReboot = async () => {
    if (!credentials) return;
    setIsRebooting(true);
    try {
      await RouterService.rebootRouter(credentials, (msg) => {
        // progress
      });
      setRebootModalOpen(false);
      showToast(lang === 'hi' ? 'राउटर सफलतापूर्वक रीबूट हो गया!' : 'Router reboot completed!', 'success');
    } catch (err) {
      showToast(lang === 'hi' ? 'रीबूट विफल।' : 'Reboot failed.', 'error');
    } finally {
      setIsRebooting(false);
    }
  };

  // Quick Demo Connect for immediate testing
  const handleQuickDemoConnect = (modelId: RouterProfile['id']) => {
    const prof = getRouterById(modelId);
    handleConnect({
      ipAddress: prof.defaultIp,
      port: 80,
      protocol: 'http',
      username: prof.defaultUsername,
      password: prof.defaultPassword,
      modelId: prof.id,
      mode: 'demo'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs animate-slide-in ${
          toastMessage.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
            : 'bg-red-950/90 border-red-500/40 text-red-300'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <Header
        lang={lang}
        setLang={setLang}
        credentials={credentials}
        currentRouter={currentRouter}
        systemStatus={systemStatus}
        isConnected={isConnected}
        onOpenConnectModal={() => setConnectModalOpen(true)}
        onDisconnect={handleDisconnect}
        onReboot={() => setRebootModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connectedDevicesCount={devices.length}
        blockedCount={blockedList.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isConnected && currentRouter && wifiConfig && systemStatus ? (
          <div>
            {/* Active Router Quick Banner */}
            <div className="mb-6 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${credentials?.mode === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`}></span>
                <span className="font-semibold text-slate-200">{currentRouter.name}</span>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-cyan-400">IP: {credentials?.ipAddress}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-mono">MAC: {systemStatus.macAddress}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  credentials?.mode === 'live' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {credentials?.mode === 'live' ? '🟢 लाइव मोड (Live Router)' : '🔵 सुरक्षित डेमो मोड (Simulation)'}
                </span>
                <button
                  onClick={() => setConnectModalOpen(true)}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline text-[11px]"
                >
                  बदलें / Switch
                </button>
              </div>
            </div>

            {/* Tab 1: Wi-Fi Configuration */}
            {activeTab === 'wifi' && (
              <WifiSettings
                wifiConfig={wifiConfig}
                currentRouter={currentRouter}
                onApplyChanges={handleApplyWifiChanges}
                lang={lang}
                isSaving={isSavingWifi}
              />
            )}

            {/* Tab 2: Connected Devices & MAC Blocking */}
            {activeTab === 'devices' && (
              <ConnectedDevices
                devices={devices}
                blockedList={blockedList}
                onBlockDevice={handleBlockDevice}
                onUnblockDevice={handleUnblockDevice}
                onManualBlock={handleManualBlock}
                onRefreshDevices={handleRefreshDevices}
                lang={lang}
                isProcessing={isProcessingDevices}
              />
            )}

            {/* Tab 3: System Status & Hardware */}
            {activeTab === 'status' && (
              <SystemStatus
                currentRouter={currentRouter}
                systemStatus={systemStatus}
                credentials={credentials}
                onReboot={() => setRebootModalOpen(true)}
                lang={lang}
              />
            )}
          </div>
        ) : (
          /* Disconnected State / Welcome Screen */
          <div className="py-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Hero Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                    <Radio className="h-3.5 w-3.5 animate-pulse" />
                    <span>राउटर कंट्रोल यूटिलिटी सॉफ्टवेयर</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    ROUTER MASTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PRO</span>
                  </h2>
                  <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                    सरल और शुद्ध राउटर प्रबंधन: Wi-Fi SSID/Password, 2.4GHz व 5GHz अलग कॉन्फ़िगरेशन, सिंगल/डुअल बैंड स्विच, कनेक्टेड डिवाइस और MAC एड्रेस ब्लॉकिंग।
                  </p>
                </div>

                <div className="shrink-0 flex flex-col gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setConnectModalOpen(true)}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 flex items-center justify-center gap-2 transition"
                  >
                    <Radio className="h-4 w-4" />
                    <span>{t.connect}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Supported 4 Models Showcase with 1-Click Launch */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span>समर्थित 4 राउटर मॉडल (1-क्लिक परीक्षण या लॉगिन करें)</span>
                </h3>
                <span className="text-xs text-slate-400">डेमो या लाइव चुनें</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SUPPORTED_ROUTERS.map((router) => (
                  <div
                    key={router.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                          {router.name}
                        </span>
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                          router.supportsDualBand ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {router.supportsDualBand ? 'Dual Band (2.4G+5G)' : 'Single Band (2.4G)'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{router.vendor} • {router.type}</p>
                      
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 space-y-1 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Default IP:</span>
                          <span className="text-cyan-400">{router.defaultIp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Admin User:</span>
                          <span>{router.defaultUsername} / {router.defaultPassword}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleQuickDemoConnect(router.id)}
                        className="flex-1 py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <span>डेमो चलाएं</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>

                      <button
                        onClick={() => {
                          setConnectModalOpen(true);
                        }}
                        className="flex-1 py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <span>लाइव कनेक्ट</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture & Verification Principle Banner */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-200">सख्त हार्डवेयर सत्यापन नियम (Zero False-Commit):</p>
                <p className="mt-0.5 text-slate-400 leading-relaxed">
                  ROUTER MASTER PRO में कोई भी बदलाव (Wi-Fi SSID, पासवर्ड, या MAC ब्लॉकिंग) तब तक स्क्रीन पर स्थायी नहीं होता, जब तक कि राउटर गेटवे से वास्तविक HTTP/NVRAM पुष्टि प्राप्त न हो जाए।
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Connect Modal */}
      <ConnectModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        onConnect={handleConnect}
        isLoading={isConnecting}
        error={connectError}
        lang={lang}
      />

      {/* Strict Verification Handshake Modal */}
      <VerificationModal
        isOpen={verificationModalOpen}
        step={verificationStep}
        statusMessage={verificationMessage}
        isComplete={verificationComplete}
        isError={verificationError}
        errorMessage={verificationErrorMsg}
        onClose={() => setVerificationModalOpen(false)}
        lang={lang}
        title={verificationTitle}
      />

      {/* Reboot Router Modal */}
      {rebootModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="h-12 w-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <RotateCw className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">{t.reboot}</h3>
            <p className="text-xs text-slate-300 mb-6">{t.rebootConfirm}</p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isRebooting}
                onClick={() => setRebootModalOpen(false)}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                disabled={isRebooting}
                onClick={handleConfirmReboot}
                className="flex-1 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30"
              >
                {isRebooting ? (
                  <>
                    <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>रीबूट हो रहा है...</span>
                  </>
                ) : (
                  <span>हाँ, रीबूट करें</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
