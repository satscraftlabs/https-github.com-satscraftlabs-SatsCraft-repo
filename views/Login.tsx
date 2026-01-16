import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { RoadmapModal } from '../components/RoadmapModal';

interface LoginProps {
  onNostrLogin: () => void;
  onLightningLogin: (address: string, displayName: string) => void;
  onGuest: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNostrLogin, onLightningLogin, onGuest }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  
  // Login State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [lightningInput, setLightningInput] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleNostr = async () => {
    setIsLoading(true);
    setError(null);
    try {
        await onNostrLogin();
    } catch (e: any) {
         setError("Nostr extension (NIP-07) not detected. Try Alby or nos2x.");
         setIsLoading(false);
    }
  };

  const validateLightningInput = (input: string): boolean => {
      const lnAddressRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      const pubkeyRegex = /^[0-9a-fA-F]{66}$/;
      return lnAddressRegex.test(input) || pubkeyRegex.test(input);
  };

  const handleLightningSubmit = async () => {
      const trimmedInput = lightningInput.trim();
      const trimmedName = displayName.trim();
      
      if (!trimmedInput) {
          setError("Please enter a valid Lightning Address or Node Alias.");
          return;
      }

      if (!validateLightningInput(trimmedInput)) {
          setError("Use a proper lightning address.");
          return;
      }

      setIsLoading(true);
      setError(null);
      
      setTimeout(() => {
          try {
              const finalName = trimmedName || trimmedInput.split('@')[0] || 'Anon_Agent';
              onLightningLogin(trimmedInput, finalName);
          } catch (e: any) {
              setError(e.message);
              setIsLoading(false);
          }
      }, 800);
  };

  const handleStartFromRoadmap = () => {
      setShowRoadmapModal(false);
      setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-body text-text-main selection:bg-primary/30 overflow-y-auto custom-scrollbar">
        
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
             <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                     <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-[#050505]">
                         <span className="material-symbols-outlined text-xl">deployed_code</span>
                     </div>
                     <span className="font-display font-bold text-xl tracking-tight text-white">SatsCraft</span>
                 </div>
                 <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white">
                     <span className="material-symbols-outlined">menu</span>
                 </button>
             </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
             {/* Background Gradients */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                 <div className="absolute top-20 left-1/4 size-96 bg-primary/10 rounded-full blur-[100px]"></div>
                 <div className="absolute bottom-20 right-1/4 size-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
             </div>

             <div className="max-w-4xl mx-auto text-center relative z-10">
                 <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-6 animate-in slide-in-from-bottom-2">
                     <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                     <span className="text-xs font-bold text-primary tracking-widest uppercase">System Online: v2.0</span>
                 </div>
                 
                 <h1 className="text-5xl md:text-7xl font-bold font-display text-white mb-6 leading-[1.1] tracking-tight">
                     Master the <span className="text-primary">Bitcoin Stack</span> through Proof of Skill
                 </h1>
                 
                 <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                     No videos. No fluff. Interact with real protocol constraints and fix real-world failures in our sandbox environments.
                 </p>
                 
                 <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
                     <Button size="lg" onClick={() => setShowLoginModal(true)} icon="terminal" className="shadow-[0_0_30px_-5px_rgba(247,147,26,0.4)]">
                         Start Crafting Now
                     </Button>
                     <Button 
                        size="lg" 
                        variant="secondary" 
                        icon="map" 
                        className="border-white/10 hover:bg-white/5"
                        onClick={() => setShowRoadmapModal(true)}
                    >
                         View Roadmap
                     </Button>
                 </div>

                 {/* Hero Image / Sandbox Preview */}
                 <div className="rounded-2xl border border-white/10 bg-surface-dark/50 backdrop-blur-sm p-2 shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
                     <div className="rounded-xl overflow-hidden bg-black/40 border border-white/5 aspect-[16/9] relative group">
                         {/* Mock UI for Lightning Sandbox */}
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                         <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                         
                         <div className="absolute bottom-6 left-6 text-left">
                             <div className="flex items-center gap-2 mb-2">
                                 <span className="text-[10px] font-bold bg-warning/20 text-warning px-2 py-0.5 rounded border border-warning/20 uppercase tracking-wider">Active Lab</span>
                             </div>
                             <h3 className="text-xl font-bold text-white font-mono">Lightning_Sandbox_v1</h3>
                         </div>
                         
                         <div className="absolute bottom-6 right-6 flex gap-1">
                             <div className="size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(247,147,26,0.8)]"></div>
                             <div className="size-2 rounded-full bg-white/20"></div>
                             <div className="size-2 rounded-full bg-white/20"></div>
                         </div>
                     </div>
                 </div>
             </div>
        </section>

        {/* Learning Architecture */}
        <section className="py-24 px-6 bg-surface-dark/30 border-y border-white/5 relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h3 className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-3">Learning Architecture</h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-display">Role-Based Learning Paths</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Protocol Developers */}
                    <div className="group p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-primary/50 transition-all duration-300">
                        <div className="bg-surface-dark h-full rounded-xl p-6 border border-white/5 relative overflow-hidden group-hover:bg-[#1A1D21] transition-colors">
                            <div className="mb-6 h-48 rounded-lg bg-black/50 border border-white/5 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Protocol Developers</h3>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">Deep dive into Script, SegWit, and Taproot. Build custom transaction types from scratch.</p>
                            <button onClick={() => setShowRoadmapModal(true)} className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                                Explore Path <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    {/* Node Operators */}
                    <div className="group p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/50 transition-all duration-300">
                        <div className="bg-surface-dark h-full rounded-xl p-6 border border-white/5 relative overflow-hidden group-hover:bg-[#1A1D21] transition-colors">
                            <div className="mb-6 h-48 rounded-lg bg-black/50 border border-white/5 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-ef526b01201b?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Node Operators</h3>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">Manage liquidity, optimize routing, and maintain high-availability Bitcoin infrastructure.</p>
                            <button onClick={() => setShowRoadmapModal(true)} className="text-purple-400 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                                Explore Path <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    {/* System Architects */}
                    <div className="group p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-blue-500/50 transition-all duration-300">
                        <div className="bg-surface-dark h-full rounded-xl p-6 border border-white/5 relative overflow-hidden group-hover:bg-[#1A1D21] transition-colors">
                            <div className="mb-6 h-48 rounded-lg bg-black/50 border border-white/5 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">System Architects</h3>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">Design multi-sig custody solutions and Layer-2 scaling strategies for enterprise.</p>
                            <button onClick={() => setShowRoadmapModal(true)} className="text-blue-400 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                                Explore Path <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 border-t border-white/5 bg-[#050505] relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                         <div className="size-8 rounded-lg bg-surface-highlight flex items-center justify-center text-primary">
                             <span className="material-symbols-outlined text-xl">deployed_code</span>
                         </div>
                         <span className="font-display font-bold text-xl text-white">SatsCraft</span>
                     </div>
                     <p className="text-sm text-text-muted leading-relaxed">
                         The technical standard for Bitcoin protocol engineering and simulation-based learning.
                     </p>
                </div>
                
                <div>
                    <h4 className="font-bold text-white mb-6 text-sm tracking-wider uppercase">Protocol</h4>
                    <ul className="space-y-4 text-sm text-text-muted">
                        <li className="hover:text-primary cursor-pointer transition-colors">UTXO Lab</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">Lightning Sandbox</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">Script Debugger</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6 text-sm tracking-wider uppercase">Community</h4>
                    <ul className="space-y-4 text-sm text-text-muted">
                        <li className="hover:text-primary cursor-pointer transition-colors">Network Hub</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">Documentation</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">Open Source</li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6 text-sm tracking-wider uppercase">Social & Contact</h4>
                    <ul className="space-y-4 text-sm text-text-muted">
                        <li className="hover:text-primary cursor-pointer transition-colors">Twitter</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">GitHub</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">
                            <a href="mailto:satscraftlab@gmail.com">satscraftlab@gmail.com</a>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-text-muted font-mono">
                <p>© 2024 SATSCRAFT EDUCATION.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <span className="text-white/30">BLOCK_HEIGHT: 840000</span>
                    <span className="hover:text-white cursor-pointer transition-colors">PRIVACY POLICY</span>
                    <span className="hover:text-white cursor-pointer transition-colors">TERMS OF SERVICE</span>
                </div>
            </div>
        </footer>

        {/* Roadmap Modal */}
        {showRoadmapModal && (
            <RoadmapModal 
                onClose={() => setShowRoadmapModal(false)}
                onCtaClick={handleStartFromRoadmap}
            />
        )}

        {/* Login Modal */}
        {showLoginModal && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div 
                    className="relative w-full max-w-md bg-[#0D0F12] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setShowLoginModal(false)}
                        className="absolute top-4 right-4 p-2 text-text-muted hover:text-white rounded-full hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    
                    {/* ORIGINAL LOGIN CONTENT */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-surface-dark border border-white/10 shadow-lg mb-4">
                            <span className="material-symbols-outlined text-4xl text-primary">deployed_code</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Identify Yourself</h2>
                        <p className="text-text-muted text-sm mt-1">Connect to the simulation network</p>
                    </div>

                    <div className="space-y-4">
                         {/* Existing Login Form Logic */}
                        {!showInput ? (
                            <button 
                                onClick={() => setShowInput(true)}
                                className="w-full py-4 px-6 bg-primary hover:bg-primary-dark text-background-dark rounded-xl font-bold flex items-center justify-between group transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-xl filled">bolt</span>
                                    <span className="tracking-wide">Log in with Lightning</span>
                                </div>
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        ) : (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className="relative">
                                    <input 
                                        type="text"
                                        placeholder="Display Name (Optional)"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full bg-background-dark border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        onKeyDown={(e) => e.key === 'Enter' && handleLightningSubmit()}
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                                        <span className="material-symbols-outlined">badge</span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        placeholder="name@domain.com or Pubkey"
                                        value={lightningInput}
                                        onChange={(e) => setLightningInput(e.target.value)}
                                        className={`w-full bg-background-dark border rounded-xl py-4 pl-12 pr-4 text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${error ? 'border-error' : 'border-primary/50'}`}
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleLightningSubmit()}
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                                        <span className="material-symbols-outlined">bolt</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" onClick={() => setShowInput(false)}>Back</Button>
                                    <Button 
                                        variant="primary" 
                                        fullWidth 
                                        onClick={handleLightningSubmit} 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Verifying...' : 'Connect'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleNostr}
                            disabled={isLoading}
                            className="w-full py-4 px-6 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#A78BFA] rounded-xl font-bold flex items-center justify-between group transition-all duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-xl">rss_feed</span>
                                <span className="tracking-wide">Log in with Nostr</span>
                            </div>
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0D0F12] px-2 text-text-muted">Or</span>
                            </div>
                        </div>

                        <Button variant="ghost" fullWidth onClick={onGuest} icon="person_off" className="opacity-70 hover:opacity-100">
                            Guest Access
                        </Button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-xl text-xs text-error flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};