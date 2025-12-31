import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Square, Star } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { CardGameData, CardGameSelection } from '@/types/questionnaire';

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

type SelectionType = 'most' | 'least' | 'aspiration';

const CardGameStep: React.FC<CardGameStepProps> = ({
  cardGameData,
  onCardGameDataChange,
  onNext,
  onBack
}) => {
  const [currentStone, setCurrentStone] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'extremes' | 'aspiration'>('extremes');
  const totalStones = bigStones.length;
  const stone = bigStones[currentStone];
  const selection = cardGameData[stone.id];

  const updateSelection = (type: SelectionType, cardId: string) => {
    const currentSelection = { ...selection };
    
    // If clicking on the same card that's already selected, deselect it
    if (currentSelection[type] === cardId) {
      currentSelection[type] = '';
    } else {
      // Check if this card is already used in another selection
      if (type === 'most' && currentSelection.least === cardId) {
        return; // Can't select same card for both most and least
      }
      if (type === 'least' && currentSelection.most === cardId) {
        return; // Can't select same card for both most and least
      }
      currentSelection[type] = cardId;
    }

    onCardGameDataChange({
      ...cardGameData,
      [stone.id]: currentSelection
    });
  };

  const canProceedExtreme = selection.most !== '' && selection.least !== '';
  const canProceedAspiration = selection.aspiration !== '';
  const canProceed = currentPhase === 'extremes' ? canProceedExtreme : canProceedAspiration;

  const handleNext = () => {
    if (currentPhase === 'extremes') {
      setCurrentPhase('aspiration');
    } else {
      if (currentStone < totalStones - 1) {
        setCurrentStone(prev => prev + 1);
        setCurrentPhase('extremes');
      } else {
        onNext();
      }
    }
  };

  const handleBack = () => {
    if (currentPhase === 'aspiration') {
      setCurrentPhase('extremes');
    } else {
      if (currentStone > 0) {
        setCurrentStone(prev => prev - 1);
        setCurrentPhase('aspiration');
      } else {
        onBack();
      }
    }
  };

  const getCardStatus = (cardId: string): SelectionType | null => {
    if (selection.most === cardId) return 'most';
    if (selection.least === cardId) return 'least';
    if (selection.aspiration === cardId) return 'aspiration';
    return null;
  };

  const isCardDisabled = (cardId: string): boolean => {
    if (currentPhase === 'extremes') {
      // In extremes phase, can't select if it would conflict
      return false; // We handle conflicts in updateSelection
    } else {
      // In aspiration phase, no restrictions
      return false;
    }
  };

  const getCardStyles = (cardId: string) => {
    const status = getCardStatus(cardId);
    
    if (currentPhase === 'extremes') {
      if (status === 'most') {
        return 'border-red-500 bg-red-50 dark:bg-red-950/30 shadow-soft ring-2 ring-red-500/30';
      }
      if (status === 'least') {
        return 'border-green-500 bg-green-50 dark:bg-green-950/30 shadow-soft ring-2 ring-green-500/30';
      }
    } else {
      if (status === 'aspiration') {
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 shadow-soft ring-2 ring-yellow-500/30';
      }
      // Show previous selections dimmed
      if (status === 'most' || status === 'least') {
        return 'border-muted bg-muted/30 opacity-60';
      }
    }
    
    return 'border-border bg-background hover:border-primary/50 hover:bg-muted/50';
  };

  const renderCardBadge = (cardId: string) => {
    const status = getCardStatus(cardId);
    
    if (status === 'most') {
      return (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
          <Square className="w-3 h-3 fill-current" />
          הכי הרבה
        </div>
      );
    }
    if (status === 'least') {
      return (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
          <Square className="w-3 h-3 fill-current" />
          הכי פחות
        </div>
      );
    }
    if (status === 'aspiration') {
      return (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500 text-white text-xs font-bold">
          <Star className="w-3 h-3 fill-current" />
          שאיפה
        </div>
      );
    }
    return null;
  };

  const totalProgress = currentStone * 2 + (currentPhase === 'aspiration' ? 1 : 0) + 1;
  const totalPhases = totalStones * 2;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProgressBar currentStep={totalProgress} totalSteps={totalPhases} />
      
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          🎴 משחק הקלפים
        </h2>
        <p className="text-muted-foreground">תפיסת תפקיד ניהולית – Forced Choice</p>
      </div>

      <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border">
        <div className="text-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            {stone.title}
          </h3>
          <p className="text-muted-foreground mb-4">{stone.subtitle}</p>
          
          {currentPhase === 'extremes' ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">חשוב על החודש האחרון:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selection.most ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-muted text-muted-foreground'
                }`}>
                  🟥 הכי הרבה: {selection.most ? '✓' : '?'}
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selection.least ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-muted text-muted-foreground'
                }`}>
                  🟩 הכי פחות: {selection.least ? '✓' : '?'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">איך היית רוצה להתנהל בעוד 3 חודשים?</p>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selection.aspiration ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-muted text-muted-foreground'
              }`}>
                ⭐ שאיפה: {selection.aspiration ? '✓' : '?'}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {stone.cards.map((card) => {
            const status = getCardStatus(card.id);
            const isDisabled = isCardDisabled(card.id);
            const showDimmed = currentPhase === 'aspiration' && (status === 'most' || status === 'least');

            return (
              <button
                key={card.id}
                onClick={() => {
                  if (currentPhase === 'extremes') {
                    // Toggle logic: if already selected, deselect; otherwise determine which to set
                    if (status === 'most') {
                      updateSelection('most', card.id); // Deselect
                    } else if (status === 'least') {
                      updateSelection('least', card.id); // Deselect
                    } else if (!selection.most) {
                      updateSelection('most', card.id);
                    } else if (!selection.least) {
                      updateSelection('least', card.id);
                    }
                  } else {
                    updateSelection('aspiration', card.id);
                  }
                }}
                disabled={isDisabled}
                className={`
                  w-full p-4 rounded-xl transition-all duration-200 text-right
                  border-2 relative
                  ${getCardStyles(card.id)}
                  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {renderCardBadge(card.id)}
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{card.emoji}</span>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-1 ${showDimmed ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {card.title}
                    </h4>
                    <p className={`text-sm leading-relaxed ${showDimmed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                      {card.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
          {currentPhase === 'extremes' ? (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>📌 <strong>הוראות:</strong></p>
              <p>• לחץ על קלף ראשון לסימון "הכי הרבה" (🟥)</p>
              <p>• לחץ על קלף שני לסימון "הכי פחות" (🟩)</p>
              <p>• לא ניתן לבחור אותו קלף לשניהם</p>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>📌 <strong>שאיפה:</strong></p>
              <p>• בחר קלף אחד (⭐) שמתאר איך היית רוצה להתנהל בעוד 3 חודשים</p>
              <p>• אפשר לבחור כל קלף, כולל אלה שסימנת קודם</p>
            </div>
          )}
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
          {currentPhase === 'extremes' ? 'לשלב השאיפה' : (currentStone < totalStones - 1 ? 'לאבן הבאה' : 'סיום')}
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CardGameStep;