import React from 'react';
import { AnalysisResponse } from '../types';
import { Trash2, XCircle, History } from './Icons';

interface HistoryViewProps {
  history: AnalysisResponse[];
  onSelect: (item: AnalysisResponse) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onDelete, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-4xl shadow-[0_0_30px_rgba(255,255,255,0.05)] text-gray-500">
           <History className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No history yet</h3>
        <p className="text-brand-muted">Your past scans will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Scan History</h2>
          <p className="text-brand-muted text-sm mt-1">Review and compare your previous analyses</p>
        </div>
        <button 
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-400 bg-red-900/10 border border-red-900/30 rounded-lg hover:bg-red-900/30 hover:border-red-500/50 transition-all duration-300"
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="grid gap-4">
        {history.map((item, index) => (
          <div 
            key={item.scan_id} 
            className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-black/40 border border-white/10 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 hover:border-brand-crimson/50 hover:shadow-[0_0_20px_rgba(220,20,60,0.15)] overflow-hidden"
            onClick={() => onSelect(item)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Side Accent Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300
              ${item.detection.risk_level === 'HIGH' ? 'bg-red-500 group-hover:bg-red-400' : 
                item.detection.risk_level === 'MEDIUM' ? 'bg-yellow-500 group-hover:bg-yellow-400' : 'bg-green-500 group-hover:bg-green-400'}`} 
            />

            <div className="flex items-center gap-5 pl-4 mb-3 sm:mb-0">
               <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold border backdrop-blur-sm transition-transform duration-300 group-hover:scale-110
                 ${item.detection.risk_level === 'HIGH' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                   item.detection.risk_level === 'MEDIUM' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}
               >
                 {item.detection.risk_score}
               </div>
               
               <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-bold text-lg capitalize tracking-tight group-hover:text-brand-crimson transition-colors">{item.mode} Analysis</span>
                    <span className="text-[10px] font-mono text-brand-muted px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                 </div>
                 <p className="text-sm text-gray-400 line-clamp-1 group-hover:text-gray-300 transition-colors">
                   {item.file_info?.name ? `File: ${item.file_info.name}` : item.detection.summary}
                 </p>
               </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(item.scan_id); }}
              className="absolute top-4 right-4 sm:static p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Delete Scan"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};