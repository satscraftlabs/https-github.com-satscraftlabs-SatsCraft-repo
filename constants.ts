

import { Module, Path, PathId } from './types';

export const PATHS: Path[] = [
  {
    id: PathId.SOVEREIGN,
    title: "Bitcoin Sovereign",
    description: "The mandatory starting point. Master self-custody, UTXOs, and the basics of the timechain.",
    icon: "key",
    activeLearners: "12.4K",
    modules: [
      { id: '1.1', title: 'The Role of Money', description: 'Money as a tool for coordination. Scarcity, opportunity cost, and the social contract.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Beginner', estimatedTime: '15m', xp: 150 },
      { id: '1.2', title: 'Flaws of Fiat', description: 'Evolution from commodity to fiat. Inflation, Cantillon effect, and centralized control.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Beginner', estimatedTime: '15m', xp: 200 },
      { id: '1.3', title: 'Bitcoin Origins', description: 'Cypherpunk roots, Nakamoto consensus, and the 21M hard cap.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '20m', xp: 250 },
      { id: '1.4', title: 'Self-Custody Basics', description: 'Keys vs Coins. The risks of third parties and the necessity of verification.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '20m', xp: 300 },
      { id: '1.5', title: 'Wallet Security', description: 'Backup strategies, seed storage, and threat modeling.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '20m', xp: 300 },
      { id: '1.6', title: 'Nodes & Rules', description: 'Verification vs Trust. Why running a node matters.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '15m', xp: 250 },
      { id: '1.7', title: 'Mining & Physics', description: 'Proof of Work, energy, and difficulty adjustment.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '20m', xp: 300 },
      { id: '1.8', title: 'Threat Awareness', description: 'Phishing, malware, and identifying scams.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '15m', xp: 250 },
      { id: '1.9', title: 'Lightning Intro', description: 'Scaling via payment channels and instant settlement.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '15m', xp: 250 },
      { id: '1.10', title: 'Real World Usage', description: 'Circular economies and political neutrality.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Beginner', estimatedTime: '10m', xp: 200 },
      { id: '1.11', title: 'Sovereignty', description: 'Freedom vs convenience. The final mindset shift.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '20m', xp: 500 },
    ]
  },
  {
    id: PathId.WALLET_MASTERY,
    title: "Wallet Mastery",
    description: "Operational wallet competence. Avoid loss, master multisig, and recover from disaster.",
    icon: "account_balance_wallet",
    activeLearners: "8.2K",
    modules: [
      { id: '2.1', title: 'Wallet Architecture', description: 'HD Wallets, BIP39, and Entropy. Design your fortress.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '20m', xp: 300 },
      { id: '2.2', title: 'Backup & Recovery', description: 'Shamir schemes, inheritance planning, and duress protocols.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '25m', xp: 350 },
      { id: '2.3', title: 'Multisig Operations', description: 'M-of-N thresholds, coordination, and script types.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '30m', xp: 500 },
      { id: '2.4', title: 'Hygiene & Auditing', description: 'Coin control, dust attacks, and verifying against your own node.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '20m', xp: 400 },
    ]
  },
  {
    id: PathId.PROTOCOL_ENGINEER,
    title: "Protocol Engineer",
    description: "Build directly on the timechain. Master consensus rules, scripting, and game theory.",
    icon: "terminal",
    activeLearners: "1.2K",
    modules: [
        { id: '3.1', title: 'Consensus & Validation', description: 'Block validity, soft/hard forks, and SPV limits.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '35m', xp: 600 },
        { id: '3.2', title: 'UTXO Mechanics', description: 'State transitions, coin creation, and orphan blocks.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Adv.', estimatedTime: '30m', xp: 600 },
        { id: '3.3', title: 'Script Language', description: 'Stack-based logic, P2SH, and Taproot upgrades.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '40m', xp: 700 },
        { id: '3.4', title: 'Incentives & Game Theory', description: 'Miner rewards, 51% attacks, and fee sniping.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '30m', xp: 650 }
    ]
  },
  {
    id: PathId.LIGHTNING_OPERATOR,
    title: "Lightning Operator",
    description: "Manage liquidity and routing. Optimize channels for high-speed throughput.",
    icon: "bolt",
    activeLearners: "1.8K",
    modules: [
      { id: '4.1', title: 'Lightning Protocol Basics', description: 'Payment channels, HTLCs, and onion routing fundamentals.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '20m', xp: 300 },
      { id: '4.2', title: 'Node Ops & Config', description: 'Backend choices, fee policies, and critical monitoring.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Adv.', estimatedTime: '25m', xp: 400 },
      { id: '4.3', title: 'Liquidity & Economics', description: 'Rebalancing strategies and routing fee optimization.', type: 'LAB', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '30m', xp: 600 },
      { id: '4.4', title: 'Advanced Ops & Risks', description: 'Splicing, submarine swaps, and channel jamming mitigation.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '35m', xp: 650 }
    ]
  },
  {
    id: PathId.SOVEREIGN_MERCHANT,
    title: "Sovereign Merchant",
    description: "Accept Bitcoin without intermediaries. Manage volatility and treasury.",
    icon: "storefront",
    activeLearners: "3.5K",
    modules: [
        { id: '5.1', title: 'Merchant Architecture', description: 'BTCPay Server, invoice logic, and privacy preservation.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '25m', xp: 350 },
        { id: '5.2', title: 'Treasury & Volatility', description: 'Hedging strategies, cold storage thresholds, and accounting.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '30m', xp: 450 },
        { id: '5.3', title: 'Customer Dispute Flows', description: 'Refunds, underpayments, and handling "chargebacks".', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '20m', xp: 300 },
        { id: '5.4', title: 'Scaling & Compliance', description: 'Circular economies, multi-node setups, and regulatory resilience.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Adv.', estimatedTime: '30m', xp: 500 }
    ]
  },
  {
    id: PathId.SECURITY_PRACTITIONER,
    title: "Security Practitioner",
    description: "Audit smart contracts and secure cold storage. Defend against attack vectors.",
    icon: "security",
    activeLearners: "1.5K",
    modules: [
      { id: '6.1', title: 'Threat Modeling Basics', description: 'Adversary types, attack surfaces, and risk matrices.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '20m', xp: 350 },
      { id: '6.2', title: 'Key & Device Defense', description: 'Malware mitigation, clipboard protection, and evil maid attacks.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Adv.', estimatedTime: '30m', xp: 500 },
      { id: '6.3', title: 'Social Engineering', description: 'Phishing sims and authority impersonation defense.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '15m', xp: 400 },
      { id: '6.4', title: 'Recovery & Incident Response', description: 'Breach containment, forensics, and post-mortems.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '35m', xp: 600 }
    ]
  },
  {
    id: PathId.P2P_MARKET,
    title: "P2P Market Operator",
    description: "Operate safely in peer-to-peer markets. Reputation, escrow, and dispute resolution.",
    icon: "handshake",
    activeLearners: "900",
    modules: [
        { id: '7.1', title: 'P2P Trading Fundamentals', description: 'Trade types, pricing premiums, and verification hygiene.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '20m', xp: 350 },
        { id: '7.2', title: 'Escrow & Dispute Resolution', description: 'Multisig escrow logic, dispute evidence, and bond slashing.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Adv.', estimatedTime: '30m', xp: 500 },
        { id: '7.3', title: 'Reputation Dynamics', description: 'Market making, liquidity provision, and trust scoring.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '25m', xp: 450 },
        { id: '7.4', title: 'Regulatory & Adversarial Ops', description: 'Evasion, ban resilience, and decentralized market design.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '35m', xp: 600 }
    ]
  },
  {
    id: PathId.COMMUNITY_BUILDER,
    title: "Community Builder",
    description: "Build resilient Bitcoin circular economies and manage social consensus.",
    icon: "groups",
    activeLearners: "2.1K",
    modules: [
        { id: '8.1', title: 'Education System Design', description: 'Curriculum building, active learning, and combating misinformation.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Intermediate', estimatedTime: '25m', xp: 300 },
        { id: '8.2', title: 'Governance & Conflict', description: 'Rough consensus, fork resolution, and treasury management.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Adv.', estimatedTime: '30m', xp: 450 },
        { id: '8.3', title: 'Circular Economy Construction', description: 'Merchant loops, local incentives, and velocity metrics.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '35m', xp: 500 },
        { id: '8.4', title: 'Social Resilience', description: 'Defending against FUD, infiltration, and growth stress.', type: 'SIMULATION', status: 'AVAILABLE', difficulty: 'Expert', estimatedTime: '20m', xp: 400 }
    ]
  }
];

export const INITIAL_USER_STATE = {
  reputation: 0,
  rank: "Pleb",
  completedModules: [],
  currentPath: PathId.SOVEREIGN,
  streak: 0,
  lastActive: new Date().toISOString(),
  lastDailyClaim: undefined,
  notifications: []
};

export const RANK_TIERS = [
  { id: 'PLEB', title: 'Plebeian', minXp: 0, icon: 'person', description: 'Just started the journey. Zero competence proven yet.' },
  { id: 'SHRIMP', title: 'Shrimp', minXp: 1000, icon: 'water_drop', description: 'Accumulating the first sats of knowledge. Basic survival skills.' },
  { id: 'CRAB', title: 'Crab', minXp: 5000, icon: 'bug_report', description: 'Pinching weak hands. Capable of self-custody and basic node ops.' },
  { id: 'OCTOPUS', title: 'Octopus', minXp: 10000, icon: 'waves', description: 'Multitasking across layers. Can handle Lightning and on-chain simultaneously.' },
  { id: 'DOLPHIN', title: 'Dolphin', minXp: 25000, icon: 'surfing', description: 'Swimming gracefully through mempools. Expert fee management.' },
  { id: 'SHARK', title: 'Shark', minXp: 50000, icon: 'dangerous', description: 'Dominating P2P markets. Arbitrage and routing master.' },
  { id: 'WHALE', title: 'Whale', minXp: 100000, icon: 'tsunami', description: 'Moving the market. Deep protocol understanding and security architecture.' },
  { id: 'KEEPER', title: 'Citadel Keeper', minXp: 500000, icon: 'castle', description: 'Guardian of consensus. The highest level of operational sovereignity.' },
];

export const MOCK_RANK_DISTRIBUTION: Record<string, number> = {
  'PLEB': 14205,
  'SHRIMP': 8430,
  'CRAB': 4100,
  'OCTOPUS': 2150,
  'DOLPHIN': 850,
  'SHARK': 320,
  'WHALE': 55,
  'KEEPER': 3
};

export const MOCK_LEADERBOARD = [
  { rank: 1, name: "Satoshi_Vz", xp: 1250000, pubkey: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
  { rank: 2, name: "Hal_Finney_AI", xp: 1180000, pubkey: "bc1q5p7t5y8j4k9l2m3n4o5p6q7r8s9t0u1v2w3x4y" },
  { rank: 3, name: "Wei_Dai_Sim", xp: 1150000, pubkey: "bc1q9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h" },
  { rank: 4, name: "Szabo_Oracle", xp: 980000, pubkey: "bc1q1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s" },
  { rank: 5, name: "Back_Hash", xp: 920000, pubkey: "bc1q2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t" },
];