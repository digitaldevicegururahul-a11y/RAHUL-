import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  RotateCw, 
  CheckCircle2, 
  Globe, 
  Clock, 
  ShieldCheck, 
  HardDrive, 
  Terminal, 
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { RouterProfile, RouterSystemStatus, ConnectionCredentials } from '../types/router';
import { translations, Language } from '../translations/i18n';

interface SystemStatusProps {
  currentRouter: RouterProfile;
  systemStatus: RouterSystemStatus;
  credentials: ConnectionCredentials | null;
  onReboot: () => void;
  lang: Language;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  currentRouter,
  systemStatus,
  credentials,
  onReboot,
  lang
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-6">
      {/* 1. Hardware & System Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentRouter.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentRouter.type}
                </span>
              </h2>
              <p className="text-xs text-slate-400">{currentRouter.vendor} • {currentRouter.description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReboot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-xs font-semibold text-amber-300 border border-amber-500/30 transition self-start sm:self-auto"
          >
            <RotateCw className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.reboot}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">{t.firmwareVer}</span>
            <span className="text-xs font-mono font-bold text-slate-200">{systemStatus.firmwareVersion}</span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">{t.hardwareVer}</span>
            <span className="text-xs font-mono font-bold text-slate-200">{systemStatus.hardwareVersion}</span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">{t.uptime}</span>
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{systemStatus.uptime}</span>
            </span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">{t.wanStatus}</span>
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{systemStatus.wanStatus}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Network Addresses & Resource Monitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network IP Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Globe className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">नेटवर्क एवं गेटवे पते (IP Configuration)</h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 font-sans">{t.lanIp} (Router Gateway)</span>
              <span className="font-bold text-cyan-400">{systemStatus.lanIp}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 font-sans">{t.wanIp} (Public IP)</span>
              <span className="font-bold text-slate-200">{systemStatus.wanIp}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 font-sans">सबनेट मास्क (Subnet Mask)</span>
              <span className="font-bold text-slate-300">{systemStatus.subnetMask}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 font-sans">राउटर हार्डवेयर MAC</span>
              <span className="font-bold text-slate-300">{systemStatus.macAddress}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 font-sans">{t.primaryDns} / Secondary</span>
              <span className="font-bold text-slate-300">{systemStatus.primaryDns} / {systemStatus.secondaryDns}</span>
            </div>
          </div>
        </div>

        {/* System Load & Hardware Specs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">सिस्टम रिसोर्स लोड (Resource Usage)</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">{t.cpuUsage}</span>
                  <span className="font-mono text-cyan-400 font-bold">{systemStatus.cpuUsagePercent}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${systemStatus.cpuUsagePercent}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">{t.memoryUsage}</span>
                  <span className="font-mono text-blue-400 font-bold">{systemStatus.memoryUsagePercent}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${systemStatus.memoryUsagePercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Model Specifications */}
              <div className="pt-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>समर्थित बैंड:</span>
                    <span className="text-slate-200 font-mono">{currentRouter.supportedBands.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>फर्मवेयर एपीआई एंडपॉइंट:</span>
                    <span className="text-slate-200 font-mono">{currentRouter.apiEndpoint}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>सिस्टम सामान्य स्थिति में संचालित हो रहा है। कोई ओवरहीटिंग या पैकेट लॉस नहीं है।</span>
          </div>
        </div>
      </div>
    </div>
  );
};
