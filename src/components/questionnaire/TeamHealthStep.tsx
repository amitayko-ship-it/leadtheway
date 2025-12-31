import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { TeamHealthData, initialTeamHealthData } from '@/types/questionnaire';

interface TeamHealthStepProps {
  teamHealthData?: TeamHealthData;
  onTeamHealthDataChange: (data: TeamHealthData) => void;
  onNext: () => void;
  onBack: () => void;
}

type LayerKey = 'trust' | 'conflict' | 'commitment' | 'accountability' | 'results';

interface LayerConfig {
  key: LayerKey;
  title: string;
  subtitle: string;
  icon: string;
  question: string;
  options: { id: string; label: string; level: 'a' | 'b' | 'c' }[];
}

const layers: LayerConfig[] = [
  {
    key: 'trust',
    title: 'אמון',
    subtitle: 'Absence of Trust',
    icon: '🤝',
    question: 'איזה היגד הכי מתאר את הצוות שלך?',
    options: [
      { id: 'a', label: 'אנשים בצוות מרגישים בנוח להודות בטעות או בחוסר ידע, וגם לבקש עזרה.', level: 'a' },
      { id: 'b', label: 'יש פתיחות מסוימת, אבל אנשים עדיין שומרים על עצמם ולא תמיד חושפים חולשות.', level: 'b' },
      { id: 'c', label: 'רוב האנשים נמנעים מלהודות בטעות או לבקש עזרה כדי לא להיתפס כחלשים.', level: 'c' },
    ],
  },
  {
    key: 'conflict',
    title: 'קונפליקט',
    subtitle: 'Fear of Conflict',
    icon: '⚔️',
    question: 'כשעולות מחלוקות מקצועיות בצוות:',
    options: [
      { id: 'a', label: 'מתקיים דיון פתוח וישיר, גם אם הוא לא נוח.', level: 'a' },
      { id: 'b', label: 'מדברים על חלק מהדברים, אבל נושאים רגישים נשארים מתחת לפני השטח.', level: 'b' },
      { id: 'c', label: 'שומרים על שקט תעשייתי, ומחלוקות צצות בשיחות צד או לא בכלל.', level: 'c' },
    ],
  },
  {
    key: 'commitment',
    title: 'מחויבות',
    subtitle: 'Lack of Commitment',
    icon: '🎯',
    question: 'בסיום דיונים וישיבות צוות:',
    options: [
      { id: 'a', label: 'ברור לכולם מה הוחלט, מי אחראי ומה הצעד הבא.', level: 'a' },
      { id: 'b', label: 'יש כיוון כללי, אבל לא תמיד בהירות מלאה לגבי החלטות ובעלות.', level: 'b' },
      { id: 'c', label: 'יוצאים מישיבות עם תחושת בלבול או "נמשיך לדבר על זה".', level: 'c' },
    ],
  },
  {
    key: 'accountability',
    title: 'אחריותיות',
    subtitle: 'Avoidance of Accountability',
    icon: '📋',
    question: 'כשמישהו בצוות לא עומד בהתחייבות או בסטנדרט:',
    options: [
      { id: 'a', label: 'חברי הצוות מעירים אחד לשני באופן ישיר וענייני.', level: 'a' },
      { id: 'b', label: 'לרוב מצפים שהמנהל יטפל בזה.', level: 'b' },
      { id: 'c', label: 'מעדיפים לא להעיר כדי לא לפגוע, גם אם זה יוצר תסכול.', level: 'c' },
    ],
  },
  {
    key: 'results',
    title: 'תוצאות',
    subtitle: 'Inattention to Results',
    icon: '🏆',
    question: 'ביחס לביצועים והצלחות:',
    options: [
      { id: 'a', label: 'הצלחת הצוות חשובה יותר מהצלחה אישית או מחלקתית.', level: 'a' },
      { id: 'b', label: 'יש שילוב בין מיקוד צוותי לאינטרסים אישיים.', level: 'b' },
      { id: 'c', label: 'כל אחד מתמקד בעיקר במה שטוב לו או ליחידה שלו.', level: 'c' },
    ],
  },
];

const priorityOptions = [
  { id: 'trust', label: 'אמון', icon: '🤝' },
  { id: 'conflict', label: 'קונפליקט', icon: '⚔️' },
  { id: 'commitment', label: 'מחויבות', icon: '🎯' },
  { id: 'accountability', label: 'אחריותיות', icon: '📋' },
  { id: 'results', label: 'תוצאות', icon: '🏆' },
];

