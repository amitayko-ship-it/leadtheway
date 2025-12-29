import React from 'react';
import { Button } from '@/components/ui/button';
import { ModuleRatings } from '@/types/questionnaire';
import ProgressBar from './ProgressBar';

interface ModuleRatingsStepProps {
  ratings: ModuleRatings;
  onUpdate: (ratings: ModuleRatings) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Module {
  id: string;
  title: string;
  icon: string;
  questions: {
    key: keyof ModuleRatings;
    text: string;
    reversed?: boolean;
  }[];
}

const modules: Module[] = [
  {
    id: 'interfaces',
    title: 'ניהול ממשקים ועבודה מטריציונית',
    icon: '🔗',
    questions: [
      {
        key: 'interfacesFriction',
        text: 'אני חווה חיכוך או תסכול בתדירות גבוהה בעבודה מול יחידות אחרות בארגון.',
        reversed: true,
      },
      {
        key: 'interfacesClarity',
        text: 'ברור לי לגמרי מי תלוי בי ומי אני תלוי בו כדי להשיג את התוצאות שלי.',
      },
    ],
  },
  {
    id: 'change',
    title: 'הובלת שינוי וחוסן',
    icon: '🔄',
    questions: [
      {
        key: 'changeTools',
        text: 'אני מרגיש/ה שיש לי כלים להסביר לצוות שלי "למה" שינוי קורה, ולא רק "מה" עושים.',
      },
      {
        key: 'changeResistance',
        text: 'הצוות שלי נוטה להביע התנגדות או שחיקה כשנכנסים תהליכים חדשים.',
        reversed: true,
      },
    ],
  },
  {
    id: 'coaching',
    title: 'חניכה ופיתוח (Coaching)',
    icon: '🌱',
    questions: [
      {
        key: 'coachingDelegation',
        text: 'אני מוצא/ת את עצמי עושה משימות של העובדים שלי כי "זה יותר מהיר מללמד אותם".',
        reversed: true,
      },
      {
        key: 'coachingConfidence',
        text: 'אני מרגיש/ה בטחון מלא בניהול שיחות קשות או מתן משוב מקדם.',
      },
    ],
  },
  {
    id: 'team',
    title: 'בניית צוות מנצח',
    icon: '🏆',
    questions: [
      {
        key: 'teamOpenness',
        text: 'יש בצוות שלי שיח פתוח על טעויות וקונפליקטים בלי פחד.',
      },
      {
        key: 'teamCohesion',
        text: 'הצוות שלי מתפקד כקבוצה מגובשת עם מטרה אחת (ולא כאוסף של יחידים).',
      },
    ],
  },
];

const RatingButton: React.FC<{
  value: number;
  selected: boolean;
  onClick: () => void;
}> = ({ value, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-10 h-10 rounded-full font-semibold transition-all duration-200
      ${
        selected
          ? 'gradient-hero text-primary-foreground shadow-soft scale-110'
          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }
    `}
  >
    {value}
  </button>
);

const ModuleRatingsStep: React.FC<ModuleRatingsStepProps> = ({
  ratings,
  onUpdate,
  onNext,
  onBack,
}) => {
  const handleRatingChange = (key: keyof ModuleRatings, value: number) => {
    onUpdate({ ...ratings, [key]: value });
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <div className="max-w-3xl mx-auto animate-slide-up">
        <ProgressBar currentStep={3} totalSteps={5} />

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-medium border border-border">
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            מיפוי מודולות
          </h2>
          <p className="text-muted-foreground mb-6">
            דרג/י עד כמה ההיגדים הבאים מתארים את המצב אצלך
            <span className="block text-sm mt-1">(1 - בכלל לא, 5 - במידה רבה מאוד)</span>
          </p>

          <div className="space-y-8">
            {modules.map((module) => (
              <div 
                key={module.id} 
                className="p-5 rounded-xl bg-muted/30 border border-border"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <span className="text-2xl">{module.icon}</span>
                  {module.title}
                </h3>

                <div className="space-y-6">
                  {module.questions.map((question) => (
                    <div key={question.key}>
                      <p className="text-sm text-foreground mb-3 leading-relaxed">
                        {question.text}
                        {question.reversed && (
                          <span className="text-xs text-muted-foreground mr-2">(הפוך)</span>
                        )}
                      </p>
                      <div className="flex justify-between items-center max-w-xs">
                        <span className="text-xs text-muted-foreground">בכלל לא</span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <RatingButton
                              key={value}
                              value={value}
                              selected={ratings[question.key] === value}
                              onClick={() => handleRatingChange(question.key, value)}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">מאוד</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            <Button variant="outline" onClick={onBack} className="flex-1">
              חזרה
            </Button>
            <Button variant="hero" onClick={onNext} className="flex-1">
              המשך
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleRatingsStep;
