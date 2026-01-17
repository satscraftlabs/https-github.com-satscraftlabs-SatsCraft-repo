
import React, { useState } from 'react';
import { PATHS } from '../constants';
import { Button } from '../components/ui/Button';
import { PathId } from '../types';
import { usePresence } from '../hooks/usePresence';

interface OnboardingProps {
  onComplete: (selectedPath: PathId) => void;
}

const SLIDES = [
  {
    id: 1,
    title: "Proof of Skill, Not Certs",
    description: "Your reputation is built through simulation. Generate verifiable skill reports and professional performance audits.",
    icon: "verified_user",
    color: "text-primary",
    bgColor: "bg-primary"
  },
  {
    id: 2,
    title: "Simulation First",
    description: "No passive lectures. You will run nodes, manage keys, and rescue funds in realistic, high-stakes environments.",
    icon: "terminal",
    color: "text-success",
    bgColor: "bg-success"
  },
  {
    id: 3,
    title: "Failure Is Mandatory",
    description: "You will make mistakes here so you don't make them on mainnet. The system forces correction before progression.",
    icon: "warning",
    color: "text-warning",
    bgColor: "bg-warning"
  },
  {
    id: 4,
    title: "Verify, Don't Trust",
    description: "Build a cryptographically signed portfolio of your competence. Prove your work to the network.",
    icon: "fingerprint",
    color: "text-blue-400",
    bgColor: "bg-blue-400"
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPath, setSelectedPath] = useState<PathId | null>(null);
  const [showPathSelection, setShowPathSelection] = useState(false);
  
  // Real-time Presence
  // We pass null initially to just listen without broadcasting presence until they pick a path
  const { activeCounts, isConnected } = usePresence(null);

  const handleNext = () => {
    if (currentSlide === SLIDES.length - 1) {
        setShowPathSelection(true);
    } else {
        setCurrentSlide(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    setShowPathSelection(true);
  };

  const renderSlides = () => {
    const slide = SLIDES[currentSlide];

    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-in fade-in duration-500 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-dark via-background-dark to-background-dark relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <div 
                className="h-full bg-primary transition-all duration-300 ease-out" 
                style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
            ></div>
        </div>
        
        <div className="relative mb-12 group">
          <div className={`absolute inset-0 ${slide.bgColor}/20 blur-[100px] rounded-full transition-colors duration-500`}></div>
          <div className="relative z-10 bg-surface-dark border border-white/10 p-8 rounded-3xl shadow-2xl ring-1 ring-white/5">
            <span className={`material-symbols-outlined text-[80px] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors duration-500 ${slide.color}`}>
              {slide.icon}
            </span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white mb-6 font-display max-w-3xl animate-in slide-in-from-bottom-4 duration-500" key={`title-${currentSlide}`}>
          {slide.title}
        </h1>
        <p className="text-text-muted text-lg md:text-xl leading-relaxed font-medium max-w-xl mx-auto mb-12 animate-in slide-in-from-bottom-2 duration-500 delay-100" key={`desc-${currentSlide}`}>
          {slide.description}
        </p>

        <div className="w-full max-w-xs flex flex-col gap-4">
          <Button variant="primary" fullWidth size="lg" onClick={handleNext}>
            {currentSlide === SLIDES.length - 1 ? "Choose Your Path" : "Next Sequence"}
          </Button>
          {currentSlide < SLIDES.length - 1 && (
             <button onClick={handleSkip} className="text-text-muted text-sm font-bold uppercase tracking-wider hover:text-white transition-colors p-2">
                Skip Intro
             </button>
          )}
        </div>
        
        {/* Slide Indicators */}
        <div className="flex gap-2 mt-12">
            {SLIDES.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-primary' : 'w-1.5 bg-white/10'}`}
                ></div>
            ))}
        </div>
      </div>
    );
  };

  const renderPathSelection = () => (
    <div className="flex flex-col h-full bg-background-dark animate-in slide-in-from-right duration-500">
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full">
          {/* Header */}
          <div className="px-6 md:px-8 pt-8 pb-6 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold text-text-main mb-2 font-display">Choose Your Path</h2>
                <div className="flex items-center gap-2">
                    <p className="text-text-muted max-w-xl">Select a specialized track to begin your simulation sequence.</p>
                    {isConnected && (
                        <div className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded border border-success/20 animate-pulse flex items-center gap-1">
                            <span className="size-1.5 bg-success rounded-full"></span>
                            LIVE
                        </div>
                    )}
                </div>
            </div>
            {/* Desktop Action Button */}
            <div className="hidden md:block">
                 <Button 
                  variant="primary" 
                  size="lg" 
                  disabled={!selectedPath}
                  onClick={() => selectedPath && onComplete(selectedPath)}
                  icon="arrow_forward"
                  className="min-w-[240px] shadow-lg shadow-primary/20"
                >
                  Confirm Selection
                </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24 md:pb-0">
              {PATHS.map((path) => {
                 const activeUsers = activeCounts[path.id] || 0;
                 return (
                    <button
                        key={path.id}
                        onClick={() => setSelectedPath(path.id)}
                        className={`group relative flex flex-col text-left p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                            selectedPath === path.id 
                            ? 'bg-surface-highlight border-primary shadow-[0_0_30px_-10px_rgba(247,147,26,0.4)]' 
                            : 'bg-surface-dark border-white/5 hover:border-white/20 hover:bg-surface-highlight'
                        }`}
                    >
                        {/* Active User Badge */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full border border-white/5">
                            <span className={`size-1.5 rounded-full bg-success ${activeUsers > 0 ? 'animate-pulse' : 'opacity-80'}`}></span>
                            <span className="text-[10px] font-mono font-bold text-text-muted">
                                {activeUsers > 0 ? `${activeUsers} Active` : 'Online'}
                            </span>
                        </div>

                        <div className={`size-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                            selectedPath === path.id 
                            ? 'bg-primary text-background-dark' 
                            : 'bg-white/5 text-text-muted group-hover:text-white'
                        }`}>
                            <span className="material-symbols-outlined text-3xl">{path.icon}</span>
                        </div>
                        
                        <h3 className={`text-xl font-bold mb-2 font-display ${selectedPath === path.id ? 'text-primary' : 'text-white'}`}>
                            {path.title}
                        </h3>
                        
                        <p className="text-sm text-text-muted leading-relaxed mb-6 flex-1">
                            {path.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5 w-full">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                {path.modules.length} Modules
                            </span>
                            {selectedPath === path.id ? (
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                            ) : (
                                <span className="material-symbols-outlined text-white/20 group-hover:text-white transition-colors">arrow_forward</span>
                            )}
                        </div>
                    </button>
                 );
              })}
            </div>
          </div>
          
          {/* Mobile Floating Action Button */}
          <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
             <Button 
                variant="primary" 
                size="lg" 
                fullWidth
                disabled={!selectedPath}
                onClick={() => selectedPath && onComplete(selectedPath)}
                icon="arrow_forward"
                className="shadow-xl shadow-black/50"
              >
                Confirm Selection
              </Button>
          </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-background-dark text-text-main font-body selection:bg-primary/30">
      {showPathSelection ? renderPathSelection() : renderSlides()}
    </div>
  );
};
