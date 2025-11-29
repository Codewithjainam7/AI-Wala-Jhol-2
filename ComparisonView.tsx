import React, { useState } from 'react';
import { AnalysisResponse } from '../types';
import { Gauge } from './Gauge';
import { Scale } from './Icons';

interface ComparisonViewProps {
  history: AnalysisResponse[];
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ history }) => {
  const [selectedLeft, setSelectedLeft] = useState<string>(history[0]?.scan_id || '');
  const [selectedRight, setSelectedRight] = useState<string>(history[1]?.scan_id || '');

  const leftItem = history.find(h => h.scan_id === selectedLeft);
  const rightItem = history.find(h => h.scan_id === selectedRight);

  if (history.length < 2) {
     return (
        <div className="flex flex-col items-center justify-center h-64 bg-white/5 rounded-xl border border-white/10 p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-3xl text-gray-500">
               <Scale className="w-8 h-8" />
            </div>
            <p className="text-white font-bold text-lg mb-2">Comparison Mode</p>
            <p className="text-brand-muted text-sm">You need at least 2 scans to use this feature.</p>
        </div>
     );
  }

  const renderCard = (item?: AnalysisResponse) => {
    if (!item) return null;
    const color = item.detection.risk_level === 'HIGH' ? '#DC143C' : item.detection.risk_level === 'MEDIUM' ? '#F59E0B' : '#10B981';
    
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col hover:border-white/20 transition-colors">
            <div className="flex justify-center mb-6 pt-4">
                <Gauge score={item.detection.risk_score} color={color} />
            </div>
            
            <div className="space-y-4 flex-1">
                <div className="text-center mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/40 border border-${item.ui_hints.suggested_color}-500/30 text-${item.ui_hints.suggested_color}-400`}>
                        {item.detection.risk_level} Risk
                    </span>
                </div>
                
                <div className="bg-black/20 p-4 rounded-xl">
                    <h4 className="text-xs text-brand-muted uppercase mb-2 font-bold">Summary</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{item.detection.summary}</p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-xl">
                    <h4 className="text-xs text-brand-muted uppercase mb-2 font-bold">Top Signal</h4>
                    <p className="text-sm text-gray-400 italic">"{item.detection.signals[0] || 'No signals detected'}"</p>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-white">Compare Results</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between bg-black/40 p-4 rounded-2xl border border-white/10">
         <div className="w-full md:w-1/2">
             <label className="text-xs text-brand-muted uppercase font-bold block mb-2 ml-1">Left Scan</label>
             <select 
               value={selectedLeft}
               onChange={(e) => setSelectedLeft(e.target.value)}
               className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson transition-all"
             >
                 {history.map(h => (
                     <option key={h.scan_id} value={h.scan_id}>
                         {new Date(h.timestamp).toLocaleDateString()} — {h.file_info?.name || (h.mode === 'text' ? 'Text Analysis' : 'Image Scan')}
                     </option>
                 ))}
             </select>
         </div>
         
         <div className="hidden md:flex items-center justify-center pt-6">
            <div className="w-10 h-10 rounded-full bg-brand-crimson/20 border border-brand-crimson/50 flex items-center justify-center text-brand-crimson font-bold text-xs">VS</div>
         </div>

         <div className="w-full md:w-1/2">
             <label className="text-xs text-brand-muted uppercase font-bold block mb-2 ml-1">Right Scan</label>
             <select 
               value={selectedRight}
               onChange={(e) => setSelectedRight(e.target.value)}
               className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson transition-all"
             >
                 {history.map(h => (
                     <option key={h.scan_id} value={h.scan_id}>
                         {new Date(h.timestamp).toLocaleDateString()} — {h.file_info?.name || (h.mode === 'text' ? 'Text Analysis' : 'Image Scan')}
                     </option>
                 ))}
             </select>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {renderCard(leftItem)}
          {renderCard(rightItem)}
          
          {/* Floating Diff Badge */}
          {leftItem && rightItem && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-full bg-brand-dark border-4 border-brand-black shadow-[0_0_30px_rgba(0,0,0,0.8)] z-10">
                <div className="text-[10px] text-gray-500 uppercase font-bold">Diff</div>
                <div className="text-2xl font-bold text-white">
                    {Math.abs(leftItem.detection.risk_score - rightItem.detection.risk_score)}
                </div>
            </div>
          )}
      </div>
    </div>
  );
};