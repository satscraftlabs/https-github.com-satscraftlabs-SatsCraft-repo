import React, { useState, useMemo } from 'react';
import { RANK_TIERS, PATHS } from '../constants';
import { PathId, UserState } from '../types';
import { usePresence, PeerData } from '../hooks/usePresence';

interface RankProps {
    currentUser: UserState;
}

// Real peers interface
interface LeaderboardEntry extends PeerData {
    isCurrentUser?: boolean;
}

export const Rank: React.FC<RankProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LEADERBOARD' | 'RANKS'>('LEADERBOARD'); // Default to Leaderboard for visibility
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);
  
  // Real-time Network Data
  const { peers, isConnected } = usePresence(currentUser);
  
  // Dynamic Global Progress
  const currentXp = currentUser.reputation;
  
  // Determine current rank based on XP
  let actualRankIndex = 0;
  for (let i = 0; i < RANK_TIERS.length; i++) {
      if (currentXp >= RANK_TIERS[i].minXp) {
          actualRankIndex = i;
      } else {
          break;
      }
  }
  
  const currentRank = RANK_TIERS[actualRankIndex];
  const nextRank = RANK_TIERS[actualRankIndex + 1];
  const xpProgress = nextRank 
    ? ((currentXp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100 
    : 100;

  // Construct the Master Leaderboard: Real Peers Only
  const sortedLeaderboard = useMemo(() => {
      // 1. Current User
      const userEntry: LeaderboardEntry = {
          pubkey: currentUser.pubkey || 'local',
          name: currentUser.npub || (currentUser.isGuest ? 'Guest User' : 'You'),
          xp: currentUser.reputation,
          rank: currentUser.rank,
          path: currentUser.currentPath || 'UNKNOWN',
          lastSeen: Date.now(),
          isOnline: true,
          isCurrentUser: true
      };

      // 2. Real Peers (Filter out current user if they exist in the list to avoid dupes)
      const realPeers = peers
        .filter(p => p.pubkey !== currentUser.pubkey)
        .map(p => ({ ...p, isCurrentUser: false }));

      // Combine and Sort
      const allEntries = [...realPeers, userEntry];
      
      // Deduplicate by pubkey just in case
      const uniqueEntries = Array.from(new Map(allEntries.map(item => [item.pubkey, item])).values());
      
      return uniqueEntries.sort((a, b) => b.xp - a.xp);

  }, [peers, currentUser]);

  // Global Calculation
  const globalRankIndex = sortedLeaderboard.findIndex(p => p.pubkey === (currentUser.pubkey || 'local'));
  const globalRank = globalRankIndex !== -1 ? globalRankIndex + 1 : sortedLeaderboard.length + 1;

  // Real-time calculation of XP per path based on completed modules
  const pathStats = useMemo(() => {
    return PATHS.map(path => {
        const totalXp = path.modules.reduce((acc, m) => acc + m.xp, 0);
        const earned = path.modules.reduce((acc, m) => {
            if (currentUser.completedModules.includes(m.id)) return acc + m.xp;
            return acc;
        }, 0);

        const percent = totalXp > 0 ? Math.round((earned / totalXp) * 100) : 0;
        
        let colorClass = "text-text-muted";
        let bgClass = "bg-white/5";
        let borderClass = "border-white/10";

        switch(path.id) {
            case PathId.SOVEREIGN: colorClass="text-primary"; bgClass="bg-primary"; borderClass="border-primary"; break;
            case PathId.WALLET_MASTERY: colorClass="text-blue-400"; bgClass="bg-blue-500"; borderClass="border-blue-500"; break;
            case PathId.PROTOCOL_ENGINEER: colorClass="text-green-400"; bgClass="bg-green-500"; borderClass="border-green-500"; break;
            case PathId.LIGHTNING_OPERATOR: colorClass="text-purple-400"; bgClass="bg-purple-500"; borderClass="border-purple-500"; break;
            case PathId.SOVEREIGN_MERCHANT: colorClass="text-orange-400"; bgClass="bg-orange-500"; borderClass="border-orange-500"; break;
            case PathId.SECURITY_PRACTITIONER: colorClass="text-red-400"; bgClass="bg-red-500"; borderClass="border-red-500"; break;
            case PathId.P2P_MARKET: colorClass="text-teal-400"; bgClass="bg-teal-500"; borderClass="border-teal-500"; break;
            case PathId.COMMUNITY_BUILDER: colorClass="text-pink-400"; bgClass="bg-pink-500"; borderClass="border-pink-500"; break;
        }

        return { ...path, totalXp, earned, percent, colorClass, bgClass, borderClass };
    }).sort((a, b) => b.percent - a.percent); 
  }, [currentUser.completedModules]);

  // Mock History Data (unchanged for visual graph)
  const historyData = useMemo(() => {
      const current = currentXp;
      return [
          Math.max(0, Math.floor(current * 0.4)),
          Math.max(0, Math.floor(current * 0.5)),
          Math.max(0, Math.floor(current * 0.65)),
          Math.max(0, Math.floor(current * 0.8)),
          Math.max(0, Math.floor(current * 0.9)),
          Math.max(0, Math.floor(current * 0.95)),
          current
      ];
  }, [currentXp]);
  
  const historyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxGraphVal = Math.max(...historyData, 100) * 1.1; 
  const minGraphVal = Math.min(...historyData);
  const range = maxGraphVal - minGraphVal || 100;
  
  const points = historyData.map((val, i) => ({
    x: (i / (historyData.length - 1)) * 100,
    y: 100 - ((val - minGraphVal) / range) * 80 - 10 
  }));

  let pathD = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const curr = points[i];
    const prev = points[i - 1];
    const cp1x = prev.x + (curr.x - prev.x) * 0.5;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) * 0.5;
    const cp2y = curr.y;
    pathD += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
  }

  // Render a specific rank user or a placeholder
  const renderPodiumSpot = (rank: number, user?: LeaderboardEntry) => {
      const isFirst = rank === 1;
      const isSecond = rank === 2;
      
      const heightClass = isFirst ? 'h-40' : isSecond ? 'h-32' : 'h-24';
      const widthClass = isFirst ? 'w-32' : 'w-28';
      const zIndex = isFirst ? 'z-10' : 'z-0';
      const iconColor = isFirst ? 'text-yellow-400' : 'text-text-muted';
      const rankColor = isFirst ? 'bg-primary' : isSecond ? 'bg-white/20' : 'bg-brown-500/20';
      const rankBorder = isFirst ? 'border-primary/20' : 'border-white/5';
      
      if (!user) {
          // Empty Placeholder
          return (
              <div className={`flex flex-col items-center ${widthClass} ${zIndex}`}>
                  <div className="size-16 rounded-full bg-white/5 border-2 border-dashed border-white/10 mb-3 flex items-center justify-center opacity-30">
                       <span className="material-symbols-outlined text-3xl text-text-muted">person_off</span>
                  </div>
                  <div className="text-center mb-2 w-full opacity-30">
                      <div className="text-text-muted font-bold text-sm">Vacant</div>
                      <div className="text-text-muted text-xs font-mono">--- XP</div>
                  </div>
                  <div className={`w-full ${heightClass} bg-surface-dark/30 border-t border-x border-dashed border-white/5 rounded-t-lg flex items-start justify-center pt-2 relative`}>
                      <span className="text-4xl font-bold text-white/5">{rank}</span>
                  </div>
              </div>
          );
      }

      return (
        <div className={`flex flex-col items-center relative ${widthClass} ${zIndex}`}>
            {isFirst && <span className="material-symbols-outlined text-yellow-400 text-4xl mb-1 animate-bounce">emoji_events</span>}
            
            <div className={`size-16 md:size-24 rounded-full mb-3 flex items-center justify-center overflow-hidden shadow-2xl border-2 
                ${isFirst ? 'bg-primary/20 border-primary' : 'bg-surface-highlight border-white/10'}`}>
                <span className={`material-symbols-outlined ${isFirst ? 'text-4xl text-primary' : 'text-3xl text-text-muted'} `}>person</span>
            </div>
            
            <div className="text-center mb-2 w-full">
                <div className={`font-bold text-sm truncate px-1 ${isFirst ? 'text-white text-base' : 'text-text-muted'}`}>
                    {user.name}
                    {user.isCurrentUser && <span className="ml-1 text-[9px] bg-primary/20 text-primary px-1 rounded">YOU</span>}
                </div>
                <div className={`text-xs font-mono font-bold ${isFirst ? 'text-primary' : 'text-text-muted'}`}>
                    {user.xp.toLocaleString()} XP
                </div>
            </div>
            
            <div className={`w-full ${heightClass} bg-surface-dark border-t border-x ${rankBorder} rounded-t-lg flex items-start justify-center pt-2 relative shadow-lg overflow-hidden`}>
                <span className={`text-6xl font-bold ${isFirst ? 'text-primary/10' : 'text-white/5'}`}>{rank}</span>
                <div className={`absolute top-0 w-full h-1 ${rankColor}`}></div>
                {/* Visual texture for podium */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%,rgba(255,255,255,0.02)_100%)] bg-[size:10px_10px] opacity-20"></div>
            </div>
        </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
      
      {/* Hero Section: Unified Identity Card */}
      <div className="p-6 md:p-8 pb-0">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-surface-dark to-[#0D0F12] border border-white/5 shadow-2xl">
            {/* Dynamic Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-20 -top-20 size-96 bg-primary/20 blur-[100px] rounded-full mix-blend-screen"></div>
                <div className="absolute -left-20 bottom-0 size-64 bg-blue-500/10 blur-[80px] rounded-full mix-blend-screen"></div>
                <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-10">
                
                {/* Left: Rank Badge */}
                <div className="shrink-0 relative group">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
                    <div className="relative size-32 md:size-40 rounded-2xl bg-surface-dark/50 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center shadow-2xl ring-1 ring-white/5 group-hover:scale-105 transition-transform duration-500">
                        <span className="material-symbols-outlined text-6xl md:text-7xl text-primary drop-shadow-[0_0_25px_rgba(247,147,26,0.6)] mb-2">
                            {currentRank.icon}
                        </span>
                        <div className="px-3 py-1 bg-black/40 rounded-full border border-white/5">
                             <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">Level {actualRankIndex + 1}</span>
                        </div>
                    </div>
                </div>

                {/* Middle: Info & Stats */}
                <div className="flex-1 w-full text-center md:text-left space-y-6">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h2 className="text-text-muted text-xs font-bold uppercase tracking-[0.2em]">Current Standing</h2>
                            <div className="flex gap-2">
                                <div className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                    Global Rank #{globalRank.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-display tracking-tight flex flex-col md:flex-row items-center md:items-baseline gap-3">
                            {currentRank.title}
                            <span className="text-sm font-body font-normal text-text-muted bg-white/5 px-2 py-1 rounded-lg border border-white/5">{currentXp.toLocaleString()} XP</span>
                        </h1>
                        <p className="text-sm text-text-muted mt-2 max-w-lg mx-auto md:mx-0 leading-relaxed">{currentRank.description}</p>
                    </div>

                    <div className="space-y-2">
                         <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="text-primary">Progress to {nextRank?.title || 'Max Rank'}</span>
                            <span className="text-text-muted">{Math.round(xpProgress)}%</span>
                        </div>
                        <div className="h-2 w-full bg-background-dark rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-primary to-orange-400 relative overflow-hidden transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(247,147,26,0.5)]" 
                                style={{width: `${xpProgress}%`}}
                            >
                                <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-text-muted pt-1">
                            <span>Current: {currentXp.toLocaleString()}</span>
                            <span>Target: {nextRank ? nextRank.minXp.toLocaleString() : '∞'}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Real-time Peer Stats */}
                <div className="hidden lg:flex flex-col gap-3 min-w-[140px]">
                    <div className="p-3 rounded-xl bg-surface-dark/50 border border-white/5 backdrop-blur-sm">
                        <span className="block text-[10px] text-text-muted uppercase font-bold mb-1">Active Peers</span>
                        <span className="flex items-center gap-2">
                            <span className={`block text-xl font-bold font-mono ${isConnected ? 'text-success' : 'text-text-muted'}`}>
                                {peers.length}
                            </span>
                            {isConnected && <span className="size-2 bg-success rounded-full animate-pulse"></span>}
                        </span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-dark/50 border border-white/5 backdrop-blur-sm">
                        <span className="block text-[10px] text-text-muted uppercase font-bold mb-1">Modules Passed</span>
                        <span className="block text-xl font-bold text-white font-mono">{currentUser.completedModules.length}</span>
                    </div>
                </div>

            </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="px-6 md:px-8 mt-8 mb-6">
          <div className="flex gap-8 border-b border-white/5 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab('LEADERBOARD')}
                className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === 'LEADERBOARD' ? 'border-primary text-white' : 'border-transparent text-text-muted hover:text-white'}`}
              >
                  Global Leaderboard
              </button>
              <button 
                onClick={() => setActiveTab('OVERVIEW')}
                className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === 'OVERVIEW' ? 'border-primary text-white' : 'border-transparent text-text-muted hover:text-white'}`}
              >
                  My Stats
              </button>
              <button 
                onClick={() => setActiveTab('RANKS')}
                className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === 'RANKS' ? 'border-primary text-white' : 'border-transparent text-text-muted hover:text-white'}`}
              >
                  Rank System
              </button>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 md:px-8 pb-12 max-w-7xl mx-auto w-full">
        
        {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                
                {/* Left Column: XP Velocity Graph */}
                <div className="space-y-8">
                    <div className="bg-surface-dark rounded-3xl p-6 border border-white/5 shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-lg">timeline</span>
                                    Total Community Score
                                </h3>
                                <p className="text-[10px] text-text-muted mt-1">Reputation accumulation trajectory</p>
                            </div>
                            <span className="text-xs font-bold text-success bg-success/5 px-3 py-1 rounded-full border border-success/10">{currentXp} XP</span>
                        </div>
                        
                        <div className="relative h-64 w-full select-none" onMouseLeave={() => setHoveredDataPoint(null)}>
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Subtle Grid */}
                                <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="2 2" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="2 2" />
                                <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="2 2" />

                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#F7931A" stopOpacity="0.15" />
                                        <stop offset="100%" stopColor="#F7931A" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {/* Area Fill */}
                                <path 
                                    d={`${pathD} L 100,100 L 0,100 Z`} 
                                    fill="url(#areaGradient)" 
                                />

                                {/* Smooth Line */}
                                <path 
                                    d={pathD} 
                                    fill="none" 
                                    stroke="#F7931A" 
                                    strokeWidth="1.5" 
                                    vectorEffect="non-scaling-stroke"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="drop-shadow-[0_0_8px_rgba(247,147,26,0.3)]"
                                />

                                {/* Interactive Points */}
                                {points.map((pt, i) => {
                                    const isHovered = hoveredDataPoint === i;
                                    return (
                                        <g key={i} onMouseEnter={() => setHoveredDataPoint(i)}>
                                            {/* Invisible Hit Target */}
                                            <rect x={pt.x - 5} y="0" width="10" height="100" fill="transparent" className="cursor-pointer" />
                                            
                                            {/* Visible Dot (Only on Hover or ends) */}
                                            <circle 
                                                cx={pt.x} cy={pt.y} 
                                                r={isHovered ? 3 : 0} 
                                                fill="#161A1E" 
                                                stroke="#F7931A" 
                                                strokeWidth="2" 
                                                className="transition-all duration-200"
                                            />
                                            
                                            {isHovered && (
                                                <g>
                                                    <foreignObject x={pt.x < 50 ? pt.x : pt.x - 20} y={pt.y - 35} width="80" height="40">
                                                        <div className="flex flex-col items-center">
                                                            <div className="bg-surface-highlight border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl text-center whitespace-nowrap">
                                                                {historyData[i]} XP
                                                            </div>
                                                            <div className="size-2 bg-surface-highlight border-r border-b border-white/10 transform rotate-45 -mt-1"></div>
                                                        </div>
                                                    </foreignObject>
                                                </g>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                            
                            {/* X-Axis Labels */}
                            <div className="flex justify-between mt-4 px-1 border-t border-white/5 pt-2">
                                {historyLabels.map((day, i) => (
                                    <span key={i} className={`text-[9px] uppercase font-bold ${hoveredDataPoint === i ? 'text-white' : 'text-text-muted'}`}>
                                        {day}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Path Mastery Breakdown */}
                <div className="bg-surface-dark rounded-3xl p-6 border border-white/5 shadow-xl flex flex-col h-full">
                    <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">donut_large</span>
                        Domain Competence Breakdown
                    </h3>
                    
                    <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-2">
                        {pathStats.map((stat, idx) => (
                            <div key={idx} className="group p-3 rounded-2xl bg-background-dark/30 border border-white/5 hover:border-white/10 hover:bg-background-dark/60 transition-all">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bgClass.replace('bg-', 'bg-opacity-10 bg-')} ${stat.colorClass} border border-opacity-20 ${stat.borderClass}`}>
                                        <span className="material-symbols-outlined text-lg">{stat.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <h4 className="font-bold text-white truncate text-sm">{stat.title}</h4>
                                            <span className={`text-xs font-mono font-bold ${stat.colorClass}`}>{stat.percent}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-surface-highlight rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${stat.bgClass} relative rounded-full transition-all duration-1000`} 
                                                style={{width: `${stat.percent}%`}}
                                            >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-text-muted font-mono px-1">
                                    <span>XP: {stat.earned} / {stat.totalXp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-white/5">
                         <button className="w-full py-3 rounded-xl bg-surface-highlight border border-white/10 text-sm font-bold text-text-muted hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 group">
                            <span className="material-symbols-outlined group-hover:text-primary transition-colors">download</span>
                            Download Full Competence Audit
                         </button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'LEADERBOARD' && (
            <div className="animate-in slide-in-from-right-4 duration-500 max-w-5xl mx-auto">
                {/* Tier Context Header */}
                <div className="mb-8 text-center">
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-primary">public</span>
                        Global Network Leaders
                    </h3>
                    <p className="text-text-muted text-sm">Top performing agents across the entire network.</p>
                </div>

                {/* Network Status Ticker */}
                <div className="mb-6 flex items-center gap-3 bg-surface-dark border border-white/5 rounded-full px-4 py-2">
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-success' : 'bg-error'} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-success' : 'bg-error'}`}></span>
                        </span>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{isConnected ? 'Gossip Network Live' : 'Connecting...'}</span>
                    </div>
                    <div className="h-4 w-px bg-white/10"></div>
                    <div className="flex-1 overflow-hidden h-4 relative flex items-center">
                        <span className="text-[10px] font-mono text-text-muted">
                            {peers.length > 0 ? `Tracking ${peers.length} active agents on relay network.` : 'Listening for peer announcements...'}
                        </span>
                    </div>
                </div>

                {/* Top 3 Podium (Global) - Fixed Structure */}
                <div className="flex justify-center items-end gap-4 mb-12 min-h-[220px]">
                    {/* Rank 2 (Left) */}
                    {renderPodiumSpot(2, sortedLeaderboard[1])}

                    {/* Rank 1 (Center) */}
                    {renderPodiumSpot(1, sortedLeaderboard[0])}

                    {/* Rank 3 (Right) */}
                    {renderPodiumSpot(3, sortedLeaderboard[2])}
                </div>

                {/* Table List - Global */}
                <div className="bg-surface-dark rounded-3xl border border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-white/5 grid grid-cols-12 gap-4 text-xs font-bold text-text-muted uppercase tracking-wider">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-5">Identity (Pubkey)</div>
                        <div className="col-span-3 text-right">Reputation</div>
                        <div className="col-span-3 text-right">Status</div>
                    </div>
                    
                    {/* Render All Available Peers (up to 50) */}
                    {sortedLeaderboard.slice(0, 50).map((player, idx) => (
                        <div key={player.pubkey} className={`p-4 border-b border-white/5 grid grid-cols-12 gap-4 items-center hover:bg-white/5 transition-colors group ${player.isCurrentUser ? 'bg-primary/5 border-primary/20' : ''}`}>
                            <div className="col-span-1 text-center font-mono font-bold text-white/50 group-hover:text-white">#{idx + 1}</div>
                            <div className="col-span-5 flex items-center gap-3">
                                <div className={`size-8 rounded-full flex items-center justify-center text-xs bg-white/5`}>
                                    {player.name.substring(0, 1).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-white font-bold text-sm truncate flex items-center gap-2">
                                        {player.name}
                                        {player.isCurrentUser && <span className="text-[9px] bg-primary/20 text-primary px-1 rounded uppercase">You</span>}
                                    </div>
                                    <div className="text-text-muted text-[10px] font-mono truncate opacity-60">{player.pubkey}</div>
                                </div>
                            </div>
                            <div className="col-span-3 text-right font-mono font-bold text-primary">{player.xp.toLocaleString()} XP</div>
                            <div className="col-span-3 text-right">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded border ${player.isOnline ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-text-muted border-white/10'}`}>
                                    <span className={`size-1.5 rounded-full ${player.isOnline ? 'bg-success animate-pulse' : 'bg-text-muted'}`}></span>
                                    {player.isOnline ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>
                    ))}
                    
                    {sortedLeaderboard.length === 0 && (
                        <div className="p-8 text-center text-text-muted">
                            No active agents found. Initializing...
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'RANKS' && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20 mb-8 flex gap-4 items-start">
                    <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
                        <span className="material-symbols-outlined">info</span>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-1">Rank System Mechanics</h4>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Ranks represent verified operational competence. They cannot be bought, only earned through successful simulation outcomes. Higher ranks unlock advanced "Red Team" scenarios and governance capabilities.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {RANK_TIERS.map((tier, index) => {
                        const isUnlocked = currentXp >= tier.minXp;
                        const isCurrent = index === actualRankIndex;
                        // Count real peers in this rank
                        const activeCount = sortedLeaderboard.filter(p => p.rank === tier.id).length;

                        return (
                            <div 
                                key={tier.id} 
                                className={`relative flex flex-col p-6 rounded-3xl border transition-all duration-300
                                    ${isCurrent 
                                        ? 'bg-surface-dark border-primary shadow-[0_0_30px_-10px_rgba(247,147,26,0.2)] z-10' 
                                        : isUnlocked 
                                            ? 'bg-surface-dark border-white/10 opacity-80' 
                                            : 'bg-background-dark border-white/5 opacity-50 grayscale'
                                    }
                                `}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`size-14 rounded-2xl flex items-center justify-center border 
                                        ${isUnlocked ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/5 text-text-muted'}`}>
                                        <span className="material-symbols-outlined text-3xl">{tier.icon}</span>
                                    </div>
                                    <div className="text-right">
                                         <span className={`block font-mono font-bold text-lg ${isUnlocked ? 'text-white' : 'text-text-muted'}`}>
                                            {tier.minXp.toLocaleString()} XP
                                        </span>
                                        {isCurrent ? (
                                             <span className="inline-block bg-primary text-background-dark text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1">Current</span>
                                        ) : (
                                            <span className="inline-block text-[10px] font-bold text-text-muted/50 uppercase mt-1">
                                                {activeCount.toLocaleString()} Agents
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className={`text-xl font-bold font-display ${isUnlocked ? 'text-white' : 'text-text-muted'}`}>
                                            {tier.title}
                                        </h3>
                                        {/* Distribution Bar */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${isCurrent ? 'bg-primary' : 'bg-white/20'}`} 
                                                    style={{ width: `${Math.min(100, (activeCount / Math.max(1, sortedLeaderboard.length)) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-muted leading-relaxed">{tier.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};