import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { UserState } from '../types';
import { PATHS, RANK_TIERS } from '../constants';

interface AuditReportModalProps {
  user: UserState;
  onClose: () => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({ user, onClose }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [viewMode, setViewMode] = useState<'VISUAL' | 'RAW'>('VISUAL');
  const [downloadState, setDownloadState] = useState<'IDLE' | 'DOWNLOADING' | 'DONE'>('IDLE');

  // Generate Report Data
  const reportDate = new Date().toISOString();
  const reportId = `AUD-${user.pubkey?.substring(0, 8).toUpperCase()}-${Date.now().toString().substring(8)}`;
  const blockHeight = 840000 + user.streak * 144; // Simulated block height based on activity

  // Resolve Rank Details
  const rankInfo = RANK_TIERS.find(r => r.title === user.rank) || RANK_TIERS[0];
  
  // Resolve Module History
  const activityLog = user.completedModules.map(modId => {
      // Find module details across all paths
      let modDetails;
      for (const p of PATHS) {
          const m = p.modules.find(mod => mod.id === modId);
          if (m) {
              modDetails = m;
              break;
          }
      }
      return {
          id: modId,
          title: modDetails?.title || 'Unknown Protocol',
          hash: 'tx-' + Math.random().toString(36).substring(2, 10) + '...' + Math.random().toString(36).substring(2, 6),
          timestamp: new Date(Date.now() - Math.random() * 1000000000).toISOString().split('T')[0]
      };
  });

  const generateNarrative = () => {
      if (user.reputation < 1000) return "Subject is in early stages of protocol onboarding. Basic competency demonstrated in foundational concepts. Recommended for supervised network access.";
      if (user.reputation < 5000) return "Subject has demonstrated consistent operational uptime and mastery of self-custody primitives. Approved for intermediate liquidity management.";
      if (user.reputation < 20000) return "Subject is a highly competent operator capable of managing routing nodes and complex multisig architectures. High trust rating assigned.";
      return "Subject exhibits elite-level protocol understanding. Suitable for consensus-critical infrastructure management and architectural oversight.";
  };

  const rawData = {
      header: {
          protocol: "SATSCRAFT_V2",
          report_id: reportId,
          timestamp: reportDate,
          block_height: blockHeight
      },
      subject: {
          alias: user.npub,
          pubkey: user.pubkey,
          current_rank: user.rank,
          reputation_score: user.reputation
      },
      proof_of_work: activityLog.map(a => ({ id: a.id, hash: a.hash })),
      signature: "30440220...[redacted]...022100"
  };

  const handleVerify = () => {
      setIsVerifying(true);
      setTimeout(() => {
          setIsVerifying(false);
          setIsVerified(true);
      }, 1500);
  };

  const handleDownload = () => {
      setDownloadState('DOWNLOADING');
      setTimeout(() => {
          setDownloadState('DONE');
      }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
        <div className="w-full max-w-4xl bg-[#0D0F12] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Toolbar */}
            <div className="h-14 border-b border-white/10 bg-[#161A1E] flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">verified_user</span>
                        Cryptographic Audit
                    </span>
                    <div className="h-4 w-px bg-white/10"></div>
                    <span className="text-xs font-mono text-text-muted">{reportId}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setViewMode(viewMode === 'VISUAL' ? 'RAW' : 'VISUAL')}
                        className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-white transition-colors"
                    >
                        {viewMode === 'VISUAL' ? 'View Raw JSON' : 'View Visual Report'}
                    </button>
                    <button 
                        onClick={onClose}
                        className="size-8 rounded hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#0D0F12] relative">
                
                {viewMode === 'RAW' ? (
                    <pre className="font-mono text-xs text-blue-300 bg-black/50 p-6 rounded-lg border border-white/5 overflow-x-auto">
                        {JSON.stringify(rawData, null, 2)}
                    </pre>
                ) : (
                    <div className="max-w-3xl mx-auto bg-white text-black p-12 shadow-xl min-h-[800px] relative">
                        {/* Paper Texture Effect */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none"></div>
                        
                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                            <span className="material-symbols-outlined text-[400px]">deployed_code</span>
                        </div>

                        {/* Document Header */}
                        <div className="flex justify-between items-start mb-12 border-b-2 border-black pb-8 relative z-10">
                            <div>
                                <h1 className="text-4xl font-display font-bold tracking-tight mb-2 text-black">Proof of Skill</h1>
                                <p className="text-xs font-mono uppercase tracking-widest text-gray-600">SatsCraft Protocol Authority</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-mono text-gray-500 mb-1">BLOCK HEIGHT</div>
                                <div className="text-xl font-bold font-mono">{blockHeight.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Subject Identity */}
                        <div className="grid grid-cols-2 gap-12 mb-12 relative z-10">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Subject Identity</label>
                                <div className="text-xl font-bold border-b border-gray-300 pb-1">{user.npub || 'Unknown'}</div>
                                <div className="text-[10px] font-mono text-gray-400 mt-1 truncate">{user.pubkey}</div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Rank Assessment</label>
                                <div className="flex items-center gap-3 border-b border-gray-300 pb-1">
                                    <span className="material-symbols-outlined text-xl">{rankInfo.icon}</span>
                                    <span className="text-xl font-bold">{user.rank.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Narrative Report */}
                        <div className="mb-12 relative z-10">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Competency Narrative</label>
                            <p className="font-serif text-sm leading-7 text-gray-800 text-justify">
                                {generateNarrative()}
                            </p>
                        </div>

                        {/* Activity Ledger */}
                        <div className="mb-12 relative z-10">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Activity Ledger</label>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-black">
                                        <th className="py-2 text-[10px] font-bold uppercase w-20">ID</th>
                                        <th className="py-2 text-[10px] font-bold uppercase">Module Protocol</th>
                                        <th className="py-2 text-[10px] font-bold uppercase text-right">Proof Hash</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activityLog.map((log, i) => (
                                        <tr key={i} className="border-b border-gray-100 font-mono text-xs">
                                            <td className="py-2 text-gray-500">{log.id}</td>
                                            <td className="py-2 font-bold">{log.title}</td>
                                            <td className="py-2 text-right text-gray-400">{log.hash}</td>
                                        </tr>
                                    ))}
                                    {activityLog.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-xs text-gray-400 italic">No verified activity recorded on-chain.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Verification Stamp */}
                        <div className="flex justify-between items-end mt-20 relative z-10">
                            <div className="w-1/2">
                                <div className="h-px bg-black w-full mb-2"></div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Protocol Signature</div>
                                <div className="font-mono text-[8px] text-gray-400 break-all mt-1">
                                    {rawData.signature}
                                </div>
                            </div>

                            {/* Dynamic Stamp */}
                            {isVerified && (
                                <div className="border-4 border-green-600 text-green-600 rounded p-2 transform -rotate-12 opacity-80 animate-in zoom-in duration-300">
                                    <div className="text-xl font-black uppercase tracking-widest text-center">Verified</div>
                                    <div className="text-[10px] font-bold uppercase text-center">SatsCraft Protocol</div>
                                    <div className="text-[8px] font-mono text-center">{reportDate.split('T')[0]}</div>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-[#161A1E] border-t border-white/10 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Integrity Status</span>
                        <div className="flex items-center gap-2">
                            <div className={`size-2 rounded-full ${isVerified ? 'bg-success' : 'bg-warning animate-pulse'}`}></div>
                            <span className={`text-xs font-mono font-bold ${isVerified ? 'text-success' : 'text-warning'}`}>
                                {isVerifying ? 'VERIFYING...' : isVerified ? 'CRYPTOGRAPHICALLY VERIFIED' : 'UNVERIFIED'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    {!isVerified && (
                         <Button 
                            variant="secondary" 
                            onClick={handleVerify}
                            disabled={isVerifying}
                            icon="fingerprint"
                        >
                            {isVerifying ? 'Checking Chain...' : 'Verify Signature'}
                        </Button>
                    )}
                    
                    <Button 
                        variant="primary" 
                        onClick={handleDownload}
                        disabled={!isVerified || downloadState !== 'IDLE'}
                        icon={downloadState === 'DONE' ? 'check' : 'download'}
                    >
                        {downloadState === 'IDLE' ? 'Download PDF' : downloadState === 'DOWNLOADING' ? 'Generating...' : 'Saved'}
                    </Button>
                </div>
            </div>

        </div>
    </div>
  );
};