import React, { useMemo } from 'react';
import { Button } from '../components/ui/Button';
import { UserState } from '../types';
import { PATHS } from '../constants';

interface LabsProps {
  onSelectModule: (moduleId: string) => void;
  userState: UserState;
}

export const Labs: React.FC<LabsProps> = ({ onSelectModule, userState }) => {
  const labCategories = [
    {
      title: "Core Protocol",
      description: "Low-level interaction with Bitcoin primitives.",
      labs: [
        { id: 'LAB_UTXO', title: 'UTXO Model Lab', description: 'Manually construct transactions by selecting unspent outputs and calculating fees.', icon: 'schema', difficulty: 'Intermediate', status: 'AVAILABLE' },
        { id: '3.3', title: 'Script Builder IDE', description: 'Write raw Bitcoin Script (P2PKH, Timelocks) in a simulated IDE environment.', icon: 'code', difficulty: 'Expert', status: 'AVAILABLE', badge: 'DEV' },
      ]
    },
    {
      title: "Network Operations",
      description: "Lightning Network and node management simulations.",
      labs: [
        { id: '4.3', title: 'Liquidity Rebalance', description: 'Balance local and remote channel liquidity to optimize routing revenue.', icon: 'flash_on', difficulty: 'Expert', status: 'AVAILABLE' },
        { id: '4.2', title: 'LND Config Editor', description: 'Configure node policy and features via lnd.conf in a terminal environment.', icon: 'terminal', difficulty: 'Adv.', status: 'AVAILABLE', badge: 'DEV' },
      ]
    },
    {
      title: "Red Team / Security",
      description: "Defensive drills against active attack vectors.",
      labs: [
        { id: '6.1', title: 'Phishing Defense', description: 'Identify social engineering attacks targeting node operators.', icon: 'security', difficulty: 'Expert', status: 'AVAILABLE' },
        { id: '6.2', title: 'Entropy Audit', description: 'Verify randomness sources for key generation. Harvest entropy via mouse movement.', icon: 'casino', difficulty: 'Adv.', status: 'AVAILABLE' },
        { id: 'LAB_P2P', title: 'P2P Trading Desk', description: 'Evaluate trade offers for risk signals. Identify fraud patterns in fiat transfers.', icon: 'handshake', difficulty: 'Intermediate', status: 'AVAILABLE' },
      ]
    }
  ];

  // Calculate Real Statistics
  const allLabIds = useMemo(() => {
      return labCategories.flatMap(cat => cat.labs.map(l => l.id));
  }, []);

  const stats = useMemo(() => {
      // 1. Pass Rate (Labs Completed / Total Labs)
      const completedLabs = allLabIds.filter(id => userState.completedModules.includes(id));
      const masteredCount = completedLabs.length;
      const totalLabs = allLabIds.length;
      const passRate = totalLabs > 0 ? Math.round((masteredCount / totalLabs) * 100) : 0;

      // 2. Time in Sim (Sum of ALL completed modules estimatedTime)
      let totalMinutes = 0;
      userState.completedModules.forEach(modId => {
          let found = false;
          // Search in defined PATHS
          for (const path of PATHS) {
              const mod = path.modules.find(m => m.id === modId);
              if (mod) {
                  totalMinutes += parseInt(mod.estimatedTime) || 0;
                  found = true;
                  break;
              }
          }
          // Fallback for custom Labs not in PATHS
          if (!found) {
             if (modId === 'LAB_UTXO') totalMinutes += 15;
             if (modId === 'LAB_P2P') totalMinutes += 20;
          }
      });

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

      return {
          passRate,
          timeInSim: timeString,
          mastered: `${masteredCount}/${totalLabs}`
      };
  }, [userState.completedModules, allLabIds]);

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-y-auto custom-scrollbar animate-in fade-in duration-500 p-6 md:p-8">
      
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <span className="material-symbols-outlined text-purple-400 text-2xl">science</span>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white font-display">Simulation Labs</h1>
                <p className="text-text-muted">Experimental environments for protocol testing and skill verification.</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-dark p-4 rounded-xl border border-white/5 flex items-center gap-4">
                <div className="size-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                    <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">{stats.passRate}%</h3>
                    <p className="text-xs text-text-muted uppercase font-bold">Lab Completion</p>
                </div>
            </div>
            <div className="bg-surface-dark p-4 rounded-xl border border-white/5 flex items-center gap-4">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">timer</span>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">{stats.timeInSim}</h3>
                    <p className="text-xs text-text-muted uppercase font-bold">Total Sim Time</p>
                </div>
            </div>
             <div className="bg-surface-dark p-4 rounded-xl border border-white/5 flex items-center gap-4">
                <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <span className="material-symbols-outlined">deployed_code</span>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">{stats.mastered}</h3>
                    <p className="text-xs text-text-muted uppercase font-bold">Labs Mastered</p>
                </div>
            </div>
        </div>
      </div>

      {/* Lab Categories */}
      <div className="space-y-12 max-w-6xl">
        {labCategories.map((cat, idx) => (
            <div key={idx} className="animate-in slide-in-from-bottom-4 duration-700" style={{animationDelay: `${idx * 150}ms`}}>
                <div className="flex items-end justify-between mb-6 border-b border-white/5 pb-2">
                    <div>
                        <h2 className="text-xl font-bold text-white">{cat.title}</h2>
                        <p className="text-sm text-text-muted">{cat.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cat.labs.map(lab => {
                        const isCompleted = userState.completedModules.includes(lab.id);
                        
                        return (
                            <div 
                                key={lab.id} 
                                className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 flex flex-col gap-4
                                    ${lab.status === 'LOCKED' 
                                        ? 'bg-surface-dark/30 border-white/5 opacity-60' 
                                        : isCompleted
                                            ? 'bg-surface-dark border-success/30 hover:border-success/50 hover:bg-surface-highlight shadow-[0_0_15px_-5px_rgba(34,197,94,0.1)]'
                                            : 'bg-surface-dark border-white/10 hover:border-primary/50 hover:bg-surface-highlight hover:shadow-xl'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className={`size-12 rounded-lg flex items-center justify-center border ${
                                        isCompleted ? 'bg-success/10 border-success/20 text-success' :
                                        lab.status === 'LOCKED' ? 'bg-white/5 border-white/5 text-text-muted' : 'bg-primary/10 border-primary/20 text-primary'
                                    }`}>
                                        <span className="material-symbols-outlined text-2xl">{isCompleted ? 'check' : lab.icon}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {lab.badge && (
                                            <span className="text-[10px] font-bold px-2 py-1 rounded border border-blue-500/20 bg-blue-500/10 text-blue-400 uppercase tracking-wider">
                                                {lab.badge}
                                            </span>
                                        )}
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${
                                            lab.status === 'LOCKED' ? 'border-white/10 text-text-muted' : 'border-success/20 bg-success/5 text-success'
                                        }`}>
                                            {lab.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">{lab.title}</h3>
                                    <p className="text-sm text-text-muted leading-relaxed">{lab.description}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className={`text-xs font-bold ${
                                        lab.difficulty === 'Expert' ? 'text-error' : 'text-warning'
                                    }`}>
                                        {lab.difficulty} Level
                                    </span>
                                    <Button 
                                        size="sm" 
                                        variant={lab.status === 'LOCKED' ? 'ghost' : isCompleted ? 'secondary' : 'secondary'}
                                        disabled={lab.status === 'LOCKED'}
                                        onClick={() => onSelectModule(lab.id)}
                                        className={isCompleted ? 'hover:bg-success/20 hover:text-success' : 'group-hover:bg-primary group-hover:text-background-dark group-hover:border-transparent transition-colors'}
                                    >
                                        {lab.status === 'LOCKED' ? 'Locked' : isCompleted ? 'Re-Run Lab' : 'Launch Lab'}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ))}

        {/* Contact / Engineering Footer */}
        <div className="mt-20 pt-10 border-t border-white/5 pb-10">
            <div className="bg-gradient-to-r from-surface-dark to-surface-highlight rounded-2xl border border-white/10 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h2 className="text-2xl font-bold text-white font-display mb-2">Contribute to the Protocol</h2>
                    <p className="text-text-muted max-w-xl text-sm leading-relaxed mb-4">
                        SatsCraft version 1 is built by <strong>AI Vibe Code</strong> and <strong>Bitcoin Unical's SatscraftLabs</strong> for everybody.
                    </p>
                    <p className="text-text-muted max-w-xl text-sm leading-relaxed">
                        If you find a bug in the simulation, want to propose other scenarios, or want to join the team, you can submit a PR or contact our team directly.
                    </p>
                </div>
                <div className="flex flex-col gap-3 shrink-0">
                     <a href="mailto:satscraftlabs@gmail.com?subject=SatsCraft%20Contribution" className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors group">
                         <span className="material-symbols-outlined text-text-muted group-hover:text-white">mail</span>
                         <span className="text-sm font-bold text-white">satscraftlabs@gmail.com</span>
                     </a>
                     <a href="https://github.com/satscraftlabs/SatsCraft-repo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 bg-[#111] hover:bg-[#222] border border-white/10 rounded-xl transition-colors group">
                         <span className="material-symbols-outlined text-text-muted group-hover:text-white">code</span>
                         <span className="text-sm font-bold text-white">GitHub Repository</span>
                     </a>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};