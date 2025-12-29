import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TimeAllocation } from '@/types/questionnaire';
import ProgressBar from './ProgressBar';

interface TimeAllocationStepProps {
  allocation: TimeAllocation;
  onUpdate: (allocation: TimeAllocation) => void;
  burningChallenge: string;
  onBurningChallengeChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const allocationLabels: Record<keyof TimeAllocation, { label: string; color: string }> = {
  leadingPeople: { label: 'הובלת אנשים', color: 'hsl(195, 70%, 35%)' },
  taskManagement: { label: 'ניהול משימות ותוצאות', color: 'hsl(210, 65%, 45%)' },
  interfaceCoordination: { label: 'תיאום ממשקים', color: 'hsl(25, 85%, 55%)' },
  changeLeadership: { label: 'הובלת שינוי', color: 'hsl(170, 60%, 40%)' },
  development: { label: 'פיתוח וחניכה', color: 'hsl(280, 50%, 50%)' },
  firefighting: { label: 'כיבוי שריפות', color: 'hsl(0, 70%, 55%)' },
  other: { label: 'אחר', color: 'hsl(220, 15%, 60%)' },
};

const TimeAllocationStep: React.FC<TimeAllocationStepProps> = ({
  allocation,
  onUpdate,
  burningChallenge,
  onBurningChallengeChange,
  onNext,
  onBack,
}) => {
  const total = useMemo(() => {
    return Object.values(allocation).reduce((sum, val) => sum + val, 0);
  }, [allocation]);

  const handleSliderChange = (key: keyof TimeAllocation, value: number[]) => {
    const newAllocation = { ...allocation, [key]: value[0] };
    onUpdate(newAllocation);
  };

  // Generate pie chart segments
  const pieSegments = useMemo(() => {
    const entries = Object.entries(allocation) as [keyof TimeAllocation, number][];
    let cumulative = 0;
    
    return entries.map(([key, value]) => {
      const startAngle = (cumulative / 100) * 360;
      cumulative += value;
      const endAngle = (cumulative / 100) * 360;
      
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      
      const x1 = 100 + 80 * Math.cos(startRad);
      const y1 = 100 + 80 * Math.sin(startRad);
      const x2 = 100 + 80 * Math.cos(endRad);
      const y2 = 100 + 80 * Math.sin(endRad);
      
      return {
        key,
        path: value > 0 ? `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z` : '',
        color: allocationLabels[key].color,
        value,
      };
    });
  }, [allocation]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-3xl w-full animate-slide-up">
        <ProgressBar currentStep={2} totalSteps={5} />

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-medium border border-border">
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            חלוקת זמן בפועל
          </h2>
          <p className="text-muted-foreground mb-6">
            הזן אחוזים לכל תחום - הם צריכים להסתכם ל-100%
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Pie Chart */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {pieSegments.map((segment) => (
                    segment.value > 0 && (
                      <path
                        key={segment.key}
                        d={segment.path}
                        fill={segment.color}
                        className="transition-all duration-300"
                        stroke="hsl(var(--card))"
                        strokeWidth="2"
                      />
                    )
                  ))}
                  <circle cx="100" cy="100" r="35" fill="hsl(var(--card))" />
                  <text 
                    x="100" 
                    y="100" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    className="fill-foreground font-bold text-xl"
                  >
                    {total}%
                  </text>
                </svg>
                {total !== 100 && (
                  <p className={`text-center mt-2 text-sm font-medium ${total > 100 ? 'text-destructive' : 'text-secondary'}`}>
                    {total > 100 ? `עודף: ${total - 100}%` : `חסר: ${100 - total}%`}
                  </p>
                )}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              {(Object.entries(allocation) as [keyof TimeAllocation, number][]).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {allocationLabels[key].label}
                    </span>
                    <span 
                      className="text-sm font-bold px-2 py-0.5 rounded"
                      style={{ 
                        backgroundColor: `${allocationLabels[key].color}20`,
                        color: allocationLabels[key].color 
                      }}
                    >
                      {value}%
                    </span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(val) => handleSliderChange(key, val)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Burning Challenge */}
          <div className="mb-8 p-6 bg-accent/30 rounded-xl border border-primary/20">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              🔥 האתגר הבוער
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              אם היה לך שרביט קסמים שיכול לפתור חסם ניהולי אחד שמעכב אותך כרגע – מה הוא היה?
            </p>
            <textarea
              value={burningChallenge}
              onChange={(e) => onBurningChallengeChange(e.target.value)}
              placeholder="כתוב/י כאן..."
              className="w-full p-4 rounded-lg border border-border bg-background text-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              חזרה
            </Button>
            <Button 
              variant="hero" 
              onClick={onNext} 
              className="flex-1"
              disabled={total !== 100}
            >
              המשך
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeAllocationStep;
