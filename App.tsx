import React, { useState, useEffect } from 'react';
import { Background } from './Background';
import { FeatureCards } from './FeatureCards';
import { analyzeContent } from './geminiService';
import { AnalysisResponse } from './types';
import { ResultCard } from './ResultCard';
import { HistoryView } from './HistoryView';
import { Navbar } from './Navbar';
import logo from '/flux-pro-2.0_3D_logo_design_with_letters_A_and_I_overlapping_and_intersecting._Black_backgrou-0.jpg';
import { TrendAnalysis } from './TrendAnalysis';
import { ComparisonView } from './ComparisonView';
import { EducationView } from './EducationView';
import { Loader2, Upload, FileText, ImageIcon, FileUp, Sparkles, Search, History, TrendingUp, Scale, GraduationCap } from './Icons';

type ViewMode = 'analyze' | 'history' | 'trends' | 'compare' | 'learn';

const App: React.FC = () => {
  // Input States
  const [inputText, setInputText] = useState('');
  const [activeInputTab, setActiveInputTab] = useState<'text' | 'image' | 'file'>('text');
  const [selectedFile, setSelectedFile] = useState<{base64: string, mime: string, name: string} | null>(null);
  const [wantHumanize, setWantHumanize] = useState(false);
  
  // Application States
  const [view, setView] = useState<ViewMode>('analyze');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Data States
  const [history, setHistory] = useState<AnalysisResponse[]>([]);

  // Initialize History from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('awj_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  // Save History
  useEffect(() => {
    localStorage.setItem('awj_history', JSON.stringify(history));
  }, [history]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64String = (event.target.result as string).split(',')[1];
          setSelectedFile({
            base64: base64String,
            mime: file.type,
            name: file.name
          });
          setError(null);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (activeInputTab === 'text' && !inputText.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }
    if ((activeInputTab === 'image' || activeInputTab === 'file') && !selectedFile) {
      setError(`Please upload a ${activeInputTab === 'file' ? 'PDF' : 'image'} to analyze.`);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await analyzeContent(
        activeInputTab === 'text' ? inputText : '',
        activeInputTab,
        wantHumanize,
        selectedFile ? { ...selectedFile } : undefined
      );

      if (response.error) {
        setError(response.message || "An error occurred");
      } else {
        setResult(response);
        setHistory(prev => [response, ...prev]);
      }
    } catch (err) {
      setError("Failed to connect to analysis engine. Please try again in a moment.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setInputText('');
    setSelectedFile(null);
    setError(null);
    setView('analyze');
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.scan_id !== id));
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to delete all history?")) {
      setHistory([]);
    }
  };

  const navItems: {id: ViewMode, label: string, icon: React.ReactNode}[] = [
    { id: 'analyze', label: 'Scanner', icon: <Search className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare', icon: <Scale className="w-4 h-4" /> },
    { id: 'learn', label: 'Learn', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-brand-text selection:bg-brand-crimson selection:text-white pb-20 font-sans relative">
      <Background />
      <Navbar onLogoClick={reset} logoSrc={logo} />

      <main className="container mx-auto max-w-6xl px-4 py-8 relative z-10">
        
        {/* Navigation Tabs */}
        {!result && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border backdrop-blur-sm ${
                  view === item.id 
                    ? 'bg-white/10 border-brand-crimson text-white shadow-[0_0_20px_rgba(220,20,60,0.3)]' 
                    : 'bg-black/30 border-white/5 text-brand-muted hover:bg-white/5 hover:text-white hover:border-white/20'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Content Views */}
        <div className="min-h-[600px]">
          
          {/* ANALYSIS RESULT VIEW */}
          {result && (
             <ResultCard data={result} onClose={reset} />
          )}

          {/* MAIN SCANNER VIEW */}
          {!result && view === 'analyze' && (
            <div className="animate-fade-in space-y-16">
               <div className="text-center space-y-6">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl leading-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-sm">
                    AI ka jhol
                  </span>
                  <span className="block text-brand-crimson drop-shadow-[0_0_35px_rgba(220,20,60,0.6)] animate-pulse-slow">pakdo!</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg md:text-xl text-brand-muted font-light leading-relaxed">
                  The ultimate open-source platform to detect and humanize AI content. <br className="hidden md:block"/> Upload PDF, Docx, or Images for deep analysis.
                </p>
              </div>

              {/* Input Card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-crimson/5 to-transparent pointer-events-none" />
                
                {/* Input Type Selector */}
                <div className="flex border-b border-white/10">
                  {[
                    { id: 'text', label: 'Text Analysis', icon: <FileText className="w-4 h-4" /> },
                    { id: 'file', label: 'PDF / Docx', icon: <FileUp className="w-4 h-4" /> },
                    { id: 'image', label: 'Image Scan', icon: <ImageIcon className="w-4 h-4" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveInputTab(tab.id as any); setSelectedFile(null); setError(null); }}
                      className={`flex-1 px-4 py-6 text-sm font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                        activeInputTab === tab.id 
                          ? 'bg-white/5 text-white border-b-2 border-brand-crimson shadow-[inset_0_-20px_40px_-20px_rgba(220,20,60,0.1)]' 
                          : 'text-brand-muted hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="p-6 md:p-10">
                  {activeInputTab === 'text' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Paste your text here..."
                          className="h-64 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-6 text-gray-200 placeholder-gray-600 focus:border-brand-crimson focus:outline-none focus:ring-1 focus:ring-brand-crimson transition-all text-lg leading-relaxed shadow-inner"
                        />
                        <div className="absolute bottom-4 right-4 text-xs font-mono text-brand-muted bg-black/60 px-2 py-1 rounded-md border border-white/5">
                           {inputText.split(/\s+/).filter(w => w.length > 0).length} words
                        </div>
                      </div>
                    </div>
                  )}

                  {(activeInputTab === 'image' || activeInputTab === 'file') && (
                    <div className="flex flex-col items-center justify-center space-y-6 py-8">
                      <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer bg-black/30 hover:bg-white/5 hover:border-brand-crimson/50 hover:shadow-[inset_0_0_40px_rgba(220,20,60,0.05)] transition-all group relative overflow-hidden">
                        {selectedFile ? (
                           activeInputTab === 'image' ? (
                             <img src={`data:${selectedFile.mime};base64,${selectedFile.base64}`} className="h-full w-full object-contain p-4 z-10" alt="Preview" />
                           ) : (
                             <div className="text-center z-10 p-8 border border-white/10 bg-black/60 rounded-xl backdrop-blur-md">
                               <div className="text-5xl mb-4 text-white flex justify-center"><FileText className="w-16 h-16" /></div>
                               <div className="text-white font-bold text-lg mb-1">{selectedFile.name}</div>
                               <div className="text-xs text-brand-muted uppercase tracking-wider">Ready to analyze</div>
                             </div>
                           )
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10">
                             <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 group-hover:border-brand-crimson/50 transition-all duration-300">
                               <Upload className="w-10 h-10 text-gray-400 group-hover:text-brand-crimson transition-colors" />
                             </div>
                             <p className="mb-2 text-lg text-gray-300 font-medium">Click to upload or drag and drop</p>
                             <p className="text-sm text-gray-500">{activeInputTab === 'image' ? 'JPG, PNG, WEBP (Max 10MB)' : 'PDF, DOCX (Max 10MB)'}</p>
                          </div>
                        )}
                        <input 
                           id="file-upload" 
                           type="file" 
                           className="hidden" 
                           accept={activeInputTab === 'image' ? "image/*" : ".pdf,.docx,.doc"} 
                           onChange={handleFileChange} 
                        />
                      </label>
                      {selectedFile && (
                        <button onClick={() => setSelectedFile(null)} className="text-sm text-red-400 hover:text-red-300 font-medium hover:underline flex items-center gap-2">
                           <span className="w-4 h-4 border border-red-400 rounded-full flex items-center justify-center text-[10px]">✕</span> Remove File
                        </button>
                      )}
                    </div>
                  )}

                  {/* Humanize Toggle (Hidden for Images) */}
                  {activeInputTab !== 'image' && (
                    <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-brand-crimson" />
                            Humanizer Mode
                          </span>
                          <span className="text-xs text-gray-500">Rewrite content to bypass detection</span>
                       </div>
                       <label className="flex items-center cursor-pointer gap-3 group relative">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={wantHumanize}
                            onChange={() => setWantHumanize(!wantHumanize)}
                          />
                          <div className="w-14 h-8 bg-black border border-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-crimson peer-checked:border-brand-crimson shadow-inner"></div>
                       </label>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-8">
                     {error && (
                       <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3 text-red-400 animate-fade-in">
                          <span className="text-sm font-medium">{error}</span>
                       </div>
                     )}
                     
                     <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-crimson to-brand-accent px-8 py-5 text-lg font-bold text-white shadow-[0_10px_40px_-10px_rgba(220,20,60,0.5)] transition-all hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(220,20,60,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                     >
                       {isAnalyzing ? (
                         <div className="flex items-center justify-center gap-3">
                           <Loader2 className={`w-6 h-6 animate-spin ${wantHumanize ? 'text-yellow-300' : 'text-white'}`} />
                           <span className={wantHumanize ? "animate-pulse" : ""}>
                             {wantHumanize ? "Analyzing & Humanizing..." : "Scanning Content..."}
                           </span>
                         </div>
                       ) : (
                         <div className="flex items-center justify-center gap-2">
                           {wantHumanize && activeInputTab !== 'image' && <Sparkles className="w-5 h-5 animate-pulse" />}
                           <span>{wantHumanize && activeInputTab !== 'image' ? "Analyze & Humanize" : "Detect AI Patterns"}</span>
                         </div>
                       )}
                       
                       {/* Button Shine Effect */}
                       <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none" />
                     </button>
                  </div>
                </div>
              </div>
              
              {/* Feature Cards Showcase */}
              <FeatureCards />
            </div>
          )}

          {/* HISTORY VIEW */}
          {view === 'history' && !result && (
            <HistoryView 
              history={history} 
              onSelect={(item) => setResult(item)} 
              onDelete={deleteHistoryItem}
              onClear={clearHistory}
            />
          )}

          {/* TRENDS VIEW */}
          {view === 'trends' && !result && (
            <TrendAnalysis history={history} />
          )}

          {/* COMPARE VIEW */}
          {view === 'compare' && !result && (
            <ComparisonView history={history} />
          )}

          {/* LEARN VIEW */}
          {view === 'learn' && !result && (
             <EducationView />
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
