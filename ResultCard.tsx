import React, { useState } from 'react';
import { AnalysisResponse } from '../types';
import { Gauge } from './Gauge';
import { RotateCcw, AlertTriangle, Lightbulb, Sparkles, ThumbsUp, ThumbsDown, MessageSquare } from './Icons';

interface ResultCardProps {
  data: AnalysisResponse;
  onClose: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onClose }) => {
  const { detection, ui_hints, humanizer } = data;
  const [feedbackSent, setFeedbackSent] = useState(false);
  
  const getScoreColor = () => {
    switch (ui_hints.suggested_color) {
      case 'green': return '#10B981';
      case 'yellow': return '#F59E0B';
      case 'red': return '#DC143C';
      default: return '#DC143C';
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    // In a real app, this would send data to an API
    console.log(`User feedback: ${type} for scan ${data.scan_id}`);
    setFeedbackSent(true);
  };

  return (
    <div className="w-full animate-fade-in space-y-8 pb-20">
      
      {/* Header Summary Card */}
      <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl transition-all hover:border-white/20`}>
        {/* Top Accent Line with Glow */}
        <div className={`absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-${ui_hints.suggested_color}-500 to-transparent opacity-80 shadow-[0_0_20px_${getScoreColor()}]`} />
        
        <div className="flex flex-col gap-10 md:flex-row md:items-center p-8 md:p-12">
          
          {/* Gauge Section */}
          <div className="flex shrink-0 flex-col items-center justify-center relative">
            <div className="scale-125 transition-transform hover:scale-[1.3] duration-500">
               <Gauge score={detection.risk_score} color={getScoreColor()} />
            </div>
            <span className={`mt-6 inline-flex items-center rounded-full px-5 py-2 text-sm font-bold uppercase tracking-widest bg-${ui_hints.suggested_color}-500/5 text-${ui_hints.suggested_color}-400 border border-${ui_hints.suggested_color}-500/20 shadow-[0_0_25px_rgba(0,0,0,0.5)] backdrop-blur-md`}>
              {detection.risk_level} Risk
            </span>
          </div>

          {/* Text Summary Section */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                 <div className="flex items-center gap-3 mb-3">
                   <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 tracking-tight">Detection Report</h2>
                 </div>
                 <p className="text-[10px] text-brand-muted font-mono bg-white/5 inline-block px-3 py-1 rounded-full border border-white/5 tracking-wider">{data.scan_id}</p>
              </div>
              
              {/* Desktop Analyze Again */}
              <button 
                onClick={onClose} 
                className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-brand-crimson hover:border-brand-crimson text-sm font-bold text-white transition-all border border-white/10 hover:shadow-[0_0_25px_rgba(220,20,60,0.4)] group"
              >
                <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-180 duration-500" />
                Analyze Again
              </button>
            </div>
            
            <p className="text-xl text-gray-200 leading-relaxed font-light border-l-2 border-white/10 pl-6">
              {detection.summary}
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl bg-black/40 p-6 border border-white/5 hover:border-brand-crimson/30 transition-all hover:bg-white/[0.02]">
                <div className="text-xs text-brand-muted uppercase tracking-widest mb-2 font-bold opacity-70">AI Probability</div>
                <div className="text-4xl font-mono text-brand-crimson drop-shadow-[0_0_15px_rgba(220,20,60,0.4)]">{(detection.ai_probability * 100).toFixed(1)}%</div>
              </div>
              <div className="rounded-2xl bg-black/40 p-6 border border-white/5 hover:border-green-500/30 transition-all hover:bg-white/[0.02]">
                <div className="text-xs text-brand-muted uppercase tracking-widest mb-2 font-bold opacity-70">Human Probability</div>
                <div className="text-4xl font-mono text-green-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">{(detection.human_probability * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signals & Recommendations */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all">
          <h3 className="mb-8 flex items-center text-2xl font-bold text-white">
            <span className="mr-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-crimson/20 text-brand-crimson ring-1 ring-brand-crimson/40 shadow-[0_0_15px_rgba(220,20,60,0.2)]">
              <AlertTriangle className="w-5 h-5" />
            </span>
            Detected Signals
          </h3>
          <ul className="space-y-6">
            {detection.signals.map((signal, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-4 text-sm text-gray-300 animate-fade-in group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-crimson shadow-[0_0_8px_#DC143C] group-hover:scale-150 transition-transform"></span>
                <span className="leading-relaxed group-hover:text-white transition-colors">{signal}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all">
          <h3 className="mb-8 flex items-center text-2xl font-bold text-white">
            <span className="mr-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Lightbulb className="w-5 h-5" />
            </span>
            Recommendations
          </h3>
          <ul className="space-y-6">
            {data.recommendations.map((rec, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-4 text-sm text-gray-300 animate-fade-in group"
                style={{ animationDelay: `${(idx + 3) * 100}ms` }}
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400 shadow-[0_0_8px_#60A5FA] group-hover:scale-150 transition-transform"></span>
                <span className="leading-relaxed group-hover:text-white transition-colors">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Humanizer Section */}
      {humanizer.requested && humanizer.humanized_text && (
        <div className="rounded-3xl border border-brand-accent/30 bg-gradient-to-br from-black/80 to-brand-accent/5 p-1 relative overflow-hidden group shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
           <div className="bg-black/80 rounded-[22px] p-10 backdrop-blur-2xl h-full">
             <div className="flex items-center justify-between mb-8">
               <h3 className="flex items-center text-3xl font-bold text-white gap-4">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse-slow" />
                Humanized Version
               </h3>
               <span className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-mono font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                 +{humanizer.improvement_score} pts improved
               </span>
             </div>
             
             <div className="rounded-2xl bg-white/[0.03] p-8 text-gray-200 leading-loose whitespace-pre-wrap font-serif border border-white/5 shadow-inner text-lg">
               {humanizer.humanized_text}
             </div>
             
             <div className="mt-8 flex flex-wrap gap-4">
                {humanizer.changes_made.map((change, idx) => (
                   <span key={idx} className="inline-flex items-center rounded-lg bg-green-900/20 px-4 py-2 text-xs font-bold text-green-400 border border-green-900/30 uppercase tracking-wide hover:bg-green-900/30 transition-colors cursor-default">
                     ✓ {change}
                   </span>
                ))}
             </div>
           </div>
        </div>
      )}

      {/* Detailed Analysis & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Deep Log */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.02] p-10 backdrop-blur-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-muted"></span>
            Deep Forensic Log
          </h3>
          <p className="text-base text-gray-400 leading-relaxed font-mono text-sm">
              {detection.detailed_analysis}
          </p>
        </div>

        {/* Feedback Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm flex flex-col justify-between">
           <div>
             <h3 className="text-lg font-bold text-white mb-2">Rate this result</h3>
             <p className="text-sm text-brand-muted mb-6">Help us improve detection accuracy.</p>
           </div>
           
           {!feedbackSent ? (
             <div className="space-y-4">
               <div className="flex gap-4">
                 <button 
                   onClick={() => handleFeedback('up')}
                   className="flex-1 py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 hover:scale-105 transition-all flex justify-center items-center"
                 >
                   <ThumbsUp className="w-6 h-6" />
                 </button>
                 <button 
                   onClick={() => handleFeedback('down')}
                   className="flex-1 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all flex justify-center items-center"
                 >
                   <ThumbsDown className="w-6 h-6" />
                 </button>
               </div>
               <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Optional suggestion..." 
                   className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-crimson/50 transition-colors"
                 />
                 <MessageSquare className="absolute right-3 top-3 w-4 h-4 text-gray-600" />
               </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in py-4">
               <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mb-3">
                 <ThumbsUp className="w-6 h-6" />
               </div>
               <p className="text-white font-bold">Thanks for your feedback!</p>
             </div>
           )}
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="flex justify-center pt-10">
        <button 
          onClick={onClose} 
          className="w-full md:w-auto px-16 py-5 rounded-full bg-gradient-to-r from-brand-crimson to-brand-accent text-white font-bold hover:shadow-[0_0_40px_rgba(220,20,60,0.5)] transition-all transform hover:scale-105 flex items-center justify-center gap-4 text-lg border border-white/10"
        >
          <RotateCcw className="w-5 h-5" />
          Scan Another Content
        </button>
      </div>
      
    </div>
  );
};
