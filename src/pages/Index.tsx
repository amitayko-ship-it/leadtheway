import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WelcomeScreen from '@/components/questionnaire/WelcomeScreen';
import FocusControlStep from '@/components/questionnaire/FocusControlStep';
import TimeEnergyStep from '@/components/questionnaire/TimeEnergyStep';
import DecisionsPriceStep from '@/components/questionnaire/DecisionsPriceStep';
import InterfacesMapStep from '@/components/questionnaire/InterfacesMapStep';
import CoachingStep from '@/components/questionnaire/CoachingStep';
import TeamHealthStep from '@/components/questionnaire/TeamHealthStep';
import EngagementStep from '@/components/questionnaire/EngagementStep';
import ModulePrioritizationStep from '@/components/questionnaire/ModulePrioritizationStep';
import CompletionScreen from '@/components/questionnaire/CompletionScreen';
import { QuestionnaireData, initialQuestionnaireData, InterfaceEntry, ModulePriority } from '@/types/questionnaire';

type Step = 
  | 'welcome' 
  | 'focusControl' 
  | 'timeEnergy' 
  | 'decisionsPrice' 
  | 'interfacesMap' 
  | 'coaching' 
  | 'teamHealth' 
  | 'engagement' 
  | 'modulePrioritization' 
  | 'completion';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [data, setData] = useState<QuestionnaireData>(initialQuestionnaireData);

  const updateData = (updates: Partial<QuestionnaireData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleRestart = () => {
    setData(initialQuestionnaireData);
    setCurrentStep('welcome');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setCurrentStep('focusControl')} />;
      
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
            onBack={() => setCurrentStep('welcome')}
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
            interfaces={data.interfaces}
            onInterfacesChange={(interfaces: InterfaceEntry[]) => updateData({ interfaces })}
            onNext={() => setCurrentStep('coaching')}
            onBack={() => setCurrentStep('decisionsPrice')}
          />
        );
      
      case 'coaching':
        return (
          <CoachingStep
            growthProof={data.growthProof}
            autonomyPrice={data.autonomyPrice}
            coachingBlocker={data.coachingBlocker}
            onGrowthProofChange={(val) => updateData({ growthProof: val })}
            onAutonomyPriceChange={(score) => updateData({ autonomyPrice: score })}
            onCoachingBlockerChange={(val) => updateData({ coachingBlocker: val })}
            onNext={() => setCurrentStep('teamHealth')}
            onBack={() => setCurrentStep('interfacesMap')}
          />
        );
      
      case 'teamHealth':
        return (
          <TeamHealthStep
            teamHealth={data.teamHealth}
            onTeamHealthChange={(val) => updateData({ teamHealth: val })}
            onNext={() => setCurrentStep('engagement')}
            onBack={() => setCurrentStep('coaching')}
          />
        );
      
      case 'engagement':
        return (
          <EngagementStep
            energyLevel={data.energyLevel}
            meaningScore={data.meaningScore}
            pressurePattern={data.pressurePattern}
            onEnergyLevelChange={(score) => updateData({ energyLevel: score })}
            onMeaningScoreChange={(score) => updateData({ meaningScore: score })}
            onPressurePatternChange={(val) => updateData({ pressurePattern: val })}
            onNext={() => setCurrentStep('modulePrioritization')}
            onBack={() => setCurrentStep('teamHealth')}
          />
        );
      
      case 'modulePrioritization':
        return (
          <ModulePrioritizationStep
            modulePriorities={data.modulePriorities}
            onModulePrioritiesChange={(priorities) => updateData({ modulePriorities: priorities })}
            onNext={() => setCurrentStep('completion')}
            onBack={() => setCurrentStep('engagement')}
          />
        );
      
      case 'completion':
        return <CompletionScreen data={data} onRestart={handleRestart} />;
      
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
