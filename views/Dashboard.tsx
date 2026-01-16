import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { PATHS, RANK_TIERS } from '../constants';
import { PathId, Path, UserState } from '../types';

interface DashboardProps {
  onSelectModule: (moduleId: string) => void;
  onViewProfile: () => void;
  onEnterStressTest: () => void;
  onPathChange: (path: PathId) => void;
  currentPath: PathId;
  userState: UserState;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onSelectModule, 
  onViewProfile, 
  onEnterStressTest, 
  onPathChange, 
  currentPath,
  userState
}) => {
  const [isPathMenuOpen, setIsPathMenuOpen] = useState(false);
  const completedModules = userState.completedModules;

  const activePath = PATHS.find(p => p.id === currentPath) || PATHS[0];

  // Calculate completion for active path
  const activePathModules = activePath.modules;
  const activeCompletedCount = activePathModules.filter(m => completedModules.includes(m.id)).length;
  const activeTotalCount = activePathModules.length;
  const activeProgress = Math.round((activeCompletedCount / activeTotalCount) * 100);
  const isPathComplete = activeCompletedCount === activeTotalCount && activeTotalCount > 0;

  // Find the next module index
  const nextModuleIndex = activePathModules.findIndex(m => !completedModules.includes(m.id));

  // Rank Data Logic
  let actualRankIndex = 0;
  for (let i = 0; i < RANK_TIERS.length; i++) {
      if (userState.reputation >= RANK_TIERS[i].minXp) {
          actualRankIndex = i;
      } else {
          break;
      }
  }
  const currentRank = RANK_TIERS[actualRankIndex];
  
  // Global Rank Calculation
  const globalRank = Math.max(1, 30120 - Math.floor(userState.reputation / 5));

  const handlePathSelect = (id: PathId) => {
    onPathChange(id);
    setIsPathMenuOpen(false);
  };

  const getPathStats = (path: Path) => {
      const completed = path.modules.filter(m => completedModules.includes(m.id)).length;
      const total = path.modules.length;
      const percent = Math.round((completed / total) * 100);
      return { completed, total, percent };
  };

  const renderStressTestButton = () => {
      if (!isPathComplete) return null;
      
      return (
          <div className="flex flex-col items-end gap-2 animate-in fade-in duration-500">
             <Button 
                variant="danger" 
                icon="emergency"
                onClick={onEnterStressTest}
                className="shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse-slow border-red-500/50"
             >
                 Adversarial Stress Test
             </Button>
             <span className="text-[9px] text-text-muted uppercase tracking-wider font-bold">
                 Unlocked: Red Team Mode
             </span>
          </div>
      );
  };

  const renderProgressRing = (percent: number, colorClass: string = "text-primary") => {
      const radius = 18;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percent / 100) * circumference;
      
      return (
          <div className="relative size-12 flex items-center justify-center">
              <svg className="size-full transform -rotate-90">
                  <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                  <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={`${colorClass} transition-all duration-1000 ease-out`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-[10px] font-bold">{percent}%</span>
          </div>
      );
  };

  const renderPathHeader = () => {
    switch (currentPath) {
      case PathId.SOVEREIGN:
        return (
          <div className="bg-gradient-to-r from-surface-dark to-surface-highlight border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group mb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 relative z-10 gap-4">
              <div>
                <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Reputation Score
                </p>
                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-display">{userState.reputation.toLocaleString()}</h3>
              </div>
              
              {isPathComplete ? renderStressTestButton() : (
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-success font-bold text-lg flex items-center gap-1 md:justify-end">
                        <span className="material-symbols-outlined">trending_up</span> +12%
                        </span>
                        <p className="text-text-muted text-xs font-mono uppercase mt-1">Proof of Work (7d)</p>
                    </div>
                    {renderProgressRing(activeProgress, "text-primary")}
                </div>
              )}
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="flex justify-between text-xs text-text-muted mb-2 font-bold tracking-wide">
                <span>PATH PROGRESS</span>
                <span>{activeCompletedCount} / {activeTotalCount} MODULES</span>
              </div>
              <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div 
                    className="h-full bg-gradient-to-r from-primary to-orange-600 shadow-[0_0_15px_rgba(247,147,26,0.6)] relative overflow-hidden transition-all duration-1000 ease-out"
                    style={{ width: `${activeProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <span className="material-symbols-outlined text-[180px]">military_tech</span>
            </div>
          </div>
        );

      case PathId.WALLET_MASTERY:
        return (
          <div className="bg-gradient-to-br from-blue-900/20 to-surface-highlight border border-blue-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group mb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 relative z-10 gap-4">
              <div>
                <p className="text-blue-400 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">shield</span>
                  Security Health
                </p>
                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-display">98/100</h3>
              </div>
              
              {isPathComplete ? renderStressTestButton() : (
                  <div className="flex gap-4 items-center">
                    <div className="hidden md:block bg-background-dark/50 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
                        <div className="text-xs text-text-muted uppercase font-bold">Multisig</div>
                        <div className="text-white font-bold">2-of-3</div>
                    </div>
                     {renderProgressRing(activeProgress, "text-blue-400")}
                  </div>
              )}
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="flex justify-between text-xs text-blue-300/70 mb-2 font-bold tracking-wide">
                <span>MASTERY PROGRESS</span>
                <span>{activeProgress}% SECURED</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-blue-500 transition-all duration-1000 ease-out" style={{ width: `${activeProgress}%` }}></div>
              </div>
            </div>
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <span className="material-symbols-outlined text-[180px]">lock</span>
            </div>
          </div>
        );

      case PathId.PROTOCOL_ENGINEER:
        return (
          <div className="bg-black border border-green-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group mb-8">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 relative z-10 gap-4">
              <div className="font-mono">
                <p className="text-green-500 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">terminal</span>
                  Node Status
                </p>
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">RUNNING</h3>
                <p className="text-text-muted text-sm mt-1">Uptime: 99.98%</p>
              </div>

              {isPathComplete ? renderStressTestButton() : (
                <div className="flex items-center gap-6">
                    <div className="hidden md:grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-sm border-r border-white/10 pr-6">
                        <div className="text-right text-text-muted">Height</div>
                        <div className="text-green-400 font-bold">824,501</div>
                        <div className="text-right text-text-muted">Peers</div>
                        <div className="text-white font-bold">12 / 8</div>
                    </div>
                    {renderProgressRing(activeProgress, "text-green-500")}
                </div>
              )}
            </div>
             <div className="relative z-10 max-w-2xl">
                 <div className="h-1.5 w-full bg-green-900/20 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-1000" style={{ width: `${activeProgress}%` }}></div>
                 </div>
             </div>
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <span className="material-symbols-outlined text-[180px]">dns</span>
            </div>
          </div>
        );

      case PathId.LIGHTNING_OPERATOR:
        return (
          <div className="bg-gradient-to-br from-purple-900/20 to-surface-highlight border border-purple-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group mb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-400/10 via-transparent to-transparent"></div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 relative z-10 gap-4">
              <div>
                <p className="text-purple-400 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  Node Liquidity
                </p>
                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-display flex items-baseline gap-2">
                    5.2M <span className="text-xl text-text-muted font-normal">sats</span>
                </h3>
              </div>
              
              {renderStressTestButton()}
              {!isPathComplete && (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end justify-center">
                        <div className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">Channel Cap</div>
                        <span className="text-white font-bold">{activeProgress}% Assigned</span>
                    </div>
                    {renderProgressRing(activeProgress, "text-purple-500")}
                  </div>
              )}
            </div>
            <div className="relative z-10 max-w-2xl">
                <div className="h-1.5 w-full bg-background-dark rounded-full overflow-hidden flex">
                    <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${activeProgress}%` }}></div>
                    <div className="h-full bg-text-muted/20 flex-1"></div>
                </div>
            </div>
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <span className="material-symbols-outlined text-[180px]">flash_on</span>
            </div>
          </div>
        );

      case PathId.SOVEREIGN_MERCHANT:
        return (
          <div className="bg-gradient-to-br from-amber-900/20 to-surface-highlight border border-amber-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group mb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 relative z-10 gap-4">
              <div>
                <p className="text-amber-400 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">storefront</span>
                  Store Volume
                </p>
                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-display flex items-baseline gap-2">
                    0.42 <span className="text-xl text-text-muted font-normal">BTC</span>
                </h3>
              </div>
              
              {renderStressTestButton()}
              {!isPathComplete && (
                  <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                          <div className="text-xs text-text-muted uppercase font-bold">Revenue</div>
                          <div className="text-success font-bold">$18,420</div>
                      </div>
                      {renderProgressRing(activeProgress, "text-amber-500")}
                  </div>
              )}
            </div>
            <div className="relative z-10 max-w-2xl">
                 <div className="flex justify-between text-xs text-amber-300/70 mb-2 font-bold tracking-wide">
                    <span>SETUP PROGRESS</span>
                 </div>
                 <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-amber-500 transition-all duration-1000 ease-out" style={{ width: `${activeProgress}%` }}></div>
                 </div>
            </div>
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <span className="material-symbols-outlined text-[180px]">point_of_sale</span>
            </div>
          </div>
        );

      case PathId.SECURITY_PRACTITIONER:
        return (
          <div className="bg-gradient-to-br from-red-900/20 to-surface-highlight border border-red-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group mb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent"></div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 relative z-10 gap-4">
              <div>
                <p className="text-red-400 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">radar</span>
                  Threat Level
                </p>
                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-display flex items-baseline gap-2">
                    LOW <span className="text-xl text-text-muted font-normal">Secured</span>
                </h3>
              </div>
              
              {renderStressTestButton()}
              {!isPathComplete && (
                  <div className="flex items-center gap-4">
                      <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20 hidden md:block">
                          <div className="text-[10px] text-red-400 uppercase font-bold">Vectors</div>
                          <div className="text-white font-bold text-sm">0 Detected</div>
                      </div>
                       {renderProgressRing(activeProgress, "text-red-500")}
                  </div>
              )}
            </div>
            <div className="relative z-10 max-w-2xl">
                 <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-red-500 transition-all duration-1000 ease-out" style={{ width: `${activeProgress}%` }}></div>
                 </div>
            </div>
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <span className="material-symbols-outlined text-[180px]">security</span>
            </div>
          </div>
        );

      case PathId.P2P_MARKET:
        return (
          <div className="bg-gradient-to-br from-teal-900/20 to-surface-highlight border border-teal-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group mb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent"></div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 relative z-10 gap-4">
              <div>
                <p className="text-teal-400 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">handshake</span>
                  Market Reputation
                </p>
                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-display flex items-baseline gap-2">
                    99.8% <span className="text-xl text-text-muted font-normal">Trust</span>
                </h3>
              </div>
              
              {renderStressTestButton()}
              {!isPathComplete && (
                   <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                          <div className="text-xs text-text-muted uppercase font-bold">Trades</div>
                          <div className="text-white font-bold">248</div>
                      </div>
                       {renderProgressRing(activeProgress, "text-teal-500")}
                  </div>
              )}
            </div>
            <div className="relative z-10 max-w-2xl">
                <div className="h-2 w-full bg-surface-dark rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)] transition-all duration-1000 ease-out" style={{ width: `${activeProgress}%` }}></div>
                </div>
            </div>
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <span className="material-symbols-outlined text-[180px]">public</span>
            </div>
          </div>
        );

      case PathId.COMMUNITY_BUILDER:
        return (
          <div className="bg-gradient-to-br from-pink-900/20 to-surface-highlight border border-pink-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group mb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent"></div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 relative z-10 gap-4">
              <div>
                <p className="text-pink-400 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">groups</span>
                  Network Reach
                </p>
                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-display flex items-baseline gap-2">
                    1.2k <span className="text-xl text-text-muted font-normal">Peers</span>
                </h3>
              </div>
              
              {renderStressTestButton()}
              {!isPathComplete && (
                  <div className="flex items-center gap-4">
                      <div className="bg-pink-500/10 p-2 rounded-lg border border-pink-500/20 text-center min-w-[80px] hidden md:block">
                          <div className="text-[10px] text-pink-400 uppercase font-bold">Nodes</div>
                          <div className="text-white font-bold text-sm">15</div>
                      </div>
                      {renderProgressRing(activeProgress, "text-pink-400")}
                  </div>
              )}
            </div>
             <div className="relative z-10 max-w-2xl">
                <div className="h-2 w-full bg-surface-dark rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-pink-500 transition-all duration-1000 ease-out" style={{ width: `${activeProgress}%` }}></div>
                </div>
            </div>
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <span className="material-symbols-outlined text-[180px]">connect_without_contact</span>
            </div>
          </div>
        );

      default:
        return (
            <div className="bg-gradient-to-r from-surface-dark to-surface-highlight border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group mb-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 relative z-10 gap-4">
                    <div>
                        <h3 className="text-4xl font-bold text-white">{activePath.title}</h3>
                        <p className="text-text-muted mt-2">Complete all modules to unlock the Adversarial Stress Test.</p>
                    </div>
                     {isPathComplete && renderStressTestButton()}
                </div>
                 <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <span className="material-symbols-outlined text-[180px]">{activePath.icon}</span>
                </div>
            </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-background-dark overflow-hidden">
      {/* Sidebar removed per user request */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Path Selector (Dropdown style) */}
        <div className="md:hidden p-4 bg-surface-dark border-b border-white/5 sticky top-0 z-30 flex items-center justify-between">
             <div className="flex items-center gap-3" onClick={() => setIsPathMenuOpen(!isPathMenuOpen)}>
                <span className="material-symbols-outlined text-primary">{activePath.icon}</span>
                <span className="font-bold text-white">{activePath.title}</span>
                <span className="material-symbols-outlined text-text-muted text-sm">expand_more</span>
             </div>
             <div 
                className="size-8 rounded-full bg-white/10 bg-cover bg-center cursor-pointer" 
                style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMdx8fOCRdcFlKuCraS74myZaihhsOC0cPtoDAJisBAaLmhG77h6_Y-OE3pzgVVLU2cA248YWGNAFJ_8GsPoYPsSoE1pQVnIVxepi0QIsJNX_LZizg9mqhRq9Sbffhe39Lf83eLfGoLHaGMp5fN-yv1If2WVgvqM_VK2nzKd1k_YU9-K_PCc_BZY4ehIyxfrPq1es2Su5sk_w6-zdZ9UCXSrE53oFoG0qbGWwfbtVPWB44hOy0eeJ_MoJcMRp_u6s0NnVDIj53CVE")'}}
                onClick={onViewProfile}
             ></div>
        </div>
        
        {/* Mobile Dropdown Menu */}
        {isPathMenuOpen && (
            <div className="md:hidden absolute top-[70px] left-0 right-0 bg-surface-dark border-b border-white/10 z-40 p-2 shadow-2xl animate-in slide-in-from-top-2">
                 {PATHS.map(path => {
                    const stats = getPathStats(path);
                    return (
                        <button
                            key={path.id}
                            onClick={() => handlePathSelect(path.id)}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 mb-1 ${
                            currentPath === path.id 
                                ? 'bg-primary/10 text-primary' 
                                : 'text-text-muted hover:bg-white/5'
                            }`}
                        >
                            <span className="material-symbols-outlined">{path.icon}</span>
                            <div className="flex-1">
                                <span className="font-bold block">{path.title}</span>
                                <div className="w-full bg-white/10 h-1 rounded-full mt-1">
                                    <div className="h-full bg-current rounded-full" style={{width: `${stats.percent}%`}}></div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        )}

        {/* Desktop Top Bar */}
        <div className="hidden md:flex p-6 md:px-8 items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur z-20 border-b border-white/5">
            <div className="relative">
                <button 
                  onClick={() => setIsPathMenuOpen(!isPathMenuOpen)}
                  className="flex items-center gap-3 hover:bg-white/5 p-2 -ml-2 rounded-xl transition-colors text-left group border border-transparent hover:border-white/5"
                >
                    <div className="size-12 rounded-lg bg-surface-highlight flex items-center justify-center border border-white/5 group-hover:border-primary/50 transition-colors shadow-lg">
                        <span className="material-symbols-outlined text-2xl text-primary">{activePath.icon}</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white font-display flex items-center gap-2 group-hover:text-primary transition-colors">
                          {activePath.title} 
                          <span className={`material-symbols-outlined text-text-muted text-sm transition-transform duration-200 ${isPathMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        </h1>
                        <p className="text-sm text-text-muted truncate max-w-md">{activePath.description}</p>
                    </div>
                </button>
                
                {/* Desktop Path Dropdown with Global Progress */}
                {isPathMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-surface-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/50">
                      <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <div className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">Switch Learning Track</div>
                        {PATHS.map(path => {
                           const stats = getPathStats(path);
                           return (
                           <button
                             key={path.id}
                             onClick={() => handlePathSelect(path.id)}
                             className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                                currentPath === path.id 
                                    ? 'bg-primary/10 text-primary border border-primary/20' 
                                    : 'text-text-muted hover:bg-white/5 hover:text-white border border-transparent'
                             }`}
                           >
                              <div className={`size-8 rounded flex items-center justify-center ${currentPath === path.id ? 'bg-primary/20' : 'bg-surface-highlight'}`}>
                                <span className="material-symbols-outlined text-lg">{path.icon}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="font-bold truncate text-sm">{path.title}</div>
                                    <div className="text-[10px] font-mono opacity-80">{stats.percent}%</div>
                                </div>
                                {/* Mini Progress Bar */}
                                <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${currentPath === path.id ? 'bg-primary' : 'bg-white/20'}`} style={{width: `${stats.percent}%`}}></div>
                                </div>
                              </div>
                           </button>
                           );
                        })}
                      </div>
                  </div>
                )}
            </div>
            
            {/* Top Right Actions */}
            <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-surface-dark rounded-lg border border-white/5 flex items-center gap-2 shadow-inner">
                    <span className="material-symbols-outlined text-warning text-sm">bolt</span>
                    <span className="text-sm font-bold text-white">{userState.reputation.toLocaleString()} XP</span>
                </div>
                <button className="size-10 rounded-lg bg-surface-highlight text-text-muted hover:text-white flex items-center justify-center transition-colors border border-white/5 hover:border-white/20 relative">
                    <span className="material-symbols-outlined">notifications</span>
                    {userState.notifications.length > 0 && <div className="absolute top-2 right-2 size-2 bg-error rounded-full"></div>}
                </button>
                
                {/* User Profile */}
                <div 
                    onClick={onViewProfile}
                    className="flex items-center gap-3 pl-4 border-l border-white/5 ml-2 cursor-pointer hover:opacity-80 transition-opacity"
                >
                     <div className="text-right hidden lg:block">
                        <h3 className="text-sm font-bold text-white leading-none">
                            {userState.isGuest ? 'Guest' : (userState.npub ? userState.npub : 'Satoshi_Vz')}
                        </h3>
                        <div className="flex justify-end gap-2 text-[10px] font-mono uppercase mt-1">
                             <span className="text-text-muted">{currentRank.title}</span>
                             <span className="text-primary font-bold">Global #{globalRank.toLocaleString()}</span>
                        </div>
                     </div>
                     <div className="size-10 rounded-full bg-primary/20 border border-primary bg-cover bg-center shadow-lg ring-2 ring-primary/20" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMdx8fOCRdcFlKuCraS74myZaihhsOC0cPtoDAJisBAaLmhG77h6_Y-OE3pzgVVLU2cA248YWGNAFJ_8GsPoYPsSoE1pQVnIVxepi0QIsJNX_LZizg9mqhRq9Sbffhe39Lf83eLfGoLHaGMp5fN-yv1If2WVgvqM_VK2nzKd1k_YU9-K_PCc_BZY4ehIyxfrPq1es2Su5sk_w6-zdZ9UCXSrE53oFoG0qbGWwfbtVPWB44hOy0eeJ_MoJcMRp_u6s0NnVDIj53CVE")'}}></div>
                </div>
            </div>
        </div>

        {/* Clickaway listener for dropdown */}
        {isPathMenuOpen && (
            <div className="fixed inset-0 z-10" onClick={() => setIsPathMenuOpen(false)}></div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
            
            {/* Distinct Dashboard Header Card */}
            {renderPathHeader()}

            {/* Modules List */}
            <div className="max-w-5xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                             <span className="material-symbols-outlined">layers</span>
                        </div>
                        <h2 className="text-base font-bold text-white uppercase tracking-wider">Modules Sequence</h2>
                    </div>
                    <span className="text-xs text-text-muted font-mono bg-white/5 px-2 py-1 rounded border border-white/5">{activePath.modules.length} UNITS</span>
                </div>

                <div className="space-y-4 relative pl-4 md:pl-0">
                    {/* Interactive Vertical Timeline Line */}
                    <div className="absolute left-[39px] top-4 bottom-8 w-0.5 bg-surface-highlight hidden md:block">
                         {/* Filled portion based on progress */}
                         <div 
                            className="absolute top-0 w-full bg-gradient-to-b from-primary to-primary/50 transition-all duration-1000 ease-in-out" 
                            style={{ height: `${activeProgress}%` }}
                         ></div>
                    </div>

                    {activePath.modules.map((mod, idx) => {
                        const isCompleted = completedModules.includes(mod.id);
                        const isNext = idx === nextModuleIndex;
                        
                        return (
                            <div key={mod.id} className="group relative flex flex-col md:flex-row gap-4 md:gap-8 md:items-start animate-in slide-in-from-bottom-2 fade-in duration-500" style={{animationDelay: `${idx * 100}ms`}}>
                                
                                {/* Desktop Timeline Node */}
                                <div className="hidden md:flex flex-col items-center mt-6 relative z-10">
                                    {isCompleted ? (
                                        <div className="size-8 rounded-full bg-background-dark border-2 border-success flex items-center justify-center text-success shadow-[0_0_10px_rgba(34,197,94,0.4)] transition-all scale-100">
                                            <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                                        </div>
                                    ) : isNext ? (
                                        <div className="size-8 rounded-full bg-background-dark border-2 border-primary flex items-center justify-center text-primary shadow-[0_0_15px_rgba(247,147,26,0.6)] animate-pulse">
                                            <div className="size-2 bg-primary rounded-full"></div>
                                        </div>
                                    ) : (
                                        <div className="size-4 rounded-full bg-surface-highlight border-2 border-white/10 mt-2 transition-all"></div>
                                    )}
                                </div>

                                {/* Card */}
                                <div className={`flex-1 rounded-2xl p-5 md:p-6 border transition-all duration-300 relative overflow-hidden ${
                                    mod.status === 'LOCKED' && !isCompleted && !isNext
                                        ? 'bg-surface-dark/30 border-white/5 opacity-60 hover:opacity-80' 
                                        : isCompleted 
                                            ? 'bg-surface-dark border-white/10 opacity-90'
                                            : isNext 
                                                ? 'bg-surface-dark border-primary/40 shadow-lg shadow-primary/5' 
                                                : 'bg-surface-dark border-white/10 hover:border-primary/40 hover:bg-surface-highlight hover:shadow-lg'
                                }`}>
                                    
                                    {isNext && (
                                        <div className="absolute top-0 right-0 p-2">
                                            <div className="bg-primary text-background-dark text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider animate-in fade-in zoom-in">
                                                Current Objective
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                                                    mod.type === 'SIMULATION' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                                    mod.type === 'LAB' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                                                    'bg-white/5 text-text-muted border-white/10'
                                                }`}>
                                                    {mod.type}
                                                </span>
                                                {!isCompleted && mod.status === 'IN_PROGRESS' && <span className="text-[10px] text-primary font-bold animate-pulse">● RESUME</span>}
                                            </div>
                                            <h3 className={`text-xl font-bold mb-2 transition-colors ${isNext ? 'text-primary' : 'text-white group-hover:text-primary'}`}>{mod.title}</h3>
                                            <p className="text-sm text-text-muted mb-4 leading-relaxed max-w-2xl">{mod.description}</p>
                                            
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted font-medium">
                                                <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                                                    <span className="material-symbols-outlined text-[14px]">timer</span> {mod.estimatedTime}
                                                </span>
                                                <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                                                    <span className="material-symbols-outlined text-[14px] text-warning">bolt</span> {mod.xp} XP
                                                </span>
                                                <span className={`flex items-center gap-1.5 px-2 py-1 rounded border ${
                                                    mod.difficulty === 'Expert' || mod.difficulty === 'Adv.' ? 'bg-error/5 text-error border-error/20' : 'bg-success/5 text-success border-success/20'
                                                }`}>
                                                    <span className="material-symbols-outlined text-[14px]">bar_chart</span>
                                                    {mod.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        {mod.status !== 'LOCKED' && (
                                            <div className="self-start md:self-center shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                                <Button 
                                                    size="md" 
                                                    fullWidth 
                                                    variant={isCompleted ? 'secondary' : 'primary'}
                                                    onClick={() => onSelectModule(mod.id)}
                                                    icon={isCompleted ? 'replay' : 'play_arrow'}
                                                    className={isNext ? 'shadow-[0_0_20px_rgba(247,147,26,0.4)]' : ''}
                                                >
                                                    {isCompleted ? 'Replay' : 'Start'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};