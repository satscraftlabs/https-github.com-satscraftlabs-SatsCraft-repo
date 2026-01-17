
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { audio } from '../utils/audio';

export const EntropyLab: React.FC<{ onComplete: () => void; devMode: boolean }> = ({ onComplete, devMode }) => {
  const [entropy, setEntropy] = useState<number[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generatedSeed, setGeneratedSeed] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isCollecting || progress >= 100) return;

    const { clientX, clientY } = e;
    // Simple mock entropy collection
    const noise = Math.floor((clientX * clientY) % 255);
    
    // Draw on canvas
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = `rgb(${noise}, ${255-noise}, 100)`;
            ctx.fillRect(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 4, 4);
        }
    }

    setEntropy(prev => [...prev, noise]);
    
    if (entropy.length % 5 === 0) {
        audio.playHover();
        setProgress(prev => Math.min(100, prev + 1));
    }
  };

  const handleStart = () => {
      setIsCollecting(true);
      setEntropy([]);
      setProgress(0);
      const canvas = canvasRef.current;
      if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
  };

  useEffect(() => {
      if (progress >= 100 && isCollecting) {
          setIsCollecting(false);
          audio.playSuccess();
          // Generate Mock Seed
          const words = ["abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse", "access", "accident"];
          // Shuffle based on entropy
          const shuffled = [...words].sort(() => 0.5 - Math.random());
          setGeneratedSeed(shuffled.join(' '));
      }
  }, [progress, isCollecting]);

  return (
    <div className="flex flex-col h-full bg-background-dark p-6 md:p-8">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white font-display mb-2">Entropy Generator</h1>
                    <p className="text-text-muted">High-quality keys require high-quality randomness. Move your mouse to generate chaos.</p>
                </div>
                {devMode && (
                    <div className="bg-purple-900/20 border border-purple-500/50 px-3 py-1 rounded text-purple-400 font-mono text-xs">
                        DEV: Entropy Pool Size: {entropy.length} bytes
                    </div>
                )}
            </div>

            <div className="flex-1 relative bg-black rounded-3xl border border-white/10 overflow-hidden cursor-crosshair shadow-2xl"
                 onMouseMove={handleMouseMove}>
                
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                {/* Canvas Layer */}
                <canvas ref={canvasRef} width={800} height={600} className="absolute inset-0 w-full h-full" />

                {/* Instructions Overlay */}
                {!isCollecting && !generatedSeed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-bounce">mouse</span>
                            <h3 className="text-2xl font-bold text-white mb-6">Input Randomness</h3>
                            <Button size="lg" onClick={handleStart} icon="play_arrow">Start Harvesting</Button>
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                {isCollecting && (
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-white mb-2">
                            <span>Harvesting Entropy...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/10">
                            <div className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-100" style={{width: `${progress}%`}}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Result Area */}
            {generatedSeed && (
                <div className="mt-6 bg-surface-dark border border-white/10 rounded-2xl p-6 animate-in slide-in-from-bottom-4">
                    <h3 className="text-lg font-bold text-white mb-4">Mnemonic Generated</h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                        {generatedSeed.split(' ').map((word, i) => (
                            <div key={i} className="flex gap-2 items-center bg-black/40 border border-white/5 px-3 py-2 rounded-lg font-mono text-sm">
                                <span className="text-text-muted select-none">{i+1}.</span>
                                <span className="text-white font-bold">{word}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <Button variant="primary" onClick={onComplete} icon="check">Confirm Backup</Button>
                        <Button variant="secondary" onClick={handleStart} icon="refresh">Regenerate</Button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
