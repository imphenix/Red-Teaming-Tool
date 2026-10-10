import React from 'react';
import { FindingStatus } from '../../types/security';

interface StatusBadgeProps {
  status: FindingStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config: Record<FindingStatus, { label: string; textClass: string; bgClass: string; borderClass: string }> = {
    OPEN: {
      label: 'Open',
      textClass: 'text-[#FF3548]',
      bgClass: 'bg-[#FF3548]/10',
      borderClass: 'border-[#FF3548]/25'
    },
    IN_PROGRESS: {
      label: 'In Progress',
      textClass: 'text-[#F5C451]',
      bgClass: 'bg-[#F5C451]/10',
      borderClass: 'border-[#F5C451]/25'
    },
    FIXED: {
      label: 'Fixed (Reported)',
      textClass: 'text-[#35C98A]',
      bgClass: 'bg-[#35C98A]/10',
      borderClass: 'border-[#35C98A]/25'
    },
    ACCEPTED_RISK: {
      label: 'Accepted Risk',
      textClass: 'text-[#98A2B3]',
      bgClass: 'bg-[#98A2B3]/10',
      borderClass: 'border-[#98A2B3]/25'
    },
    RETEST_REQUIRED: {
      label: 'Retest Needed',
      textClass: 'text-[#58A6FF]',
      bgClass: 'bg-[#58A6FF]/10',
      borderClass: 'border-[#58A6FF]/25'
    },
    FALSE_POSITIVE: {
      label: 'False Positive',
      textClass: 'text-[#98A2B3]',
      bgClass: 'bg-[#98A2B3]/10',
      borderClass: 'border-[#98A2B3]/25'
    }
  };

  const item = config[status] || config.OPEN;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center rounded border font-medium ${item.textClass} ${item.bgClass} ${item.borderClass} ${sizeClasses} whitespace-nowrap shrink-0`}>
      {item.label}
    </span>
  );
};
