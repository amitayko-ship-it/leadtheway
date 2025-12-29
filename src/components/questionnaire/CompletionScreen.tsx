import React from 'react';
import { Button } from '@/components/ui/button';
import { QuestionnaireData } from '@/types/questionnaire';
import { CheckCircle2, TrendingUp, Target, Sparkles } from 'lucide-react';

interface CompletionScreenProps {
  data: QuestionnaireData;
  onRestart: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ data, onRestart }) => {
  const firefightingPercentage = data.timeAllocation.firefighting;
  const developmentPercentage = data.timeAllocation.development;

  // Calculate module averages
  const moduleScores = {
    interfaces: (data.moduleRatings.interfacesClarity + (6 - data.moduleRatings.interfacesFriction)) / 2,
    change: (data.moduleRatings.changeTools + (6 - data.moduleRatings.changeResistance)) / 2,
    coaching: ((6 - data.moduleRatings.coachingDelegation) + data.moduleRatings.coachingConfidence) / 2,
    team: (data.moduleRatings.teamOpenness + data.moduleRatings.teamCohesion) / 2,
  };

  const lowestModule = Object.entries(moduleScores).reduce((a, b) => 
    a[1] < b[1] ? a : b
  );

  const moduleNames: Record<string, string> = {
    interfaces: 'ניהול ממשקים',
    change: 'הובלת שינוי',
    coaching: 'חניכה ופיתוח',
    team: 'בניית צוות',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full animate-scale-in">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center shadow-glow">
            <CheckCircle2 className="w-14 h-14 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">
          תודה על השיתוף! 🎉
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          הנתונים שלך נשמרו בהצלחה
        </p>

        {/* Insights Card */}
        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-medium border border-border mb-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <Sparkles className="w-6 h-6 text-secondary" />
            התובנות המיידיות שלך
          </h2>

          {/* Time Distribution Insight */}
          <div className="p-5 rounded-xl bg-accent/30 border border-primary/20 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-foreground">חלוקת זמן</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  לפי חלוקת הזמן שציינת, אתה משקיע{' '}
                  <span className="font-bold text-secondary">{firefightingPercentage}%</span>{' '}
                  מהזמן בפעולות "תגובתיות" (כיבוי שריפות) ורק{' '}
                  <span className="font-bold text-primary">{developmentPercentage}%</span>{' '}
                  בפיתוח אנשים.
                </p>
                <p className="text-sm text-foreground mt-2 font-medium">
                  המטרה שלנו בתהליך הפיתוח תהיה להגדיל את זמן הניהול היוזם שלך.
                </p>
              </div>
            </div>
          </div>

          {/* Module Focus Insight */}
          <div className="p-5 rounded-xl bg-muted/50 border border-border mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-foreground">תחום לפיתוח</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  התחום שדורש את תשומת הלב הגבוהה ביותר הוא{' '}
                  <span className="font-bold text-primary">{moduleNames[lowestModule[0]]}</span>.
                  נמליץ להתחיל את תהליך הפיתוח בתחום זה.
                </p>
              </div>
            </div>
          </div>

          {/* Priority Summary */}
          <div className="p-5 rounded-xl bg-muted/30 border border-border">
            <h3 className="font-semibold mb-3 text-foreground">סדר העדיפויות שלך:</h3>
            <div className="flex flex-wrap gap-2">
              {data.priorities.map((priority, index) => (
                <span 
                  key={priority}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm"
                >
                  <span className="w-5 h-5 rounded-full gradient-hero text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  {moduleNames[priority]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            צוות ה-HR יקבל את התוצאות ויתאם איתך תהליך פיתוח מותאם אישית
          </p>
          <Button variant="soft" onClick={onRestart}>
            מילוי שאלון חדש
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
