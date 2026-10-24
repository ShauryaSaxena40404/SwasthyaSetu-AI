import React from 'react';
import { ShieldAlert, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  variant: 'draft' | 'verified' | 'guidance' | 'caution' | 'demo';
  className?: string;
  size?: 'sm' | 'md';
}

export const DisclaimerBadge: React.FC<Props> = ({ variant, className = '', size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  switch (variant) {
    case 'draft':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses} ${className}`}>
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>Draft for Clinician Review</span>
        </span>
      );
    case 'verified':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses} ${className}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Healthcare Source</span>
        </span>
      );
    case 'guidance':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-teal-50 text-teal-800 border border-teal-200 ${sizeClasses} ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          <span>AI General Information Only</span>
        </span>
      );
    case 'caution':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-red-50 text-red-700 border border-red-200 ${sizeClasses} ${className}`}>
          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
          <span>Requires Doctor Diagnosis</span>
        </span>
      );
    case 'demo':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses} ${className}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
          <span>Demo Account (Fictional Data)</span>
        </span>
      );
    default:
      return null;
  }
};
