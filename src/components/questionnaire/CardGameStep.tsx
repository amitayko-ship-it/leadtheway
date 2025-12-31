import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { CardGameData } from '@/types/questionnaire';

interface CardGameStepProps {
  cardGameData: CardGameData;
  onCardGameDataChange: (data: CardGameData) => void;
  onNext: () => void;
  onBack: () => void;
}

interface CardOption {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

interface BigStone {
  id: keyof CardGameData;
  title: string;
  subtitle: string;
  cards: CardOption[];
}

const bigStones: BigStone[] = [
  {
    id: 'focusPrioritization',
    title: '🪨 אבן גדולה 1: מיקוד ותיעדוף ניהולי',
    subtitle: 'איך נראה יום עבודה טיפוסי שלי',
    cards: [
      {
        id: 'day_fills_itself',
        emoji: '🃏',
        title: 'היום שלי מתמלא מעצמו',
        description: 'היומן נסגר דרך בקשות, בעיות ופניות מהשטח. דברים "חשובים באמת" נדחקים לסוף היום או לשבוע הבא.'
      },
      {
        id: 'important_slow',
        emoji: '🃏',
        title: 'יש לי דברים חשובים – אבל הם זזים לאט',
        description: 'ברור לי מה צריך לקדם, אבל בפועל זה מתקדם בקצב איטי ממה שהייתי רוצה.'
      },
      {
        id: 'holding_a_lot',
        emoji: '🃏',
        title: 'אני מחזיק הרבה על הראש',
        description: 'מצליח לגעת גם בשוטף וגם בדברים חשובים, אבל מרגיש שאני תמיד על הקצה.'
      },
      {
        id: 'choose_focus',
        emoji: '🃏',
        title: 'אני בוחר במה להתעסק',
        description: 'לא כל בקשה נכנסת ליומן, ויש לי סדרי עדיפויות יחסית ברורים.'
      },
      {
        id: 'clear_direction',
        emoji: '🃏',
        title: 'הזמן שלי משרת כיוון ברור',
        description: 'רוב השבוע מושקע בנושאים שמקדמים את היחידה קדימה, ולא רק בתחזוקה.'
      }
    ]
  },
  {
    id: 'timeRoutines',
    title: '🪨 אבן גדולה 2: ניהול זמן ושגרות',
    subtitle: 'איך נראית ההתנהלות השוטפת שלי',
    cards: [
      {
        id: 'no_routine',
        emoji: '🃏',
        title: 'אין אצלי שגרה קבועה',
        description: 'כל שבוע נראה אחרת, ומה שקורה נקבע לפי המציאות.'
      },
      {
        id: 'meetings_unclear',
        emoji: '🃏',
        title: 'יש פגישות קבועות – לא תמיד ברור למה',
        description: 'יש שגרות, אבל לא תמיד ברור מה הערך שלהן.'
      },
      {
        id: 'trying_order',
        emoji: '🃏',
        title: 'אני מנסה לייצר סדר, אבל זה לא תמיד מחזיק',
        description: 'חלק מהשגרות עובדות, אחרות מתמסמסות.'
      },
      {
        id: 'routines_help',
        emoji: '🃏',
        title: 'השגרות עוזרות לי לנהל',
        description: 'יש פגישות ותהליכים שעוזרים לי לשלוט בתמונה, גם כשהעומס עולה.'
      },
      {
        id: 'routines_advance',
        emoji: '🃏',
        title: 'השגרות שלי מקדמות אנשים ותוצאות',
        description: 'הזמן חוזר על עצמו בצורה שמייצרת התקדמות, לא רק עדכון.'
      }
    ]
  },
  {
    id: 'coachingDelegation',
    title: '🪨 אבן גדולה 3: חניכה ושחרור שליטה',
    subtitle: 'איך אני עובד עם אנשים ביום־יום',
    cards: [
      {
        id: 'do_alone',
        emoji: '🃏',
        title: 'קל לי יותר לעשות לבד',
        description: 'כשצריך שזה יקרה מהר או טוב, אני מעדיף לקחת את זה אליי.'
      },
      {
        id: 'delegate_close',
        emoji: '🃏',
        title: 'אני מעביר משימות, אבל נשאר קרוב',
        description: 'האחריות אצלם, אבל אני בודק מקרוב.'
      },
      {
        id: 'selective_release',
        emoji: '🃏',
        title: 'יש אנשים שאני משחרר להם, ויש כאלה שלא',
        description: 'מידת העצמאות תלויה באדם, לא בתפקיד.'
      },
      {
        id: 'define_goal',
        emoji: '🃏',
        title: 'אני מגדיר יעד ונותן חופש פעולה',
        description: 'חשוב לי שיבינו לאן הולכים, ופחות איך בדיוק.'
      },
      {
        id: 'people_grow',
        emoji: '🃏',
        title: 'אנשים גדלים סביבי',
        description: 'אני רואה אנשים שלוקחים יותר אחריות עם הזמן, ופונים אליי פחות על כל דבר.'
      }
    ]
  },
  {
    id: 'influenceLeadership',
    title: '🪨 אבן גדולה 4: השפעה והובלה',
    subtitle: 'איך דברים זזים סביבי בארגון',
    cards: [
      {
        id: 'need_presence',
        emoji: '🃏',
        title: 'כדי שמשהו יקרה – אני צריך להיות בתמונה',
        description: 'בלי נוכחות שלי, דברים נתקעים.'
      },
      {
        id: 'close_circle',
        emoji: '🃏',
        title: 'אני משפיע בעיקר במעגל הקרוב',
        description: 'עם הצוות שלי זה עובד טוב, מעבר לזה פחות.'
      },
      {
        id: 'pressure_driven',
        emoji: '🃏',
        title: 'אני מגייס דרך משימות ולחץ',
        description: 'כשצריך – אני יודע לדרוש, אבל זה שוחק.'
      },
      {
        id: 'clear_direction_leadership',
        emoji: '🃏',
        title: 'אנשים מבינים לאן אני מכוון',
        description: 'גם בלי שאגיד כל פעם, יש כיוון ברור.'
      },
      {
        id: 'things_move',
        emoji: '🃏',
        title: 'דברים זזים גם כשאני לא בחדר',
        description: 'יש אמון, רתימה והשפעה רוחבית, לא רק ניהול ישיר.'
      }
    ]
  },
  {
    id: 'teamLearning',
    title: '🪨 אבן גדולה 5: צוות ולמידה',
    subtitle: 'איך נראית הדינמיקה שאני מייצר',
    cards: [
      {
        id: 'task_driven',
        emoji: '🃏',
        title: 'אנחנו מתקדמים דרך משימות',
        description: 'פחות עוצרים לדבר על תהליך, יותר על מה צריך לקרות.'
      },
      {
        id: 'problem_talk',
        emoji: '🃏',
        title: 'מדברים על דברים רק כשיש בעיה',
        description: 'רפלקציה קורית בעיקר אחרי כשל.'
      },
      {
        id: 'inconsistent_dialogue',
        emoji: '🃏',
        title: 'יש שיח, אבל לא תמיד עקבי',
        description: 'לפעמים פותחים דברים, לא תמיד סוגרים.'
      },
      {
        id: 'space_to_talk',
        emoji: '🃏',
        title: 'יש מקום לדבר וללמוד',
        description: 'שיחות על איך עובדים ביחד הן חלק מהשגרה.'
      },
      {
        id: 'team_safe',
        emoji: '🃏',
        title: 'הצוות מרגיש בטוח להעלות דברים',
        description: 'יש פתיחות, גם לנושאים לא נוחים, ולמידה אמיתית.'
      }
    ]
  }
];

const CardGameStep: React.FC<CardGameStepProps> = ({
  cardGameData,
  onCardGameDataChange,
  onNext,
  onBack
}) => {
  const [currentStone, setCurrentStone] = useState(0);
  const totalStones = bigStones.length;
  const stone = bigStones[currentStone];

  const updateSelection = (stoneId: keyof CardGameData, cardId: string) => {
    const currentSelection = cardGameData[stoneId];
    let newSelection: string[];

    if (currentSelection.includes(cardId)) {
      newSelection = currentSelection.filter(id => id !== cardId);
    } else if (currentSelection.length < 3) {
      newSelection = [...currentSelection, cardId];
    } else {
      return; // Already 3 selected
    }

    onCardGameDataChange({
      ...cardGameData,
      [stoneId]: newSelection
    });
  };

  const canProceed = cardGameData[stone.id].length === 3;

  const handleNext = () => {
    if (currentStone < totalStones - 1) {
      setCurrentStone(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (currentStone > 0) {
      setCurrentStone(prev => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProgressBar currentStep={currentStone + 1} totalSteps={totalStones} />
      
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          🎴 משחק הקלפים
        </h2>
        <p className="text-muted-foreground">תפיסת תפקיד ניהולית</p>
      </div>

      <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border">
        <div className="text-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            {stone.title}
          </h3>
          <p className="text-muted-foreground">{stone.subtitle}</p>
          <div className="mt-3 inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            בחר 3 קלפים שמתארים אותך הכי טוב כיום ({cardGameData[stone.id].length}/3)
          </div>
        </div>

        <div className="space-y-3">
          {stone.cards.map((card) => {
            const isSelected = cardGameData[stone.id].includes(card.id);
            const isDisabled = !isSelected && cardGameData[stone.id].length >= 3;

            return (
              <button
                key={card.id}
                onClick={() => updateSelection(stone.id, card.id)}
                disabled={isDisabled}
                className={`
                  w-full p-4 rounded-xl transition-all duration-200 text-right
                  border-2 relative
                  ${isSelected
                    ? 'border-primary bg-accent shadow-soft'
                    : isDisabled
                      ? 'border-border bg-muted/30 opacity-50 cursor-not-allowed'
                      : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{card.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-1">{card.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex items-center gap-2"
        >
          {currentStone < totalStones - 1 ? 'הבא' : 'סיום'}
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CardGameStep;
