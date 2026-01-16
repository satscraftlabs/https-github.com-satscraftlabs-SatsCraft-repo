import React from 'react';
import { Button } from './ui/Button';
import { AppNotification } from '../types';

interface NotificationModalProps {
  notification: AppNotification;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ notification, onClose }) => {
  const isPenalty = notification.type === 'PENALTY';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-4">
        <div className={`bg-surface-dark border p-1 rounded-3xl shadow-2xl w-full max-w-sm relative overflow-hidden animate-in zoom-in duration-300 ${isPenalty ? 'border-error/30' : 'border-white/10'}`}>
             
             {/* Background Effects */}
             <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] via-transparent to-transparent opacity-30 ${isPenalty ? 'from-error/20' : 'from-primary/20'}`}></div>
             
             <div className="bg-[#0D0F12] rounded-[22px] p-6 relative z-10 overflow-hidden text-center">
                
                <div className={`size-20 mx-auto rounded-full flex items-center justify-center mb-6 border-4 ${isPenalty ? 'bg-error/10 border-error/20 text-error' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                    <span className="material-symbols-outlined text-4xl">
                        {isPenalty ? 'broken_image' : 'notifications'}
                    </span>
                </div>

                <h2 className={`text-2xl font-bold font-display mb-2 ${isPenalty ? 'text-error' : 'text-white'}`}>
                    {notification.title}
                </h2>
                
                <p className="text-sm text-text-muted leading-relaxed mb-8">
                    {notification.message}
                </p>

                {isPenalty && (
                    <div className="bg-surface-dark p-3 rounded-xl border border-white/5 mb-6 text-xs text-text-muted">
                        <p className="uppercase font-bold mb-1">How to prevent this?</p>
                        <p>Complete the <span className="text-white font-bold">"Sovereignty"</span> module (1.11) to permanently shield your reputation from decay.</p>
                    </div>
                )}

                <Button variant={isPenalty ? 'danger' : 'primary'} fullWidth onClick={onClose} icon="check">
                    Acknowledge
                </Button>

             </div>
        </div>
    </div>
  );
};