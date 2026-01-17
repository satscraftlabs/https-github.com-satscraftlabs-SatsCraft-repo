import React, { useState } from 'react';
import { IDE } from '../components/IDE';
import { Button } from '../components/ui/Button';
import { BuilderContent } from '../types';

interface BuilderSimulationProps {
  content: BuilderContent;
  onComplete: () => void;
  onExit: () => void;
}

export const BuilderSimulation: React.FC<BuilderSimulationProps> = ({ content, onComplete, onExit }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [output, setOutput] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isStepSuccess, setIsStepSuccess] = useState(false);

  const step = content.steps[currentStepIndex];
  const isLastStep = currentStepIndex === content.steps.length - 1;

  const handleRunCode = (code: string) => {
    setOutput({ type: 'info', message: 'Compiling/Parsing...' });
    
    setTimeout(() => {
        let result = { passed: false, error: 'Unknown Error' };
        
        if (step.validationFunction) {
            result = step.validationFunction(code);
        } else if (step.validationPattern) {
            // Fallback regex check
            const passed = new RegExp(step.validationPattern).test(code);
            result = { passed, error: passed ? undefined : 'Validation Pattern Mismatch' };
        }

        if (result.passed) {
            setOutput({ type: 'success', message: step.successMessage });
            setIsStepSuccess(true);
        } else {
            setOutput({ type: 'error', message: result.error || 'Syntax Error' });
            setIsStepSuccess(false);
        }
    }, 800);
  };

  const handleNext = () => {
    if (isLastStep) {
        onComplete();
    } else {
        setCurrentStepIndex(prev => prev + 1);
        setIsStepSuccess(false);
        setOutput(null);
    }
  };

  return (
    <div className="flex h-full bg-[#0D0F12]">
      {/* Left Panel: Educational Context & Instructions */}
      <div className="w-1/3 border-r border-white/5 bg-[#161A1E] flex flex-col z-10 shadow-2xl">
         <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0D0F12]">
             <button onClick={onExit} className="text-text-muted hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back
            </button>
            <div className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                Builder Mode
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
             <div>
                 <h2 className="text-xl font-bold text-white font-display mb-3">{content.title}</h2>
                 <div className="flex gap-1 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     {content.steps.map((_, i) => (
                         <div key={i} className={`flex-1 transition-colors ${i <= currentStepIndex ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                     ))}
                 </div>
                 <p className="text-[10px] text-text-muted mt-2 font-mono uppercase tracking-wider">Step {currentStepIndex + 1} of {content.steps.length}</p>
             </div>

             {/* LEARNING CARD (New) */}
             {step.conceptExplanation && (
                 <div className="bg-gradient-to-br from-blue-900/10 to-transparent border border-blue-500/20 rounded-xl overflow-hidden">
                     <div className="bg-blue-500/10 px-4 py-2 border-b border-blue-500/10 flex items-center gap-2">
                         <span className="material-symbols-outlined text-sm text-blue-400">school</span>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                            {step.conceptTitle || 'Learn the Concept'}
                         </span>
                     </div>
                     <div className="p-4 space-y-4">
                         <p className="text-sm text-blue-100/90 leading-relaxed whitespace-pre-wrap">
                             {step.conceptExplanation}
                         </p>
                         
                         {step.referenceCode && (
                             <div className="bg-black/40 rounded-lg p-3 border border-blue-500/10 relative group">
                                 <pre className="font-mono text-xs text-blue-300 overflow-x-auto">
                                     {step.referenceCode}
                                 </pre>
                                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[9px] text-text-muted uppercase">Example</span>
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>
             )}

             {/* TASK CARD */}
             <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-sm text-primary">terminal</span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Current Task</h4>
                 </div>
                 <div className="prose prose-invert prose-sm text-text-muted leading-relaxed text-sm">
                     {step.description}
                 </div>
             </div>

             {/* Hint Box */}
             <div className="mt-4 p-3 bg-white/5 border-l-2 border-white/20 rounded-r-lg">
                 <p className="text-[10px] text-text-muted font-bold uppercase mb-1 flex items-center gap-1">
                     <span className="material-symbols-outlined text-xs">lightbulb</span> 
                     Hint
                 </p>
                 <p className="text-xs text-text-muted italic">{step.hint}</p>
             </div>
         </div>

         <div className="p-6 border-t border-white/5 bg-[#0D0F12]">
             <Button 
                variant={isStepSuccess ? 'primary' : 'secondary'} 
                disabled={!isStepSuccess} 
                fullWidth 
                size="lg"
                onClick={handleNext}
                icon="arrow_forward"
             >
                 {isLastStep ? 'Complete Module' : 'Next Step'}
             </Button>
         </div>
      </div>

      {/* Right Panel: IDE */}
      <div className="flex-1 p-4 md:p-6 bg-[#0D0F12] overflow-hidden flex flex-col">
          <IDE 
            initialCode={step.initialCode} 
            language={step.language} 
            onRun={handleRunCode}
            output={output}
            isSuccess={isStepSuccess}
          />
      </div>
    </div>
  );
};