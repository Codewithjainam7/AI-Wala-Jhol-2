import React from 'react';

interface GaugeProps {
  score: number;
  color: string;
}

export const Gauge: React.FC<GaugeProps> = ({ score, color }) => {
  return (
    <div className="relative h-48 w-48 flex items-center justify-center">
      {/* CSS Conic Gradient Gauge */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
          maskImage: 'radial-gradient(transparent 62%, black 63%)',
          WebkitMaskImage: 'radial-gradient(transparent 62%, black 63%)',
          transform: 'rotate(-90deg)' // Start from top
        }}
      />
      
      {/* Inner Glow/Decoration */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div 
          className="text-5xl font-bold tracking-tighter drop-shadow-lg"
          style={{ color: color }}
        >
          {score}
        </div>
        <div className="text-xs uppercase tracking-widest text-brand-muted mt-1 font-medium">Risk Score</div>
      </div>
    </div>
  );
};