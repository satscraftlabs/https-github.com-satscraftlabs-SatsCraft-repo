import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { UserState } from '../types';
import { Button } from './ui/Button';

interface AITutorProps {
  user: UserState;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const AITutor: React.FC<AITutorProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'model',
      text: `Greetings, ${user.npub || 'Agent'}. I am the SatsCraft AI protocol advisor.\n\nI can clarify Bitcoin concepts, generate custom text-based simulations, or recommend study resources.\n\nWhat topic shall we explore?`,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini Chat
  useEffect(() => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `
        You are the AI Tutor for "SatsCraft", a technical Bitcoin education platform.
        
        USER CONTEXT:
        - Rank: ${user.rank}
        - Current Path: ${user.currentPath}
        - XP: ${user.reputation}

        YOUR MISSION:
        1. Explain Bitcoin/Lightning concepts simply but accurately (technical accuracy is paramount).
        2. If the user asks for a "simulation" or "scenario", generate a text-based "Choose Your Own Adventure" scenario. Present a problem (e.g., "Mempool congestion detected"), give 3 options, and explain the outcome of their choice.
        3. Recommend external resources (YouTube, Books, Docs) if asked. Stick to high-quality, signal-rich sources (e.g., Andreas Antonopoulos, Lopp.net, Lightning Engineering, Mastering Bitcoin).
        
        CONSTRAINTS:
        - BITCOIN ONLY. Do not discuss altcoins, NFTs (unless Ordinals/Runes context), or "Crypto" generally.
        - NO FINANCIAL ADVICE. Focus on technology, protocol mechanics, and operational security.
        - Keep responses concise and formatted with Markdown (bolding key terms).
        - Use a "Cyberpunk / Terminal" tone. Slightly robotic but helpful.
        `;

        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        setChatSession(chat);
    } catch (e) {
        console.error("Failed to init AI", e);
    }
  }, [user.rank, user.currentPath]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
      if (!input.trim() || !chatSession) return;
      
      const userMsg: Message = {
          id: Date.now().toString(),
          role: 'user',
          text: input,
          timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
          const result = await chatSession.sendMessage({ message: input });
          const responseText = (result as GenerateContentResponse).text || "Error: No response data.";
          
          const modelMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: responseText,
              timestamp: new Date()
          };
          
          setMessages(prev => [...prev, modelMsg]);
      } catch (e) {
          const errorMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: "CONNECTION ERROR: Unable to reach neural core. Check network or API configuration.",
              timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMsg]);
      } finally {
          setIsLoading(false);
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  };

  // Render Markdown-ish text (simple bolding/newlines)
  const renderText = (text: string) => {
      return text.split('\n').map((line, i) => (
          <p key={i} className="mb-2 min-h-[1em]" dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*(.*?)\*\*/g, '<span class="text-primary font-bold">$1</span>')
                          .replace(/`(.*?)`/g, '<code class="bg-black/30 px-1 rounded font-mono text-xs text-blue-300">$1</code>')
          }}></p>
      ));
  };

  return (
    <>
        {/* Toggle Button */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`fixed bottom-6 right-6 z-[60] size-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(247,147,26,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-surface-highlight border-2 border-white/10 text-white' : 'bg-primary text-background-dark'}`}
        >
            <span className="material-symbols-outlined text-3xl">
                {isOpen ? 'close' : 'psychology'}
            </span>
            {!isOpen && (
                <span className="absolute -top-1 -right-1 flex size-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-3 bg-success"></span>
                </span>
            )}
        </button>

        {/* Chat Interface */}
        {isOpen && (
            <div className="fixed bottom-24 right-6 z-[60] w-[90vw] md:w-[400px] h-[60vh] max-h-[600px] flex flex-col bg-[#161A1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 ring-1 ring-white/5">
                
                {/* Header */}
                <div className="p-4 bg-[#0D0F12] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                            <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white font-display">SatsCraft AI</h3>
                            <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Protocol Educator</p>
                        </div>
                    </div>
                    <div className="text-[10px] font-mono text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                        ONLINE
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-gradient-to-b from-[#161A1E] to-[#0D0F12]">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                    ? 'bg-primary text-background-dark font-medium rounded-tr-none' 
                                    : 'bg-surface-highlight border border-white/5 text-text-main rounded-tl-none shadow-md'
                            }`}>
                                {renderText(msg.text)}
                                <div className={`text-[9px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-black' : 'text-text-muted'} text-right`}>
                                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-surface-highlight border border-white/5 rounded-2xl rounded-tl-none p-4 flex gap-1">
                                <span className="size-2 bg-text-muted rounded-full animate-bounce"></span>
                                <span className="size-2 bg-text-muted rounded-full animate-bounce delay-100"></span>
                                <span className="size-2 bg-text-muted rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-[#0D0F12] border-t border-white/5">
                    <div className="relative flex items-center gap-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about Lightning, Script, or request a sim..."
                            className="w-full bg-[#1A1D21] text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none no-scrollbar border border-white/5"
                            rows={1}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-background-dark rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">send</span>
                        </button>
                    </div>
                </div>

            </div>
        )}
    </>
  );
};