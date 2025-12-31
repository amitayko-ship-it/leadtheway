import React from 'react';
import { Button } from '@/components/ui/button';
import ProgressBar from './ProgressBar';
import { ModulePriority } from '@/types/questionnaire';

interface ModulePriorities {
  teamDevelopment: ModulePriority;
  interfaceManagement: ModulePriority;
  coachingDevelopment: ModulePriority;
  managerialFocus: ModulePriority;
}

interface ModulePrioritizationStepProps {
  modulePriorities: ModulePriorities;
  onModulePrioritiesChange: (priorities: ModulePriorities) => void;
  onNext: () => void;
  onBack: () => void;
}

const modules = [
  { 
    key: 'teamDevelopment' as const, 
    label: 'פיתוח צוות', 
    icon: '👥',
    description: 'בניית צוות מגובש ובעל ביצועים גבוהים'
  },
  { 
    key: 'interfaceManagement' as const, 
    label: 'ניהול ממשקים', 
    icon: '🔗',
    description: 'שיפור עבודה רוחבית ותיאום בין יחידות'
  },
  { 
    key: 'coachingDevelopment' as const, 
    label: 'חניכה ופיתוח עובדים', 
    icon: '🌱',
    description: 'פיתוח עצמאות ויכולות הצוות'
  },
  { 
    key: 'managerialFocus' as const, 
    label: 'מיקוד ניהולי / זמן', 
    icon: '🎯',
    description: 'ניהול זמן, עדיפויות והשקעה נכונה'
  },
];

const ratingLabels = {
  value: {
    label: 'ערך',
    question: 'כמה קפיצת מדרגה כאן תשפיע על השקט שלך, הביצועים והתוצאות?'
  },
  feasibility: {
    label: 'ישימות',
    question: 'עד כמה זה בידיים שלך להשתפר בזה בחודש הקרוב?'
  },
  readiness: {
    label: 'מוכנות',
    question: 'עד כמה אתה מוכן להשקיע 2-3 שעות בשבוע ביישום בפועל?'
  },
};

const ModulePrioritizationStep: React.FC<ModulePrioritizationStepProps> = ({
  modulePriorities,
  onModulePrioritiesChange,
  onNext,
  onBack,
}) => {
  const updateModulePriority = (
    moduleKey: keyof ModulePriorities,
    field: keyof ModulePriority,
    value: number
  ) => {
    onModulePrioritiesChange({
      ...modulePriorities,
      [moduleKey]: {
        ...modulePriorities[moduleKey],
        [field]: value,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-3xl w-full animate-slide-up">
        <ProgressBar currentStep={8} totalSteps={8} />

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-medium border border-border">
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            תעדוף מודולות
          </h2>
          <p className="text-muted-foreground mb-6">
            דרג כל מודולה בשלושה ממדים
          </p>

          <div className="space-y-6 mb-8">
            {modules.map((module) => (
              <div
                key={module.key}
                className="p-4 bg-muted/50 rounded-xl border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{module.icon}</span>
                  <div>
                    <h3 className="font-bold text-foreground">{module.label}</h3>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {(Object.keys(ratingLabels) as Array<keyof typeof ratingLabels>).map((field) => (
                    <div key={field} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="sm:w-1/3">
                        <span className="text-sm font-medium text-foreground">
                          {ratingLabels[field].label}:
                        </span>
                        <p className="text-xs text-muted-foreground hidden sm:block">
                          {ratingLabels[field].question}
                        </p>
                      </div>
                      <div className="flex gap-2 sm:flex-1 justify-start sm:justify-end">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            onClick={() => updateModulePriority(module.key, field, score)}
                            className={`
                              w-9 h-9 rounded-lg font-bold text-sm transition-all duration-200
                              ${modulePriorities[module.key][field] === score
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background text-muted-foreground hover:bg-accent'
                              }
                            `}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              חזרה
            </Button>
            <Button 
              variant="hero" 
              onClick={onNext} 
              className="flex-1"
            >
              סיום
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePrioritizationStep;
