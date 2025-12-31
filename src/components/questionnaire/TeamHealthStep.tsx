import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface TeamHealthStepProps {
  teamHealth: string;
  onTeamHealthChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const teamHealthOptions = [
  { 
    id: 'conflict_avoidance', 
    label: 'נמנעים מעימותים כדי לשמור על שקט',
    description: 'חוסר אמון / Fear of Conflict',
    icon: '🤐'
  },
  { 
    id: 'lack_clarity', 
    label: 'הרבה דיונים, חוסר בהירות בביצוע',
    description: 'חוסר מחויבות / Lack of Commitment',
    icon: '🌀'
  },
  { 
    id: 'low_standards', 
    label: 'לא דורשים מספיק סטנדרטים',
    description: 'הימנעות מאחריותיות / Avoidance of Accountability',
    icon: '📊'
  },
  { 
    id: 'personal_interests', 
    label: 'אינטרסים אישיים גוברים על הצלחת הצוות',
    description: 'חוסר תשומת לב לתוצאות / Inattention to Results',
    icon: '🎯'
  },
  { 
    id: 'fear_vulnerability', 
    label: 'קשה לדבר על טעויות וחולשות',
    description: 'היעדר אמון / Absence of Trust',
    icon: '🔒'
  },
];

const TeamHealthStep: React.FC<TeamHealthStepProps> = ({
  teamHealth,
  onTeamHealthChange,
  onNext,
  onBack,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full animate-slide-up">
        <ProgressBar currentStep={6} totalSteps={8} />

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-medium border border-border">
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            בריאות הצוות
          </h2>
          <p className="text-muted-foreground mb-6">
            מודל Lencioni
          </p>

          <div className="mb-8">
            <label className="block text-foreground font-medium mb-4">
              בחר את ההיגד שמתאר הכי טוב את הצוות שלך:
            </label>
            <div className="grid gap-3">
              {teamHealthOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onTeamHealthChange(option.id)}
                  className={`
                    w-full p-4 rounded-xl text-right transition-all duration-200
                    flex items-start gap-3 border-2
                    ${teamHealth === option.id
                      ? 'border-primary bg-accent shadow-soft'
                      : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                >
                  <span className="text-2xl mt-1">{option.icon}</span>
                  <div className="flex-1">
                    <span className="font-medium text-foreground block">{option.label}</span>
                    <span className="text-sm text-muted-foreground">{option.description}</span>
                  </div>
                  {teamHealth === option.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              חזרה
            </Button>
            <Button 
              variant="hero" 
              onClick={onNext} 
              className="flex-1"
              disabled={!teamHealth}
            >
              המשך
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamHealthStep;
