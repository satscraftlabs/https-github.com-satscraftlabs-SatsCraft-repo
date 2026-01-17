import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { StressEvent, StressEventSeverity, PathId } from '../types';

interface StressTestProps {
  onComplete: (success: boolean, score: number) => void;
  onExit: () => void;
  pathId?: PathId;
  devMode?: boolean;
}

// Expanded Scenario Logic with correct solutions
const SCENARIO_LOGIC: Record<string, { valid: string[], fatal: string[] }> = {
    'CHANNEL_BREACH': { valid: ['JUSTICE_TX'], fatal: ['WAIT', 'RESTART_SERVICE'] },
    'FEE_SPIKE': { valid: ['BUMP_FEE'], fatal: ['FORCE_CLOSE'] },
    'DB_CORRUPTION': { valid: ['RESTART_SERVICE'], fatal: ['BUMP_FEE'] },
    'PEER_DISCONNECT': { valid: ['WAIT', 'RESTART_SERVICE'], fatal: ['FORCE_CLOSE'] },
    'GOSSIP_FLOOD': { valid: ['LIMIT_GOSSIP'], fatal: [] },
    'SYBIL_ATTACK': { valid: ['BAN_PEERS'], fatal: ['WAIT'] },
    'DUST_STORM': { valid: ['LIMIT_GOSSIP', 'BUMP_FEE'], fatal: [] },
    'PRIVACY_LEAK': { valid: ['MIX_COINS'], fatal: ['WAIT'] },
    'KEY_LEAK': { valid: ['SWEEP_FUNDS'], fatal: ['RESTART_SERVICE', 'WAIT'] },
    'PHISHING': { valid: ['VERIFY_SIG'], fatal: ['SIGN_TX'] },
    'BACKUP_ROT': { valid: ['RESTORE_SEED'], fatal: ['RESTART_SERVICE'] },
};

const SCENARIOS: Record<string, Omit<StressEvent, 'id' | 'timestamp' | 'resolved'>[]> = {
    [PathId.LIGHTNING_OPERATOR]: [
        { type: 'CHANNEL_BREACH', title: 'HTLC Breach Attempt', symptom: 'WARN: Channel 24x789 state mismatch. Remote peer broadcasting old commitment.', rootCause: 'Malicious Peer', severity: 'CRITICAL', decayRate: 2.0 },
        { type: 'FEE_SPIKE', title: 'Mempool Congestion', symptom: 'ERROR: 14 HTLCs pending. Commitment tx fee below relay threshold.', rootCause: 'Fee Market', severity: 'HIGH', decayRate: 0.8 },
        { type: 'DB_CORRUPTION', title: 'State DB Lock', symptom: 'FATAL: channel.db is locked by another process. RPC unresponsive.', rootCause: 'IO Failure', severity: 'HIGH', decayRate: 1.2 },
        { type: 'PEER_DISCONNECT', title: 'Liquidity Partition', symptom: 'INFO: 80% of inbound liquidity offline. Routing failures increasing.', rootCause: 'Network Outage', severity: 'MEDIUM', decayRate: 0.4 },
        { type: 'GOSSIP_FLOOD', title: 'Gossip Storm', symptom: 'WARN: CPU load > 95%. Processing excessive channel updates.', rootCause: 'Spam', severity: 'LOW', decayRate: 0.2 },
    ],
    [PathId.SOVEREIGN]: [
        { type: 'SYBIL_ATTACK', title: 'Sybil Attack', symptom: 'WARN: 80% of peers returning invalid headers. Consensus divergent.', rootCause: 'Network Partition', severity: 'HIGH', decayRate: 1.2 },
        { type: 'DUST_STORM', title: 'Dust Attack', symptom: 'Mempool spiked to 300MB. Minimum relay fee increased to 20 sat/vB.', rootCause: 'Spam Attack', severity: 'MEDIUM', decayRate: 0.6 },
        { type: 'KEY_LEAK', title: 'Weak Entropy', symptom: 'CRITICAL: Key generation PRNG flagged as insecure.', rootCause: 'Weak Randomness', severity: 'CRITICAL', decayRate: 2.5 },
    ],
    [PathId.WALLET_MASTERY]: [
        { type: 'KEY_LEAK', title: 'Entropy Failure', symptom: 'CRITICAL: PRNG weakness detected in signing module.', rootCause: 'Weak Randomness', severity: 'CRITICAL', decayRate: 2.0 },
        { type: 'PHISHING', title: 'Clipboard Hijack', symptom: 'WARN: Destination address mismatch detected during signing.', rootCause: 'Malware', severity: 'HIGH', decayRate: 1.0 },
        { type: 'BACKUP_ROT', title: 'Bit Rot', symptom: 'ERROR: Checksum failure on mnemonic shard #2.', rootCause: 'Data Corruption', severity: 'MEDIUM', decayRate: 0.5 },
    ]
};

