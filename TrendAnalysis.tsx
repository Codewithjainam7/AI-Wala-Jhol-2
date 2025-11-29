import React from 'react';
import { AnalysisResponse } from '../types';
import { TrendingUp, Activity, ArrowUpRight } from './Icons';

interface TrendAnalysisProps {
  history: AnalysisResponse[];
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ history }) => {
  const avgScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.detection.risk_score, 0) / history.length) 
    : 0;

  const trend = history.length >= 2 
    ? (history[0].detection.risk_score > history[1].detection.risk_score ? 'Increasing' : 'Decreasing') 
    : 'Stable';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">Detection Trends</h2>
        <p className="text-brand-muted mt-2">Visualize your content risk scores over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-brand-crimson/30 transition-all hover:bg-white/10 group">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-muted uppercase tracking-wider mb-4 group-hover:text-brand-crimson transition-colors">
              <Activity className="w-4 h-4" />
              Total Scans
            </div>
            <div className="text-5xl font-black text-white">{history.length}</div>
            <div className="mt-2 text-sm text-gray-400">Items analyzed</div>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-brand-crimson/30 transition-all hover:bg-white/10 group">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-muted uppercase tracking-wider mb-4 group-hover:text-brand-crimson transition-colors">
              <TrendingUp className="w-4 h-4" />
              Average Risk Score
            </div>
            <div className="flex items-baseline gap-2">
              <div className={`text-5xl font-black ${avgScore > 70 ? 'text-brand-crimson' : avgScore > 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {avgScore}
              </div>
              <span className="text-xl text-gray-500 font-bold">/100</span>
            </div>
            <div className="mt-2 text-sm text-gray-400">Cumulative average</div>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-brand-crimson/30 transition-all hover:bg-white/10 group overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-muted uppercase tracking-wider mb-4 group-hover:text-brand-crimson transition-colors">
              <ArrowUpRight className="w-4 h-4" />
              Risk Trend
            </div>
            
            {/* Adjusted layout for wrapping and sizing */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <div className={`text-4xl lg:text-5xl font-black tracking-tight break-all sm:break-normal ${trend === 'Increasing' ? 'text-red-500' : trend === 'Decreasing' ? 'text-green-500' : 'text-gray-400'}`}>
                  {history.length < 2 ? '-' : trend}
              </div>
              {history.length >= 2 && (
                <div className={`text-3xl transition-transform transform ${trend === 'Increasing' ? 'text-red-500 -rotate-45' : trend === 'Decreasing' ? 'text-green-500 rotate-45' : 'text-gray-400'}`}>
                   ➔
                </div>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-400">Based on recent scans</div>
        </div>
      </div>

      {/* Placeholder for future graph if needed, currently text only for stability */}
      {history.length < 2 && (
        <div className="mt-12 p-8 rounded-2xl bg-black/40 border border-white/5 text-center">
           <p className="text-brand-muted">Perform more scans to see detailed trend direction.</p>
        </div>
      )}
    </div>
  );
};