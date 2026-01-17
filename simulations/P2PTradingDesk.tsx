
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { audio } from '../utils/audio';

interface TradeOffer {
    id: string;
    buyerName: string;
    buyerRep: string; // "Top Trader", "New User", etc.
    paymentMethod: string;
    premium: string;
    isScam: boolean;
    redFlags: string[];
}

const OFFERS: TradeOffer[] = [
    {
        id: '1',
        buyerName: 'FastTrader99',
        buyerRep: 'New User (0 Trades)',
        paymentMethod: 'PayPal F&F',
        premium: '+15%',
        isScam: true,
        redFlags: ['High Premium', 'Reversible Method', 'New Account']
    },
    {
        id: '2',
        buyerName: 'HodlWhale',
        buyerRep: 'Trusted (500+ Trades)',
        paymentMethod: 'Bank Transfer (SEPA)',
        premium: '+4%',
        isScam: false,
        redFlags: []
    },
    {
        id: '3',
        buyerName: 'Anon_X',
        buyerRep: 'Level 2 (20 Trades)',
        paymentMethod: 'Gift Cards (Amazon)',
        premium: '+25%',
        isScam: true,
        redFlags: ['Gift Cards are High Risk', 'Absurd Premium']
    }
];

export const P2PTradingDesk: React.FC<{ onComplete: () => void; devMode: boolean }> = ({ onComplete, devMode }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

    const currentOffer = OFFERS[currentIndex];
    const isFinished = currentIndex >= OFFERS.length;

    const handleDecision = (accept: boolean) => {
        const isCorrect = accept === !currentOffer.isScam;
        
        if (isCorrect) {
            audio.playSuccess();
            setScore(prev => prev + 100);
            setFeedback({ msg: accept ? 'Trade Secured' : 'Scam Avoided', type: 'success' });
        } else {
            audio.playError();
            setFeedback({ 
                msg: accept 
                    ? `FATAL: Chargeback Fraud Initiated. Lost Funds. Flags: ${currentOffer.redFlags.join(', ')}` 
                    : 'Missed Opportunity. This was a valid trade.',
                type: 'error' 
            });
        }

        setTimeout(() => {
            setFeedback(null);
            setCurrentIndex(prev => prev + 1);
        }, 2000);
    };

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-background-dark p-6 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Shift Complete</h1>
                <div className="text-6xl font-bold text-primary mb-6">{score} XP</div>
                <p className="text-text-muted mb-8">You have processed all pending offers.</p>
                <Button onClick={onComplete} size="lg">Return to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#111] p-6 items-center justify-center">
            
            {/* Header / HUD */}
            <div className="w-full max-w-md flex justify-between items-center mb-8">
                <div className="bg-surface-dark px-4 py-2 rounded-lg border border-white/10">
                    <span className="text-xs text-text-muted uppercase font-bold">Session Score</span>
                    <div className="text-xl font-bold text-primary font-mono">{score}</div>
                </div>
                <div className="bg-surface-dark px-4 py-2 rounded-lg border border-white/10">
                    <span className="text-xs text-text-muted uppercase font-bold">Queue</span>
                    <div className="text-xl font-bold text-white font-mono">{currentIndex + 1} / {OFFERS.length}</div>
                </div>
            </div>

            {/* Trade Card */}
            <div className="relative w-full max-w-md bg-surface-dark border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
                {devMode && (
                    <div className="absolute top-0 right-0 bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-1 uppercase">
                        DEV: SCAM={currentOffer.isScam.toString()}
                    </div>
                )}
                
                {feedback && (
                    <div className={`absolute inset-0 flex items-center justify-center z-20 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in`}>
                        <div className={`text-2xl font-bold ${feedback.type === 'success' ? 'text-success' : 'text-error'} text-center px-8`}>
                            <span className="material-symbols-outlined text-6xl block mb-4">{feedback.type === 'success' ? 'check_circle' : 'cancel'}</span>
                            {feedback.msg}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                            {currentOffer.buyerName[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{currentOffer.buyerName}</h2>
                            <p className={`text-xs font-bold ${currentOffer.buyerRep.includes('New') ? 'text-warning' : 'text-success'}`}>
                                {currentOffer.buyerRep}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/5 px-3 py-1 rounded text-xs font-mono text-text-muted">
                        #TRD-{currentOffer.id}882
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-text-muted text-sm">Payment Method</span>
                        <span className="text-white font-bold text-right">{currentOffer.paymentMethod}</span>
                    </div>
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-text-muted text-sm">Price Premium</span>
                        <span className="text-success font-bold text-right font-mono">{currentOffer.premium}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="danger" onClick={() => handleDecision(false)} icon="block">
                        Reject
                    </Button>
                    <Button variant="primary" onClick={() => handleDecision(true)} icon="check">
                        Accept Trade
                    </Button>
                </div>
            </div>

            <p className="mt-8 text-xs text-text-muted text-center max-w-sm">
                Analyze the reputation, payment method reversibility, and price premium. If it looks too good to be true, it is.
            </p>
        </div>
    );
};
