import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface ResponsibilitiesStepProps {
  selected: string[];
  onSelect: (responsibilities: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const responsibilities = [
  { id: 'leading', label: 'הובלת אנשים וצוות', icon: '👥' },
  { id: 'goals', label: 'עמידה ביעדים ותוצאות עסקיות', icon: '🎯' },
  { id: 'tasks', label: 'ניהול משימות ותהליכים תפעוליים', icon: '📋' },
  { id: 'interfaces', label: 'תיאום ממשקים ועבודה רוחבית', icon: '🔗' },
  { id: 'change', label: 'הובלת שינויים והטמעת תהליכים', icon: '🔄' },
  { id: 'development', label: 'פיתוח עובדים/מנהלים (חניכה)', icon: '🌱' },
  { id: 'firefighting', label: '"כיבוי שריפות" וטיפול במשברים', icon: '🔥' },
];

const ResponsibilitiesStep: React.FC<ResponsibilitiesStepProps> = ({
  selected,
  onSelect,
  onNext,
  onBack,
}) => {
  const toggleResponsibility = (id: string) => {
    if (selected.includes(id)) {
      onSelect(selected.filter((r) => r !== id));
    } else {
      onSelect([...selected, id]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full animate-slide-up">
        <ProgressBar currentStep={1} totalSteps={5} />

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-medium border border-border">
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            תמונת מצב וחלוקת קשב
          </h2>
          <p className="text-muted-foreground mb-6">
            מהן האחריות המרכזיות שלך ביומיום? (בחירה מרובה)
          </p>

          <div className="grid gap-3 mb-8">
            {responsibilities.map((resp) => (
              <button
                key={resp.id}
                onClick={() => toggleResponsibility(resp.id)}
                className={`
                  w-full p-4 rounded-xl text-right transition-all duration-200
                  flex items-center gap-3 border-2
                  ${
                    selected.includes(resp.id)
                      ? 'border-primary bg-accent shadow-soft'
                      : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
              >
                <span className="text-2xl">{resp.icon}</span>
                <span className="flex-1 font-medium text-foreground">{resp.label}</span>
                {selected.includes(resp.id) && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </button>
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
              disabled={selected.length === 0}
            >
              המשך
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsibilitiesStep;
