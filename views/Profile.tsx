import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { UserState } from '../types';
import { AuditReportModal } from '../components/AuditReportModal';

interface ProfileProps {
  user: UserState;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [showAuditModal, setShowAuditModal] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-y-auto custom-scrollbar animate-in fade-in duration-500 p-6 md:p-8">
      
      <div className="max-w-2xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <div className="size-16 rounded-full bg-surface-highlight border border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-text-muted">settings</span>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white font-display">System Configuration</h1>
                <p className="text-text-muted">Manage your identity and simulator preferences.</p>
            </div>
        </div>

        {/* Identity Section */}
        <div className="bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">fingerprint</span>
                    Identity
                </h2>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-2">Display Name</label>
                    <div className="bg-background-dark border border-white/10 rounded-xl p-3 flex items-center gap-3">
                         <div className={`size-8 rounded-full flex items-center justify-center ${user.isGuest ? 'bg-white/10' : 'bg-purple-500/20 text-purple-400'}`}>
                             <span className="material-symbols-outlined text-sm">{user.isGuest ? 'person_off' : 'badge'}</span>
                         </div>
                         <div className="text-white font-bold truncate flex-1">
                             {user.isGuest ? 'Guest User' : user.npub}
                         </div>
                         <div className="text-success text-[10px] font-bold uppercase border border-success/20 bg-success/10 px-2 py-0.5 rounded">
                             Active
                         </div>
                    </div>
                </div>

                {!user.isGuest && (
                    <div>
                         <label className="block text-xs font-bold text-text-muted uppercase mb-2">Public Key / Address</label>
                         <div className="bg-background-dark border border-white/10 rounded-xl p-3 flex items-center gap-3">
                             <span className="material-symbols-outlined text-text-muted text-sm">key</span>
                             <input 
                                type="text" 
                                value={user.pubkey || ''} 
                                disabled 
                                className="w-full bg-transparent text-text-muted font-mono text-xs focus:outline-none opacity-60"
                            />
                         </div>
                    </div>
                )}

                <Button variant="secondary" fullWidth onClick={onLogout} icon="logout">
                    Disconnect Session
                </Button>
            </div>
        </div>

        {/* Verifiable Credentials & Reports Section */}
        <div className="bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400">verified</span>
                    Credentials
                </h2>
                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-wider">
                    Block Verified
                </span>
            </div>
            <div className="p-6">
                <div className="bg-background-dark border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 transition-all hover:border-primary/30 group cursor-pointer" onClick={() => setShowAuditModal(true)}>
                    <div className="size-12 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">description</span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-white font-bold text-sm">Proof of Skill Audit</h3>
                        <p className="text-xs text-text-muted mt-1">Full cryptographic breakdown of completed modules, rank history, and competency narrative.</p>
                        <div className="flex gap-2 mt-2 justify-center md:justify-start">
                             <span className="text-[10px] font-mono text-text-muted bg-white/5 px-2 py-0.5 rounded">ID: AUD-{user.pubkey?.substring(0,4).toUpperCase()}</span>
                             <span className="text-[10px] font-mono text-text-muted bg-white/5 px-2 py-0.5 rounded">{new Date().toISOString().split('T')[0]}</span>
                        </div>
                    </div>
                    <div className="shrink-0">
                         <span className="material-symbols-outlined text-text-muted group-hover:text-white transition-colors">chevron_right</span>
                    </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                    <Button fullWidth variant="primary" icon="visibility" onClick={() => setShowAuditModal(true)}>
                        View Report
                    </Button>
                </div>
            </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-dark p-4 rounded-xl border border-white/5 text-center">
                <span className="material-symbols-outlined text-warning mb-2">local_fire_department</span>
                <h3 className="text-2xl font-bold text-white">{user.streak}</h3>
                <p className="text-[10px] text-text-muted uppercase font-bold">Day Streak</p>
            </div>
             <div className="bg-surface-dark p-4 rounded-xl border border-white/5 text-center">
                <span className="material-symbols-outlined text-primary mb-2">bolt</span>
                <h3 className="text-2xl font-bold text-white">{user.reputation}</h3>
                <p className="text-[10px] text-text-muted uppercase font-bold">Total XP</p>
            </div>
             <div className="bg-surface-dark p-4 rounded-xl border border-white/5 text-center">
                <span className="material-symbols-outlined text-blue-400 mb-2">military_tech</span>
                <h3 className="text-lg font-bold text-white truncate px-2">{user.rank}</h3>
                <p className="text-[10px] text-text-muted uppercase font-bold">Current Rank</p>
            </div>
        </div>
        
        {/* App Settings (Mock) */}
        <div className="bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">
             <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-text-muted">tune</span>
                    Preferences
                </h2>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-white">Simulation Audio</h4>
                        <p className="text-xs text-text-muted">Sound effects and feedback tones</p>
                    </div>
                    <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 size-4 bg-white rounded-full"></div>
                    </div>
                </div>
                <div className="w-full h-px bg-white/5"></div>
                 <div className="flex items-center justify-between opacity-50">
                    <div>
                        <h4 className="text-sm font-bold text-white">Developer Mode</h4>
                        <p className="text-xs text-text-muted">Show raw protocol logs in labs</p>
                    </div>
                    <div className="w-10 h-6 bg-white/10 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 size-4 bg-text-muted rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="text-center">
             <p className="text-[10px] text-text-muted font-mono">SatsCraft Protocol v0.9.3 (Beta)</p>
             <p className="text-[10px] text-text-muted font-mono mt-1">Nostr Relay Connection: wss://relay.damus.io [CONNECTED]</p>
        </div>

      </div>

      {showAuditModal && (
        <AuditReportModal user={user} onClose={() => setShowAuditModal(false)} />
      )}
    </div>
  );
};