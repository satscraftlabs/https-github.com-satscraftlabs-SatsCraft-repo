import React from 'react';
import { Button } from '../components/ui/Button';
import { PATHS } from '../constants';
import { PathId } from '../types';

interface PathSuccessProps {
  pathId: PathId;
  onReturn: () => void;
}

export const PathSuccess: React.FC<PathSuccessProps> = ({ pathId, onReturn }) => {
  const path = PATHS.find(p => p.id === pathId) || PATHS[0];

  return (
    <div className="flex flex-col h-full bg-[#050505] p-6 animate-in zoom-in duration-500 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center gap-8 relative z-10">
        
        {/* Trophy / Badge Animation */}
        <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all duration-1000"></div>
            <div className="relative size-40 rounded-full bg-gradient-to-b from-surface-highlight to-black border-2 border-primary flex items-center justify-center shadow-[0_0_50px_rgba(247,147,26,0.4)]">
                <span className="material-symbols-outlined text-[80px] text-primary drop-shadow-[0_0_10px_rgba(247,147,26,0.8)] animate-pulse-slow">{path.icon}</span>
            </div>
            {/* Orbiting particles (css only) */}
            <div className="absolute inset-0 border border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute -inset-4 border border-primary/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        </div>
        
        <div className="text-center space-y-4 max-w-2xl">
            <div className="inline-block bg-primary/10 border border-primary/20 rounded-full px-4 py-1">
                <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">{path.title} Mastered</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white font-display tracking-tight leading-none">
                Protocol Competence <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Verified</span>
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
                You have successfully navigated all modules and survived the adversarial stress test. Your mastery of this domain is now recorded on-chain.
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-4">
            <div className="bg-surface-dark p-4 rounded-2xl border border-white/10 text-center hover:border-primary/30 transition-colors">
                <span className="block text-3xl font-bold text-white font-display">{path.modules.length}</span>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Modules</span>
            </div>
            <div className="bg-surface-dark p-4 rounded-2xl border border-white/10 text-center hover:border-primary/30 transition-colors">
                <span className="block text-3xl font-bold text-success font-display">100%</span>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Survival Rate</span>
            </div>
            <div className="bg-surface-dark p-4 rounded-2xl border border-white/10 text-center hover:border-primary/30 transition-colors">
                <span className="block text-3xl font-bold text-primary font-display">+{path.modules.reduce((acc, m) => acc + m.xp, 0)}</span>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Total XP</span>
            </div>
        </div>

      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        <Button variant="primary" fullWidth size="lg" onClick={onReturn} className="shadow-[0_0_30px_-5px_rgba(247,147,26,0.5)]">
            Return to Headquarters
        </Button>
      </div>
    </div>
  );
};