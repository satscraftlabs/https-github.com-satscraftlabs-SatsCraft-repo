
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
  devMode?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onSelectModule, 
  onViewProfile, 
  onEnterStressTest, 
  onPathChange, 
  currentPath,
  userState,
  devMode
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
  
  const handlePathSelect = (id: PathId) => {
    onPathChange(id);
    setIsPathMenuOpen(false);
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
    const isComplete = activeProgress === 100;

    const CommonProgress = () => (
         <div className="mt-6">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="opacity-70">Sequence Progress</span>
                <span>{activeProgress}%</span>
            </div>
            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ease-out relative overflow-hidden ${
                        isComplete ? 'bg-success' : 'bg-white'
                    }`} 
                    style={{ width: `${activeProgress}%` }}
                >
                    {isComplete && <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>}
                </div>
            </div>
        </div>
    );

    switch (currentPath) {
        case PathId.SOVEREIGN:
            return (
                <div className="bg-gradient-to-br from-orange-600/20 to-orange-900/40 border border-orange-500/30 rounded-3xl p-8 relative overflow-hidden group mb-10 transition-all hover:border-orange-500/50">
                     <div className="absolute top-0 right-0 p-32 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                     <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                         <div>
                             <div className="flex items-center gap-2 mb-2 text-orange-400">
                                 <span className="material-symbols-outlined text-lg">verified</span>
                                 <span className="text-xs font-bold uppercase tracking-widest">Proof of Work</span>
                             </div>
                             <h2 className="text-4xl md:text-5xl font-bold text-white font-display mb-2">{userState.reputation.toLocaleString()} <span className="text-lg text-text-muted font-mono font-normal">Sats (XP)</span></h2>
                             <p className="text-orange-200/60 max-w-md">Your reputation is the only currency that matters here. Build it through operational competence.</p>
                         </div>
                         <div className="flex flex-col items-end gap-4">
                              {isComplete && renderStressTestButton()}
                              <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                                  <div className="text-right">
                                      <div className="text-[10px] text-text-muted uppercase font-bold">Current Rank</div>
                                      <div className="text-white font-bold">{currentRank.title}</div>
                                  </div>
                                  <div className="size-10 bg-surface-highlight rounded-lg flex items-center justify-center border border-white/5">
                                      <span className="material-symbols-outlined text-orange-500">{currentRank.icon}</span>
                                  </div>
                              </div>
                         </div>
                     </div>
                     <CommonProgress />
                </div>
            );

        case PathId.WALLET_MASTERY:
            return (
                <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/60 border border-blue-500/30 rounded-3xl p-8 relative overflow-hidden mb-10">
                     <div className="absolute -left-10 -bottom-10 size-64 bg-blue-500/10 blur-[60px] rounded-full"></div>
                     <div className="relative z-10">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-blue-400">
                                    <span className="material-symbols-outlined text-lg">lock</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">OpSec Vault</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white font-display mb-2">Cold Storage Mastery</h2>
                                <p className="text-blue-200/60 max-w-lg text-sm">
                                    "Not your keys, not your coins." Master the art of air-gapped signing, multisig coordination, and entropy management.
                                </p>
                            </div>
                            <span className="material-symbols-outlined text-6xl text-blue-500/20">shield</span>
                         </div>
                         
                         <div className="grid grid-cols-3 gap-3 mb-6">
                             <div className="bg-blue-950/30 border border-blue-500/20 p-3 rounded-lg text-center">
                                 <span className="material-symbols-outlined text-blue-400 mb-1">key</span>
                                 <div className="text-[10px] uppercase text-blue-300 font-bold">Key Mgmt</div>
                             </div>
                             <div className="bg-blue-950/30 border border-blue-500/20 p-3 rounded-lg text-center">
                                 <span className="material-symbols-outlined text-blue-400 mb-1">group_work</span>
                                 <div className="text-[10px] uppercase text-blue-300 font-bold">Multisig</div>
                             </div>
                             <div className="bg-blue-950/30 border border-blue-500/20 p-3 rounded-lg text-center">
                                 <span className="material-symbols-outlined text-blue-400 mb-1">sd_card</span>
                                 <div className="text-[10px] uppercase text-blue-300 font-bold">Air Gap</div>
                             </div>
                         </div>
                         {isComplete && <div className="flex justify-end mb-4">{renderStressTestButton()}</div>}
                         <CommonProgress />
                     </div>
                </div>
            );

        case PathId.PROTOCOL_ENGINEER:
            return (
                 <div className="bg-gradient-to-br from-[#0a1f0a] to-black border border-green-500/30 rounded-3xl p-8 relative overflow-hidden mb-10 font-mono">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                     <div className="relative z-10">
                         <div className="flex justify-between items-start">
                             <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="size-3 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-green-500 text-xs font-bold uppercase">Mainnet Consensus Active</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">&lt;Protocol_Engineer /&gt;</h2>
                                <p className="text-green-400/60 max-w-lg text-sm mb-6">
                                    Manipulate raw script. Validate headers. Enforce consensus rules directly at the byte level.
                                </p>
                             </div>
                             <span className="material-symbols-outlined text-6xl text-green-500/20">terminal</span>
                         </div>

                         <div className="bg-black/60 border border-green-500/20 p-4 rounded-lg mb-6 text-xs text-green-400/80">
                             <p>OP_HASH160 1a2b...8821 OP_EQUALVERIFY OP_CHECKSIG</p>
                             <p className="mt-2 text-white/40">// Objective: Master Script, Consensus Rules, and Fork Dynamics.</p>
                         </div>
                         {isComplete && <div className="flex justify-end mb-4">{renderStressTestButton()}</div>}
                         <CommonProgress />
                     </div>
                </div>
            );

        case PathId.LIGHTNING_OPERATOR:
            return (
                 <div className="bg-gradient-to-br from-purple-900/30 to-[#0D0F12] border border-purple-500/30 rounded-3xl p-8 relative overflow-hidden mb-10">
                     <div className="absolute top-0 right-0 p-40 bg-purple-600/10 blur-[100px] rounded-full"></div>
                     <div className="relative z-10">
                         <div className="flex justify-between items-center mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-purple-400">
                                    <span className="material-symbols-outlined text-lg">hub</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">L2 Scaling</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white font-display">Liquidity Node</h2>
                                <p className="text-purple-200/60 text-sm mt-1 max-w-md">Manage channels, rebalance liquidity, and route packets across the gossip network.</p>
                            </div>
                            <span className="material-symbols-outlined text-5xl text-purple-500 shadow-purple-500/50 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">bolt</span>
                         </div>
                         
                         <div className="flex gap-4 mb-6">
                             <div className="flex-1 bg-surface-dark border border-white/5 p-3 rounded-xl flex items-center gap-3">
                                 <div className="size-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                     <span className="material-symbols-outlined text-sm">hub</span>
                                 </div>
                                 <div>
                                     <div className="text-[10px] text-text-muted uppercase font-bold">Active Channels</div>
                                     <div className="text-white font-bold">8</div>
                                 </div>
                             </div>
                             <div className="flex-1 bg-surface-dark border border-white/5 p-3 rounded-xl flex items-center gap-3">
                                 <div className="size-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                     <span className="material-symbols-outlined text-sm">swap_vert</span>
                                 </div>
                                 <div>
                                     <div className="text-[10px] text-text-muted uppercase font-bold">Capacity</div>
                                     <div className="text-white font-bold">5.2M sats</div>
                                 </div>
                             </div>
                         </div>
                         {isComplete && <div className="flex justify-end mb-4">{renderStressTestButton()}</div>}
                         <CommonProgress />
                     </div>
                </div>
            );

        case PathId.SOVEREIGN_MERCHANT:
            return (
                <div className="bg-gradient-to-br from-yellow-900/30 to-[#0D0F12] border border-yellow-500/30 rounded-3xl p-8 relative overflow-hidden mb-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                           <div>
                               <div className="flex items-center gap-2 mb-2 text-yellow-500">
                                   <span className="material-symbols-outlined text-lg">storefront</span>
                                   <span className="text-xs font-bold uppercase tracking-widest">Merchant Services</span>
                               </div>
                               <h2 className="text-3xl font-bold text-white font-display">Treasury Management</h2>
                               <p className="text-yellow-200/60 text-sm mt-1 max-w-md">Accept censorship-resistant payments and manage volatility without banking rails.</p>
                           </div>
                           <span className="material-symbols-outlined text-5xl text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">payments</span>
                        </div>
                        {isComplete && <div className="flex justify-end mb-4">{renderStressTestButton()}</div>}
                        <CommonProgress />
                    </div>
               </div>
           );

        case PathId.SECURITY_PRACTITIONER:
            return (
                <div className="bg-gradient-to-br from-red-900/30 to-[#0D0F12] border border-red-500/30 rounded-3xl p-8 relative overflow-hidden mb-10">
                     <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(220,38,38,0.02)_10px,rgba(220,38,38,0.02)_20px)]"></div>
                     <div className="relative z-10">
                         <div className="flex justify-between items-center mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-red-500">
                                    <span className="material-symbols-outlined text-lg">gpp_maybe</span>
                                    <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Threat Level: High</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white font-display">Red Team Defense</h2>
                                <p className="text-red-200/60 text-sm mt-1 max-w-md">Analyze attack vectors, mitigate social engineering, and harden infrastructure against state-level adversaries.</p>
                            </div>
                            <span className="material-symbols-outlined text-5xl text-red-500">security</span>
                         </div>
                         {isComplete && <div className="flex justify-end mb-4">{renderStressTestButton()}</div>}
                         <CommonProgress />
                     </div>
                </div>
            );

        case PathId.P2P_MARKET:
            return (
                <div className="bg-gradient-to-br from-teal-900/30 to-[#0D0F12] border border-teal-500/30 rounded-3xl p-8 relative overflow-hidden mb-10">
                     <div className="relative z-10">
                         <div className="flex justify-between items-center mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-teal-400">
                                    <span className="material-symbols-outlined text-lg">public</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">Global Order Book</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white font-display">P2P Arbitrage</h2>
                                <p className="text-teal-200/60 text-sm mt-1 max-w-md">Navigate decentralized markets, manage escrow disputes, and build reputation without KYC.</p>
                            </div>
                            <span className="material-symbols-outlined text-5xl text-teal-500">handshake</span>
                         </div>
                         {isComplete && <div className="flex justify-end mb-4">{renderStressTestButton()}</div>}
                         <CommonProgress />
                     </div>
                </div>
            );

        case PathId.COMMUNITY_BUILDER:
            return (
                <div className="bg-gradient-to-br from-pink-900/30 to-[#0D0F12] border border-pink-500/30 rounded-3xl p-8 relative overflow-hidden mb-10">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-10"></div>
                        {/* Abstract Map Nodes */}
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-40 overflow-hidden pointer-events-none">
                            <div className="absolute top-[30%] right-[30%] size-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]"></div>
                            <div className="absolute top-[40%] right-[15%] size-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]"></div>
                            <div className="absolute top-[60%] right-[25%] size-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]"></div>
                            <div className="absolute top-[20%] right-[40%] size-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]"></div>
                            {/* Lines */}
                            <svg className="absolute inset-0 w-full h-full stroke-pink-500/30 stroke-1">
                                <line x1="70%" y1="30%" x2="85%" y2="40%" />
                                <line x1="70%" y1="30%" x2="75%" y2="60%" />
                                <line x1="70%" y1="30%" x2="60%" y2="20%" />
                            </svg>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-pink-500">
                                    <span className="material-symbols-outlined text-lg">hub</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">Grassroots Adoption</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white font-display">Citadel Builder</h2>
                                <p className="text-pink-200/60 text-sm mt-1 max-w-md">Map your local circular economy. Onboard merchants, connect nodes, and foster social resilience.</p>
                            </div>
                            <span className="material-symbols-outlined text-5xl text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">share_location</span>
                            </div>
                            
                            {/* Stats */}
                            <div className="flex gap-4 mb-6">
                                <div className="bg-surface-dark/50 border border-pink-500/20 p-3 rounded-xl flex items-center gap-3 flex-1">
                                    <div className="size-10 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400">
                                        <span className="material-symbols-outlined">storefront</span>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">14</div>
                                        <div className="text-[10px] text-pink-200/60 uppercase font-bold">Active Merchants</div>
                                    </div>
                                </div>
                                <div className="bg-surface-dark/50 border border-pink-500/20 p-3 rounded-xl flex items-center gap-3 flex-1">
                                    <div className="size-10 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400">
                                        <span className="material-symbols-outlined">hub</span>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">8</div>
                                        <div className="text-[10px] text-pink-200/60 uppercase font-bold">Local Nodes</div>
                                    </div>
                                </div>
                            </div>

                            {isComplete && <div className="flex justify-end mb-4">{renderStressTestButton()}</div>}
                            <CommonProgress />
                        </div>
                </div>
            );
        
        default:
             return (
                <div className="bg-gradient-to-r from-surface-dark to-surface-highlight border border-white/10 rounded-3xl p-8 relative overflow-hidden mb-10">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white font-display mb-2">{activePath.title}</h2>
                                <p className="text-text-muted max-w-xl">{activePath.description}</p>
                            </div>
                            <div className="size-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-3xl text-text-muted">{activePath.icon}</span>
                            </div>
                        </div>
                        {isComplete && <div className="mt-4 flex justify-end">{renderStressTestButton()}</div>}
                        <CommonProgress />
                    </div>
                </div>
            );
    }
  };

  // --- MEMPOOL VISUALIZER ---
  const MempoolVisualizer = () => (
      <div className="h-16 flex items-center gap-2 px-4 py-2 overflow-hidden relative">
          {/* Simulated scrolling blocks */}
          <div className="flex gap-1 animate-[slideLeft_20s_linear_infinite]">
              {Array.from({length: 20}).map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-sm border border-white/5 flex items-center justify-center opacity-60 ${
                      Math.random() > 0.7 ? 'bg-primary/20' : 'bg-blue-500/10'
                  }`}>
                      <div className={`size-4 ${Math.random() > 0.7 ? 'bg-primary' : 'bg-blue-500'} rounded-[1px]`}></div>
                  </div>
              ))}
          </div>
          {/* Overlay text */}
           <div className="absolute left-0 top-0 bottom-0 px-4 bg-gradient-to-r from-background-dark to-transparent flex items-center">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider bg-black/50 px-2 py-1 rounded border border-white/10">Mempool Feed</span>
          </div>
      </div>
  );

  return (
    <div className="flex h-full bg-background-dark overflow-hidden">
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Bar with Mempool */}
        <div className="hidden md:flex p-6 md:px-8 items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur z-20 border-b border-white/5">
             <div className="flex items-center gap-4">
                {/* Path Selector Trigger */}
                <button onClick={() => setIsPathMenuOpen(!isPathMenuOpen)} className="flex items-center gap-3 hover:bg-white/5 p-2 -ml-2 rounded-xl transition-colors">
                     <div className="size-10 rounded-lg bg-surface-highlight flex items-center justify-center border border-white/5">
                        <span className="material-symbols-outlined text-xl text-primary">{activePath.icon}</span>
                    </div>
                    <div className="text-left">
                        <h1 className="text-lg font-bold text-white font-display flex items-center gap-2">
                          {activePath.title} 
                          <span className="material-symbols-outlined text-sm">expand_more</span>
                        </h1>
                    </div>
                </button>

                {/* MEMPOOL VISUALIZER (Desktop) */}
                <div className="hidden lg:block w-64 border-l border-r border-white/5 mx-4">
                    <MempoolVisualizer />
                </div>
             </div>

             {/* User Stats */}
             <div className="flex items-center gap-4">
                 {devMode && (
                     <div className="px-2 py-1 bg-red-500/10 border border-red-500/50 rounded text-[10px] font-bold text-red-500 uppercase animate-pulse">
                         DEV MODE ACTIVE
                     </div>
                 )}
                <div className="px-4 py-2 bg-surface-dark rounded-lg border border-white/5 flex items-center gap-2 shadow-inner">
                    <span className="material-symbols-outlined text-warning text-sm">bolt</span>
                    <span className="text-sm font-bold text-white">{userState.reputation.toLocaleString()} XP</span>
                </div>
                <div onClick={onViewProfile} className="flex items-center gap-3 pl-4 border-l border-white/5 ml-2 cursor-pointer hover:opacity-80 transition-opacity">
                     <div className="text-right hidden lg:block">
                        <h3 className="text-sm font-bold text-white leading-none">
                            {userState.isGuest ? 'Guest' : (userState.npub || 'Agent')}
                        </h3>
                        <div className="flex justify-end gap-2 text-[10px] font-mono uppercase mt-1">
                             <span className="text-text-muted">{currentRank.title}</span>
                        </div>
                     </div>
                     <div className="size-10 rounded-full bg-primary/20 border border-primary bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMdx8fOCRdcFlKuCraS74myZaihhsOC0cPtoDAJisBAaLmhG77h6_Y-OE3pzgVVLU2cA248YWGNAFJ_8GsPoYPsSoE1pQVnIVxepi0QIsJNX_LZizg9mqhRq9Sbffhe39Lf83eLfGoLHaGMp5fN-yv1If2WVgvqM_VK2nzKd1k_YU9-K_PCc_BZY4ehIyxfrPq1es2Su5sk_w6-zdZ9UCXSrE53oFoG0qbGWwfbtVPWB44hOy0eeJ_MoJcMRp_u6s0NnVDIj53CVE")'}}></div>
                </div>
            </div>
        </div>
        
        {isPathMenuOpen && (
             <div className="absolute top-[80px] left-8 z-50 w-80 bg-surface-dark border border-white/10 rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in-95">
                {PATHS.map(path => (
                    <button key={path.id} onClick={() => handlePathSelect(path.id)} className="w-full text-left p-3 rounded-lg flex items-center gap-3 hover:bg-white/5 text-text-muted hover:text-white">
                        <span className="material-symbols-outlined">{path.icon}</span>
                        <span className="font-bold">{path.title}</span>
                    </button>
                ))}
             </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
            {renderPathHeader()}
            
            {/* Modules List */}
            <div className="max-w-5xl">
                <div className="space-y-4 relative pl-4 md:pl-0">
                    <div className="absolute left-[39px] top-4 bottom-8 w-0.5 bg-surface-highlight hidden md:block">
                         <div className="absolute top-0 w-full bg-gradient-to-b from-primary to-primary/50 transition-all duration-1000 ease-in-out" style={{ height: `${activeProgress}%` }}></div>
                    </div>
                    {activePath.modules.map((mod, idx) => {
                        const isCompleted = completedModules.includes(mod.id);
                        const isNext = idx === nextModuleIndex;
                        return (
                            <div key={mod.id} className="group relative flex flex-col md:flex-row gap-4 md:gap-8 md:items-start animate-in slide-in-from-bottom-2 fade-in duration-500" style={{animationDelay: `${idx * 100}ms`}}>
                                <div className="hidden md:flex flex-col items-center mt-6 relative z-10">
                                    {isCompleted ? (
                                        <div className="size-8 rounded-full bg-background-dark border-2 border-success flex items-center justify-center text-success shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                                            <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                                        </div>
                                    ) : isNext ? (
                                        <div className="size-8 rounded-full bg-background-dark border-2 border-primary flex items-center justify-center text-primary shadow-[0_0_15px_rgba(247,147,26,0.6)] animate-pulse">
                                            <div className="size-2 bg-primary rounded-full"></div>
                                        </div>
                                    ) : (
                                        <div className="size-4 rounded-full bg-surface-highlight border-2 border-white/10 mt-2"></div>
                                    )}
                                </div>
                                <div className={`flex-1 rounded-2xl p-5 md:p-6 border transition-all duration-300 relative overflow-hidden ${
                                    mod.status === 'LOCKED' && !isCompleted && !isNext ? 'bg-surface-dark/30 border-white/5 opacity-60' : 'bg-surface-dark border-white/10 hover:border-primary/40'
                                }`}>
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border bg-white/5 text-text-muted border-white/10`}>
                                                    {mod.type}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">{mod.title}</h3>
                                            <p className="text-sm text-text-muted mb-4">{mod.description}</p>
                                        </div>
                                        {mod.status !== 'LOCKED' && (
                                            <div className="self-start md:self-center shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                                <Button size="md" fullWidth variant={isCompleted ? 'secondary' : 'primary'} onClick={() => onSelectModule(mod.id)} icon={isCompleted ? 'replay' : 'play_arrow'}>
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
