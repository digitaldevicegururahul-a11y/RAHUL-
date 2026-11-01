import React from 'react';
import { 
  ShieldCheck, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Server, 
  ArrowRight
} from 'lucide-react';
import { translations, Language } from '../translations/i18n';

interface VerificationModalProps {
  isOpen: boolean;
  step: number; // 1, 2, 3
  statusMessage: string;
  isComplete: boolean;
  isError: boolean;
  errorMessage?: string;
  onClose: () => void;
  lang: Language;
  title?: string;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  step,
  statusMessage,
  isComplete,
  isError,
  errorMessage,
  onClose,
  lang,
  title
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 text-center">
        {/* Animated Icon status */}
        <div className="mx-auto mb-4 flex items-center justify-center">
          {isError ? (
            <div className="h-16 w-16 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
              <XCircle className="h-10 w-10 animate-bounce" />
            </div>
          ) : isComplete ? (
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 animate-scale-up" />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <RotateCw className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-1">
          {title || t.verifyingTitle}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          {isError 
            ? 'राउटर से त्रुटि प्राप्त हुई' 
            : isComplete 
              ? 'राउटर द्वारा पुष्टि स्वीकृत (Verified & Committed)' 
              : 'हार्डवेयर पुष्टि प्रक्रिया जारी है...'}
        </p>

        {/* 3 Step Sequence Indicators */}
        <div className="space-y-3 text-left mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
              step > 1 || isComplete
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : step === 1 && !isError
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              {step > 1 || isComplete ? '✓' : '1'}
            </div>
            <span className={`text-xs ${step >= 1 ? 'text-slate-200' : 'text-slate-500'}`}>
              पेलोड ट्रांसमिशन (Payload Transmission)
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
              step > 2 || isComplete
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : step === 2 && !isError
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              {step > 2 || isComplete ? '✓' : '2'}
            </div>
            <span className={`text-xs ${step >= 2 ? 'text-slate-200' : 'text-slate-500'}`}>
              फर्मवेयर सत्यापन एवं वायरलेस रीलोड
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
              isComplete
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : isError
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : step === 3
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              {isComplete ? '✓' : isError ? '✕' : '3'}
            </div>
            <span className={`text-xs ${isComplete ? 'text-emerald-300 font-medium' : isError ? 'text-red-300' : step >= 3 ? 'text-slate-200' : 'text-slate-500'}`}>
              NVRAM में सहेजा गया और पुष्टि प्राप्त
            </span>
          </div>
        </div>

        {/* Current Dynamic Status Note */}
        <div className={`p-3 rounded-lg text-xs font-mono mb-6 text-left ${
          isError 
            ? 'bg-red-950/40 border border-red-500/40 text-red-300' 
            : isComplete 
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300' 
              : 'bg-slate-950 border border-slate-800 text-cyan-300'
        }`}>
          {isError ? (errorMessage || t.verificationFailed) : statusMessage}
        </div>

        {/* Dismiss Button (only when complete or error) */}
        {(isComplete || isError) && (
          <button
            onClick={onClose}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-lg ${
              isError
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {t.close}
          </button>
        )}
      </div>
    </div>
  );
};
