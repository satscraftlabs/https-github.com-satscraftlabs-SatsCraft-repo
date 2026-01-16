import React, { useState } from 'react';
import { PATHS } from '../constants';
import { Button } from './ui/Button';

interface RoadmapModalProps {
  onClose: () => void;
  onCtaClick: () => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({ onClose, onCtaClick }) => {
  const [selectedPathId, setSelectedPathId] = useState(PATHS[0].id);
  const selectedPath = PATHS.find(p => p.id === selectedPathId) || PATHS[0];

  const getDifficultyStyles = (diff: string) => {
      switch(diff) {
          case 'Beginner': return 'text-success bg-success/10 border-success/20';
          case 'Intermediate': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
          case 'Adv.': return 'text-warning bg-warning/10 border-warning/20';
          case 'Expert': return 'text-error bg-error/10 border-error/20';
          default: return 'text-text-muted bg-white/5 border-white/10';
      }
  };

  const getTypeStyles = (type: string) => {
      return type === 'LAB' 
        ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' 
        : 'text-primary bg-primary/10 border-primary/20';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-6xl bg-[#0D0F12] border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row h-[85vh] overflow-hidden relative ring-1 ring-white/5">
        
        {/* Close Button Mobile */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 md:hidden z-50 p-2 bg-black/50 rounded-full text-white border border-white/10 backdrop-blur-md"
        >
            <span className="material-symbols-outlined">close</span>
        </button>

        {/* Sidebar: Path Selection */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/5 bg-surface-dark flex flex-col shrink-0">
            <div className="p-6 border-b border-white/5 bg-[#161A1E]">
                <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">map</span>
                    Curriculum Map
                </h2>
                <p className="text-xs text-text-muted mt-1">Select a specialization track.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                {PATHS.map(path => (
                    <button
                        key={path.id}
                        onClick={() => setSelectedPathId(path.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 group relative overflow-hidden ${
                            selectedPathId === path.id 
                                ? 'bg-surface-highlight border-primary/30 ring-1 ring-primary/20 shadow-lg' 
                                : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                        }`}
                    >
                        {selectedPathId === path.id && (
                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                        )}
                        
                        <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            selectedPathId === path.id ? 'bg-primary text-background-dark' : 'bg-white/5 text-text-muted group-hover:text-white'
                        }`}>
                            <span className="material-symbols-outlined text-[20px]">{path.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-sm truncate ${selectedPathId === path.id ? 'text-primary' : 'text-text-main'}`}>
                                {path.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                                <span>{path.modules.length} Mods</span>
                                <span className="size-0.5 bg-white/20 rounded-full"></span>
                                <span>{path.activeLearners}</span>
                            </div>
                        </div>
                        {selectedPathId === path.id && (
                            <span className="material-symbols-outlined text-primary text-sm animate-in slide-in-from-left-2">chevron_right</span>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* Main Content: Path Details & Modules */}
        <div className="flex-1 flex flex-col bg-[#0D0F12] relative overflow-hidden">
             
             {/* Path Header */}
             <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-b from-surface-dark to-transparent shrink-0">
                 <div className="flex justify-between items-start gap-4">
                     <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-text-muted mb-4">
                            <span className="size-1.5 rounded-full bg-success animate-pulse"></span>
                            Live Simulation Environment
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white font-display mb-3 tracking-tight">{selectedPath.title}</h1>
                        <p className="text-text-muted leading-relaxed text-sm md:text-base">{selectedPath.description}</p>
                     </div>
                     
                     <div className="hidden md:flex flex-col gap-2 shrink-0">
                        <button onClick={onClose} className="size-10 flex items-center justify-center hover:bg-white/5 rounded-full text-text-muted hover:text-white transition-colors border border-transparent hover:border-white/10">
                             <span className="material-symbols-outlined">close</span>
                        </button>
                     </div>
                 </div>
             </div>

             {/* Module Timeline */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                 <div className="max-w-4xl space-y-6 relative">
                     {/* Connector Line */}
                     <div className="absolute left-[19px] top-6 bottom-6 w-px bg-white/10 md:left-[23px]"></div>

                     {selectedPath.modules.map((mod, idx) => (
                         <div key={mod.id} className="relative flex gap-6 md:gap-8 group animate-in slide-in-from-bottom-2 duration-500" style={{animationDelay: `${idx * 50}ms`}}>
                             {/* Node */}
                             <div className={`relative z-10 size-10 md:size-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors shadow-lg
                                ${idx === 0 
                                    ? 'bg-primary text-background-dark border-primary' 
                                    : 'bg-[#0D0F12] border-white/10 text-text-muted group-hover:border-primary/50 group-hover:text-primary'
                                }`}>
                                 <span className="text-xs md:text-sm font-mono font-bold">{idx + 1}</span>
                             </div>

                             {/* Card */}
                             <div className="flex-1 p-5 rounded-2xl border border-white/5 bg-surface-dark/40 hover:bg-surface-dark/80 transition-all duration-200 hover:border-white/10 hover:shadow-xl group-hover:translate-x-1">
                                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                                    <h4 className="text-lg font-bold text-white font-display group-hover:text-primary transition-colors">
                                        {mod.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2">
                                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getTypeStyles(mod.type)}`}>
                                             {mod.type === 'LAB' ? 'Practical Lab' : 'Simulation'}
                                         </span>
                                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getDifficultyStyles(mod.difficulty)}`}>
                                             {mod.difficulty}
                                         </span>
                                         <span className="text-[10px] font-mono font-bold bg-white/5 text-text-muted px-2 py-0.5 rounded border border-white/5">
                                             {mod.xp} XP
                                         </span>
                                    </div>
                                 </div>
                                 
                                 <p className="text-sm text-text-muted leading-relaxed max-w-2xl">{mod.description}</p>
                                 
                                 <div className="mt-4 flex items-center gap-4 text-[10px] font-mono text-text-muted/60 uppercase tracking-widest">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        {mod.estimatedTime}
                                    </span>
                                    {mod.type === 'LAB' && (
                                        <span className="flex items-center gap-1 text-purple-400">
                                            <span className="material-symbols-outlined text-sm">terminal</span>
                                            Terminal Access
                                        </span>
                                    )}
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

             {/* CTA Footer */}
             <div className="p-6 border-t border-white/5 bg-surface-dark flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 z-20">
                 <div className="hidden md:block">
                     <p className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Estimated Duration</p>
                     <p className="text-text-muted text-sm font-mono">~{selectedPath.modules.reduce((acc, m) => acc + parseInt(m.estimatedTime), 0)} Minutes Total</p>
                 </div>
                 <div className="flex gap-4 w-full md:w-auto">
                     <Button variant="ghost" onClick={onClose} className="hidden md:flex">Close Preview</Button>
                     <Button variant="primary" onClick={onCtaClick} fullWidth icon="rocket_launch" size="lg" className="shadow-[0_0_20px_rgba(247,147,26,0.3)]">
                         Start {selectedPath.title}
                     </Button>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};