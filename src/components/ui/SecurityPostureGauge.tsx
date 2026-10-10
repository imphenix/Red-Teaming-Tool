import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity } from 'lucide-react';
import { Severity } from '../../types/security';

interface SecurityPostureGaugeProps {
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  fixedCount: number;
}

export const SecurityPostureGauge: React.FC<SecurityPostureGaugeProps> = ({
  criticalCount,
  highCount,
  mediumCount,
  lowCount,
  fixedCount
}) => {
  // Score math: 100 baseline, deductions based on severity
  const penalty = (criticalCount * 22) + (highCount * 12) + (mediumCount * 5) + (lowCount * 2);
  const score = Math.max(15, Math.min(100, 100 - penalty));

  // Determine status
  const getStatus = () => {
    if (score >= 85) return { label: 'HARDENED POSTURE', color: 'text-[#35C98A]', stroke: '#35C98A', glow: 'emerald-glow' };
    if (score >= 65) return { label: 'MODERATE EXPOSURE', color: 'text-[#F5C451]', stroke: '#F5C451', glow: '' };
    if (score >= 45) return { label: 'ELEVATED RISK', color: 'text-[#FF8A3D]', stroke: '#FF8A3D', glow: '' };
    return { label: 'CRITICAL EXPOSURE', color: 'text-[#FF3548]', stroke: '#FF3548', glow: 'crimson-glow' };
  };

  const status = getStatus();

  // SVG Circumference calculation for 80px radius circle
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`p-6 rounded-xl cyber-surface relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${status.glow}`}>
      {/* Background cyber accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF3548]/40 to-transparent" />

      {/* Left Column: Gauge SVG & Score */}
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            {/* Background Track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="rgba(37, 44, 56, 0.6)"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Animated Score Arc */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke={status.stroke}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold font-mono tracking-tight text-[#F3F5F8] tabular-nums">
              {score}
            </span>
            <span className="text-[10px] font-mono text-[#98A2B3] tracking-widest uppercase">
              / 100
            </span>
          </div>
        </div>

        {/* Status text */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FF3548]" />
            <span className="text-[10px] font-mono text-[#98A2B3] uppercase tracking-wider">
              Security Posture Index
            </span>
          </div>
          <h3 className={`text-base font-bold font-mono ${status.color}`}>
            {status.label}
          </h3>
          <p className="text-xs text-[#98A2B3] max-w-xs leading-relaxed">
            Derived from automated assessment checks across active assets and resolved remediations.
          </p>
        </div>
      </div>

      {/* Right Column: Breakdown Indicators */}
      <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-[#252C38] pt-4 md:pt-0 md:pl-6 text-xs w-full md:w-auto justify-between md:justify-start">
        <div className="space-y-1">
          <span className="text-[11px] text-[#98A2B3] block">Active Critical</span>
          <span className="text-xl font-bold font-mono text-[#FF3548] tabular-nums block">
            {criticalCount}
          </span>
          <span className="text-[10px] text-[#98A2B3]/70 font-mono">-22 pts each</span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-[#98A2B3] block">Active High</span>
          <span className="text-xl font-bold font-mono text-[#FF8A3D] tabular-nums block">
            {highCount}
          </span>
          <span className="text-[10px] text-[#98A2B3]/70 font-mono">-12 pts each</span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-[#98A2B3] block">Verified Fixed</span>
          <span className="text-xl font-bold font-mono text-[#35C98A] tabular-nums block">
            {fixedCount}
          </span>
          <span className="text-[10px] text-[#35C98A]/70 font-mono">Restored</span>
        </div>
      </div>
    </div>
  );
};