const DEFAULT_SCENARIOS = SCENARIOS[PathId.LIGHTNING_OPERATOR];

export const AdversarialStressTest: React.FC<StressTestProps> = ({ onComplete, onExit, pathId = PathId.LIGHTNING_OPERATOR, devMode = false }) => {
  const [phase, setPhase] = useState<'BRIEFING' | 'RUNNING' | 'FAILED' | 'SUCCESS'>('BRIEFING');
  const [uptime, setUptime] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [events, setEvents] = useState<StressEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(['> System initialized. Monitoring daemon active...']);
  
  const tickRef = useRef<number | null>(null);
  const scenarios = SCENARIOS[pathId] || DEFAULT_SCENARIOS;

  // --- ENGINE LOGIC ---

  const addLog = (msg: string, type: 'INFO' | 'SUCCESS' | 'ERROR' = 'INFO') => {
    setLogs(prev => [`> ${new Date().toLocaleTimeString().split(' ')[0]} [${type}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const spawnEvent = () => {
    const activeCount = events.filter(e => !e.resolved).length;
    // Dynamic difficulty: Spawn more if user is doing well, less if struggling
    const spawnChance = uptime > 80 ? 0.6 : 0.3;
    
    if (activeCount < 4 && Math.random() < spawnChance) {
      const template = scenarios[Math.floor(Math.random() * scenarios.length)];
      // Prevent duplicates of same type
      if (events.some(e => e.type === template.type && !e.resolved)) return;

      const newEvent: StressEvent = {
        ...template,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        resolved: false,
      };
      setEvents(prev => [newEvent, ...prev]);
      addLog(`${newEvent.title} DETECTED: ${newEvent.symptom}`, 'ERROR');
    }
  };

  const checkConditions = () => {
    if (uptime <= 0) {
      setPhase('FAILED');
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    if (timeLeft <= 0) {
      setPhase('SUCCESS');
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
  };

  const processDecay = () => {
    let decay = 0;
    events.forEach(e => {
      if (!e.resolved) decay += e.decayRate;
    });
    setUptime(prev => Math.max(0, prev - decay));
  };

  useEffect(() => {
    if (phase === 'RUNNING') {
      tickRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
        spawnEvent();
        processDecay();
        checkConditions();
      }, 1000);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [phase, uptime, timeLeft, events]);

  // --- ACTIONS ---

  const handleAction = (actionType: string) => {
    if (!selectedEventId) {
        addLog("Select a threat from the left panel to target.", 'ERROR');
        return;
    }

    const event = events.find(e => e.id === selectedEventId);
    if (!event || event.resolved) return;

    const logic = SCENARIO_LOGIC[event.type];
    const isCorrect = logic?.valid.includes(actionType);
    const isFatal = logic?.fatal.includes(actionType);

    if (isCorrect) {
      setEvents(prev => prev.map(e => e.id === selectedEventId ? { ...e, resolved: true } : e));
      addLog(`MITIGATED: ${event.title} resolved via ${actionType}.`, 'SUCCESS');
      setUptime(prev => Math.min(100, prev + 10)); 
      setSelectedEventId(null);
    } else if (isFatal) {
      addLog(`CRITICAL ERROR: ${actionType} exacerbated ${event.title}.`, 'ERROR');
      setUptime(prev => Math.max(0, prev - 20)); // Heavy penalty
    } else {
      addLog(`INEFFECTIVE: ${actionType} has no effect on ${event.title}.`, 'INFO');
      setUptime(prev => Math.max(0, prev - 5)); // Minor penalty
    }
  };

  const getSeverityColor = (sev: StressEventSeverity) => {
    switch(sev) {
      case 'CRITICAL': return 'text-error animate-pulse';
      case 'HIGH': return 'text-orange-500';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-blue-400';
    }
  };

  const activeEvent = events.find(e => e.id === selectedEventId);

  // --- COMMAND PALETTE ---
  const COMMANDS = {
      'Network': [
          { id: 'RESTART_SERVICE', label: 'Restart Daemon' },
          { id: 'LIMIT_GOSSIP', label: 'Rate Limit Peers' },
          { id: 'BAN_PEERS', label: 'Ban IP Range' },
          { id: 'WAIT', label: 'Wait / Monitor' },
      ],
      'On-Chain': [
          { id: 'BUMP_FEE', label: 'CPFP (Bump Fee)' },
          { id: 'SWEEP_FUNDS', label: 'Sweep to Cold' },
          { id: 'MIX_COINS', label: 'CoinJoin' },
          { id: 'RESTORE_SEED', label: 'Restore Backup' },
      ],
      'Lightning': [
          { id: 'FORCE_CLOSE', label: 'Force Close' },
          { id: 'JUSTICE_TX', label: 'Broadcast Justice' },
          { id: 'VERIFY_SIG', label: 'Verify Signature' },
          { id: 'SIGN_TX', label: 'Sign & Broadcast' },
      ]
  };

  // --- VIEWS ---

  if (phase === 'BRIEFING') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#050505] text-center p-8 animate-in zoom-in duration-300">
        <div className="max-w-2xl border border-red-900/50 bg-red-950/10 p-12 rounded-3xl relative overflow-hidden">
           <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(220,38,38,0.05)_10px,rgba(220,38,38,0.05)_20px)]"></div>
           <div className="relative z-10">
               <span className="material-symbols-outlined text-6xl text-error mb-6">warning</span>
               <h1 className="text-4xl font-bold text-white font-display uppercase tracking-widest mb-4">Adversarial Mode</h1>
               <p className="text-lg text-red-200/80 mb-8 leading-relaxed">
                   <strong>{pathId.replace('_', ' ')}: FINAL EXAM</strong>
                   <br/><br/>
                   This is not a drill. You are about to enter a high-stress simulation.
                   <br/>
                   Identify the root cause of each anomaly and apply the <strong>correct protocol</strong>.
                   <br/><br/>
                   <span className="text-sm bg-black/30 px-2 py-1 rounded">Hint: Guessing is fatal. "Restarting" doesn't fix a hack.</span>
               </p>
               <div className="flex gap-4 justify-center">
                   <Button variant="ghost" onClick={onExit}>Retreat</Button>
                   <Button variant="danger" size="lg" icon="emergency" onClick={() => setPhase('RUNNING')}>
                       Start Stress Test
                   </Button>
               </div>
           </div>
        </div>
      </div>
    );
  }

  if (phase === 'FAILED') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-center p-8">
            <h1 className="text-6xl font-bold text-error font-mono mb-4">SYSTEM OFFLINE</h1>
            <p className="text-text-muted mb-8">Uptime reached 0%. Slashing Penalty Applied.</p>
            <div className="bg-surface-dark p-6 rounded-xl border border-white/10 w-full max-w-md text-left font-mono text-xs mb-8">
                 {events.filter(e => !e.resolved).map(e => (
                     <div key={e.id} className="text-error mb-2">
                         [FATAL] Unresolved: {e.title}
                     </div>
                 ))}
                 <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-error font-bold text-sm">
                     <span>FEE PENALTY:</span>
                     <span>-100 XP</span>
                 </div>
            </div>
            <div className="flex gap-4">
                 <Button variant="secondary" onClick={() => onComplete(false, 0)}>Accept Penalty</Button>
                 <Button variant="danger" onClick={() => { setUptime(100); setTimeLeft(60); setEvents([]); setPhase('BRIEFING'); setLogs([]); }}>Re-Attempt (-10 XP)</Button>
            </div>
        </div>
      );
  }

  if (phase === 'SUCCESS') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-[#0D0F12] text-center p-8">
             <div className="size-24 rounded-full bg-success/20 border-2 border-success flex items-center justify-center mb-6">
                 <span className="material-symbols-outlined text-5xl text-success">verified</span>
             </div>
             <h1 className="text-4xl font-bold text-white font-display mb-2">Survival Confirmed</h1>
             <p className="text-text-muted mb-8">System stabilized under pressure. Mastery Verified.</p>
             <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                 <div className="bg-surface-dark p-4 rounded-xl border border-white/10">
                     <div className="text-xs text-text-muted uppercase">Final Uptime</div>
                     <div className="text-2xl font-bold text-white font-mono">{Math.round(uptime)}%</div>
                 </div>
                 <div className="bg-surface-dark p-4 rounded-xl border border-white/10">
                     <div className="text-xs text-text-muted uppercase">Threats Neutralized</div>
                     <div className="text-2xl font-bold text-success font-mono">{events.filter(e => e.resolved).length}</div>
                 </div>
             </div>
             <Button variant="primary" onClick={() => onComplete(true, uptime)}>Generate Proof</Button>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-black text-white font-mono overflow-hidden relative">
      
      {/* --- DEV MODE OVERLAY --- */}
      {devMode && (
          <div className="absolute top-16 right-0 p-4 bg-purple-900/40 border-l border-b border-purple-500/30 z-50 max-w-xs pointer-events-none backdrop-blur-sm">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2 border-b border-purple-500/30 pb-1">
                  DEV: Simulation State
              </div>
              <div className="space-y-1 text-[9px] font-mono text-purple-200">
                  <div className="flex justify-between"><span>Decay Rate:</span><span>{events.filter(e=>!e.resolved).reduce((a,b)=>a+b.decayRate, 0).toFixed(2)}/sec</span></div>
                  <div className="flex justify-between"><span>Tick Rate:</span><span>1000ms</span></div>
                  <div className="flex justify-between"><span>Entropy:</span><span>{Math.random().toFixed(4)}</span></div>
                  <div className="mt-2 text-purple-400 font-bold">Active Event Vector:</div>
                  {events.filter(e => !e.resolved).map(e => (
                      <div key={e.id} className="pl-2 border-l border-purple-500/50">
                          ID: {e.id} | TYPE: {e.type}<br/>
                          SOL: {SCENARIO_LOGIC[e.type]?.valid[0]}
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Top Bar: Metrics */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#050505] shrink-0 relative z-10">
          <div className="flex items-center gap-4">
              <span className="text-error font-bold uppercase tracking-widest animate-pulse">Live Incident</span>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="text-sm text-text-muted">T-Minus: <span className="text-white font-bold">{timeLeft}s</span></div>
          </div>
          <div className="flex items-center gap-4">
              <span className="text-xs text-text-muted uppercase">Network Uptime</span>
              <div className="w-48 h-4 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className={`h-full transition-all duration-300 ${uptime > 60 ? 'bg-success' : uptime > 30 ? 'bg-warning' : 'bg-error'}`} 
                    style={{ width: `${uptime}%` }}
                  ></div>
              </div>
              <span className={`font-bold ${uptime < 30 ? 'text-error' : 'text-white'}`}>{Math.round(uptime)}%</span>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel: Active Threats */}
          <div className="w-80 border-r border-white/10 bg-[#0A0A0A] flex flex-col shrink-0">
              <div className="p-3 border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-text-muted">
                  Active Signals ({events.filter(e => !e.resolved).length})
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {events.filter(e => !e.resolved).length === 0 && (
                      <div className="p-4 text-center text-text-muted text-xs italic opacity-50">
                          No active anomalies detected.
                      </div>
                  )}
                  {events.filter(e => !e.resolved).map(e => (
                      <div 
                        key={e.id}
                        onClick={() => setSelectedEventId(e.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedEventId === e.id 
                                ? 'bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                                : 'bg-black border-white/10 hover:border-white/20'
                        }`}
                      >
                          <div className="flex justify-between items-start mb-2">
                              <span className={`text-[10px] font-bold border px-1.5 rounded ${getSeverityColor(e.severity)} border-current`}>
                                  {e.severity}
                              </span>
                              <span className="text-[10px] text-text-muted">{e.timestamp}</span>
                          </div>
                          <h4 className="font-bold text-sm mb-1">{e.title}</h4>
                          <p className="text-[10px] text-text-muted leading-relaxed opacity-80">{e.symptom}</p>
                      </div>
                  ))}
              </div>
          </div>

          {/* Center Panel: Visualization & Logs */}
          <div className="flex-1 flex flex-col relative bg-black min-w-0">
              {/* Fake Network Graph Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 border border-white/20 rounded-full flex items-center justify-center">
                      <div className="size-48 border border-white/20 rounded-full flex items-center justify-center">
                          <div className="size-32 border border-white/20 rounded-full animate-pulse"></div>
                      </div>
                  </div>
              </div>

              {/* Central Status Node */}
              <div className="flex-1 flex flex-col items-center justify-center z-10 p-8">
                   <div className={`size-32 rounded-full border-4 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 mb-8 ${
                       activeEvent ? 'border-red-500 bg-red-900/20 shadow-red-900/40' : 'border-blue-500 bg-blue-900/10'
                   }`}>
                       <span className="material-symbols-outlined text-4xl mb-1 text-white">
                           {activeEvent ? 'warning' : 'dns'}
                       </span>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                           {activeEvent ? 'ALERT' : 'ONLINE'}
                       </span>
                   </div>
                   
                   {activeEvent && (
                       <div className="bg-black/80 backdrop-blur border border-red-500/30 p-4 rounded-xl max-w-lg text-center animate-in slide-in-from-bottom-4">
                           <h3 className="text-red-400 font-bold mb-1">TARGET LOCKED: {activeEvent.title}</h3>
                           <p className="text-xs text-text-muted">Identify the root cause ({activeEvent.rootCause}) and select the appropriate counter-measure below.</p>
                       </div>
                   )}
              </div>

              {/* Logs */}
              <div className="h-48 border-t border-white/10 bg-[#050505] p-4 font-mono text-[10px] overflow-y-auto shrink-0">
                  {logs.map((log, i) => (
                      <div key={i} className={`mb-1 ${log.includes('ERROR') ? 'text-error' : log.includes('WARN') ? 'text-warning' : log.includes('SUCCESS') ? 'text-success' : 'text-text-muted'}`}>
                          {log}
                      </div>
                  ))}
              </div>
          </div>

      </div>

      {/* Bottom Panel: Command Center */}
      <div className="h-48 bg-[#0D0F12] border-t border-white/10 p-4 shrink-0">
          <div className="grid grid-cols-3 gap-4 h-full">
              
              {/* Category 1: Network */}
              <div className="bg-surface-dark border border-white/5 rounded-xl p-2 flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-text-muted uppercase px-2 mb-1">Network Layer</div>
                  <div className="grid grid-cols-2 gap-2 flex-1">
                      {COMMANDS.Network.map(cmd => (
                          <button
                            key={cmd.id}
                            onClick={() => handleAction(cmd.id)}
                            className="bg-black hover:bg-white/5 border border-white/10 rounded flex items-center justify-center text-xs font-bold transition-colors text-blue-200"
                          >
                              {cmd.label}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Category 2: On-Chain */}
              <div className="bg-surface-dark border border-white/5 rounded-xl p-2 flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-text-muted uppercase px-2 mb-1">Chain / Wallet</div>
                  <div className="grid grid-cols-2 gap-2 flex-1">
                      {COMMANDS['On-Chain'].map(cmd => (
                          <button
                            key={cmd.id}
                            onClick={() => handleAction(cmd.id)}
                            className="bg-black hover:bg-white/5 border border-white/10 rounded flex items-center justify-center text-xs font-bold transition-colors text-orange-200"
                          >
                              {cmd.label}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Category 3: Lightning */}
              <div className="bg-surface-dark border border-white/5 rounded-xl p-2 flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-text-muted uppercase px-2 mb-1">Lightning / Channel</div>
                  <div className="grid grid-cols-2 gap-2 flex-1">
                      {COMMANDS.Lightning.map(cmd => (
                          <button
                            key={cmd.id}
                            onClick={() => handleAction(cmd.id)}
                            className="bg-black hover:bg-white/5 border border-white/10 rounded flex items-center justify-center text-xs font-bold transition-colors text-purple-200"
                          >
                              {cmd.label}
                          </button>
                      ))}
                  </div>
              </div>

          </div>
      </div>

    </div>
  );
};