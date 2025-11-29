import React from 'react';
import { FileText, ImageIcon, FileUp, Sparkles } from './Icons';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: <FileText className="w-8 h-8 text-brand-crimson" />,
      title: "Text Analysis",
      desc: "Detect AI patterns in essays, blogs, and articles with deep linguistic scanning.",
      delay: "0ms"
    },
    {
      icon: <FileUp className="w-8 h-8 text-blue-400" />,
      title: "PDF & Docx",
      desc: "Upload documents for full-context AI detection preserving structure.",
      delay: "100ms"
    },
    {
      icon: <ImageIcon className="w-8 h-8 text-purple-400" />,
      title: "Image Detection",
      desc: "Analyze visual artifacts and metadata to spot AI-generated images.",
      delay: "200ms"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
      title: "Humanizer",
      desc: "Rewrite robotic text into natural, human-sounding language instantly.",
      delay: "300ms"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 animate-fade-in perspective-[1000px]">
      {features.map((feature, idx) => (
        <div 
          key={idx}
          className="group relative h-full min-h-[220px]"
          style={{ animationDelay: feature.delay }}
        >
          <div className="relative h-full w-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/40 p-6 backdrop-blur-sm transition-all duration-500 ease-out transform-gpu group-hover:-translate-y-4 group-hover:rotate-x-2 group-hover:shadow-[0_20px_40px_-10px_rgba(220,20,60,0.4)] group-hover:border-brand-crimson/40">
            
            {/* Inner Glow Gradient */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-brand-crimson/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative z-10 flex flex-col items-start gap-4">
              <div className="rounded-xl bg-black/50 p-3 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-brand-crimson/10">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-crimson transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {feature.desc}
                </p>
              </div>
            </div>

            {/* Bottom Shine */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-crimson/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-b-2xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};