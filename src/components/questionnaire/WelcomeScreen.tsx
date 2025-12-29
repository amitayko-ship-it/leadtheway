import React from 'react';
import { Button } from '@/components/ui/button';
import { Compass, Clock, Target, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full animate-fade-in">
        {/* Hero Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-2xl gradient-hero flex items-center justify-center shadow-glow animate-pulse-soft">
            <Compass className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
          מצפן פיתוח מנהלים
        </h1>
        
        <p className="text-lg text-muted-foreground text-center mb-8">
          זיהוי אתגרים והתאמת מודולות למידה מבוססות דאטה
        </p>

        {/* Info Card */}
        <div className="bg-card rounded-2xl p-6 shadow-medium mb-8 border border-border">
          <p className="text-foreground leading-relaxed text-center">
            מנהל/ת יקר/ה, השאלון הזה נוצר כדי להפסיק לנחש מה יעזור לך להצליח. 
            ב-4 דקות הקרובות נמפה את האתגרים היומיומיים שלך, כדי שנוכל לבנות עבורך 
            תהליך פיתוח ממוקד, פרקטי ורלוונטי באמת.
          </p>
          <div className="mt-4 p-4 bg-accent/50 rounded-xl">
            <p className="text-sm font-semibold text-accent-foreground text-center">
              <Sparkles className="w-4 h-4 inline ml-2" />
              אין תשובות נכונות - רק את המציאות שלך בשטח.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4">
            <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">4 דקות</p>
          </div>
          <div className="text-center p-4">
            <Target className="w-8 h-8 mx-auto mb-2 text-secondary" />
            <p className="text-sm text-muted-foreground">5 שלבים</p>
          </div>
          <div className="text-center p-4">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">תובנות מיידיות</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            variant="hero" 
            size="xl" 
            onClick={onStart}
            className="min-w-[200px]"
          >
            בואו נתחיל
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
