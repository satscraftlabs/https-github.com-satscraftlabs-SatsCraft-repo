import { UserState, PathId, AppNotification } from '../types';
import { INITIAL_USER_STATE } from '../constants';

// Define the window.nostr interface
declare global {
  interface Window {
    nostr?: {
      getPublicKey(): Promise<string>;
      signEvent(event: any): Promise<any>;
    };
  }
}

const STORAGE_PREFIX = 'satscraft_user_';
const SAFETY_MODULE_ID = '1.11'; // Sovereignty Module protects against decay
const DECAY_THRESHOLD_DAYS = 5;
const DECAY_PERCENTAGE = 0.05; // 5%

// Mock npub encoding
const toMockNpub = (hex: string) => {
    return `npub1${hex.substring(0, 8)}...${hex.substring(hex.length - 6)}`;
};

export const loginWithNostr = async (): Promise<UserState> => {
  if (!window.nostr) {
    throw new Error("NIP-07 Extension not found (Alby, Nos2x)");
  }

  try {
    const pubkey = await window.nostr.getPublicKey();
    return loadUserState(pubkey, toMockNpub(pubkey));
  } catch (error) {
    console.error("Nostr login failed", error);
    throw error;
  }
};

export const loginWithLightning = async (identifier: string, displayName?: string): Promise<UserState> => {
    // Generate a pseudo-ID from the user's input string
    const pseudoId = btoa(identifier).replace(/=/g, '').substring(0, 16); 
    
    // Use the provided display name, or fall back to the identifier
    const finalName = displayName && displayName.trim().length > 0 ? displayName : identifier;
    
    return loadUserState(pseudoId, finalName);
};

export const loadUserState = (id: string, displayName: string): UserState => {
  const stored = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
  
  if (stored) {
    let user: UserState = JSON.parse(stored);
    
    // Update display name if a new one is provided
    if (displayName && displayName !== user.npub && displayName !== id) {
        user.npub = displayName;
    }
    
    // --- ENTROPY DECAY LOGIC ---
    const now = new Date();
    const lastActive = new Date(user.lastActive || now.toISOString());
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
    // Check if user is protected
    const isProtected = user.completedModules.includes(SAFETY_MODULE_ID);
    
    // Logic: If inactive > threshold AND not protected, apply penalty
    if (diffDays >= DECAY_THRESHOLD_DAYS && !isProtected && user.reputation > 0) {
        const decayAmount = Math.floor(user.reputation * DECAY_PERCENTAGE);
        const newReputation = Math.max(0, user.reputation - decayAmount);
        
        const penaltyNotification: AppNotification = {
            id: Date.now().toString(),
            type: 'PENALTY',
            title: 'Entropy Decay Detected',
            message: `You were inactive for ${diffDays} days. ${Math.round(DECAY_PERCENTAGE * 100)}% of your XP (${decayAmount}) has been lost due to lack of maintenance.`,
            data: { lostAmount: decayAmount }
        };

        user = {
            ...user,
            reputation: newReputation,
            streak: 0, // Inactivity breaks streak
            lastActive: now.toISOString(),
            notifications: [...(user.notifications || []), penaltyNotification]
        };
    } else {
        // Just update last active time
        user = {
            ...user,
            lastActive: now.toISOString()
        };
    }
    
    saveUserState(user);
    return user;
  }

  // New User Profile
  // We explicitly reset stats here to ensure new users start fresh
  const newUser: UserState = {
    ...INITIAL_USER_STATE,
    isGuest: false,
    pubkey: id,
    npub: displayName,
    reputation: 0,
    streak: 0,
    completedModules: [],
    lastActive: new Date().toISOString(),
    notifications: []
  };
  
  saveUserState(newUser);
  return newUser;
};

export const saveUserState = (state: UserState) => {
  if (state.isGuest || !state.pubkey) return; // Don't persist guest state permanently
  localStorage.setItem(`${STORAGE_PREFIX}${state.pubkey}`, JSON.stringify(state));
};

export const logout = () => {
    // Just a placeholder, we handle state clearing in App
};