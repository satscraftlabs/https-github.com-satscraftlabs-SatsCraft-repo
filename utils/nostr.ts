import { generatePrivateKey, getPublicKey, getEventHash, signEvent } from 'nostr-tools';
import { UserState } from '../types';

// Default relays that support ephemeral events
const RELAYS = [
    'wss://relay.damus.io',
    'wss://relay.primal.net',
    'wss://nos.lol'
];

// Ephemeral Event Kind for Presence
const KIND_PRESENCE = 20000;
const PRESENCE_TAG = 'satscraft_presence_v1';

// Managing Guest Identity
const getGuestKey = () => {
    let sk = localStorage.getItem('satscraft_guest_sk');
    if (!sk) {
        sk = generatePrivateKey();
        localStorage.setItem('satscraft_guest_sk', sk);
    }
    return sk;
};

// Simple Relay Pool implementation
class SimplePool {
    private sockets: WebSocket[] = [];
    private listeners: ((event: any) => void)[] = [];

    constructor() {
        this.connect();
    }

    private connect() {
        RELAYS.forEach(url => {
            try {
                const ws = new WebSocket(url);
                ws.onopen = () => {
                    // console.log(`Connected to ${url}`);
                };
                ws.onmessage = (msg) => {
                    try {
                        const data = JSON.parse(msg.data);
                        if (data[0] === 'EVENT') {
                            this.listeners.forEach(cb => cb(data[2]));
                        }
                    } catch (e) {}
                };
                ws.onerror = () => {
                    // Silent fail
                };
                this.sockets.push(ws);
            } catch (e) {
                console.warn(`Failed to connect to ${url}`);
            }
        });
    }

    subscribe(filter: any) {
        const subId = 'sub_' + Math.random().toString(36).substring(2);
        const msg = JSON.stringify(['REQ', subId, filter]);
        this.sockets.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(msg);
            } else {
                ws.addEventListener('open', () => ws.send(msg), { once: true });
            }
        });
    }

    publish(event: any) {
        const msg = JSON.stringify(['EVENT', event]);
        this.sockets.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(msg);
            }
        });
    }

    onEvent(callback: (event: any) => void) {
        this.listeners.push(callback);
    }
    
    close() {
        this.sockets.forEach(ws => ws.close());
        this.listeners = [];
    }
}

export const nostrPresence = new SimplePool();

export const publishPresence = async (user: UserState) => {
    const isExtension = !!window.nostr;
    
    // Construct tags with rich metadata
    const tags = [
        ['t', PRESENCE_TAG],
        ['path', user.currentPath || 'UNKNOWN'],
        ['xp', user.reputation.toString()],
        ['rank', user.rank],
        ['nick', user.npub || (user.isGuest ? 'Guest Agent' : 'Agent')]
    ];

    const event: any = {
        kind: KIND_PRESENCE,
        created_at: Math.floor(Date.now() / 1000),
        tags: tags,
        content: '', // Ephemeral events usually have empty content or status message
        pubkey: ''
    };

    try {
        if (isExtension) {
            // Use Extension
            event.pubkey = await window.nostr!.getPublicKey();
            // Extension sign
            const signed = await window.nostr!.signEvent(event);
            nostrPresence.publish(signed);
        } else {
            // Use Guest Key
            const sk = getGuestKey();
            event.pubkey = getPublicKey(sk);
            event.id = getEventHash(event);
            event.sig = signEvent(event, sk);
            nostrPresence.publish(event);
        }
    } catch (e) {
        console.error("Failed to publish presence", e);
    }
};

export const subscribeToPresence = () => {
    nostrPresence.subscribe({
        kinds: [KIND_PRESENCE],
        '#t': [PRESENCE_TAG],
        since: Math.floor(Date.now() / 1000) - 120 // Get events from last 2 minutes
    });
};