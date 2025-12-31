import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Circle } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { InterfaceEntry } from '@/types/questionnaire';

interface InterfacesMapStepProps {
  interfaces: InterfaceEntry[];
  onInterfacesChange: (interfaces: InterfaceEntry[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const statusOptions: { id: InterfaceEntry['status']; label: string; color: string }[] = [
  { id: 'green', label: 'זורם', color: 'text-green-500' },
  { id: 'yellow', label: 'עובד אך שוחק', color: 'text-yellow-500' },
  { id: 'red', label: 'תקוע', color: 'text-red-500' },
];

const InterfacesMapStep: React.FC<InterfacesMapStepProps> = ({
  interfaces,
  onInterfacesChange,
  onNext,
  onBack,
}) => {
  const [newInterfaceName, setNewInterfaceName] = useState('');

  const addInterface = () => {
    if (newInterfaceName.trim() && interfaces.length < 5) {
      const newInterface: InterfaceEntry = {
        id: Date.now().toString(),
        name: newInterfaceName.trim(),
        status: 'yellow',
        criticality: 3,
      };
      onInterfacesChange([...interfaces, newInterface]);
      setNewInterfaceName('');
    }
  };

  const removeInterface = (id: string) => {
    onInterfacesChange(interfaces.filter(i => i.id !== id));
  };

  const updateInterface = (id: string, updates: Partial<InterfaceEntry>) => {
    onInterfacesChange(
      interfaces.map(i => i.id === id ? { ...i, ...updates } : i)
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full animate-slide-up">
        <ProgressBar currentStep={4} totalSteps={8} />

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-medium border border-border">
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            מפת ממשקים
          </h2>
          <p className="text-muted-foreground mb-6">
            הוסף עד 5 ממשקים מרכזיים
          </p>

          {/* Add Interface */}
          <div className="flex gap-2 mb-6">
            <Input
              value={newInterfaceName}
              onChange={(e) => setNewInterfaceName(e.target.value)}
              placeholder="שם הממשק (למשל: צוות מכירות)"
              onKeyPress={(e) => e.key === 'Enter' && addInterface()}
              disabled={interfaces.length >= 5}
            />
            <Button
              variant="outline"
              onClick={addInterface}
              disabled={!newInterfaceName.trim() || interfaces.length >= 5}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Interfaces List */}
          <div className="space-y-4 mb-8">
            {interfaces.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                הוסף ממשקים כדי להמשיך
              </div>
            ) : (
              interfaces.map((interfaceItem) => (
                <div
                  key={interfaceItem.id}
                  className="p-4 bg-muted/50 rounded-xl border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-foreground">{interfaceItem.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInterface(interfaceItem.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  {/* Status Selection */}
                  <div className="mb-4">
                    <label className="block text-sm text-muted-foreground mb-2">
                      סטטוס:
                    </label>
                    <div className="flex gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status.id}
                          onClick={() => updateInterface(interfaceItem.id, { status: status.id })}
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
                            ${interfaceItem.status === status.id
                              ? 'border-primary bg-accent'
                              : 'border-border hover:border-primary/50'
                            }
                          `}
                        >
                          <Circle className={`w-4 h-4 fill-current ${status.color}`} />
                          <span className="text-sm">{status.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Criticality */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      עד כמה הממשק קריטי להצלחת האבנים הגדולות שלך?
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          onClick={() => updateInterface(interfaceItem.id, { criticality: score })}
                          className={`
                            w-10 h-10 rounded-lg font-bold transition-all duration-200
                            ${interfaceItem.criticality === score
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background text-muted-foreground hover:bg-accent'
                            }
                          `}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              חזרה
            </Button>
            <Button 
              variant="hero" 
              onClick={onNext} 
              className="flex-1"
              disabled={interfaces.length === 0}
            >
              המשך
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfacesMapStep;
