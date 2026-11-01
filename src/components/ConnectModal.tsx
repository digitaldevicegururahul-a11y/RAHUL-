import React, { useState } from 'react';
import { 
  Radio, 
  Lock, 
  User, 
  Server, 
  ShieldAlert, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Zap, 
  AlertCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { ConnectionCredentials, ConnectionMode, RouterModelId } from '../types/router';
import { SUPPORTED_ROUTERS, getRouterById } from '../data/routerModels';
import { translations, Language } from '../translations/i18n';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (credentials: ConnectionCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  lang: Language;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  isLoading,
  error,
  lang
}) => {
  const t = translations[lang];

  const [selectedModel, setSelectedModel] = useState<RouterModelId>('zte-zxhn-f670l');
  const [ipAddress, setIpAddress] = useState<string>('192.168.1.1');
  const [port, setPort] = useState<number>(80);
  const [protocol, setProtocol] = useState<'http' | 'https'>('http');
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin');
  const [mode, setMode] = useState<ConnectionMode>('demo');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentProfile = getRouterById(selectedModel);

  const handleModelChange = (modelId: RouterModelId) => {
    setSelectedModel(modelId);
    const prof = getRouterById(modelId);
    setIpAddress(prof.defaultIp);
    setUsername(prof.defaultUsername);
    setPassword(prof.defaultPassword);
  };

  const handleApplyDefaults = () => {
    const prof = getRouterById(selectedModel);
    setIpAddress(prof.defaultIp);
    setUsername(prof.defaultUsername);
    setPassword(prof.defaultPassword);
    setPort(80);
    setProtocol('http');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect({
      ipAddress: ipAddress.trim(),
      port,
      protocol,
      username: username.trim(),
      password,
      modelId: selectedModel,
      mode
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t.loginHeader}</h2>
              <p className="text-xs text-slate-400">ROUTER MASTER PRO Control Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyDefaults}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 transition"
              title="मॉडल के डिफ़ॉल्ट क्रेडेंशियल्स भरें"
            >
              <Zap className="h-3 w-3 text-cyan-400" />
              <span>{t.quickPresets}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/15 border border-red-500/40 rounded-lg p-3 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{t.connectFailed}</p>
                <p className="text-red-300/80 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Mode Selector: Demo vs Real Router */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>{t.connectionMode}</span>
              <span className="text-[11px] font-normal text-slate-400">डेमो और वास्तविक अलग</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('demo')}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition ${
                  mode === 'demo'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                  mode === 'demo' ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
                }`}>
                  {mode === 'demo' && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    {t.demoMode}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    सुरक्षित सिमुलेशन, सभी 4 मॉडल्स और सेटिंग्स का परीक्षण करें।
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('live')}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition ${
                  mode === 'live'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                  mode === 'live' ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600'
                }`}>
                  {mode === 'live' && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    {t.liveMode}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    लोकल गेटवे से सीधा संपर्क। वास्तविक पुष्टि पर ही बदलाव लागू होंगे।
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Router Model Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>{t.routerModel} (समर्थित 4 मॉडल्स)</span>
              <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
                currentProfile.supportsDualBand ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {currentProfile.supportsDualBand ? t.dualBandSupported : t.singleBandOnly}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {SUPPORTED_ROUTERS.map((r) => {
                const isSelected = selectedModel === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleModelChange(r.id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/80 text-white shadow-sm ring-1 ring-cyan-500/40'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/70 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-slate-100">{r.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        r.supportsDualBand ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {r.supportsDualBand ? 'Dual Band' : 'Single'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{r.vendor}</span>
                    <span className="text-[10px] font-mono text-cyan-400/90 mt-1.5">Default: {r.defaultIp}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Router IP & Protocol */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>{t.routerIp}</span>
                <span className="text-[10px] text-slate-400 font-mono">Gateway IP</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="192.168.1.1"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              {/* Quick IP Presets */}
              <div className="flex items-center gap-1.5 mt-1.5">
                {['192.168.1.1', '192.168.0.1', '192.168.29.1'].map((ip) => (
                  <button
                    key={ip}
                    type="button"
                    onClick={() => setIpAddress(ip)}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-cyan-300 hover:bg-slate-700 transition"
                  >
                    {ip}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                {t.port}
              </label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Admin Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>{t.username}</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{t.password}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-cyan-400 hover:underline"
                >
                  {showPassword ? t.hidePassword : t.showPassword}
                </button>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 pr-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mode Explanation Notice */}
          <div className={`p-3 rounded-lg border text-xs ${
            mode === 'live' 
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' 
              : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200'
          }`}>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{mode === 'live' ? t.liveModeNote : t.demoModeNote}</span>
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{t.authenticating}</span>
                </>
              ) : (
                <>
                  <Radio className="h-4 w-4" />
                  <span>{t.connect}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
