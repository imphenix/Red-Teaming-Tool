import React, { useEffect, useState } from 'react';
import { ShieldAlert, Crosshair } from 'lucide-react';
import { playRadarBlip } from '../../utils/cyberAudio';

interface CyberRadarProps {
  isScanning: boolean;
  threatCount?: number;
  engineName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CyberRadar: React.FC<CyberRadarProps> = ({
  isScanning,
  threatCount = 0,
  engineName = 'KALI ARSENAL MATRIX',
  size = 'md'
}) => {
  const [blips, setBlips] = useState<{ id: number; x: number; y: number; opacity: number }[]>([]);

  useEffect(() => {
    if (!isScanning) {
      setBlips([]);
      return;
    }

    // Periodically spawn radar blips when scanning
    const interval = setInterval(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 25 + Math.random() * 55; // percentage
      const x = 50 + Math.cos(angle) * (radius / 2);
      const y = 50 + Math.sin(angle) * (radius / 2);

      setBlips(prev => [
        ...prev.slice(-5),
        { id: Date.now() + Math.random(), x, y, opacity: 1 }
      ]);

      playRadarBlip();
    }, 1200);

    return () => clearInterval(interval);
  }, [isScanning]);

  const dimension = size === 'sm' ? 'w-24 h-24' : size === 'lg' ? 'w-64 h-64' : 'w-44 h-44';

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Radar Container */}
      <div className={`relative ${dimension} rounded-full border border-[#00FF88]/30 bg-[#050A0E] overflow-hidden shadow-[0_0_25px_rgba(0,255,136,0.15)]`}>
        {/* Radar Background Grid Rings */}
        <div className="absolute inset-2 rounded-full border border-[#00FF88]/20" />
        <div className="absolute inset-8 rounded-full border border-[#00FF88]/25 border-dashed" />
        <div className="absolute inset-16 rounded-full border border-[#00FF88]/20" />

        {/* Crosshair lines */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#00FF88]/20 -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#00FF88]/20 -translate-x-1/2" />

        {/* Radial degree ticks */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full border border-[#00FF88]/10 rotate-45" />
        </div>

        {/* Rotating Sweep Beam */}
        {isScanning && (
          <div 
            className="absolute inset-0 origin-center pointer-events-none"
            style={{
              animation: 'spin 3s linear infinite',
              background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 255, 136, 0.15) 330deg, rgba(0, 255, 136, 0.45) 360deg)'
            }}
          />
        )}

        {/* Center Target Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88] flex items-center justify-center z-10">
          <div className={`w-1.5 h-1.5 rounded-full ${threatCount > 0 ? 'bg-[#FF3548] animate-ping' : 'bg-white'}`} />
        </div>

        {/* Animated Blips */}
        {blips.map(blip => (
          <div
            key={blip.id}
            className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#FF3548] shadow-[0_0_8px_#FF3548] animate-ping"
            style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
          />
        ))}

        {/* Corner HUD labels */}
        <div className="absolute top-1.5 left-2 text-[8px] font-mono text-[#00FF88]/80 select-none">
          RADAR.ACTIVE
        </div>
        <div className="absolute bottom-1.5 right-2 text-[8px] font-mono text-[#00FF88]/80 select-none">
          {threatCount > 0 ? `ALERT: ${threatCount}` : 'CLEAR'}
        </div>
      </div>

      {/* Under-Radar Status Indicator */}
      <div className="mt-2 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-wider text-[#00FF88]">
          <Crosshair className="w-3 h-3 animate-spin text-[#00FF88]" style={{ animationDuration: '6s' }} />
          <span>{engineName}</span>
        </div>
        <div className="text-[9px] text-[#98A2B3] font-mono mt-0.5">
          {isScanning ? 'PROBING ATTACK VECTORS...' : threatCount > 0 ? `${threatCount} ANOMALIES INTERCEPTED` : 'READY TO ENGAGE'}
        </div>
      </div>
    </div>
  );
};
