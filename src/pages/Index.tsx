import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WelcomeScreen from '@/components/questionnaire/WelcomeScreen';
import CardGameStep from '@/components/questionnaire/CardGameStep';
import CardGameSummaryScreen from '@/components/questionnaire/CardGameSummaryScreen';
import FocusControlStep from '@/components/questionnaire/FocusControlStep';
import TimeEnergyStep from '@/components/questionnaire/TimeEnergyStep';
import DecisionsPriceStep from '@/components/questionnaire/DecisionsPriceStep';
import InterfacesMapStep from '@/components/questionnaire/InterfacesMapStep';
import CoachingStep from '@/components/questionnaire/CoachingStep';
import TeamHealthStep from '@/components/questionnaire/TeamHealthStep';
import ModuleSelectionScreen from '@/components/questionnaire/ModuleSelectionScreen';
import ManagementCompassDashboard from '@/components/questionnaire/ManagementCompassDashboard';
import { QuestionnaireData, initialQuestionnaireData, InterfaceJourneyData, CoachingData, TeamHealthData, CardGameData } from '@/types/questionnaire';

const STORAGE_KEY = 'management-compass-data';
const STEP_STORAGE_KEY = 'management-compass-step';

type Step = 
  | 'welcome' 
  | 'cardGame'
  | 'cardGameSummary'
  | 'focusControl' 
  | 'timeEnergy' 
  | 'decisionsPrice' 
  | 'interfacesMap' 
  | 'coaching' 
  | 'teamHealth' 
  | 'moduleSelection'
  | 'dashboard';

const loadFromStorage = (): { data: QuestionnaireData; step: Step } => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_STORAGE_KEY) as Step | null;
    return {
      data: savedData ? JSON.parse(savedData) : initialQuestionnaireData,
      step: savedStep || 'welcome'
    };
  } catch {
    return { data: initialQuestionnaireData, step: 'welcome' };
  }
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>(() => loadFromStorage().step);
  const [data, setData] = useState<QuestionnaireData>(() => loadFromStorage().data);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Save step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STEP_STORAGE_KEY, currentStep);
  }, [currentStep]);

  const updateData = (updates: Partial<QuestionnaireData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleRestart = () => {
    setData(initialQuestionnaireData);
    setCurrentStep('welcome');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_STORAGE_KEY);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setCurrentStep('cardGame')} />;
      
      case 'cardGame':
        return (
          <CardGameStep
            cardGameData={data.cardGameData}
            onCardGameDataChange={(cardGameData: CardGameData) => updateData({ cardGameData })}
            onNext={() => setCurrentStep('cardGameSummary')}
            onBack={() => setCurrentStep('welcome')}
          />
        );
      
      case 'cardGameSummary':
        return (
          <CardGameSummaryScreen
            cardGameData={data.cardGameData}
            onNext={() => setCurrentStep('focusControl')}
          />
        );
      
      case 'focusControl':
        return (
          <FocusControlStep
            anchorScore={data.anchorScore}
            timeDrain={data.timeDrain}
            timeDrainOther={data.timeDrainOther}
            onAnchorChange={(score) => updateData({ anchorScore: score })}
            onTimeDrainChange={(drain) => updateData({ timeDrain: drain })}
            onTimeDrainOtherChange={(text) => updateData({ timeDrainOther: text })}
            onNext={() => setCurrentStep('timeEnergy')}
            onBack={() => setCurrentStep('cardGame')}
          />
        );
      
      case 'timeEnergy':
        return (
          <TimeEnergyStep
            quadrants={data.quadrants}
            breathingSpace={data.breathingSpace}
            onQuadrantsChange={(quadrants) => updateData({ quadrants })}
            onBreathingSpaceChange={(score) => updateData({ breathingSpace: score })}
            onNext={() => setCurrentStep('decisionsPrice')}
            onBack={() => setCurrentStep('focusControl')}
          />
        );
      
      case 'decisionsPrice':
        return (
          <DecisionsPriceStep
            immediatePrice={data.immediatePrice}
            longTermPrice={data.longTermPrice}
            retrospective={data.retrospective}
            onImmediatePriceChange={(val) => updateData({ immediatePrice: val })}
            onLongTermPriceChange={(val) => updateData({ longTermPrice: val })}
            onRetrospectiveChange={(val) => updateData({ retrospective: val })}
            onNext={() => setCurrentStep('interfacesMap')}
            onBack={() => setCurrentStep('timeEnergy')}
          />
        );
      
      case 'interfacesMap':
        return (
          <InterfacesMapStep
            interfaceJourney={data.interfaceJourney}
            onInterfaceJourneyChange={(interfaceJourney: InterfaceJourneyData) => updateData({ interfaceJourney })}
            onNext={() => setCurrentStep('coaching')}
            onBack={() => setCurrentStep('decisionsPrice')}
          />
        );
      
      case 'coaching':
        return (
          <CoachingStep
            coaching={data.coaching}
            onCoachingChange={(coaching: CoachingData) => updateData({ coaching })}
            onNext={() => setCurrentStep('teamHealth')}
            onBack={() => setCurrentStep('interfacesMap')}
          />
        );
      
      case 'teamHealth':
        return (
          <TeamHealthStep
            teamHealthData={data.teamHealthData}
            onTeamHealthDataChange={(teamHealthData: TeamHealthData) => updateData({ teamHealthData })}
            onNext={() => setCurrentStep('moduleSelection')}
            onBack={() => setCurrentStep('coaching')}
          />
        );
      
      case 'moduleSelection':
        return (
          <ModuleSelectionScreen
            data={data}
            onNext={() => setCurrentStep('dashboard')}
            onBack={() => setCurrentStep('teamHealth')}
          />
        );
      
      case 'dashboard':
        return <ManagementCompassDashboard data={data} onRestart={handleRestart} />;
      
      default:
        return <WelcomeScreen onStart={() => setCurrentStep('focusControl')} />;
    }
  };

  return (
    <>
      <head>
        <title>מצפן הניהול | אבחון ממוקד למנהלים</title>
        <meta name="description" content="כלי אבחוני לזיהוי איפה נתקע האימפקט הניהולי ואיפה מהלך ממוקד יכול לעשות קפיצה אמיתית" />
      </head>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {renderStep()}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
