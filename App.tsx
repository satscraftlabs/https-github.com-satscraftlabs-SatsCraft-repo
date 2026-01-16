import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './views/Login'; // New View
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { Labs } from './views/Labs';
import { Rank } from './views/Rank';
import { UTXOLab } from './simulations/UTXOLab';
import { LightningSandbox } from './simulations/LightningSandbox';
import { PhishingDefense } from './simulations/PhishingDefense';
import { AdversarialStressTest } from './simulations/AdversarialStressTest';
import { StandardSimulation } from './views/StandardSimulation';
import { BuilderSimulation } from './views/BuilderSimulation';
import { Audit } from './views/Audit';
import { Profile } from './views/Profile';
import { DailyBonusModal } from './components/DailyBonusModal';
import { NotificationModal } from './components/NotificationModal';
import { View, PathId, UserState } from './types';
import { INITIAL_USER_STATE, PATHS } from './constants';
import { MODULE_CONTENT } from './data/moduleContent';
import { BUILDER_CONTENT } from './data/builderContent';
import { loginWithNostr, loginWithLightning, saveUserState } from './utils/auth';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LOGIN); // Start at Login
  const [userState, setUserState] = useState<UserState>(INITIAL_USER_STATE);
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  
  // Daily Bonus State
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [hasClaimedDaily, setHasClaimedDaily] = useState(false);

  // Notification State
  const [currentNotification, setCurrentNotification] = useState<any>(null);

  // Persist state on every change if logged in
  useEffect(() => {
    if (!userState.isGuest && userState.pubkey) {
        saveUserState(userState);
    }
  }, [userState]);

  // Handle Notifications Queue (Penalty alerts, etc)
  useEffect(() => {
      if (userState.notifications && userState.notifications.length > 0) {
          setCurrentNotification(userState.notifications[0]);
      }
  }, [userState.notifications]);

  // Trigger daily bonus
  useEffect(() => {
    // Only show bonus if no critical notifications are pending
    if (view === View.DASHBOARD && !hasClaimedDaily && !showDailyBonus && !currentNotification) {
        const timer = setTimeout(() => {
            setShowDailyBonus(true);
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [view, hasClaimedDaily, showDailyBonus, currentNotification]);

  // Auth Handlers
  const handleNostrLogin = async () => {
    try {
        const loggedInUser = await loginWithNostr();
        setUserState(loggedInUser);
        handleLoginRedirect(loggedInUser);
    } catch (e) {
        throw e;
    }
  };

  const handleLightningLogin = async (address: string, displayName: string) => {
      try {
          const loggedInUser = await loginWithLightning(address, displayName);
          setUserState(loggedInUser);
          handleLoginRedirect(loggedInUser);
      } catch (e) {
          throw e;
      }
  };

  const handleLoginRedirect = (user: UserState) => {
    if (user.completedModules.length > 0) {
        setView(View.DASHBOARD);
    } else {
        setView(View.ONBOARDING);
    }
  };

  const handleGuestLogin = () => {
      setUserState({ ...INITIAL_USER_STATE, isGuest: true });
      setView(View.ONBOARDING);
  };

  const handleLogout = () => {
      setUserState(INITIAL_USER_STATE);
      setView(View.LOGIN);
  };

  const handleOnboardingComplete = (path: PathId) => {
    setUserState(prev => ({ ...prev, currentPath: path }));
    setView(View.DASHBOARD);
  };

  const handlePathChange = (path: PathId) => {
    setUserState(prev => ({ ...prev, currentPath: path }));
  };

  const handleModuleSelect = (moduleId: string) => {
    setActiveSimulation(moduleId);
    if (BUILDER_CONTENT[moduleId]) {
        setView(View.BUILDER);
    } else {
        setView(View.SIMULATION);
    }
  };

  const handleSimulationComplete = () => {
    if (!activeSimulation) return;

    // Calc XP for the module
    let xpGain = 0;
    // Check if standard module
    for (const p of PATHS) {
        const mod = p.modules.find(m => m.id === activeSimulation);
        if (mod) xpGain = mod.xp;
    }

    // Mark complete & Add XP
    const updatedCompleted = [...userState.completedModules];
    let newReputation = userState.reputation;
    
    if (!updatedCompleted.includes(activeSimulation)) {
        updatedCompleted.push(activeSimulation);
        newReputation += xpGain;
    }
    
    setUserState(prev => ({ 
        ...prev, 
        completedModules: updatedCompleted,
        reputation: newReputation
    }));

    // Check Path Completion Logic
    const currentPathData = PATHS.find(p => p.id === userState.currentPath);
    if (currentPathData) {
        const allModulesIds = currentPathData.modules.map(m => m.id);
        const isPathComplete = allModulesIds.every(id => updatedCompleted.includes(id));
        const wasAlreadyComplete = allModulesIds.every(id => userState.completedModules.includes(id));
        
        if (isPathComplete && !wasAlreadyComplete) {
            setView(View.STRESS_TEST);
            return;
        }
    }

    setView(View.AUDIT);
  };

  const handleClaimDaily = (amount: number) => {
      setUserState(prev => ({
          ...prev,
          reputation: prev.reputation + amount,
          streak: prev.streak + 1
      }));
      setHasClaimedDaily(true);
      setShowDailyBonus(false);
  };

  const handleCloseNotification = () => {
      // Remove the first notification from the list
      setUserState(prev => ({
          ...prev,
          notifications: prev.notifications.slice(1)
      }));
      setCurrentNotification(null);
  };

  const renderSimulation = () => {
    if (!activeSimulation) return null;

    if (activeSimulation === '1.4' && userState.currentPath === PathId.SOVEREIGN) return <StandardSimulation content={MODULE_CONTENT['1.4']} onComplete={handleSimulationComplete} onExit={() => setView(View.DASHBOARD)} />;
    if (activeSimulation === '4.3') return <LightningSandbox onComplete={handleSimulationComplete} />;
    if (activeSimulation === '6.3') return <PhishingDefense onComplete={handleSimulationComplete} />;

    const content = MODULE_CONTENT[activeSimulation];
    if (content) {
        return <StandardSimulation content={content} onComplete={handleSimulationComplete} onExit={() => setView(View.DASHBOARD)} />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full bg-background-dark p-6 text-center">
            <span className="material-symbols-outlined text-6xl text-text-muted mb-4">construction</span>
            <h2 className="text-xl font-bold text-white mb-2">Under Construction</h2>
            <div className="flex gap-4 mt-4">
                <button onClick={() => setView(View.DASHBOARD)} className="text-text-muted font-bold hover:text-white">Return</button>
            </div>
        </div>
    );
  };

  return (
    <Layout currentView={view} onNavigate={setView}>
      {view === View.LOGIN && (
          <Login 
            onNostrLogin={handleNostrLogin} 
            onLightningLogin={handleLightningLogin}
            onGuest={handleGuestLogin} 
          />
      )}

      {view === View.ONBOARDING && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      {view === View.DASHBOARD && (
        <Dashboard 
          currentPath={userState.currentPath || PathId.SOVEREIGN} 
          onSelectModule={handleModuleSelect} 
          onViewProfile={() => setView(View.PROFILE)}
          onEnterStressTest={() => setView(View.STRESS_TEST)}
          onPathChange={handlePathChange}
          userState={userState} // Correctly passed prop
        />
      )}

      {view === View.LABS && (
        <Labs onSelectModule={handleModuleSelect} />
      )}

      {view === View.RANK && (
        <Rank currentUser={userState} />
      )}

      {view === View.SIMULATION && renderSimulation()}

      {view === View.BUILDER && activeSimulation && BUILDER_CONTENT[activeSimulation] && (
        <BuilderSimulation 
            content={BUILDER_CONTENT[activeSimulation]} 
            onComplete={handleSimulationComplete} 
            onExit={() => setView(View.DASHBOARD)} 
        />
      )}

      {view === View.STRESS_TEST && (
        <AdversarialStressTest 
            pathId={userState.currentPath || PathId.SOVEREIGN}
            onComplete={(success, score) => {
                setView(View.AUDIT);
            }} 
            onExit={() => setView(View.DASHBOARD)} 
        />
      )}

      {view === View.AUDIT && (
        <Audit onReturn={() => setView(View.DASHBOARD)} />
      )}

      {view === View.PROFILE && (
        <Profile user={userState} onLogout={handleLogout} />
      )}

      {showDailyBonus && (
          <DailyBonusModal 
            streak={userState.streak} 
            onClaim={handleClaimDaily} 
            onClose={() => setShowDailyBonus(false)} 
          />
      )}

      {currentNotification && (
          <NotificationModal 
            notification={currentNotification} 
            onClose={handleCloseNotification} 
          />
      )}
    </Layout>
  );
};

export default App;