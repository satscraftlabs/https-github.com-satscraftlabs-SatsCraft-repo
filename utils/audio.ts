
// Simple Web Audio API Synth for UI Sounds
class SoundManager {
    private ctx: AudioContext | null = null;
    private enabled: boolean = true;

    constructor() {
        // Initialize on first user interaction usually, but here we prep
        if (typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
        if (!this.ctx || !this.enabled) return;
        
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio context might be suspended or not supported
        }
    }

    playClick() {
        this.playTone(800, 'sine', 0.05, 0.05);
    }

    playHover() {
        this.playTone(400, 'triangle', 0.02, 0.02);
    }

    playSuccess() {
        if (!this.ctx || !this.enabled) return;
        this.playTone(523.25, 'sine', 0.2, 0.1); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.4, 0.1), 100); // E5
    }

    playError() {
        if (!this.ctx || !this.enabled) return;
        this.playTone(150, 'sawtooth', 0.3, 0.15);
        setTimeout(() => this.playTone(100, 'sawtooth', 0.3, 0.15), 150);
    }

    playAlarm() {
        if (!this.ctx || !this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }
}

export const audio = new SoundManager();
