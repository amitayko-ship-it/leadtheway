import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface CoachingStepProps {
  growthProof: string;
  autonomyPrice: number;
  coachingBlocker: string;
  onGrowthProofChange: (value: string) => void;
  onAutonomyPriceChange: (score: number) => void;
  onCoachingBlockerChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const blockerOptions = [
  { id: 'time', label: 'חוסר זמן', icon: '⏰' },
  { id: 'patience', label: 'חוסר סבלנות', icon: '😤' },
  { id: 'control', label: 'פחד מאיבוד שליטה', icon: '🎮' },
  { id: 'maturity', label: 'העובד לא בשל', icon: '🌱' },
  { id: 'method', label: 'אין לי שיטה ברורה', icon: '📋' },
];

const CoachingStep: React.FC<CoachingStepProps> = ({
  growthProof,
  autonomyPrice,
  coachingBlocker,
  onGrowthProofChange,
  onAutonomyPriceChange,
  onCoachingBlockerChange,
  onNext,
  onBack,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full animate-slide-up">
        <ProgressBar currentStep={5} totalSteps={8} />

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-medium border border-border">
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            חניכה ופיתוח
          </h2>
          <p className="text-muted-foreground mb-6">
            Coaching & Development
          </p>

          {/* Q9 - Growth Proof */}
          <div className="mb-8">
            <label className="block text-foreground font-medium mb-4">
              שם עובד אחד שביצע קפיצת מדרגה בעצמאות / יכולת ברבעון האחרון בזכות תהליך שאתה הובלת.
            </label>
            <Textarea
              value={growthProof}
              onChange={(e) => onGrowthProofChange(e.target.value)}
              placeholder="שם העובד או תיאור קצר..."
              rows={2}
            />
          </div>

          {/* Q10 - Autonomy Price */}
          <div className="mb-8">
            <label className="block text-foreground font-medium mb-4">
              באיזו מידה חוסר עצמאות של הצוות מונע ממך לעסוק בדברים החשובים באמת בתפקידך?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => onAutonomyPriceChange(score)}
                  className={`
                    w-12 h-12 rounded-xl font-bold text-lg transition-all duration-200
                    ${autonomyPrice === score
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                    }
                  `}
                >
                  {score}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
              <span>כמעט ולא</span>
              <span>במידה רבה מאוד</span>
            </div>
          </div>

          {/* Q11 - Coaching Blocker */}
          <div className="mb-8">
            <label className="block text-foreground font-medium mb-4">
              מה החסם המרכזי שלך בחניכה?
            </label>
            <div className="grid gap-3">
              {blockerOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onCoachingBlockerChange(option.id)}
                  className={`
                    w-full p-4 rounded-xl text-right transition-all duration-200
                    flex items-center gap-3 border-2
                    ${coachingBlocker === option.id
                      ? 'border-primary bg-accent shadow-soft'
                      : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="flex-1 font-medium text-foreground">{option.label}</span>
                  {coachingBlocker === option.id && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
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
              disabled={!coachingBlocker}
            >
              המשך
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingStep;
