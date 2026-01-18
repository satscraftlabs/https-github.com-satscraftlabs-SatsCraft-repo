import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  // Full screen views without navigation
  if (currentView === View.ONBOARDING || currentView === View.LOGIN) {
    return <>{children}</>;
  }

  const NavItem = ({ icon, label, view, onClick }: { icon: string; label: string; view?: View; onClick?: () => void }) => {
    const isActive = currentView === view;
    // Desktop: Icon + Label, stacked, square aspect ratio
    // Mobile: Icon + Label, stacked, flexible width
    return (
      <button 
        onClick={onClick}
        className={`group flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all w-full md:aspect-square relative
          ${isActive 
            ? 'text-primary md:bg-primary/10' 
            : 'text-text-muted hover:text-white hover:bg-white/5'
          }`}
      >
        <span 
          className={`material-symbols-outlined text-2xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
          style={{fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"}}
        >
          {icon}
        </span>
        <span className="text-[9px] md:text-[10px] font-bold tracking-wider">{label}</span>
        {isActive && (
          <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen w-full bg-background-dark text-text-main overflow-hidden font-body">
      
      {/* Desktop Navigation Rail (Left) - Hidden on Mobile */}
      <nav className="hidden md:flex flex-col w-20 border-r border-white/5 bg-surface-dark items-center py-6 z-50 shrink-0 shadow-xl">
        <div className="mb-8">
           <div className="size-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/20 shadow-[0_0_15px_-3px_rgba(247,147,26,0.3)]">
              <span className="material-symbols-outlined">dataset</span>
           </div>
        </div>

        <div className="flex flex-col gap-4 w-full px-2">
           <NavItem icon="dashboard" label="HOME" view={View.DASHBOARD} onClick={() => onNavigate(View.DASHBOARD)} />
           <NavItem icon="school" label="LABS" view={View.LABS} onClick={() => onNavigate(View.LABS)} /> 
           <NavItem icon="menu_book" label="LIBRARY" view={View.RESOURCES} onClick={() => onNavigate(View.RESOURCES)} />
           <NavItem icon="emoji_events" label="RANK" view={View.RANK} onClick={() => onNavigate(View.RANK)} />
           <NavItem icon="settings" label="PROFILE" view={View.PROFILE} onClick={() => onNavigate(View.PROFILE)} />
        </div>

        <div className="mt-auto mb-4">
             <div className="size-8 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-center transition-colors">
                 <span className="material-symbols-outlined text-text-muted text-sm">help</span>
             </div>
        </div>
      </nav>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden h-full">
        {children}
        
        {/* Mobile Bottom Navigation - Hidden on Desktop */}
        <nav className="md:hidden bg-[#0D0F12]/95 backdrop-blur-md border-t border-white/5 absolute bottom-0 w-full z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          <div className="flex justify-around items-center h-16 px-2">
             <NavItem icon="dashboard" label="Home" view={View.DASHBOARD} onClick={() => onNavigate(View.DASHBOARD)} />
             <NavItem icon="school" label="Labs" view={View.LABS} onClick={() => onNavigate(View.LABS)} />
             <NavItem icon="menu_book" label="Library" view={View.RESOURCES} onClick={() => onNavigate(View.RESOURCES)} />
             <NavItem icon="emoji_events" label="Rank" view={View.RANK} onClick={() => onNavigate(View.RANK)} />
             <NavItem icon="settings" label="Profile" view={View.PROFILE} onClick={() => onNavigate(View.PROFILE)} />
          </div>
        </nav>
      </div>
    </div>
  );
};