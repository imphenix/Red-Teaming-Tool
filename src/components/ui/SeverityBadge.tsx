import React from 'react';
import { Severity } from '../../types/security';

interface SeverityBadgeProps {
  severity: Severity;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ 
  severity, 
  size = 'md' 
}) => {
  const config: Record<Severity, { label: string; textClass: string; borderClass: string; bgClass: string; dotClass: string }> = {
    CRITICAL: {
      label: 'Critical',
      textClass: 'text-[#FF3548]',
      borderClass: 'border-[#FF3548]/30',
      bgClass: 'bg-[#FF3548]/10',
      dotClass: 'bg-[#FF3548]'
    },
    HIGH: {
      label: 'High',
      textClass: 'text-[#FF8A3D]',
      borderClass: 'border-[#FF8A3D]/30',
      bgClass: 'bg-[#FF8A3D]/10',
      dotClass: 'bg-[#FF8A3D]'
    },
    MEDIUM: {
      label: 'Medium',
      textClass: 'text-[#F5C451]',
      borderClass: 'border-[#F5C451]/30',
      bgClass: 'bg-[#F5C451]/10',
      dotClass: 'bg-[#F5C451]'
    },
    LOW: {
      label: 'Low',
      textClass: 'text-[#58A6FF]',
      borderClass: 'border-[#58A6FF]/30',
      bgClass: 'bg-[#58A6FF]/10',
      dotClass: 'bg-[#58A6FF]'
    },
    INFORMATIONAL: {
      label: 'Info',
      textClass: 'text-[#8B95A7]',
      borderClass: 'border-[#8B95A7]/30',
      bgClass: 'bg-[#8B95A7]/10',
      dotClass: 'bg-[#8B95A7]'
    }
  };

  const current = config[severity] || config.INFORMATIONAL;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${current.bgClass} ${current.borderClass} ${current.textClass} ${sizeClasses} whitespace-nowrap shrink-0`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dotClass}`} aria-hidden="true" />
      <span>{current.label}</span>
    </span>
  );
};
