import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="relative h-10 w-10 flex items-center justify-center">
      {/* Outer Ring */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-crimson to-brand-accent animate-pulse-slow blur-[2px] opacity-70"></div>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-crimson to-brand-accent shadow-[0_0_15px_rgba(220,20,60,0.6)]"></div>
      
      {/* Eye Graphic */}
      <svg className="relative w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      
      {/* Scanning Line */}
      <div className="absolute left-0 right-0 h-[2px] bg-white opacity-80 shadow-[0_0_5px_white] animate-[float_3s_ease-in-out_infinite] top-1/2 -translate-y-1/2 w-full scale-x-110"></div>
    </div>
  );
};