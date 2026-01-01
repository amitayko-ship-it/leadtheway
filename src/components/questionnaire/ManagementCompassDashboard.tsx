import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QuestionnaireData } from '@/types/questionnaire';
import { CardGameData } from '@/types/questionnaire';
import { getModuleResults, getFullModules, ModuleResult } from '@/lib/moduleSelection';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Compass, Eye, ChevronLeft, Sparkles, Lightbulb } from 'lucide-react';

interface ManagementCompassDashboardProps {
  data: QuestionnaireData;
  onRestart: () => void;
}

// Card data for getting labels
const cardLabels: Record<string, string> = {
  do_alone: 'קל לי יותר לעשות לבד',
  delegate_close: 'משחרר אבל בודק מקרוב',
  people_grow: 'אנשים גדלים סביבי',
  give_space: 'נותן מרחב לטעויות',
  develop_skills: 'משקיע בפיתוח יכולות',
  need_presence: 'בלי הנוכחות שלי דברים נתקעים',
  close_circle: 'משפיע בעיקר במעגל הקרוב',
  things_move: 'דברים זזים גם כשאני לא שם',
  influence_without_authority: 'משפיע גם בלי סמכות',
  navigate_politics: 'מנווט פוליטיקה ארגונית',
  day_fills_itself: 'היום שלי מתמלא מעצמו',
  holding_a_lot: 'מחזיק הרבה על הראש',
  clear_direction: 'הזמן שלי משרת כיוון ברור',
  focused_goals: 'עובד לפי יעדים ברורים',
  strategic_planning: 'מתכנן אסטרטגית',
  no_routine: 'אין לי שגרות קבועות',
  meetings_unclear: 'הישיבות לא תמיד ברורות',
  routines_advance: 'שגרות מקדמות אותי',
  efficient_meetings: 'פגישות יעילות וממוקדות',
  deep_work_time: 'יש לי זמן לעבודה עמוקה',
  reactive_mode: 'פועל ממצב תגובתי',
  fires_take_over: 'שריפות משתלטות על היום',
  proactive_planning: 'מתכנן מראש ולא מופתע',
  space_to_think: 'יש לי מרחב לחשוב',
  controlled_calendar: 'יומן בשליטה שלי'
};

// Module drill-down content
const moduleDeepDive: Record<string, { description: string; impact: string[]; question: string }> = {
  coaching: {
    description: 'בחודש האחרון אתה נוטה לנהל כך שיותר אחריות נשארת אצלך, ופחות עוברת דרך אנשים אחרים.',
    impact: ['עומס וזמינות גבוהה שלך', 'פחות מרחב לצמיחה של אחרים'],
    question: 'מה המחיר של הדפוס הזה עבורך, כשהוא חוזר שוב ושוב?'
  },
  interfaces: {
    description: 'בחודש האחרון הנוכחות שלך היא קריטית להתקדמות דברים, וההשפעה שלך מורגשת בעיקר במעגל הקרוב.',
    impact: ['תלות גבוהה בזמינות שלך', 'פחות השפעה על מעגלים רחוקים יותר'],
    question: 'מה יקרה אם ההשפעה שלך תגיע גם למקומות שאתה לא נמצא בהם פיזית?'
  },
  focus: {
    description: 'בחודש האחרון הזמן שלך מתמלא מבלי שבחרת בזה, או שאתה מחזיק יותר מדי על הראש במקביל.',
    impact: ['קושי להתמקד בעיקר', 'תחושת עומס מתמדת'],
    question: 'מה הדבר האחד שאם תשחרר אותו - ישתחררו עוד דברים מאחוריו?'
  },
  team: {
    description: 'זוהתה דיספונקציה בולטת באחד המימדים של הצוות לפי מודל לנציוני.',
    impact: ['פגיעה בביצועי הצוות', 'אנרגיה שנשפכת לכיוונים לא יעילים'],
    question: 'מה יקרה אם הדיספונקציה הזו תטופל לפני כל דבר אחר?'
  }
};

// Observation suggestions based on patterns
const getObservation = (cardGameData: CardGameData): string => {
  const coachingMost = cardGameData.coachingDelegation.most;
  
  if (coachingMost === 'do_alone' || coachingMost === 'delegate_close') {
    return 'שים לב מתי אתה נכנס לפתור משהו שיכול היה להיות הזדמנות למישהו אחר להתמודד.';
  }
  if (cardGameData.focusPrioritization.most === 'day_fills_itself') {
    return 'שים לב מתי אתה אומר "כן" למשהו שלא באמת משרת את הכיוון שלך.';
  }
  if (cardGameData.influenceLeadership.most === 'need_presence') {
    return 'שים לב לרגעים שבהם אתה מרגיש שחייבים אותך - ושאל אם באמת חייבים.';
  }
  return 'שים לב לרגעים שבהם דפוס מוכר חוזר על עצמו - ונסה לתפוס אותו בזמן אמת.';
};

