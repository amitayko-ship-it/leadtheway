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

interface LayerOption {
  id: string;
  label: string;
}

interface LayerConfig {
  key: LayerKey;
  title: string;
  subtitle: string;
  icon: string;
  question: string;
  options: LayerOption[];
}

const layers: LayerConfig[] = [
  {
    key: 'trust',
    title: 'אמון',
    subtitle: 'דרך תגובה לכשל',
    icon: '🤝',
    question: 'כשקורה כשל מקצועי בצוות, מה קורה בדרך כלל קודם?',
    options: [
      { id: 'a', label: 'מנסים להבין מהר מה קרה ואיך מתקנים' },
      { id: 'b', label: 'מחפשים מי אחראי כדי למנוע חזרה על זה' },
      { id: 'c', label: 'מגנים קודם על הצוות כלפי חוץ, ורק אחר כך בודקים פנימה' },
      { id: 'd', label: 'הנושא מטופל בעיקר בשיחות אחד־על־אחד' },
      { id: 'e', label: 'מעדיפים לא לפתוח את זה אם זה לא קריטי' },
    ],
  },
  {
    key: 'conflict',
    title: 'קונפליקט',
    subtitle: 'דרך ישיבות',
    icon: '⚔️',
    question: 'בדיונים מקצועיים עם דעות שונות, מה הכי מאפיין את הישיבות?',
    options: [
      { id: 'a', label: 'יש ויכוח פתוח וישיר, גם אם זה לא נעים' },
      { id: 'b', label: 'חלק מדברים בחדר, חלק בשיחות מסדרון' },
      { id: 'c', label: 'נזהרים לא להיכנס לנושאים רגישים' },
      { id: 'd', label: 'ההחלטות מתקבלות בעיקר מחוץ לישיבה' },
      { id: 'e', label: 'אני נדרש "לסגור" כדי להתקדם' },
    ],
  },
  {
    key: 'commitment',
    title: 'מחויבות',
    subtitle: 'דרך סיום דיון',
    icon: '🎯',
    question: 'אחרי ישיבות צוות משמעותיות, מה קורה בפועל?',
    options: [
      { id: 'a', label: 'ברור מה הוחלט ומי עושה מה' },
      { id: 'b', label: 'ברור הכיוון, פחות ברור הביצוע' },
      { id: 'c', label: 'חוזרים לנושא שוב בישיבה הבאה' },
      { id: 'd', label: 'אנשים מפרשים אחרת את אותה החלטה' },
      { id: 'e', label: 'אין באמת החלטה, רק המשך דיון' },
    ],
  },
  {
    key: 'accountability',
    title: 'אחריותיות',
    subtitle: 'דרך סטנדרטים',
    icon: '📋',
    question: 'כשמישהו בצוות לא עומד בהתחייבות, מה קורה לרוב?',
    options: [
      { id: 'a', label: 'חברי צוות מעירים אחד לשני ישירות' },
      { id: 'b', label: 'מצפים שאני אתערב' },
      { id: 'c', label: 'זה עובר מתחת לרדאר' },
      { id: 'd', label: 'מדברים על זה רק בדיעבד' },
      { id: 'e', label: 'הסטנדרטים לא מספיק ברורים מלכתחילה' },
    ],
  },
  {
    key: 'results',
    title: 'תוצאות',
    subtitle: 'דרך מדדי הצלחה',
    icon: '🏆',
    question: 'מה באמת מגדיר "הצלחה" בצוות ביום־יום?',
    options: [
      { id: 'a', label: 'עמידה ביעדי הצוות כיחידה' },
      { id: 'b', label: 'עמידה ביעדי כל אחד בתחומו' },
      { id: 'c', label: 'הצלחה מול הלקוחות' },
      { id: 'd', label: 'שקט תעשייתי והימנעות מבעיות' },
      { id: 'e', label: 'הישגים אישיים / מחלקתיים' },
    ],
  },
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

  // Identify dominant dysfunction pattern
  const getDominantPattern = (): { layer: LayerConfig; answer: string } | null => {
    for (const layer of layers) {
      if (data[layer.key]) {
        return { layer, answer: data[layer.key] };
      }
    }
    return null;
  };

  const getAnswerLabel = (layerKey: LayerKey, answerId: string): string => {
    const layer = layers.find(l => l.key === layerKey);
    if (!layer) return '';
    const option = layer.options.find(o => o.id === answerId);
    return option?.label || '';
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

      <div className="p-3 rounded-lg bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground">
          💡 חשוב על החודש האחרון. ענה לפי מה שקורה בפועל, לא לפי איך שהיית רוצה שזה ייראה.
        </p>
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
    const allAnswered = layers.every(l => data[l.key] !== '');
    const dominantPattern = getDominantPattern();
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">סיכום דינמיקה צוותית</h3>
          <p className="text-sm text-muted-foreground">תמונת המצב של הצוות – אבחון עקיף</p>
        </div>

        {/* Results Summary */}
        {allAnswered && (
          <div className="p-4 rounded-xl bg-muted/50 border border-border mb-4">
            <div className="grid gap-3">
              {layers.map((layer) => (
                <div key={layer.key} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span>{layer.icon}</span>
                    <span className="text-foreground font-medium">{layer.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mr-7">
                    {getAnswerLabel(layer.key, data[layer.key])}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pattern Insight */}
        {dominantPattern && (
          <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground font-medium mb-1">דפוס מרכזי</p>
              <p className="text-sm text-muted-foreground">
                הדפוס המרכזי שעולה בצוות שלך כרגע הוא סביב <span className="font-bold">{dominantPattern.layer.title}</span>.
                <br />
                זה כנראה משפיע על השכבות שמעליו בפירמידה.
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
                דינמיקה צוותית
              </h2>
              <p className="text-muted-foreground">
                אבחון עקיף (Lencioni-based)
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