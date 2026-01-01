import React from 'react';
import { Button } from '@/components/ui/button';
import { CardGameData } from '@/types/questionnaire';
import { getFullModules } from '@/lib/moduleSelection';
import { ArrowLeft, Compass } from 'lucide-react';

interface CardGameSummaryScreenProps {
  cardGameData: CardGameData;
  onNext: () => void;
}

const CardGameSummaryScreen: React.FC<CardGameSummaryScreenProps> = ({ cardGameData, onNext }) => {
  // Get the first full module to show what's next
  const fullModules = getFullModules(cardGameData);
  const firstModule = fullModules[0];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-xl w-full animate-scale-in text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-glow">
            <Compass className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
          עצרנו רגע כדי לדייק את ההמשך
        </h1>

        {/* Body Text */}
        <div className="text-right space-y-4 mb-8 px-4">
          <p className="text-muted-foreground leading-relaxed">
            סיימת את השלב הראשון בתהליך.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            הבחירות שעשית משקפות
            <br />
            <span className="text-foreground font-medium">דפוסי ניהול כפי שהם נראים בפועל בחודש האחרון.</span>
          </p>
          <p className="text-muted-foreground leading-relaxed">
            מכאן אנחנו ממשיכים בצורה ממוקדת.
            <br />
            לא ניגע בהכול.
            <br />
            <span className="text-foreground font-medium">נעמיק איפה שיש סיכוי אמיתי להזיז משהו.</span>
          </p>
        </div>

        {/* Next Module Preview */}
        {firstModule && (
          <div className="bg-card rounded-xl p-5 border border-border mb-6 text-right">
            <p className="text-sm text-muted-foreground mb-2">
              על בסיס מה שעלה כאן,
              <br />
              השלב הבא מתמקד ב־
            </p>
            <div className="flex items-center gap-3 justify-end">
              <span className="text-xl">🪨</span>
              <span className="text-lg font-bold text-primary">{firstModule.name}</span>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <Button
          variant="hero"
          size="lg"
          onClick={onNext}
          className="gap-2"
        >
          להמשך
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Subtle footnote */}
        <p className="text-xs text-muted-foreground mt-4">
          מבוסס על הבחירות שלך במשחק הקלפים
        </p>
      </div>
    </div>
  );
};

export default CardGameSummaryScreen;
