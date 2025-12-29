import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface PrioritiesStepProps {
  priorities: string[];
  onUpdate: (priorities: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const priorityItems: Record<string, { label: string; icon: string; description: string }> = {
  interfaces: {
    label: 'שיפור ממשקים ועבודה רוחבית',
    icon: '🔗',
    description: 'תקשורת ושיתוף פעולה עם יחידות אחרות',
  },
  change: {
    label: 'הובלת שינויים וחוסן ארגוני',
    icon: '🔄',
    description: 'הטמעת תהליכים והתמודדות עם התנגדויות',
  },
  coaching: {
    label: 'כלי חניכה, משוב ופיתוח עובדים',
    icon: '🌱',
    description: 'האצלת סמכויות ופיתוח אנשים',
  },
  team: {
    label: 'בניית וניהול צוות (Team Building)',
    icon: '🏆',
    description: 'יצירת גיבוש ותרבות צוותית',
  },
};

const PrioritiesStep: React.FC<PrioritiesStepProps> = ({
  priorities,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== draggedItem) {
      setDragOverItem(id);
    }
  };

  const handleDragEnd = () => {
    if (draggedItem && dragOverItem) {
      const newPriorities = [...priorities];
      const draggedIndex = newPriorities.indexOf(draggedItem);
      const dragOverIndex = newPriorities.indexOf(dragOverItem);
      
      newPriorities.splice(draggedIndex, 1);
      newPriorities.splice(dragOverIndex, 0, draggedItem);
      
      onUpdate(newPriorities);
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newPriorities = [...priorities];
    [newPriorities[index - 1], newPriorities[index]] = [newPriorities[index], newPriorities[index - 1]];
    onUpdate(newPriorities);
  };

  const handleMoveDown = (index: number) => {
    if (index === priorities.length - 1) return;
    const newPriorities = [...priorities];
    [newPriorities[index], newPriorities[index + 1]] = [newPriorities[index + 1], newPriorities[index]];
    onUpdate(newPriorities);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full animate-slide-up">
        <ProgressBar currentStep={4} totalSteps={5} />

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-medium border border-border">
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            סדרי עדיפויות
          </h2>
          <p className="text-muted-foreground mb-6">
            דרג/י את תחומי הפיתוח הבאים לפי מידת החשיבות שלהם עבורך כרגע
            <span className="block text-sm mt-1">גרור/י את הפריטים או השתמש/י בחצים לשינוי הסדר (1 = הכי דחוף)</span>
          </p>

          <div className="space-y-3 mb-8">
            {priorities.map((id, index) => {
              const item = priorityItems[id];
              const isDragged = draggedItem === id;
              const isDragOver = dragOverItem === id;

              return (
                <div
                  key={id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, id)}
                  onDragOver={(e) => handleDragOver(e, id)}
                  onDragEnd={handleDragEnd}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 cursor-grab active:cursor-grabbing
                    ${isDragged ? 'opacity-50 scale-95' : ''}
                    ${isDragOver ? 'border-primary bg-accent' : 'border-border bg-background hover:border-primary/50'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold shadow-soft">
                      {index + 1}
                    </div>

                    {/* Drag Handle */}
                    <GripVertical className="w-5 h-5 text-muted-foreground" />

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-semibold text-foreground">{item.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <span className="text-lg">↑</span>
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === priorities.length - 1}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <span className="text-lg">↓</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              חזרה
            </Button>
            <Button variant="hero" onClick={onNext} className="flex-1">
              סיום
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrioritiesStep;
