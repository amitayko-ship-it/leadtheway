import React, { useState } from 'react';
import WelcomeScreen from '@/components/questionnaire/WelcomeScreen';
import ResponsibilitiesStep from '@/components/questionnaire/ResponsibilitiesStep';
import TimeAllocationStep from '@/components/questionnaire/TimeAllocationStep';
import ModuleRatingsStep from '@/components/questionnaire/ModuleRatingsStep';
import PrioritiesStep from '@/components/questionnaire/PrioritiesStep';
import CompletionScreen from '@/components/questionnaire/CompletionScreen';
import { 
  QuestionnaireData, 
  initialQuestionnaireData, 
  TimeAllocation,
  ModuleRatings
} from '@/types/questionnaire';

type Step = 'welcome' | 'responsibilities' | 'timeAllocation' | 'moduleRatings' | 'priorities' | 'completion';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [data, setData] = useState<QuestionnaireData>(initialQuestionnaireData);

  const handleStart = () => setCurrentStep('responsibilities');

  const handleResponsibilitiesSelect = (responsibilities: string[]) => {
    setData(prev => ({ ...prev, responsibilities }));
  };

  const handleTimeAllocationUpdate = (timeAllocation: TimeAllocation) => {
    setData(prev => ({ ...prev, timeAllocation }));
  };

  const handleBurningChallengeChange = (burningChallenge: string) => {
    setData(prev => ({ ...prev, burningChallenge }));
  };

  const handleModuleRatingsUpdate = (moduleRatings: ModuleRatings) => {
    setData(prev => ({ ...prev, moduleRatings }));
  };

  const handlePrioritiesUpdate = (priorities: string[]) => {
    setData(prev => ({ ...prev, priorities }));
  };

  const handleRestart = () => {
    setData(initialQuestionnaireData);
    setCurrentStep('welcome');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      
      case 'responsibilities':
        return (
          <ResponsibilitiesStep
            selected={data.responsibilities}
            onSelect={handleResponsibilitiesSelect}
            onNext={() => setCurrentStep('timeAllocation')}
            onBack={() => setCurrentStep('welcome')}
          />
        );
      
      case 'timeAllocation':
        return (
          <TimeAllocationStep
            allocation={data.timeAllocation}
            onUpdate={handleTimeAllocationUpdate}
            burningChallenge={data.burningChallenge}
            onBurningChallengeChange={handleBurningChallengeChange}
            onNext={() => setCurrentStep('moduleRatings')}
            onBack={() => setCurrentStep('responsibilities')}
          />
        );
      
      case 'moduleRatings':
        return (
          <ModuleRatingsStep
            ratings={data.moduleRatings}
            onUpdate={handleModuleRatingsUpdate}
            onNext={() => setCurrentStep('priorities')}
            onBack={() => setCurrentStep('timeAllocation')}
          />
        );
      
      case 'priorities':
        return (
          <PrioritiesStep
            priorities={data.priorities}
            onUpdate={handlePrioritiesUpdate}
            onNext={() => setCurrentStep('completion')}
            onBack={() => setCurrentStep('moduleRatings')}
          />
        );
      
      case 'completion':
        return (
          <CompletionScreen
            data={data}
            onRestart={handleRestart}
          />
        );
      
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <>
      <head>
        <title>מצפן פיתוח מנהלים | שאלון אבחון</title>
        <meta name="description" content="שאלון אבחון לזיהוי אתגרים והתאמת מודולות למידה מבוססות דאטה עבור מנהלים ומנהלות" />
      </head>
      <main className="min-h-screen">
        {renderStep()}
      </main>
    </>
  );
};

export default Index;
