import { useState, useEffect, useRef } from 'react';
import { publishPresence, subscribeToPresence, nostrPresence } from '../utils/nostr';
import { UserState } from '../types';

export interface PeerData {
    pubkey: string;
    name: string;
    xp: number;
    rank: string;
    path: string;
    lastSeen: number;
    isOnline: boolean;
}

export const usePresence = (user: UserState | null) => {
    const [activeCounts, setActiveCounts] = useState<Record<string, number>>({});
    const [peers, setPeers] = useState<PeerData[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    
    // Map of pubkey -> PeerData
    const peersRef = useRef<Map<string, PeerData>>(new Map());

    useEffect(() => {
        // Start subscription logic
        subscribeToPresence();
        setIsConnected(true);

        const handleEvent = (event: any) => {
            const tags = event.tags;
            const getTag = (k: string) => tags.find((t: string[]) => t[0] === k)?.[1];
            
            const path = getTag('path');
            const xp = parseInt(getTag('xp') || '0');
            const rank = getTag('rank') || 'Unknown';
            const nick = getTag('nick') || 'Anon';

            if (path) {
                peersRef.current.set(event.pubkey, {
                    pubkey: event.pubkey,
                    name: nick,
                    xp: xp,
                    rank: rank,
                    path: path,
                    lastSeen: Date.now(),
                    isOnline: true
                });
            }
        };

        nostrPresence.onEvent(handleEvent);

        // Heartbeat Loop (Publish my presence)
        const heartbeat = setInterval(() => {
            if (user && user.currentPath) {
                publishPresence(user);
            }
        }, 15000); // Pulse every 15s

        // Cleanup Loop (Remove stale peers > 60s)
        const cleanup = setInterval(() => {
            const now = Date.now();
            
            // Prune old peers
            for (const [pubkey, data] of peersRef.current.entries()) {
                if (now - data.lastSeen > 60000) {
                    peersRef.current.delete(pubkey);
                }
            }

            // Update Active Counts
            const newCounts: Record<string, number> = {};
            const activePeers: PeerData[] = [];
            
            for (const data of peersRef.current.values()) {
                newCounts[data.path] = (newCounts[data.path] || 0) + 1;
                activePeers.push(data);
            }
            
            setActiveCounts(newCounts);
            
            // Sort peers by XP desc
            setPeers(activePeers.sort((a, b) => b.xp - a.xp));
            
        }, 3000); // Update UI every 3s

        // Initial publish
        if (user && user.currentPath) publishPresence(user);

        return () => {
            clearInterval(heartbeat);
            clearInterval(cleanup);
        };
    }, [user?.currentPath, user?.reputation]); // Re-publish if path or XP changes

    return { activeCounts, peers, isConnected };
};