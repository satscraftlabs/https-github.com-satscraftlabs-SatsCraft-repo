import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './views/Login'; // New View
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { Labs } from './views/Labs';
import { Rank } from './views/Rank';
import { Resources } from './views/Resources';
import { UTXOLab } from './simulations/UTXOLab';
import { LightningSandbox } from './simulations/LightningSandbox';
import { PhishingDefense } from './simulations/PhishingDefense';
import { EntropyLab } from './simulations/EntropyLab';
import { P2PTradingDesk } from './simulations/P2PTradingDesk';
import { AdversarialStressTest } from './simulations/AdversarialStressTest';
import { StandardSimulation } from './views/StandardSimulation';
import { BuilderSimulation } from './views/BuilderSimulation';
import { Audit } from './views/Audit';
import { PathSuccess } from './views/PathSuccess';
import { Profile } from './views/Profile';
import { DailyBonusModal } from './components/DailyBonusModal';
import { NotificationModal } from './components/NotificationModal';
import { AITutor } from './components/AITutor';
import { View, PathId, UserState } from './types';
import { INITIAL_USER_STATE, PATHS } from './constants';
import { MODULE_CONTENT, TAPROOT_UPGRADE_PATCH } from './data/moduleContent';
import { BUILDER_CONTENT } from './data/builderContent';
import { loginWithNostr, loginWithLightning, saveUserState } from './utils/auth';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LOGIN); // Start at Login
  const [userState, setUserState] = useState<UserState>(INITIAL_USER_STATE);
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [devMode, setDevMode] = useState(false);
  
  // Dynamic Content State ( Simulating Network Consensus )
  const [activeContent, setActiveContent] = useState(MODULE_CONTENT);
  const [appVersion, setAppVersion] = useState("v0.9.3 (SegWit)");

  // Daily Bonus State
  const [showDailyBonus, setShowDailyBonus] = useState(false);

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
    // Only show bonus if no critical notifications are pending and user is on dashboard
    if (view === View.DASHBOARD && !showDailyBonus && !currentNotification) {
        
        const hasClaimedToday = () => {
            if (!userState.lastDailyClaim) return false;
            const last = new Date(userState.lastDailyClaim);
            const now = new Date();
            return last.getDate() === now.getDate() &&
                   last.getMonth() === now.getMonth() &&
                   last.getFullYear() === now.getFullYear();
        };

        if (!hasClaimedToday()) {
            const timer = setTimeout(() => {
                setShowDailyBonus(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }
  }, [view, showDailyBonus, currentNotification, userState.lastDailyClaim]);

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

  // --- CONTENT UPGRADE LOGIC ---
  const handleSystemUpgrade = () => {
      // Merge patch
      setActiveContent(prev => ({
          ...prev,
          ...TAPROOT_UPGRADE_PATCH
      }));
      setAppVersion("v1.0.0 (Taproot)");
      
      // Notify user
      setUserState(prev => ({
          ...prev,
          notifications: [...prev.notifications, {
              id: Date.now().toString(),
              type: 'INFO',
              title: 'Consensus Upgrade Activated',
              message: 'Node updated to v1.0.0. Taproot features unlocked in Script module.',
          }]
      }));
  };

  // --- PENALTY LOGIC ---
  const handleMistake = (amount: number = 5) => {
      setUserState(prev => ({
          ...prev,
          reputation: Math.max(0, prev.reputation - amount)
      }));
  };

  const handleMajorPenalty = (amount: number = 100, reason: string) => {
      setUserState(prev => {
          const newReputation = Math.max(0, prev.reputation - amount);
          return {
              ...prev,
              reputation: newReputation,
              notifications: [...prev.notifications, {
                  id: Date.now().toString(),
                  type: 'PENALTY',
                  title: 'Slashing Event',
                  message: `${reason} -${amount} XP penalty applied to your reputation.`,
                  data: { amount }
              }]
          };
      });
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
    // Check custom labs
    if (activeSimulation === 'LAB_UTXO') xpGain = 150;
    if (activeSimulation === 'LAB_P2P') xpGain = 350;
    if (activeSimulation === '6.2') xpGain = 300;

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
          streak: prev.streak + 1,
          lastDailyClaim: new Date().toISOString()
      }));
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

    if (activeSimulation === 'LAB_UTXO') return <UTXOLab onComplete={handleSimulationComplete} />;
    if (activeSimulation === '4.3') return <LightningSandbox onComplete={handleSimulationComplete} />;
    if (activeSimulation === '6.3' || activeSimulation === '6.1') return <PhishingDefense onComplete={handleSimulationComplete} />;
    
    // New Simulators
    if (activeSimulation === '6.2') return <EntropyLab onComplete={handleSimulationComplete} devMode={devMode} />;
    if (activeSimulation === 'LAB_P2P') return <P2PTradingDesk onComplete={handleSimulationComplete} devMode={devMode} />;

    const content = activeContent[activeSimulation];
    if (content) {
        return (
            <StandardSimulation 
                content={content} 
                onComplete={handleSimulationComplete} 
                onExit={() => setView(View.DASHBOARD)} 
                onMistake={() => handleMistake(5)}
            />
        );
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
          userState={userState}
          devMode={devMode}
        />
      )}

      {view === View.LABS && (
        <Labs onSelectModule={handleModuleSelect} userState={userState} />
      )}

      {view === View.RESOURCES && (
        <Resources />
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
                if(success) {
                    setView(View.PATH_SUCCESS);
                } else {
                    handleMajorPenalty(100, "Operational Failure in Stress Test");
                    setView(View.DASHBOARD); 
                }
            }} 
            onExit={() => setView(View.DASHBOARD)} 
            devMode={devMode}
        />
      )}

      {view === View.PATH_SUCCESS && (
        <PathSuccess 
            pathId={userState.currentPath || PathId.SOVEREIGN}
            onReturn={() => setView(View.DASHBOARD)} 
        />
      )}

      {view === View.AUDIT && (
        <Audit onReturn={() => setView(View.DASHBOARD)} />
      )}

      {view === View.PROFILE && (
        <Profile 
            user={userState} 
            onLogout={handleLogout} 
            devMode={devMode} 
            setDevMode={setDevMode}
            appVersion={appVersion}
            onUpgrade={handleSystemUpgrade}
        />
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

      {/* AI Tutor is always available except on Login */}
      {view !== View.LOGIN && (
          <AITutor user={userState} />
      )}

    </Layout>
  );
};

export default App;