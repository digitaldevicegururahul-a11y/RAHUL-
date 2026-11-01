import React, { useState } from 'react';
import { 
  Laptop2, 
  Smartphone, 
  Tv, 
  Wifi, 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  RotateCw, 
  Radio, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  HelpCircle,
  Clock,
  HardDrive
} from 'lucide-react';
import { ConnectedDevice, BlockedMacEntry } from '../types/router';
import { translations, Language } from '../translations/i18n';

interface ConnectedDevicesProps {
  devices: ConnectedDevice[];
  blockedList: BlockedMacEntry[];
  onBlockDevice: (device: ConnectedDevice) => void;
  onUnblockDevice: (mac: string) => void;
  onManualBlock: (mac: string, name?: string) => void;
  onRefreshDevices: () => void;
  lang: Language;
  isProcessing: boolean;
}

export const ConnectedDevices: React.FC<ConnectedDevicesProps> = ({
  devices,
  blockedList,
  onBlockDevice,
  onUnblockDevice,
  onManualBlock,
  onRefreshDevices,
  lang,
  isProcessing
}) => {
  const t = translations[lang];

  const [manualMac, setManualMac] = useState<string>('');
  const [manualName, setManualName] = useState<string>('');
  const [macFormatError, setMacFormatError] = useState<string | null>(null);

  // MAC address validation: 6 pairs of hex digits separated by colon or hyphen
  const validateMac = (mac: string): boolean => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac.trim());
  };

  const handleAddManualBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMac = manualMac.trim().toUpperCase();
    if (!validateMac(cleanMac)) {
      setMacFormatError(lang === 'hi' ? 'अमान्य MAC एड्रेस! सही प्रारूप: AA:BB:CC:DD:EE:FF' : 'Invalid MAC address! Format: AA:BB:CC:DD:EE:FF');
      return;
    }
    setMacFormatError(null);
    onManualBlock(cleanMac, manualName.trim() || undefined);
    setManualMac('');
    setManualName('');
  };

  const getDeviceIcon = (type: ConnectedDevice['deviceType'], band: ConnectedDevice['band']) => {
    switch (type) {
      case 'phone':
        return <Smartphone className="h-4 w-4 text-cyan-400" />;
      case 'laptop':
      case 'pc':
        return <Laptop2 className="h-4 w-4 text-blue-400" />;
      case 'tv':
        return <Tv className="h-4 w-4 text-emerald-400" />;
      default:
        return band === 'LAN' ? <HardDrive className="h-4 w-4 text-indigo-400" /> : <Wifi className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getSignalBadge = (dbm: number, band: string) => {
    if (band === 'LAN') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          LAN Wire
        </span>
      );
    }

    let color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    let label = 'उत्कृष्ट';
    if (dbm < -70) {
      color = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      label = 'मध्यम';
    } else if (dbm < -80) {
      color = 'text-red-400 bg-red-500/10 border-red-500/20';
      label = 'कमजोर';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border ${color}`}>
        <Radio className="h-3 w-3" />
        <span>{dbm} dBm</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Active Connected Devices Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
              <Laptop2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t.connectedDevicesTitle}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {devices.length} {t.connectedDevicesCount}
                </span>
              </h2>
              <p className="text-xs text-slate-400">राउटर से जुड़े सभी सक्रिय मोबाइल, लैपटॉप व उपकरण</p>
            </div>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onRefreshDevices}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition"
          >
            <RotateCw className={`h-3.5 w-3.5 text-cyan-400 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{t.refreshList}</span>
          </button>
        </div>

        {/* Devices Table */}
        {devices.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            <Wifi className="h-8 w-8 mx-auto text-slate-600 mb-2" />
            <p>{t.noDevicesConnected}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3 pl-2">{t.deviceName}</th>
                  <th className="pb-3">{t.ipAddress}</th>
                  <th className="pb-3">{t.macAddress}</th>
                  <th className="pb-3">{t.band}</th>
                  <th className="pb-3">{t.signal}</th>
                  <th className="pb-3 pr-2 text-right">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {devices.map((device) => {
                  const isAlreadyBlocked = blockedList.some(
                    (b) => b.mac.toLowerCase() === device.mac.toLowerCase()
                  );

                  return (
                    <tr key={device.id} className="hover:bg-slate-800/40 transition">
                      {/* Name & Vendor */}
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                            {getDeviceIcon(device.deviceType, device.band)}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span>{device.name}</span>
                              {isAlreadyBlocked && (
                                <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.2 rounded font-mono">
                                  {t.deviceBlockedBadge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{device.vendor}</span>
                          </div>
                        </div>
                      </td>

                      {/* IP */}
                      <td className="py-3.5 font-mono text-cyan-300">
                        {device.ip}
                      </td>

                      {/* MAC Address (Highlighted Monospace) */}
                      <td className="py-3.5">
                        <span className="font-mono text-slate-200 bg-slate-950 px-2 py-1 rounded border border-slate-800 select-all">
                          {device.mac}
                        </span>
                      </td>

                      {/* Band */}
                      <td className="py-3.5">
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                          device.band === '5GHz' 
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                            : device.band === '2.4GHz' 
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30' 
                              : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {device.band}
                        </span>
                      </td>

                      {/* Signal */}
                      <td className="py-3.5">
                        {getSignalBadge(device.signalDbm, device.band)}
                      </td>

                      {/* Action: Block / Unblock */}
                      <td className="py-3.5 pr-2 text-right">
                        {isAlreadyBlocked ? (
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => onUnblockDevice(device.mac)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition text-xs font-semibold"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>{t.unblockDevice}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => onBlockDevice(device)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 hover:bg-red-500/25 transition text-xs font-semibold"
                            title="इस डिवाइस को ब्लॉक करें"
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span>{t.blockDevice}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. MAC Blocking & Access Control Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual MAC Block Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-3">
            <ShieldAlert className="h-5 w-5 text-red-400" />
            <h3 className="text-sm font-bold text-white">{t.macBlockingTitle}</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">{t.macBlockingDesc}</p>

          <form onSubmit={handleAddManualBlock} className="space-y-3">
            {macFormatError && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 text-[11px] text-red-300 flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{macFormatError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                {t.manualBlockInput}
              </label>
              <input
                type="text"
                required
                value={manualMac}
                onChange={(e) => {
                  setManualMac(e.target.value);
                  setMacFormatError(null);
                }}
                placeholder={t.manualBlockPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono uppercase text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                डिवाइस नाम / विवरण (वैकल्पिक)
              </label>
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="उदा. Unknown Intruder Phone"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing || !manualMac.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md shadow-red-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>{t.addBlockBtn}</span>
            </button>
          </form>
        </div>

        {/* Blocked Devices Table (Blacklist) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">{t.blockedDevicesTitle}</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                {blockedList.length} ब्लॉक किए गए MAC
              </span>
            </div>

            {blockedList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <ShieldCheck className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                <p>{t.noBlockedDevices}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-medium">
                      <th className="pb-2 pl-2">MAC एड्रेस</th>
                      <th className="pb-2">पहचान / डिवाइस</th>
                      <th className="pb-2">ब्लॉक समय</th>
                      <th className="pb-2 pr-2 text-right">कार्रवाई</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {blockedList.map((entry) => (
                      <tr key={entry.mac} className="hover:bg-slate-800/40 transition">
                        <td className="py-2.5 pl-2 font-mono text-red-400 font-semibold select-all">
                          {entry.mac}
                        </td>
                        <td className="py-2.5 text-slate-300">
                          {entry.name || 'Unnamed Device'}
                        </td>
                        <td className="py-2.5 text-slate-400 text-[11px] font-mono">
                          {entry.blockedAt}
                        </td>
                        <td className="py-2.5 pr-2 text-right">
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => onUnblockDevice(entry.mac)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-[11px] font-medium transition"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>{t.unblockDevice}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>राउटर फ़ायरवॉल इन MAC एड्रेसों से आने वाले सभी डेटा पैकेट्स को ड्रॉप कर देता है।</span>
          </div>
        </div>
      </div>
    </div>
  );
};
