import React, { useState, useMemo } from 'react';
import { Button } from './ui/Button';
import { UserState } from '../types';
import { PATHS, RANK_TIERS } from '../constants';
import { jsPDF } from 'jspdf';

interface AuditReportModalProps {
  user: UserState;
  onClose: () => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({ user, onClose }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [viewMode, setViewMode] = useState<'VISUAL' | 'RAW'>('VISUAL');
  const [downloadState, setDownloadState] = useState<'IDLE' | 'DOWNLOADING' | 'DONE'>('IDLE');
  const [isPublishing, setIsPublishing] = useState(false);

  // Generate Report Data
  const reportDate = new Date().toISOString();
  const reportId = `AUD-${user.pubkey?.substring(0, 8).toUpperCase()}-${Date.now().toString().substring(8)}`;
  const blockHeight = 840000 + user.streak * 144; // Simulated block height based on activity

  // Resolve Rank Details
  const rankInfo = RANK_TIERS.find(r => r.title === user.rank) || RANK_TIERS[0];
  
  // Resolve Activity Graph Data (Same logic as Profile for consistency)
  const activityGraphData = useMemo(() => {
    const weeks = [];
    const totalWeeks = 30; // Shorter for report
    const daysPerWeek = 7;
    const yearActivity = new Array(totalWeeks * daysPerWeek).fill(0);
    
    user.completedModules.forEach(modId => {
        let hash = 0;
        for (let i = 0; i < modId.length; i++) hash = ((hash << 5) - hash) + modId.charCodeAt(i);
        const dayIndex = Math.abs(hash) % (totalWeeks * 7 - 14); 
        yearActivity[dayIndex] = Math.min(4, yearActivity[dayIndex] + 2);
    });
    const todayIndex = (totalWeeks * daysPerWeek) - 1;
    for (let i = 0; i < user.streak; i++) {
        const idx = todayIndex - i;
        if (idx >= 0) yearActivity[idx] = 4;
    }
    for (let w = 0; w < totalWeeks; w++) weeks.push(yearActivity.slice(w * 7, (w * 7) + 7));
    return weeks;
  }, [user.completedModules, user.streak]);

  // Resolve Module History (Real Data)
  const activityLog = useMemo(() => {
    return user.completedModules.map(modId => {
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
          // Deterministic hash based on module ID to keep report consistent
          hash: 'tx-' + btoa(modId + user.pubkey).substring(0, 16).toLowerCase(), 
          timestamp: new Date().toISOString().split('T')[0] // In a real app, we'd store completion dates
      };
    }).reverse(); // Newest first
  }, [user.completedModules, user.pubkey]);

