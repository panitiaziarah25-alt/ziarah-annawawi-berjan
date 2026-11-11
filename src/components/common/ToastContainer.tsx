import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-900 text-white border-emerald-700',
    error: 'bg-rose-900 text-white border-rose-700',
    info: 'bg-stone-900 text-white border-stone-700',
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[toast.type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-sm max-w-md ${bgStyles}`}
      >
        <Icon className="w-5 h-5 shrink-0 text-amber-300" />
        <span className="font-medium text-xs sm:text-sm leading-snug">{toast.text}</span>
      </div>
    </div>
  );
};
