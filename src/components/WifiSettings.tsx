import React, { useState } from 'react';
import { 
  Wifi, 
  Lock, 
  Radio, 
  Sliders, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { RouterProfile, RouterWifiConfig, WifiBandConfig } from '../types/router';
import { translations, Language } from '../translations/i18n';

interface WifiSettingsProps {
  wifiConfig: RouterWifiConfig;
  currentRouter: RouterProfile;
  onApplyChanges: (newConfig: RouterWifiConfig) => void;
  lang: Language;
  isSaving: boolean;
}

export const WifiSettings: React.FC<WifiSettingsProps> = ({
  wifiConfig,
  currentRouter,
  onApplyChanges,
  lang,
  isSaving
}) => {
  const t = translations[lang];

  // Local draft state
  const [bandMode, setBandMode] = useState<'single' | 'dual'>(
    currentRouter.supportsDualBand ? wifiConfig.bandMode : 'single'
  );
  const [smartConnect, setSmartConnect] = useState<boolean>(wifiConfig.smartConnect);

  const [wifi24, setWifi24] = useState<WifiBandConfig>({ ...wifiConfig.wifi24 });
  const [wifi5, setWifi5] = useState<WifiBandConfig>({ ...wifiConfig.wifi5 });

  const [showPass24, setShowPass24] = useState<boolean>(false);
  const [showPass5, setShowPass5] = useState<boolean>(false);

  // Sync 5G with 2.4G if smartConnect is on
  const handle24SsidChange = (newSsid: string) => {
    setWifi24(prev => ({ ...prev, ssid: newSsid }));
    if (smartConnect) {
      setWifi5(prev => ({ ...prev, ssid: newSsid }));
    }
  };

  const handle24PasswordChange = (newPass: string) => {
    setWifi24(prev => ({ ...prev, password: newPass }));
    if (smartConnect) {
      setWifi5(prev => ({ ...prev, password: newPass }));
    }
  };

  const handleSmartConnectToggle = (enabled: boolean) => {
    setSmartConnect(enabled);
    if (enabled) {
      setWifi5(prev => ({
        ...prev,
        ssid: wifi24.ssid,
        password: wifi24.password,
        securityMode: wifi24.securityMode
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalConfig: RouterWifiConfig = {
      bandMode: currentRouter.supportsDualBand ? bandMode : 'single',
      smartConnect: currentRouter.supportsDualBand && bandMode === 'dual' ? smartConnect : false,
      wifi24: { ...wifi24 },
      wifi5: { 
        ...wifi5, 
        enabled: currentRouter.supportsDualBand && bandMode === 'dual' ? wifi5.enabled : false 
      }
    };
    onApplyChanges(finalConfig);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Band Mode Selection Header (Single Band vs Dual Band Mode) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                {t.bandModeTitle}
                <span className="text-[11px] font-normal text-slate-400">({currentRouter.name})</span>
              </h2>
              <p className="text-xs text-slate-400">{t.bandModeDesc}</p>
            </div>
          </div>

          {!currentRouter.supportsDualBand && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
              <Info className="h-3.5 w-3.5" />
              <span>{t.singleBandOnly}</span>
            </div>
          )}
        </div>

        {/* Band Mode Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Single Band Mode */}
          <button
            type="button"
            onClick={() => setBandMode('single')}
            className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
              bandMode === 'single'
                ? 'bg-cyan-950/40 border-cyan-500 text-white ring-1 ring-cyan-500/50'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
              bandMode === 'single' ? 'border-cyan-400 bg-cyan-500' : 'border-slate-600'
            }`}>
              {bandMode === 'single' && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
            </div>
            <div>
              <div className="text-xs font-bold text-white">{t.singleBandMode}</div>
              <p className="text-[11px] text-slate-400 mt-1">
                केवल 2.4GHz फ्रीक्वेंसी सक्रिय रहेगी। लंबी दूरी एवं सामान्य IoT उपकरणों हेतु।
              </p>
            </div>
          </button>

          {/* Dual Band Mode (Only allowed if supported by router) */}
          <button
            type="button"
            disabled={!currentRouter.supportsDualBand}
            onClick={() => currentRouter.supportsDualBand && setBandMode('dual')}
            className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
              !currentRouter.supportsDualBand
                ? 'opacity-40 cursor-not-allowed bg-slate-950/20 border-slate-800/50 text-slate-500'
                : bandMode === 'dual'
                  ? 'bg-cyan-950/40 border-cyan-500 text-white ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
              bandMode === 'dual' ? 'border-cyan-400 bg-cyan-500' : 'border-slate-600'
            }`}>
              {bandMode === 'dual' && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{t.dualBandMode}</span>
                {!currentRouter.supportsDualBand && (
                  <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.2 rounded">
                    असमर्थित
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                2.4GHz और 5GHz दोनों बैंड सक्रिय। हाई स्पीड और मल्टी-डिवाइस स्ट्रीमिंग।
              </p>
            </div>
          </button>
        </div>

        {/* Smart Connect switch if Dual Band is active */}
        {currentRouter.supportsDualBand && bandMode === 'dual' && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200">{t.smartConnectTitle}</span>
                <p className="text-[11px] text-slate-400">{t.smartConnectDesc}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smartConnect}
                onChange={(e) => handleSmartConnectToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>
        )}
      </div>

      {/* 2. Wi-Fi Band Configuration Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2.4GHz Configuration Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                  2.4G
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.wifi24Title}</h3>
                  <p className="text-[11px] text-slate-400">{t.wifi24Desc}</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                802.11 b/g/n
              </span>
            </div>

            <div className="space-y-4">
              {/* SSID */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">
                  {t.ssidName}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={wifi24.ssid}
                    onChange={(e) => handle24SsidChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    placeholder="MyRouter_2.4G"
                  />
                  <Wifi className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    {t.wifiPassword}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPass24(!showPass24)}
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {showPass24 ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span>{showPass24 ? t.hidePassword : t.showPassword}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass24 ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={wifi24.password}
                    onChange={(e) => handle24PasswordChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    placeholder="कम से कम 8 अक्षर"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                </div>
              </div>

              {/* Security Mode & Channel Width */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">
                    {t.securityMode}
                  </label>
                  <select
                    value={wifi24.securityMode}
                    onChange={(e) => setWifi24(prev => ({ ...prev, securityMode: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="WPA2-PSK">WPA2-PSK (AES)</option>
                    <option value="WPA2/WPA3-PSK">WPA2/WPA3 Mixed</option>
                    <option value="WPA-PSK">WPA-PSK (TKIP)</option>
                    <option value="Open">Open (No Security)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">
                    {t.channelWidth}
                  </label>
                  <select
                    value={wifi24.channelWidth}
                    onChange={(e) => setWifi24(prev => ({ ...prev, channelWidth: e.target.value as any }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="20MHz">20 MHz</option>
                    <option value="40MHz">40 MHz</option>
                    <option value="Auto">Auto (20/40)</option>
                  </select>
                </div>
              </div>

              {/* Channel & Tx Power */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">
                    {t.channel}
                  </label>
                  <select
                    value={wifi24.channel}
                    onChange={(e) => setWifi24(prev => ({ ...prev, channel: e.target.value === 'auto' ? 'auto' : Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="auto">Auto Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(ch => (
                      <option key={ch} value={ch}>Channel {ch} (2.4{ch}GHz)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">
                    {t.txPower}
                  </label>
                  <select
                    value={wifi24.txPower}
                    onChange={(e) => setWifi24(prev => ({ ...prev, txPower: Number(e.target.value) as any }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value={100}>100% (High)</option>
                    <option value={75}>75% (Medium)</option>
                    <option value={50}>50% (Eco)</option>
                    <option value={25}>25% (Low)</option>
                  </select>
                </div>
              </div>

              {/* Hide SSID Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={wifi24.hideSsid}
                    onChange={(e) => setWifi24(prev => ({ ...prev, hideSsid: e.target.checked }))}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0"
                  />
                  <span>{t.hideSsid}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 5GHz Configuration Card */}
        <div className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition ${
          !currentRouter.supportsDualBand || bandMode === 'single'
            ? 'opacity-50 border-slate-800/60 bg-slate-950/40'
            : 'border-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  5G
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.wifi5Title}</h3>
                  <p className="text-[11px] text-slate-400">{t.wifi5Desc}</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                802.11 ac/ax
              </span>
            </div>

            {!currentRouter.supportsDualBand ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <AlertTriangle className="h-8 w-8 mx-auto text-amber-400 mb-2 opacity-80" />
                <p className="font-semibold text-slate-300">5GHz समर्थित नहीं है</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  चुना गया राउटर मॉडल ({currentRouter.name}) केवल सिंगल बैंड 2.4GHz हार्डवेयर चिपसेट पर काम करता है।
                </p>
              </div>
            ) : bandMode === 'single' ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <Info className="h-8 w-8 mx-auto text-cyan-400 mb-2 opacity-80" />
                <p className="font-semibold text-slate-300">सिंगल बैंड मोड सक्रिय</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  5GHz रेडियो अभी निष्क्रिय है। इसे चालू करने के लिए ऊपर "डुअल बैंड मोड" चुनें।
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {smartConnect && (
                  <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-lg p-2.5 text-[11px] text-cyan-300 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span>स्मार्ट कनेक्ट सक्रिय है: SSID और पासवर्ड 2.4GHz के समान स्वचालित रूप से सिंक होंगे।</span>
                  </div>
                )}

                {/* SSID */}
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">
                    {t.ssidName}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      disabled={smartConnect}
                      value={wifi5.ssid}
                      onChange={(e) => setWifi5(prev => ({ ...prev, ssid: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
                      placeholder="MyRouter_5G"
                    />
                    <Wifi className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">
                      {t.wifiPassword}
                    </label>
                    <button
                      type="button"
                      disabled={smartConnect}
                      onClick={() => setShowPass5(!showPass5)}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 disabled:opacity-50"
                    >
                      {showPass5 ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      <span>{showPass5 ? t.hidePassword : t.showPassword}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass5 ? 'text' : 'password'}
                      required
                      minLength={8}
                      disabled={smartConnect}
                      value={wifi5.password}
                      onChange={(e) => setWifi5(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
                      placeholder="कम से कम 8 अक्षर"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  </div>
                </div>

                {/* Security Mode & Channel Width */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                      {t.securityMode}
                    </label>
                    <select
                      disabled={smartConnect}
                      value={wifi5.securityMode}
                      onChange={(e) => setWifi5(prev => ({ ...prev, securityMode: e.target.value as any }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-60"
                    >
                      <option value="WPA2-PSK">WPA2-PSK (AES)</option>
                      <option value="WPA2/WPA3-PSK">WPA2/WPA3 Mixed</option>
                      <option value="WPA-PSK">WPA-PSK</option>
                      <option value="Open">Open (No Security)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                      {t.channelWidth}
                    </label>
                    <select
                      value={wifi5.channelWidth}
                      onChange={(e) => setWifi5(prev => ({ ...prev, channelWidth: e.target.value as any }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="80MHz">80 MHz (High Speed)</option>
                      <option value="40MHz">40 MHz</option>
                      <option value="20MHz">20 MHz</option>
                      <option value="Auto">Auto</option>
                    </select>
                  </div>
                </div>

                {/* Channel & Tx Power */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                      {t.channel}
                    </label>
                    <select
                      value={wifi5.channel}
                      onChange={(e) => setWifi5(prev => ({ ...prev, channel: e.target.value === 'auto' ? 'auto' : Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="auto">Auto Select</option>
                      {[36, 40, 44, 48, 149, 153, 157, 161].map(ch => (
                        <option key={ch} value={ch}>CH {ch} (5.{ch * 5}GHz)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                      {t.txPower}
                    </label>
                    <select
                      value={wifi5.txPower}
                      onChange={(e) => setWifi5(prev => ({ ...prev, txPower: Number(e.target.value) as any }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value={100}>100% (High)</option>
                      <option value={75}>75% (Medium)</option>
                      <option value={50}>50% (Eco)</option>
                      <option value={25}>25% (Low)</option>
                    </select>
                  </div>
                </div>

                {/* Hide SSID Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={wifi5.hideSsid}
                      onChange={(e) => setWifi5(prev => ({ ...prev, hideSsid: e.target.checked }))}
                      className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0"
                    />
                    <span>{t.hideSsid}</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Action Bar: Save & Apply with Strict Verification */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="text-xs text-slate-400">
          <p className="font-semibold text-slate-200">सत्यापन सूचना:</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            बटन दबाने पर राउटर को पेलोड भेजा जाएगा, फर्मवेयर द्वारा पुष्टि मिलने के बाद ही सेटिंग्स सुरक्षित होंगी।
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 transition disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{t.savingChanges}</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{t.saveChanges}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
