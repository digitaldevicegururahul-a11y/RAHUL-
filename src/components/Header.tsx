import React from 'react';
import { 
  Wifi, 
  ShieldCheck, 
  Power, 
  Globe, 
  Radio, 
  Laptop2, 
  RotateCw, 
  Activity,
  AlertTriangle
} from 'lucide-react';
import { ConnectionCredentials, RouterProfile, RouterSystemStatus } from '../types/router';
import { translations, Language } from '../translations/i18n';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  credentials: ConnectionCredentials | null;
  currentRouter: RouterProfile | null;
  systemStatus: RouterSystemStatus | null;
  isConnected: boolean;
  onOpenConnectModal: () => void;
  onDisconnect: () => void;
  onReboot: () => void;
  activeTab: 'wifi' | 'devices' | 'status';
  setActiveTab: (tab: 'wifi' | 'devices' | 'status') => void;
  connectedDevicesCount: number;
  blockedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  credentials,
  currentRouter,
  systemStatus,
  isConnected,
  onOpenConnectModal,
  onDisconnect,
  onReboot,
  activeTab,
  setActiveTab,
  connectedDevicesCount,
  blockedCount
}) => {
  const t = translations[lang];

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Bar: Brand, Status, Mode Switch, Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold ring-1 ring-cyan-400/40">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                ROUTER MASTER <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded font-mono border border-cyan-500/30">PRO</span>
              </h1>
              {isConnected && credentials && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-mono ${
                  credentials.mode === 'live' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${credentials.mode === 'live' ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400'}`}></span>
                  {credentials.mode === 'live' ? t.liveMode : t.demoMode}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Center / Model Info when connected */}
        {isConnected && currentRouter && (
          <div className="hidden md:flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">मॉडल:</span>
              <span className="font-semibold text-cyan-300">{currentRouter.name}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">IP:</span>
              <span className="font-mono text-emerald-400">{credentials?.ipAddress}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] px-1.5 py-0.5 rounded ${currentRouter.supportsDualBand ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                {currentRouter.supportsDualBand ? 'Dual Band (2.4G + 5G)' : 'Single Band (2.4G)'}
              </span>
            </div>
          </div>
        )}

        {/* Right Actions: Lang Toggle, Connect/Disconnect, Reboot */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="भाषा बदलें / Switch Language"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>

          {isConnected ? (
            <>
              <button
                onClick={onReboot}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition"
                title={t.reboot}
              >
                <RotateCw className="h-3.5 w-3.5 text-amber-400" />
                <span>{t.reboot}</span>
              </button>

              <button
                onClick={onDisconnect}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-300 hover:bg-red-500/20 transition"
                title={t.disconnect}
              >
                <Power className="h-3.5 w-3.5 text-red-400" />
                <span>{t.disconnect}</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenConnectModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-semibold text-white shadow-md shadow-cyan-600/25 transition"
            >
              <Radio className="h-3.5 w-3.5" />
              <span>{t.connect}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs (Only visible when connected) */}
      {isConnected && (
        <div className="border-t border-slate-800/80 bg-slate-900/60 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
            <nav className="flex space-x-1 sm:space-x-4 py-2">
              <button
                onClick={() => setActiveTab('wifi')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition ${
                  activeTab === 'wifi'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Wifi className="h-4 w-4 text-cyan-400" />
                <span>{t.tabWifi}</span>
              </button>

              <button
                onClick={() => setActiveTab('devices')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition relative ${
                  activeTab === 'devices'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Laptop2 className="h-4 w-4 text-cyan-400" />
                <span>{t.tabDevices}</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {connectedDevicesCount}
                </span>
                {blockedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-red-950 text-red-300 border border-red-800">
                    {blockedCount} ब्लॉक
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('status')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition ${
                  activeTab === 'status'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Activity className="h-4 w-4 text-cyan-400" />
                <span>{t.tabStatus}</span>
              </button>
            </nav>

            <div className="hidden lg:flex items-center text-xs text-slate-400 gap-3">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>WAN: {systemStatus?.wanStatus || 'Connected'}</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="font-mono text-slate-400 text-[11px]">
                Uptime: {systemStatus?.uptime || '14d 6h'}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