const ManagementCompassDashboard: React.FC<ManagementCompassDashboardProps> = ({ data, onRestart }) => {
  const [selectedModule, setSelectedModule] = useState<ModuleResult | null>(null);
  
  const moduleResults = getModuleResults(data.cardGameData, data.teamHealthData);
  const fullModules = getFullModules(data.cardGameData, data.teamHealthData);
  const lightModules = moduleResults.filter(m => m.depth === 'light');

  // Get card labels for the overview
  const getCardLabel = (cardId: string): string => {
    return cardLabels[cardId] || cardId;
  };

  // Find the dominant patterns from card game
  const getDominantPattern = () => {
    const categories = [
      { key: 'coachingDelegation', name: 'חניכה והאצלה' },
      { key: 'influenceLeadership', name: 'השפעה והובלה' },
      { key: 'focusPrioritization', name: 'מיקוד ותיעדוף' },
      { key: 'timeRoutines', name: 'זמן ושגרות' },
      { key: 'controlReactivity', name: 'שליטה ותגובתיות' }
    ];

    return categories.map(cat => {
      const catData = data.cardGameData[cat.key as keyof CardGameData];
      return {
        name: cat.name,
        most: catData.most,
        least: catData.least,
        mostLabel: getCardLabel(catData.most),
        leastLabel: getCardLabel(catData.least)
      };
    });
  };

  const patterns = getDominantPattern();
  const observation = getObservation(data.cardGameData);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <Compass className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            כך נראית ההתנהלות הניהולית שלך בחודש האחרון
          </h1>
        </div>

        {/* General Picture */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">התמונה הכללית</h2>
          </div>
          
          <p className="text-muted-foreground mb-4 text-right leading-relaxed">
            זה הדפוס שמוביל את הניהול שלך עכשיו:
          </p>

          <div className="bg-accent/30 rounded-xl p-4 text-right mb-4">
            <p className="text-foreground leading-relaxed">
              אתה נוטה לפעול מתוך <span className="font-bold text-primary">"{patterns[0]?.mostLabel}"</span>,
              <br />
              ובפועל כמעט ולא משתמש ב־<span className="font-bold text-secondary">"{patterns[0]?.leastLabel}"</span>.
            </p>
          </div>

          <p className="text-sm text-muted-foreground text-right">
            אין כאן טוב או רע.
            <br />
            זו תמונת מצב של איך הדברים קורים עכשיו.
          </p>
        </div>

        {/* Big Stones - Cards View */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span>🪨</span>
            האבנים הגדולות – מבט לפי תחומים
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {patterns.map((pattern, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-5 border border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => {
                  const module = moduleResults.find(m => 
                    (pattern.name.includes('חניכה') && m.key === 'coaching') ||
                    (pattern.name.includes('השפעה') && m.key === 'interfaces') ||
                    (pattern.name.includes('מיקוד') && m.key === 'focus') ||
                    (pattern.name.includes('זמן') && m.key === 'focus') ||
                    (pattern.name.includes('שליטה') && m.key === 'focus')
                  );
                  if (module) setSelectedModule(module);
                }}
              >
                <h3 className="font-bold text-foreground mb-3">{pattern.name}</h3>
                
                <div className="space-y-2 text-right text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">מה מוביל:</span>
                    <span className="text-muted-foreground">{pattern.mostLabel}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">מה חסר:</span>
                    <span className="text-muted-foreground">{pattern.leastLabel}</span>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="mt-3 gap-1 text-primary">
                  <ChevronLeft className="w-4 h-4" />
                  להעמקה
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Where to Focus */}
        <div className="bg-card rounded-2xl p-6 border border-primary/30 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-bold text-foreground">איפה נכון להתעכב בהמשך הדרך</h2>
          </div>

          <p className="text-sm text-muted-foreground mb-4 text-right">
            לא בכל נושא צריך לעבוד באותה עוצמה.
            <br />
            כאן יש תחומים שבהם העמקה יכולה לייצר עבורך ערך אמיתי.
          </p>

          <div className="space-y-3">
            {fullModules.map((module, index) => (
              <div key={index} className="bg-accent/50 rounded-lg p-4 text-right border-r-4 border-primary">
                <div className="flex items-center gap-2 mb-1">
                  <span>🪨</span>
                  <span className="font-bold text-foreground">{module.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{module.reason}</p>
              </div>
            ))}
          </div>

          {lightModules.length > 0 && (
            <p className="text-xs text-muted-foreground mt-4 text-right">
              שאר המודולות ({lightModules.map(m => m.name).join(', ')}) יופיעו בנגיעה קלה כחלק מהתהליך הקבוצתי.
            </p>
          )}
        </div>

        {/* Observation Point */}
        <div className="bg-muted/30 rounded-xl p-5 border border-border mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-secondary" />
            <h3 className="font-medium text-foreground">נקודת תשומת לב לדרך</h3>
          </div>
          <p className="text-muted-foreground text-right text-sm">
            משהו קטן לשים לב אליו בזמן הקרוב:
          </p>
          <p className="text-foreground mt-2 text-right font-medium">
            {observation}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-border pt-6">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            פיתוח ניהולי לא מתחיל מכלים.
            <br />
            הוא מתחיל בהבנה איך אתה פועל בפועל,
            <br />
            ומה שווה להזיז עכשיו.
          </p>
          <Button variant="soft" onClick={onRestart}>
            מילוי שאלון חדש
          </Button>
        </div>

        {/* Drill-down Sheet */}
        <Sheet open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
          <SheetContent side="left" className="w-full sm:max-w-lg">
            {selectedModule && moduleDeepDive[selectedModule.key] && (
              <>
                <SheetHeader>
                  <SheetTitle className="text-right flex items-center gap-2 justify-end">
                    <span>{selectedModule.name}</span>
                    <span>🪨</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6 text-right">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">מה קורה בפועל:</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {moduleDeepDive[selectedModule.key].description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">מה זה מייצר בדרך כלל:</h4>
                    <ul className="space-y-1">
                      {moduleDeepDive[selectedModule.key].impact.map((item, i) => (
                        <li key={i} className="text-muted-foreground flex items-center gap-2 justify-end">
                          <span>{item}</span>
                          <span>•</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-accent/30 rounded-xl p-4 border border-primary/20">
                    <h4 className="font-medium text-foreground mb-2">שאלה שכדאי לעצור עליה:</h4>
                    <p className="text-primary font-medium">
                      {moduleDeepDive[selectedModule.key].question}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      (אין המלצה, אין פתרון. רק עצירה.)
                    </p>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ManagementCompassDashboard;
