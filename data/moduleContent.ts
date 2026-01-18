

import { ModuleContent } from '../types';

export const MODULE_CONTENT: Record<string, ModuleContent> = {
  // --- PATH 1: SOVEREIGN ---
  '1.1': {
    id: '1.1',
    steps: [
      {
        id: 's1',
        title: 'The Barter Simulation',
        explanation: 'You are in a village. You have shoes. You want apples. The apple seller doesn\'t want shoes—they want salt. You must find a salt seller who wants shoes.\n\nThis friction is the "Double Coincidence of Wants". It halts trade and limits specialization.',
        question: 'In a barter system, why does economic activity stall?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'People are lazy', isCorrect: false, feedback: 'Incorrect. People want to trade, but the mechanism prevents it.' },
            { id: 'o2', label: 'Coincidence of Wants', isCorrect: true, feedback: 'Correct. Finding a perfect mutual match for every trade is statistically impossible at scale.' },
            { id: 'o3', label: 'Lack of Goods', isCorrect: false, feedback: 'Goods exist, but they cannot move because the medium of exchange is missing.' }
        ]
      },
      {
        id: 's2',
        title: 'Time Preference & Opportunity Cost',
        explanation: 'Money allows you to store labor from today and spend it next year. If money loses value (inflation), you are forced to spend now (High Time Preference).\n\nGood money rewards "Low Time Preference"—delaying gratification to build capital for the future.',
        question: 'How does high time preference (spending now) affect long-term wealth?',
        visualType: 'TIMELINE',
        options: [
            { id: 'o1', label: 'It builds capital', isCorrect: false, feedback: 'Spending consumes capital. Saving builds it.' },
            { id: 'o2', label: 'It destroys capital', isCorrect: true, feedback: 'Correct. Consuming seed corn today means no harvest tomorrow. Sound money encourages saving.' },
            { id: 'o3', label: 'It has no effect', isCorrect: false, feedback: 'Every economic action has an opportunity cost.' }
        ]
      },
      {
        id: 's3',
        title: 'Scarcity: Natural vs Artificial',
        explanation: 'For something to be a Store of Value, it must be scarce. \n\nGold has "Natural Scarcity" (physics/geology). \nFiat has "Artificial Scarcity" (laws/politicians). \nBitcoin has "Mathematical Scarcity" (code/consensus).',
        question: 'Why is artificial scarcity (Fiat) historically unreliable?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'It is too rigid', isCorrect: false, feedback: 'Fiat is the opposite of rigid; it is elastic.' },
            { id: 'o2', label: 'Human temptation', isCorrect: true, feedback: 'Correct. Those with the power to print money always succumb to the temptation to print more.' },
            { id: 'o3', label: 'It costs too much', isCorrect: false, feedback: 'Fiat is cheap to produce, which is exactly the problem.' }
        ]
      }
    ]
  },
  '1.2': {
    id: '1.2',
    steps: [
      {
        id: 's1',
        title: 'The Cantillon Effect',
        explanation: 'When new money is printed, it is not distributed evenly. It goes to banks and government contractors first.\n\nThey buy assets at current prices. By the time the money reaches you (wages), prices have risen. Inflation is a wealth transfer from the poor to the connected.',
        question: 'Who benefits most from money printing?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Savers', isCorrect: false, feedback: 'Savers are punished as their purchasing power dilutes.' },
            { id: 'o2', label: 'First Receivers', isCorrect: true, feedback: 'Correct. Those closest to the printer buy assets before inflation hits prices.' }
        ]
      },
      {
        id: 's2',
        title: 'Debasement History',
        explanation: 'From Roman Denarius clipping to the Weimar Republic printing press, every fiat currency in history has eventually trended to zero.\n\nGovernments choose inflation over taxation because it is invisible to the uneducated.',
        question: 'Why do governments prefer inflation over direct taxes?',
        visualType: 'TIMELINE',
        options: [
            { id: 'o1', label: 'It is easier to hide', isCorrect: true, feedback: 'Correct. Direct taxes cause revolts. Inflation is blamed on "greedy corporations" or "supply chains".' },
            { id: 'o2', label: 'It is fairer', isCorrect: false, feedback: 'It is the most regressive tax, hurting the poor the most.' }
        ]
      }
    ]
  },
  '1.3': {
    id: '1.3',
    steps: [
      {
        id: 's1',
        title: 'The Byzantine Generals Problem',
        explanation: 'Before Bitcoin, digital cash had a "Double Spend" problem. You needed a central server (Visa/PayPal) to prevent copying money.\n\nSatoshi Nakamoto solved this with Proof of Work, allowing decentralized consensus without a leader.',
        question: 'What does Proof of Work solve?',
        visualType: 'BLOCKCHAIN',
        options: [
            { id: 'o1', label: 'Transaction speed', isCorrect: false, feedback: 'PoW is intentionally slow to ensure security.' },
            { id: 'o2', label: 'Trustless Consensus', isCorrect: true, feedback: 'Correct. It allows strangers to agree on the ledger state without a middleman.' }
        ]
      },
      {
        id: 's2',
        title: 'The 21 Million Cap',
        explanation: 'There will never be more than 21,000,000 BTC. This is enforced by nodes, not miners.\n\nIf miners try to print more, the nodes reject their blocks. The supply schedule is unchangeable.',
        question: 'Who enforces the 21M limit?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'The CEO of Bitcoin', isCorrect: false, feedback: 'There is no CEO.' },
            { id: 'o2', label: 'Full Nodes', isCorrect: true, feedback: 'Correct. Every user running a node validates the rules.' }
        ]
      }
    ]
  },
  '1.4': {
    id: '1.4',
    steps: [
      {
        id: 's1',
        title: 'Not Your Keys, Not Your Coins',
        explanation: 'When you leave coins on an exchange, you do not own Bitcoin. You own an IOU.\n\nExchanges can be hacked, regulated, or go bankrupt. Self-custody is the only way to truly own your wealth.',
        question: 'Who controls the Bitcoin on an exchange?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'You do', isCorrect: false, feedback: 'Incorrect. You only have a login. They have the keys.' },
            { id: 'o2', label: 'The Exchange', isCorrect: true, feedback: 'Correct. If they pause withdrawals, you have nothing.' }
        ]
      },
      {
        id: 's2',
        title: 'Public vs Private Keys',
        explanation: 'A Public Key is like your email address (receive funds). A Private Key is like your password (send funds).\n\nNever share your Private Key. You can share your Public Key freely.',
        question: 'What happens if you share your Private Key?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Funds are stolen', isCorrect: true, feedback: 'Correct. Anyone with the key can spend the funds.' },
            { id: 'o2', label: 'Nothing', isCorrect: false, feedback: 'Your wallet is compromised immediately.' }
        ]
      }
    ]
  },
  '1.5': {
    id: '1.5',
    steps: [
      {
        id: 's1',
        title: 'Entropy & The Seed',
        explanation: 'Your 12 or 24 words represent a number so huge it cannot be guessed.\n\nHumans are bad at randomness. Never create a seed from your brain (e.g., "password123"). Always use high-quality entropy (dice, hardware RNG).',
        question: 'Is "Correct Horse Battery Staple" a good seed?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Yes', isCorrect: false, feedback: 'No. Brain wallets are easily cracked by computers.' },
            { id: 'o2', label: 'No', isCorrect: true, feedback: 'Correct. Always let math generate the randomness.' }
        ]
      },
      {
        id: 's2',
        title: 'The $5 Wrench Attack',
        explanation: 'Cryptography cannot stop physical violence. If someone threatens you, you will give up your password.\n\nSolution: Passphrases (the "25th word"). This creates a hidden wallet. You can give the attacker the "decoy" wallet with a small amount.',
        question: 'What does a BIP39 Passphrase do?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Encrypts the seed', isCorrect: false, feedback: 'Technically yes, but functionally it creates a completely different wallet.' },
            { id: 'o2', label: 'Creates a hidden wallet', isCorrect: true, feedback: 'Correct. The same seed + different passphrase = completely different addresses.' }
        ]
      }
    ]
  },
  '1.6': {
    id: '1.6',
    steps: [
      {
        id: 's1',
        title: 'Don\'t Trust, Verify',
        explanation: 'If you use a centralized wallet (like Coinbase or a default Light Wallet), you are asking *their* node what your balance is.\n\nThey can lie to you. Running your own node means you download the blockchain and verify every transaction yourself.',
        question: 'Why run a node if you aren\'t a miner?',
        visualType: 'BLOCKCHAIN',
        options: [
            { id: 'o1', label: 'To earn fees', isCorrect: false, feedback: 'Only miners earn block rewards/fees.' },
            { id: 'o2', label: 'To ensure financial sovereignty', isCorrect: true, feedback: 'Correct. A node ensures you are interacting with the real Bitcoin network, not a fake one.' }
        ]
      }
    ]
  },
  '1.7': {
    id: '1.7',
    steps: [
      {
        id: 's1',
        title: 'Energy as Security',
        explanation: 'Mining converts electricity into security. The more energy spent, the harder it is to rewrite the chain (51% attack).\n\nBitcoin does not "waste" energy; it uses energy to secure the first incorruptible monetary network.',
        question: 'What happens if we lower the energy usage?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Security decreases', isCorrect: true, feedback: 'Correct. Lower cost to attack means the ledger is less secure.' },
            { id: 'o2', label: 'Price goes up', isCorrect: false, feedback: 'Price is correlated with utility and security, not just efficiency.' }
        ]
      }
    ]
  },
  '1.8': {
    id: '1.8',
    steps: [
      {
        id: 's1',
        title: 'The Giveaway Scam',
        explanation: '"Send 1 BTC, get 2 BTC back!"\n\nThis is the most common scam. There is no such thing as free money. Vitalik, Elon, or Saylor will never ask you to send them crypto.',
        question: 'You see a Youtube Live of Michael Saylor promising to double your coins. Real?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Scam', isCorrect: true, feedback: 'Correct. Deepfakes are common. Never send money to receive money.' },
            { id: 'o2', label: 'Maybe Real', isCorrect: false, feedback: 'Incorrect. It is 100% a scam.' }
        ]
      }
    ]
  },
  '1.9': {
    id: '1.9',
    steps: [
      {
        id: 's1',
        title: 'Scaling Layers',
        explanation: 'Bitcoin base layer (L1) is for final settlement. It is slow and expensive, like a wire transfer.\n\nLightning (L2) is for coffee. It is instant and cheap, like Visa, but decentralized.',
        question: 'Should you buy coffee on-chain?',
        visualType: 'TIMELINE',
        options: [
            { id: 'o1', label: 'No', isCorrect: true, feedback: 'Correct. Paying a $5 fee for a $3 coffee makes no sense. Use Lightning.' },
            { id: 'o2', label: 'Yes', isCorrect: false, feedback: 'You will clog the blocks and waste money.' }
        ]
      }
    ]
  },
  '1.10': {
    id: '1.10',
    steps: [
      {
        id: 's1',
        title: 'Circular Economy',
        explanation: 'If you earn in Fiat and buy Bitcoin, you pay exchange fees.\n\nIf you EARN Bitcoin directly, you skip the exchange and the KYC. Spending Bitcoin at merchants who keep it closes the loop.',
        question: 'What is the most sovereign way to acquire Bitcoin?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Buying on Coinbase', isCorrect: false, feedback: 'This links your ID to your coins.' },
            { id: 'o2', label: 'Earning it', isCorrect: true, feedback: 'Correct. Trading value for value preserves privacy.' }
        ]
      }
    ]
  },
  '1.11': {
    id: '1.11',
    steps: [
      {
        id: 's1',
        title: 'The Sovereign Mindset',
        explanation: 'Bitcoin is responsibility. There is no "Forgot Password" button. There is no bank to reverse a fraud.\n\nThis scares some, but empowers others. You are the central bank.',
        question: 'Who is responsible if you lose your keys?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'The Protocol Developers', isCorrect: false, feedback: 'Code is law, but custody is yours.' },
            { id: 'o2', label: 'You', isCorrect: true, feedback: 'Correct. Extreme ownership is the price of freedom.' }
        ]
      }
    ]
  },

  // --- PATH 2: WALLET MASTERY ---
  '2.1': {
    id: '2.1',
    steps: [
      {
        id: 's1',
        title: 'Hot vs Cold Wallets',
        explanation: 'A Hot Wallet is connected to the internet (Mobile App). Convenient but hackable.\n\nA Cold Wallet (Hardware) keeps keys offline. The internet never sees your seed.',
        question: 'Where should you keep your life savings?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Hot Wallet', isCorrect: false, feedback: 'Too risky for large amounts.' },
            { id: 'o2', label: 'Cold Storage', isCorrect: true, feedback: 'Correct. Offline keys are immune to remote hackers.' }
        ]
      }
    ]
  },
  '2.2': {
    id: '2.2',
    steps: [
      {
        id: 's1',
        title: 'Steel vs Paper',
        explanation: 'Paper burns. Ink fades. Water destroys.\n\nFor long-term storage, stamp your seed words into stainless steel or titanium. It must survive a house fire.',
        question: 'Is a paper backup sufficient for 10 years?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'No', isCorrect: true, feedback: 'Correct. Environmental decay is a real threat.' },
            { id: 'o2', label: 'Yes', isCorrect: false, feedback: 'Only if stored in a bank vault, which adds third-party risk.' }
        ]
      }
    ]
  },
  '2.3': {
    id: '2.3',
    steps: [
      {
        id: 's1',
        title: 'Single Points of Failure',
        explanation: 'A standard wallet has one key. If you lose it, money gone. If stolen, money gone.\n\nMultisig (2-of-3) requires 2 keys to spend. You can lose one key and still recover funds.',
        question: 'What is the main benefit of Multisig?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Faster transactions', isCorrect: false, feedback: 'Multisig is slightly slower/more complex.' },
            { id: 'o2', label: 'Fault Tolerance', isCorrect: true, feedback: 'Correct. It removes the single point of failure.' }
        ]
      }
    ]
  },
  '2.4': {
    id: '2.4',
    steps: [
      {
        id: 's1',
        title: 'Coin Control',
        explanation: 'Your wallet balance is made of chunks (UTXOs). Some might be KYC\'d (from exchange), some non-KYC.\n\nIf you combine them in one transaction, you link your identities. Coin Control allows you to select which chunks to spend.',
        question: 'Why separate KYC and non-KYC coins?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Privacy', isCorrect: true, feedback: 'Correct. Prevent chain analysis from clustering your activity.' },
            { id: 'o2', label: 'Fees', isCorrect: false, feedback: 'Fees depend on data size, not privacy.' }
        ]
      }
    ]
  },

  // --- PATH 3: PROTOCOL ENGINEER ---
  '3.1': {
    id: '3.1',
    steps: [
      {
        id: 's1',
        title: 'Soft Fork vs Hard Fork',
        explanation: 'A Soft Fork tightens rules (backward compatible). Old nodes still accept new blocks.\n\nA Hard Fork loosens rules (not compatible). Old nodes reject new blocks, splitting the chain.',
        question: 'Which upgrade type is safer for network cohesion?',
        visualType: 'BLOCKCHAIN',
        options: [
            { id: 'o1', label: 'Soft Fork', isCorrect: true, feedback: 'Correct. It avoids splitting the community and currency.' },
            { id: 'o2', label: 'Hard Fork', isCorrect: false, feedback: 'Incorrect. Hard forks force users to choose sides.' }
        ]
      },
      {
        id: 's2',
        title: 'Scenario: The Block Size War',
        explanation: 'A group of miners wants to increase the block size from 1MB to 8MB (Hard Fork). Your node enforces the 1MB rule.\n\nThe miners produce an 8MB block. What does your node do?',
        question: 'How does your 1MB-rule node react to an 8MB block?',
        visualType: 'BLOCKCHAIN',
        options: [
            { id: 'o1', label: 'Accept it', isCorrect: false, feedback: 'Your node checks the size, sees 8MB > 1MB, and must reject it.' },
            { id: 'o2', label: 'Reject & Ban', isCorrect: true, feedback: 'Correct. To your node, the block is invalid. It bans the peer that sent it.' }
        ]
      },
      {
        id: 's3',
        title: 'Chain Split Consequences',
        explanation: 'Because 60% of miners switched to 8MB, and 40% stayed on 1MB, the blockchain has split into two separate paths sharing the same history up to block #800.\n\nWithout "Replay Protection", a transaction signed on one chain is valid on the other.',
        question: 'You send 1 BTC to Bob on the Fork chain. What might happen on the Legacy chain?',
        visualType: 'NETWORK_SPLIT',
        options: [
            { id: 'o1', label: 'Nothing', isCorrect: false, feedback: 'Since you use the same Private Key on both chains, the signature is valid on both.' },
            { id: 'o2', label: 'Accidental Spend', isCorrect: true, feedback: 'Correct. This is a "Replay Attack". You intended to spend Fork-Coin, but also spent your Legacy-Coin.' }
        ]
      }
    ]
  },
  '3.2': {
    id: '3.2',
    steps: [
      {
        id: 's1',
        title: 'Anatomy of a UTXO',
        explanation: 'Bitcoin uses Unspent Transaction Outputs. You don\'t have a "balance"; you have a pile of checks written to you.\n\nTo spend 0.5 BTC, you might have to melt down a 1.0 BTC coin and send 0.5 to yourself as "change".',
        question: 'What happens to the change in a transaction?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'It disappears', isCorrect: false, feedback: 'No, that would be deflationary/loss.' },
            { id: 'o2', label: 'Sent to a new address you control', isCorrect: true, feedback: 'Correct. Change addresses are automatically generated by your wallet.' }
        ]
      }
    ]
  },
  // 3.3 is BUILDER_CONTENT
  '3.4': {
    id: '3.4',
    steps: [
      {
        id: 's1',
        title: 'The Nash Equilibrium',
        explanation: 'Miners engage in a game where honesty is profitable and cheating is expensive.\n\nIf a miner tries to cheat (double spend), they waste electricity and their block is rejected. They lose money.',
        question: 'What secures Bitcoin?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Goodwill', isCorrect: false, feedback: 'Hope is not a strategy.' },
            { id: 'o2', label: 'Greed/Incentives', isCorrect: true, feedback: 'Correct. The system aligns self-interest with network security.' }
        ]
      }
    ]
  },

  // --- PATH 4: LIGHTNING OPERATOR ---
  '4.1': {
    id: '4.1',
    steps: [
      {
        id: 's1',
        title: 'Payment Channels',
        explanation: 'A Lightning channel is a 2-of-2 multisig address. Both parties put money in.\n\nTo pay, you don\'t move funds on blockchain; you just update the local balance sheet signed by both parties.',
        question: 'When does a Lightning tx hit the blockchain?',
        visualType: 'TIMELINE',
        options: [
            { id: 'o1', label: 'Every transaction', isCorrect: false, feedback: 'That is L1.' },
            { id: 'o2', label: 'Only on Open/Close', isCorrect: true, feedback: 'Correct. Millions of trades can happen between the opening and closing transactions.' }
        ]
      }
    ]
  },
  // 4.2 is BUILDER, 4.3 is LAB
  '4.4': {
    id: '4.4',
    steps: [
      {
        id: 's1',
        title: 'Channel Management',
        explanation: 'Routing nodes earn fees by forwarding payments. If your channel is empty on one side, you cannot route in that direction.\n\n"Rebalancing" is the art of keeping liquidity fluid.',
        question: 'What happens if your local balance is 0?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'You can only receive', isCorrect: true, feedback: 'Correct. You have no funds to push to the other side.' },
            { id: 'o2', label: 'You can only send', isCorrect: false, feedback: 'You need local balance to send.' }
        ]
      }
    ]
  },

  // --- PATH 5: SOVEREIGN MERCHANT ---
  // 5.1 is BUILDER
  '5.2': {
    id: '5.2',
    steps: [
      {
        id: 's1',
        title: 'Volatility Management',
        explanation: 'Merchants have bills in Fiat. If Bitcoin drops 10%, they lose margin.\n\nStrategy: Auto-convert percentage of sales to Fiat/Stablecoins to cover costs, keep profit in BTC.',
        question: 'Why not keep 100% in BTC?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Operational Risk', isCorrect: true, feedback: 'Correct. Short term volatility can bankrupt a business with tight margins.' },
            { id: 'o2', label: 'BTC is bad money', isCorrect: false, feedback: 'BTC is good money, but volatility is the price of price discovery.' }
        ]
      }
    ]
  },
  '5.3': {
    id: '5.3',
    steps: [
      {
        id: 's1',
        title: 'Proof of Payment',
        explanation: 'In Lightning, the "Preimage" is a cryptographic proof that you paid an invoice. \n\nIf a customer claims "I paid but didn\'t get the product", you ask for the preimage. If they have it, they paid.',
        question: 'Can a customer fake a preimage?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'No', isCorrect: true, feedback: 'Correct. It is cryptographically generated by the receiver (you) and only revealed upon payment.' },
            { id: 'o2', label: 'Yes', isCorrect: false, feedback: 'Impossible in the protocol.' }
        ]
      }
    ]
  },
  '5.4': {
    id: '5.4',
    steps: [
      {
        id: 's1',
        title: 'Regulatory Defense',
        explanation: 'Using a self-hosted BTCPay Server keeps your customer data private.\n\nUsing a third-party processor (BitPay) leaks customer data and allows the processor to block payments.',
        question: 'Why self-host payments?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Censorship Resistance', isCorrect: true, feedback: 'Correct. No one can stop a payment to your own node.' },
            { id: 'o2', label: 'It is easier', isCorrect: false, feedback: 'It is harder, but worth it.' }
        ]
      }
    ]
  },

  // --- PATH 6: SECURITY PRACTITIONER ---
  '6.1': {
    id: '6.1',
    steps: [
      {
        id: 's1',
        title: 'Attack Surface',
        explanation: 'The more complex your setup, the more holes it has.\n\nA laptop with 50 apps, WiFi, and Bluetooth is a "High Attack Surface". A hardware wallet with no wireless is "Low Attack Surface".',
        question: 'Where should you generate keys?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Windows Desktop', isCorrect: false, feedback: 'Malware prone.' },
            { id: 'o2', label: 'Dedicated Hardware', isCorrect: true, feedback: 'Correct. Minimal code means minimal bugs.' }
        ]
      }
    ]
  },
  '6.2': {
    id: '6.2',
    steps: [
      {
        id: 's1',
        title: 'Air Gaps',
        explanation: 'An Air Gapped computer never touches the internet. You move data via SD Card or QR Code.\n\nThis physically prevents remote extraction of private keys.',
        question: 'Can a hacker access an air-gapped device?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Yes', isCorrect: false, feedback: 'There is no WiFi.' },
            { id: 'o2', label: 'Only with physical access', isCorrect: true, feedback: 'Correct. Or via "Evil Maid" attacks (tampering with hardware).' }
        ]
      }
    ]
  },
  // 6.3 is CUSTOM LAB
  '6.4': {
    id: '6.4',
    steps: [
      {
        id: 's1',
        title: 'Incident Response',
        explanation: 'You accidentally pasted your seed phrase into ChatGPT. What do you do?\n\n1. DISCONNECT INTERNET IMMEDIATELY.\n2. Sweep funds to a new wallet using a clean device.',
        question: 'Should you wait to see if funds move?',
        visualType: 'CARDS',
        options: [
            { id: 'o1', label: 'Yes', isCorrect: false, feedback: 'Bots will sweep it in seconds.' },
            { id: 'o2', label: 'No, Sweep immediately', isCorrect: true, feedback: 'Correct. It is a race against scripts.' }
        ]
      }
    ]
  },

  // --- PATH 7: P2P MARKET (Existing) ---
  '7.1': {
    id: '7.1',
    steps: [
      {
        id: 's1',
        title: 'Asymmetric Information',
        explanation: 'In P2P trades (e.g., Cash for Bitcoin), trust is low. You don\'t know if the other person will pay.\n\nYou must design the trade to be trust-minimized using escrows or social reputation.',
        question: 'What is the primary risk for a Bitcoin seller in a bank transfer trade?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Volatility', isCorrect: false, feedback: 'Price changes matter, but fraud is the primary risk.' },
          { id: 'o2', label: 'Chargeback Fraud', isCorrect: true, feedback: 'Correct. The buyer sends fiat, gets the BTC, then reverses the bank transfer. BTC is irreversible; fiat is not.' }
        ]
      },
      {
        id: 's2',
        title: 'Pricing Premiums',
        explanation: 'P2P Bitcoin often trades at a premium above "Spot Price" (Exchange Price).\n\nThis premium pays for: \n1. Privacy (No KYC)\n2. Convenience (Local payment methods)\n3. Risk (Fraud/Volatility)',
        question: 'Why would a buyer pay 5% above market price?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Ignorance', isCorrect: false, feedback: 'Buyers know the price. They pay for value.' },
          { id: 'o2', label: 'Privacy/No-KYC', isCorrect: true, feedback: 'Correct. The buyer values the lack of surveillance more than the 5% spread.' }
        ]
      },
      {
        id: 's3',
        title: 'Verification Hygiene',
        explanation: 'Before releasing Bitcoin from escrow, you must verify the fiat payment is FINAL.\n\nScreenshots can be photoshopped. Emails can be spoofed. You must log into your bank account and see the cleared balance.',
        question: 'A buyer sends a screenshot of a "Pending" transfer. Do you release the BTC?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Yes', isCorrect: false, feedback: 'Never. "Pending" can be cancelled. You lose your coins.' },
          { id: 'o2', label: 'No', isCorrect: true, feedback: 'Correct. Only release when funds are "Settled" and irreversible in your own account.' }
        ]
      }
    ]
  },
  '7.2': {
    id: '7.2',
    steps: [
      {
        id: 's1',
        title: '2-of-3 Multisig Escrow',
        explanation: 'Most P2P markets use a 2-of-3 multisig: \n- Key A: Buyer\n- Key B: Seller\n- Key C: Arbitrator\n\nNormally, Buyer + Seller sign (2-of-3) to complete the trade. If they disagree, the Arbitrator steps in to sign with the winner.',
        question: 'Can the Arbitrator steal the funds alone?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Yes', isCorrect: false, feedback: 'The Arbitrator has only 1 key. They need 2 to spend.' },
          { id: 'o2', label: 'No', isCorrect: true, feedback: 'Correct. They can only collude with one party, but they cannot take funds unilaterally.' }
        ]
      },
      {
        id: 's2',
        title: 'Dispute Evidence',
        explanation: 'If a trade goes to dispute, the Arbitrator needs proof. \n- Chat logs (signed)\n- Bank statements\n- Video evidence\n\nIf you communicate off-platform (e.g., Telegram), the Arbitrator cannot verify the logs.',
        question: 'Why should you keep all trade chat inside the trading app?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Verifiable History', isCorrect: true, feedback: 'Correct. Cryptographically signed app logs are admissible evidence. Telegram screenshots are easily faked.' },
          { id: 'o2', label: 'Data mining', isCorrect: false, feedback: 'P2P apps (like Bisq/RoboSats) are encrypted. It is about dispute resolution, not tracking.' }
        ]
      },
      {
        id: 's3',
        title: 'Bonded Escrows',
        explanation: 'To prevent "Griefing" (locking funds for fun), both parties post a security bond (e.g., 10%).\n\nIf the seller refuses to release BTC after getting paid, the arbitrator can slash their bond, compensating the buyer for the time wasted.',
        question: 'What is the purpose of the security bond?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Platform Profit', isCorrect: false, feedback: 'Bonds are returned if the trade goes well.' },
          { id: 'o2', label: 'Skin in the Game', isCorrect: true, feedback: 'Correct. It makes bad behavior expensive.' }
        ]
      }
    ]
  },
  '7.3': {
    id: '7.3',
    steps: [
      {
        id: 's1',
        title: 'Reputation as Capital',
        explanation: 'In a pseudonymous market, your Reputation Score is your identity. \n\nA "Level 1" trader has low limits. A "Level 5" trader with 1000+ trades commands higher premiums and trust.',
        question: 'What happens if you burn your reputation for a quick scam?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Make new account', isCorrect: false, feedback: 'New accounts have low limits and zero trust. You lose the ability to trade at volume.' },
          { id: 'o2', label: 'Permanent Loss', isCorrect: true, feedback: 'Correct. The "Cost of Acquisition" for a high-rep profile is years of work. Burning it is economically irrational.' }
        ]
      },
      {
        id: 's2',
        title: 'Market Making Spreads',
        explanation: 'Market Makers provide liquidity (Offers). They buy low and sell high.\n\nSpread = (Sell Price - Buy Price). \nIf the spread is too narrow, volatility might make you sell below cost. If too wide, no one takes your offer.',
        question: 'How does high volatility affect your spread strategy?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Widen Spread', isCorrect: true, feedback: 'Correct. You need a larger buffer to protect against price swings during the trade window.' },
          { id: 'o2', label: 'Tighten Spread', isCorrect: false, feedback: 'Tight spreads in high volatility lead to "Toxic Flow" (arbitrageurs picking you off).' }
        ]
      }
    ]
  },
  '7.4': {
    id: '7.4',
    steps: [
      {
        id: 's1',
        title: 'The Trap of Centralization',
        explanation: 'Platforms like LocalBitcoins failed because they held custody and required KYC. This created a central "Honey Pot" for hackers and regulators.\n\nTrue P2P markets (Bisq, Hodl Hodl, RoboSats) are non-custodial. The platform cannot freeze funds because it never holds them.',
        question: 'Which model is more resilient to a government ban?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Custodial', isCorrect: false, feedback: 'The government just orders the CEO to shut down.' },
          { id: 'o2', label: 'Non-Custodial P2P', isCorrect: true, feedback: 'Correct. There is no central server holding funds to seize. The code is just a coordination tool.' }
        ]
      },
      {
        id: 's2',
        title: 'OpSec & Surveillance',
        explanation: 'Even in P2P, your bank knows you sent money to "Stranger X". \n\nIf you trade high volumes using personal bank accounts, the bank will flag you for "Commercial Use" or AML risks. \n\nSolution: Multiple accounts, diverse payment rails, and staying under radar limits.',
        question: 'What is a "Structuring" violation?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Organizing files', isCorrect: false, feedback: 'No.' },
          { id: 'o2', label: 'Evading Reporting', isCorrect: true, feedback: 'Correct. Intentionally breaking transactions into small chunks (e.g., $9,999) to avoid reporting thresholds is illegal in many jurisdictions.' }
        ]
      }
    ]
  },

  // --- PATH 8: COMMUNITY BUILDER (Existing) ---
  '8.1': {
    id: '8.1',
    steps: [
      {
        id: 's1',
        title: 'Active Recall vs Passive Consumption',
        explanation: 'Watching a video feels like learning, but isn\'t. \n\nTo build a Bitcoin community, you must design workshops where users DO things (install wallet, backup seed, send tx). Competence requires action.',
        question: 'Which workshop format yields higher retention?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Lecture Slides', isCorrect: false, feedback: 'Retention is < 10%.' },
          { id: 'o2', label: 'Guided Setup', isCorrect: true, feedback: 'Correct. "Learning by Doing" creates muscle memory and confidence.' }
        ]
      },
      {
        id: 's2',
        title: 'Train the Trainer',
        explanation: 'You cannot teach everyone. You must teach teachers.\n\nA scalable community model identifies local leaders, trains them, and resources them to run their own nodes/meetups.',
        question: 'What is the risk of a "Cult of Personality" leader?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Single Point of Failure', isCorrect: true, feedback: 'Correct. If the leader leaves or is compromised, the community collapses.' },
          { id: 'o2', label: 'Too much charisma', isCorrect: false, feedback: 'Charisma helps, but dependency is the flaw.' }
        ]
      }
    ]
  },
  '8.2': {
    id: '8.2',
    steps: [
      {
        id: 's1',
        title: 'Rough Consensus',
        explanation: 'Bitcoin has no president. It runs on "Rough Consensus". \n\nWe don\'t vote (majority rule). We discuss until no one strongly objects. If we can\'t agree, we don\'t change the rules.',
        question: 'Why is "Democracy" (51% vote) bad for a protocol?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Too slow', isCorrect: false, feedback: 'Voting is fast, but dangerous.' },
          { id: 'o2', label: 'Tyranny of Majority', isCorrect: true, feedback: 'Correct. 51% could vote to steal the other 49%\'s money. Consensus protects the minority rights.' }
        ]
      },
      {
        id: 's2',
        title: 'Exit Rights (Forks)',
        explanation: 'If a conflict is unresolvable, the community splits (Forks).\n\nThis is a feature, not a bug. It ensures no one is coerced. You follow the chain that aligns with your values.',
        question: 'What keeps the community together if splitting is easy?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Network Effects', isCorrect: true, feedback: 'Correct. Splitting destroys value (liquidity, user base). The economic incentive is to stay together.' },
          { id: 'o2', label: 'Legal contracts', isCorrect: false, feedback: 'There are no contracts in open source.' }
        ]
      }
    ]
  },
  '8.3': {
    id: '8.3',
    steps: [
      {
        id: 's1',
        title: 'The Closed Loop',
        explanation: 'A Circular Economy exists when Bitcoin doesn\'t touch fiat.\n\nCustomer pays Merchant -> Merchant pays Supplier -> Supplier pays Employee -> Employee pays Merchant.\n\nEvery time you convert to Fiat, value leaks out to the banking system.',
        question: 'What is the hardest link to close in the circle?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Merchant Acceptance', isCorrect: false, feedback: 'Merchants are easy to onboard.' },
          { id: 'o2', label: 'Supplier/Wholesale', isCorrect: true, feedback: 'Correct. Global supply chains (energy, imports) usually demand Fiat. This is the bottleneck.' }
        ]
      },
      {
        id: 's2',
        title: 'Velocity of Money',
        explanation: 'A successful community isn\'t just HODLing. It is spending.\n\nVelocity = How often a sat changes hands. High velocity creates a vibrant local economy even with a small monetary base.',
        question: 'Does HODLing hurt a circular economy?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Yes', isCorrect: true, feedback: 'Correct. If everyone HODLs, no trade happens. You need a balance of "Saving" and "Medium of Exchange".' },
          { id: 'o2', label: 'No', isCorrect: false, feedback: 'HODLing increases price, but decreases local trade volume.' }
        ]
      }
    ]
  },
  '8.4': {
    id: '8.4',
    steps: [
      {
        id: 's1',
        title: 'Infiltration & Scams',
        explanation: 'Successful communities attract predators (MLMs, Affinity Scammers).\n\nThey use the community\'s trust ("We are all Bitcoiners") to push bad projects. "Toxic Maximalism" acts as a community immune system to reject these pathogens.',
        question: 'Why is "Gatekeeping" sometimes necessary?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'To be mean', isCorrect: false, feedback: 'No.' },
          { id: 'o2', label: 'Protect Standards', isCorrect: true, feedback: 'Correct. It filters out bad actors and maintains the signal-to-noise ratio.' }
        ]
      },
      {
        id: 's2',
        title: 'Handling FUD',
        explanation: 'Fear, Uncertainty, Doubt. \n\nWhen price crashes or media attacks, new members panic. A resilient community provides context and history to calm the nerves.',
        question: 'What is the best antidote to FUD?',
        visualType: 'CARDS',
        options: [
          { id: 'o1', label: 'Censorship', isCorrect: false, feedback: 'Hiding FUD makes it stronger.' },
          { id: 'o2', label: 'Education/Data', isCorrect: true, feedback: 'Correct. Showing that "Bitcoin has died 400 times before" provides perspective.' }
        ]
      }
    ]
  }
};

// --- SIMULATED REMOTE CONTENT PATCH ---
// In a real app, this would be fetched from IPFS or a Nostr Relay
export const TAPROOT_UPGRADE_PATCH: Partial<Record<string, ModuleContent>> = {
    '3.3': {
        id: '3.3',
        steps: [
            {
                id: 's1',
                title: 'Script Upgrade: Taproot',
                explanation: 'We have upgraded to Taproot (Schnorr Signatures). This makes multi-sig transactions look identical to single-sig on chain.\n\nLegacy ECDSA signatures were large and distinct. Schnorr allows key aggregation.',
                question: 'What is the privacy benefit of Key Aggregation?',
                visualType: 'CARDS',
                options: [
                    { id: 'o1', label: 'Indistinguishable Tx', isCorrect: true, feedback: 'Correct. A multisig spend looks exactly like a single person spending.' },
                    { id: 'o2', label: 'Faster block time', isCorrect: false, feedback: 'Block time is fixed at 10 minutes.' }
                ]
            }
        ]
    }
};
