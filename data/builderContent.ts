

import { BuilderContent } from '../types';

export const BUILDER_CONTENT: Record<string, BuilderContent> = {
  // Module 3.3: Script Language (Bitcoin Script)
  '3.3': {
    id: '3.3',
    title: 'Bitcoin Script Basics',
    steps: [
      {
        id: 'intro_stack',
        title: 'Concept: The Stack',
        conceptTitle: 'How Bitcoin Thinks',
        conceptExplanation: 'Bitcoin does not use variables like Python or JS. It uses a **Stack**. Think of it like a stack of plates. You can only put data on top (PUSH) or do math with the top two items.\n\nTo add 1 + 1, we push `1`, push `1`, then use `OP_ADD`.',
        referenceCode: `// Example: Adding 5 and 3
OP_5
OP_3
OP_ADD
// Result on stack: 8`,
        description: 'Let\'s start simple. Write a script that adds **2** and **4** together.',
        language: 'bitcoin-script',
        initialCode: `// Push 2
OP_2
// Push 4 (Fill this in below)

// Add them together (Fill this in)
`,
        hint: 'Use OP_4 and OP_ADD.',
        successMessage: 'Great! You just wrote your first Stack program.',
        validationFunction: (code: string) => {
            const clean = code.toUpperCase();
            if (clean.includes('OP_4') && clean.includes('OP_ADD')) {
                return { passed: true };
            }
            return { passed: false, error: 'Stack result incorrect. Did you push OP_4 and use OP_ADD?' };
        }
      },
      {
        id: 'step1',
        title: 'Concept: Locking Scripts',
        conceptTitle: 'Pay-to-PubKey-Hash (P2PKH)',
        conceptExplanation: 'When you send Bitcoin, you are actually "locking" it with a puzzle. The receiver must provide the "key" (Signature + Public Key) to solve the puzzle.\n\nThe standard puzzle checks two things:\n1. Does the Public Key hash match the address?\n2. Is the Signature valid for that Public Key?',
        referenceCode: `// Standard P2PKH Structure:
OP_DUP
OP_HASH160
<PubKeyHash>
OP_EQUALVERIFY
OP_CHECKSIG`,
        description: 'Complete the locking script below. We have the Hash check (`OP_EQUALVERIFY`), but we are missing the final signature check.',
        language: 'bitcoin-script',
        initialCode: `// Standard P2PKH Lock
OP_DUP
OP_HASH160
<PubKeyHash>
OP_EQUALVERIFY
// ... what opcode checks the signature?
`,
        hint: 'Look at the reference code. The last opcode verifies the signature.',
        successMessage: 'Perfect. OP_CHECKSIG is the final gatekeeper of ownership.',
        validationFunction: (code: string) => {
            const clean = code.replace(/\/\/.*$/gm, '').replace(/\s+/g, ' ').trim();
            if (clean.includes('OP_CHECKSIG')) {
                return { passed: true };
            }
            return { passed: false, error: 'Script invalid. You missed the opcode that checks the signature.' };
        }
      },
      {
        id: 'step2',
        title: 'Concept: Time Locks',
        conceptTitle: 'Hodling with Code',
        conceptExplanation: 'You can make Bitcoin unspendable until a specific date or block height. This is called a **Time Lock**.\n\nWe use `OP_CHECKLOCKTIMEVERIFY` (or `OP_CLTV`) to ensure the current block height is greater than our target.',
        referenceCode: `<BlockHeight> OP_CLTV OP_DROP`,
        description: 'Create a script that funds can ONLY be spent after block height 850,000.',
        language: 'bitcoin-script',
        initialCode: `// Push the target block height
<850000>

// Verify the locktime (Add opcode here)

// Drop the height from stack to clean up
OP_DROP

<PubKey>
OP_CHECKSIG
`,
        hint: 'Use OP_CHECKLOCKTIMEVERIFY (or OP_CLTV) before dropping the height.',
        successMessage: 'Timelock Validated: Transaction effectively frozen until block 850,000.',
        validationFunction: (code: string) => {
            const clean = code.toUpperCase();
            if (clean.includes('OP_CHECKLOCKTIMEVERIFY') || clean.includes('OP_CLTV')) {
                return { passed: true };
            }
            return { passed: false, error: 'Execution Failed: Block height not verified against nLockTime field.' };
        }
      }
    ]
  },

  // Module 4.2: Node Config (LND)
  '4.2': {
    id: '4.2',
    title: 'Node Configuration',
    steps: [
      {
        id: 'step1',
        title: 'Concept: Config Files',
        conceptTitle: 'lnd.conf',
        conceptExplanation: 'Your Lightning Node (LND) behavior is controlled by a text file called `lnd.conf`. It uses a simple format:\n`parameter=value`\n\nLines starting with `#` are comments (ignored).',
        referenceCode: `[Application Options]
# This is my node name
alias=My_Super_Node
# This is my node color (Hex)
color=#FF0000`,
        description: 'Give your node a name! Set the `alias` to something unique and pick a `color` for the network graph.',
        language: 'ini',
        initialCode: `[Application Options]
# Set your node alias (visible to network)
alias=

# Set your node color (hex code)
color=#000000
`,
        hint: 'Just type a name after alias= (e.g., alias=Satoshi).',
        successMessage: 'Config Validated: Identity established.',
        validationFunction: (code: string) => {
             if (!/alias=.+/.test(code)) return { passed: false, error: 'Config Error: Alias cannot be empty.' };
             if (/alias=\s*$/.test(code)) return { passed: false, error: 'Config Error: Please provide a name.' };
             return { passed: true };
        }
      },
      {
        id: 'step2',
        title: 'Concept: Wumbo Channels',
        conceptTitle: 'Removing Limits',
        conceptExplanation: 'By default, Lightning channels were limited to 0.16 BTC to protect users while the network was young.\n\nNow that the network is mature, we can enable "Wumbo" (Big) channels to send larger payments. You must explicitly opt-in.',
        referenceCode: `protocol.wumbo-channels=true`,
        description: 'Enable the "Wumbo" protocol to support channels larger than 0.16 BTC.',
        language: 'ini',
        initialCode: `[Application Options]
alias=Satoshi_Node
color=#F7931A

# Enable Wumbo channels (Set this to true)
protocol.wumbo-channels=false
`,
        hint: 'Change false to true.',
        successMessage: 'Daemon Restarted: Wumbo channels enabled. 5BTC channels now supported.',
        validationFunction: (code: string) => {
            if (code.includes('protocol.wumbo-channels=true')) {
                return { passed: true };
            }
            return { passed: false, error: 'Protocol Error: Wumbo channels explicitly disabled.' };
        }
      }
    ]
  },

  // Module 5.1: Merchant Architecture (JSON)
  '5.1': {
    id: '5.1',
    title: 'Payment Requests',
    steps: [
      {
        id: 'step1',
        title: 'Concept: JSON Payloads',
        conceptTitle: 'Talking to APIs',
        conceptExplanation: 'Modern apps talk to Bitcoin nodes using JSON (JavaScript Object Notation). It works like a dictionary with Key/Value pairs.\n\n`"key": "value"`',
        referenceCode: `{
  "currency": "BTC",
  "speedPolicy": "MediumSpeed" 
}`,
        description: 'We are creating an invoice for $50. The current policy is set to `HighSpeed` (0 confirmations), which is risky. Change it to `MediumSpeed` (1 confirmation) to prevent double-spends.',
        language: 'json',
        initialCode: `{
  "amount": 50.00,
  "currency": "USD",
  "metadata": {
    "orderId": "ORD-1024"
  },
  "checkout": {
    "speedPolicy": "HighSpeed",
    "expirationMinutes": 15
  }
}`,
        hint: 'Find "speedPolicy" and change "HighSpeed" to "MediumSpeed".',
        successMessage: 'API 200 OK: Invoice generated with safe confirmation target.',
        validationFunction: (code: string) => {
            if (code.includes('"speedPolicy": "MediumSpeed"')) {
                return { passed: true };
            }
            return { passed: false, error: 'Risk Alert: HighSpeed policy (0-conf) poses double-spend risk for this amount.' };
        }
      }
    ]
  }
};