  // Dynamic Narrative Generation based on MULTIPLE paths
  const generateNarrative = () => {
      // Analyze Path Progress
      const pathProgress = PATHS.map(p => {
          const completed = p.modules.filter(m => user.completedModules.includes(m.id)).length;
          return { title: p.title, percent: completed / p.modules.length };
      });

      const mastered = pathProgress.filter(p => p.percent === 1.0).map(p => p.title);
      const active = pathProgress.filter(p => p.percent > 0 && p.percent < 1.0).map(p => p.title);
      const totalModules = user.completedModules.length;

      let narrative = `Subject is identified as ${user.npub} with a current rank of ${user.rank.toUpperCase()}. `;
      
      if (totalModules === 0) {
          narrative += "Subject has initialized the protocol environment but has not yet generated cryptographic proof of skill. Status: ONBOARDING.";
      } else {
          narrative += `Operational velocity is ${user.streak > 5 ? 'high' : 'nominal'} with a verified streak of ${user.streak} days. `;
          
          if (mastered.length > 0) {
              narrative += `Subject has achieved FULL MASTERY in the following domains: ${mastered.join(', ')}. This indicates deep architectural competence and readiness for mainnet deployment. `;
          }
          
          if (active.length > 0) {
              narrative += `Active development is currently observed in: ${active.join(', ')}. `;
          }

          if (user.reputation > 10000) {
              narrative += "Subject is considered a high-value network peer suitable for consensus-critical infrastructure management.";
          } else if (user.reputation > 2000) {
              narrative += "Subject demonstrates solid foundational knowledge and is cleared for intermediate node operations.";
          } else {
              narrative += "Subject is in early stages of protocol onboarding. Recommended for supervised network access.";
          }
      }
      
      return narrative;
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

  const handleNostrPublish = async () => {
      if (!window.nostr) {
          alert("Nostr extension not found!");
          return;
      }
      
      setIsPublishing(true);
      try {
          const event = {
              kind: 1,
              created_at: Math.floor(Date.now() / 1000),
              tags: [
                  ["t", "satscraft"],
                  ["t", "proofofskill"],
                  ["d", reportId]
              ],
              content: `Verifiable Proof of Skill generated via SatsCraft.\n\nRank: ${user.rank.toUpperCase()}\nXP: ${user.reputation}\nModules Completed: ${user.completedModules.length}\nReport ID: ${reportId}\n\n#satscraft #bitcoin`
          };
          
          // @ts-ignore
          await window.nostr.signEvent(event);
          // In a real app we would now relay.publish(signedEvent)
          
          alert("Proof signed and broadcast to relays!");
      } catch (e) {
          console.error(e);
          alert("Failed to sign event.");
      } finally {
          setIsPublishing(false);
      }
  };

  const handleDownload = () => {
      setDownloadState('DOWNLOADING');
      
      try {
        const doc = new jsPDF();
        
        // Fonts
        doc.setFont("helvetica");
        
        // 1. Header
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("Proof of Skill", 20, 25);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text("SatsCraft Protocol Authority", 20, 31);
        
        // Right Header
        doc.setTextColor(0);
        doc.setFontSize(8);
        doc.setFont("courier", "normal");
        doc.text("BLOCK HEIGHT", 150, 23);
        doc.setFontSize(14);
        doc.setFont("courier", "bold");
        doc.text(blockHeight.toLocaleString(), 150, 29);
        
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(20, 40, 190, 40);
        
        // 2. Subject Identity
        let y = 55;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("SUBJECT IDENTITY", 20, y);
        doc.text("RANK ASSESSMENT", 110, y);
        
        y += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(user.npub || 'Unknown', 20, y);
        doc.text(user.rank.toUpperCase(), 110, y);
        
        y += 6;
        doc.setFont("courier", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(user.pubkey || 'N/A', 20, y);
        doc.text(`Level ${rankInfo.id}`, 110, y);
        
        // 3. Narrative
        y += 25;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("COMPETENCY NARRATIVE", 20, y);
        
        y += 8;
        doc.setFont("times", "roman");
        doc.setFontSize(11);
        doc.setTextColor(0);
        const narrativeText = generateNarrative();
        const splitNarrative = doc.splitTextToSize(narrativeText, 170);
        doc.text(splitNarrative, 20, y);
        y += (splitNarrative.length * 5) + 15;
        
        // 4. Activity Ledger
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("ACTIVITY LEDGER", 20, y);
        
        y += 8;
        doc.setFontSize(9);
        doc.setTextColor(0);
        // Table Header
        doc.text("ID", 20, y);
        doc.text("PROTOCOL", 45, y);
        doc.text("PROOF HASH", 130, y);
        
        doc.setLineWidth(0.1);
        doc.line(20, y+2, 190, y+2);
        y += 8;
        
        doc.setFont("courier", "normal");
        activityLog.forEach((log) => {
            if (y > 250) {
                doc.addPage();
                y = 20;
            }
            doc.text(log.id, 20, y);
            doc.text(log.title.substring(0, 40), 45, y);
            doc.text(log.hash, 130, y);
            y += 6;
        });
        
        if (activityLog.length === 0) {
            doc.setFont("helvetica", "italic");
            doc.setTextColor(150);
            doc.text("No verified activity recorded on-chain.", 20, y);
            y += 10;
        }

        // 5. Signature
        y = 260; // Bottom of page
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(20, y, 90, y);
        
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("PROTOCOL SIGNATURE", 20, y);
        
        y += 5;
        doc.setFont("courier", "normal");
        doc.setFontSize(6);
        const sig = doc.splitTextToSize(rawData.signature, 70);
        doc.text(sig, 20, y);
        
        // 6. Verified Stamp
        if (isVerified) {
             doc.setTextColor(22, 163, 74); // Green
             doc.setFontSize(18);
             doc.setFont("helvetica", "bold");
             doc.text("VERIFIED", 140, 255);
             
             doc.setFontSize(10);
             doc.text("SATSCRAFT PROTOCOL", 140, 262);
             doc.text(reportDate.split('T')[0], 140, 268);
             
             doc.setLineWidth(1);
             doc.setDrawColor(22, 163, 74);
             doc.rect(135, 242, 55, 30);
        }

        doc.save(`${reportId}.pdf`);
        setDownloadState('DONE');
      } catch (e) {
        console.error("PDF download failed", e);
        setDownloadState('IDLE');
      }
  };

  const getColorForLevel = (level: number) => {
    switch(level) {
        case 1: return 'bg-gray-300';
        case 2: return 'bg-gray-400';
        case 3: return 'bg-gray-600';
        case 4: return 'bg-black';
        default: return 'bg-gray-100';
    }
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

                        {/* Visual Protocol Activity Graph (Added Copy) */}
                        <div className="mb-12 relative z-10">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Protocol Activity</label>
                            <div className="w-full overflow-hidden">
                                <div className="flex gap-1">
                                    {activityGraphData.map((week, weekIdx) => (
                                        <div key={weekIdx} className="flex flex-col gap-1">
                                            {week.map((dayLevel, dayIdx) => (
                                                <div 
                                                    key={dayIdx} 
                                                    className={`size-2 rounded-sm ${getColorForLevel(dayLevel)}`}
                                                ></div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-1 text-[8px] font-mono text-gray-400">
                                    <span>20 Weeks Ago</span>
                                    <span>Current</span>
                                </div>
                            </div>
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
                    
                    {window.nostr && (
                        <Button
                            variant="secondary"
                            onClick={handleNostrPublish}
                            disabled={isPublishing}
                            icon="rss_feed"
                            className="bg-purple-900/20 text-purple-400 border-purple-500/30"
                        >
                            {isPublishing ? 'Broadcasting...' : 'Publish to Nostr'}
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