const TeamHealthStep: React.FC<TeamHealthStepProps> = ({
  teamHealthData: dataProp,
  onTeamHealthDataChange,
  onNext,
  onBack,
}) => {
  const data = dataProp || initialTeamHealthData;
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6; // 5 layers + summary

  const updateData = (updates: Partial<TeamHealthData>) => {
    onTeamHealthDataChange({ ...data, ...updates });
  };

  const canProceedToNextStep = () => {
    if (currentStep < 5) {
      const layer = layers[currentStep];
      return data[layer.key] !== '';
    }
    return true; // Summary is optional
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  // Find the bottleneck - lowest layer with 'c', then 'b'
  const getBottleneck = (): { layer: LayerConfig; level: string } | null => {
    for (const layer of layers) {
      if (data[layer.key] === 'c') {
        return { layer, level: 'c' };
      }
    }
    for (const layer of layers) {
      if (data[layer.key] === 'b') {
        return { layer, level: 'b' };
      }
    }
    return null;
  };

  const getLevelLabel = (level: string): string => {
    switch (level) {
      case 'a': return 'חזק';
      case 'b': return 'חלקי';
      case 'c': return 'חסר';
      default: return '';
    }
  };

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'a': return 'text-green-500';
      case 'b': return 'text-yellow-500';
      case 'c': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const renderLayerStep = (layer: LayerConfig) => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{layer.icon}</span>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{layer.title}</h3>
          <p className="text-sm text-muted-foreground">{layer.subtitle}</p>
        </div>
      </div>
      
      <label className="block text-foreground font-medium mb-4">
        {layer.question}
      </label>
      
      <div className="grid gap-3">
        {layer.options.map((option) => (
          <button
            key={option.id}
            onClick={() => updateData({ [layer.key]: option.id })}
            className={`
              w-full p-4 rounded-xl text-right transition-all duration-200
              flex items-start gap-3 border-2
              ${data[layer.key] === option.id
                ? 'border-primary bg-accent shadow-soft'
                : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
              }
            `}
          >
            <span className={`text-lg font-bold mt-0.5 w-6 ${data[layer.key] === option.id ? 'text-primary' : 'text-muted-foreground'}`}>
              {option.id.toUpperCase()}.
            </span>
            <span className="flex-1 font-medium text-foreground">{option.label}</span>
            {data[layer.key] === option.id && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSummaryStep = () => {
    const bottleneck = getBottleneck();
    const allAnswered = layers.every(l => data[l.key] !== '');
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">סיכום</h3>
          <p className="text-sm text-muted-foreground">תמונת המצב של הצוות</p>
        </div>

        {/* Results Summary */}
        {allAnswered && (
          <div className="p-4 rounded-xl bg-muted/50 border border-border mb-4">
            <div className="grid gap-2">
              {layers.map((layer) => (
                <div key={layer.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{layer.icon}</span>
                    <span className="text-foreground">{layer.title}</span>
                  </div>
                  <span className={`font-bold ${getLevelColor(data[layer.key])}`}>
                    {getLevelLabel(data[layer.key])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottleneck Alert */}
        {bottleneck && (
          <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground font-medium mb-1">צוואר הבקבוק</p>
              <p className="text-sm text-muted-foreground">
                לפי מודל לנציוני, <span className="font-bold">{bottleneck.layer.title}</span> הוא התחום שדורש את תשומת הלב הראשונה.
                לא עובדים על שכבה גבוהה לפני שהתחתונה יציבה.
              </p>
            </div>
          </div>
        )}

        {/* Gold Question */}
        <div className="mt-6 p-4 rounded-xl bg-secondary/10 border border-secondary/30">
          <label className="block text-foreground font-medium mb-3">
            ✨ שאלת הזהב: מה פעולה אחת שאם תעשה – תשפיע על הצוות לטובה?
          </label>
          <textarea
            value={data.goldAction || ''}
            onChange={(e) => updateData({ goldAction: e.target.value })}
            placeholder="תאר את הפעולה..."
            className="w-full p-3 rounded-xl border-2 border-border bg-background text-foreground text-right resize-none focus:border-primary focus:outline-none transition-colors"
            rows={3}
          />
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    if (currentStep < 5) {
      return renderLayerStep(layers[currentStep]);
    }
    return renderSummaryStep();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full animate-slide-up">
        <ProgressBar currentStep={6} totalSteps={8} />

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-medium border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                פיתוח צוות
              </h2>
              <p className="text-muted-foreground">
                מודל 5 הדיספונקציות של לנציוני
              </p>
            </div>
            <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {currentStep + 1} / {totalSteps}
            </div>
          </div>

          {/* Step Progress */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  idx <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={handlePrevStep} className="flex-1">
              <ChevronRight className="w-4 h-4 ml-2" />
              חזרה
            </Button>
            <Button 
              variant="hero" 
              onClick={handleNextStep} 
              className="flex-1"
              disabled={!canProceedToNextStep()}
            >
              {currentStep === totalSteps - 1 ? 'המשך' : 'הבא'}
              <ChevronLeft className="w-4 h-4 mr-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamHealthStep;
