import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Gradient Orbs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-crimson/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px] animate-pulse-slow delay-1000"></div>
      <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[120px]"></div>

      {/* Floating 3D Cards with 'Detection' Content */}
      
      {/* Card 1: Scanning Code */}
      <div className="absolute top-32 right-[8%] w-40 h-48 glass-card rounded-xl opacity-30 transform rotate-12 animate-float overflow-hidden border border-white/10">
        <div className="p-3 space-y-2">
           <div className="w-1/2 h-2 bg-white/20 rounded"></div>
           <div className="w-3/4 h-2 bg-white/10 rounded"></div>
           <div className="w-full h-2 bg-white/10 rounded"></div>
           <div className="w-2/3 h-2 bg-brand-crimson/20 rounded mt-4"></div>
           <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-crimson/50 shadow-[0_0_10px_#DC143C] animate-pulse"></div>
        </div>
      </div>

      {/* Card 2: Waveform/Graph */}
      <div className="absolute bottom-40 left-[5%] w-56 h-36 glass-card rounded-xl opacity-20 transform -rotate-6 animate-float-delayed border border-white/10 overflow-hidden">
         <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-2 pb-2 h-full">
            <div className="w-1/6 bg-white/10 h-[30%] rounded-t"></div>
            <div className="w-1/6 bg-white/20 h-[60%] rounded-t"></div>
            <div className="w-1/6 bg-brand-crimson/30 h-[80%] rounded-t animate-pulse"></div>
            <div className="w-1/6 bg-white/10 h-[40%] rounded-t"></div>
            <div className="w-1/6 bg-white/5 h-[20%] rounded-t"></div>
         </div>
      </div>
      
      {/* Card 3: Deep Layer */}
      <div className="absolute top-1/3 left-20 w-24 h-24 glass-card rounded-lg opacity-10 blur-[2px] animate-float delay-700"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>
  );
};