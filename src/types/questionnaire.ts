// Interface for a single interface/stakeholder mapping
export interface InterfaceEntry {
  id: string;
  name: string;
  status: 'green' | 'yellow' | 'red';
  criticality: number;
}

// Module prioritization ratings
export interface ModulePriority {
  value: number;
  feasibility: number;
  readiness: number;
}

// All questionnaire data
export interface QuestionnaireData {
  // Screen 1: Focus & Control
  anchorScore: number;
  timeDrain: string;
  timeDrainOther: string;
  
  // Screen 2: Time & Energy (4 Quadrants)
  quadrants: {
    urgentImportant: number;
    importantNotUrgent: number;
    urgentNotImportant: number;
    notUrgentNotImportant: number;
  };
  breathingSpace: number;
  
  // Screen 3: Decisions & Price
  immediatePrice: string;
  longTermPrice: string;
  retrospective: string;
  
  // Screen 4: Interfaces Map
  interfaces: InterfaceEntry[];
  
  // Screen 5: Coaching & Development
  growthProof: string;
  autonomyPrice: number;
  coachingBlocker: string;
  
  // Screen 6: Team Health
  teamHealth: string;
  
  // Screen 7: Engagement & Energy
  energyLevel: number;
  meaningScore: number;
  pressurePattern: string;
  
  // Screen 8: Module Prioritization
  modulePriorities: {
    teamDevelopment: ModulePriority;
    interfaceManagement: ModulePriority;
    coachingDevelopment: ModulePriority;
    managerialFocus: ModulePriority;
  };
}

export const initialQuestionnaireData: QuestionnaireData = {
  // Screen 1
  anchorScore: 3,
  timeDrain: '',
  timeDrainOther: '',
  
  // Screen 2
  quadrants: {
    urgentImportant: 25,
    importantNotUrgent: 25,
    urgentNotImportant: 25,
    notUrgentNotImportant: 25,
  },
  breathingSpace: 3,
  
  // Screen 3
  immediatePrice: '',
  longTermPrice: '',
  retrospective: '',
  
  // Screen 4
  interfaces: [],
  
  // Screen 5
  growthProof: '',
  autonomyPrice: 3,
  coachingBlocker: '',
  
  // Screen 6
  teamHealth: '',
  
  // Screen 7
  energyLevel: 3,
  meaningScore: 3,
  pressurePattern: '',
  
  // Screen 8
  modulePriorities: {
    teamDevelopment: { value: 3, feasibility: 3, readiness: 3 },
    interfaceManagement: { value: 3, feasibility: 3, readiness: 3 },
    coachingDevelopment: { value: 3, feasibility: 3, readiness: 3 },
    managerialFocus: { value: 3, feasibility: 3, readiness: 3 },
  },
};

// Calculate priority score for a module
export const calculateModuleScore = (priority: ModulePriority): number => {
  return (priority.value * 0.4) + (priority.feasibility * 0.35) + (priority.readiness * 0.25);
};

// Get the top priority module
export const getTopModule = (data: QuestionnaireData): string => {
  const scores = {
    teamDevelopment: calculateModuleScore(data.modulePriorities.teamDevelopment),
    interfaceManagement: calculateModuleScore(data.modulePriorities.interfaceManagement),
    coachingDevelopment: calculateModuleScore(data.modulePriorities.coachingDevelopment),
    managerialFocus: calculateModuleScore(data.modulePriorities.managerialFocus),
  };
  
  const moduleNames: Record<string, string> = {
    teamDevelopment: 'פיתוח צוות',
    interfaceManagement: 'ניהול ממשקים',
    coachingDevelopment: 'חניכה ופיתוח עובדים',
    managerialFocus: 'מיקוד ניהולי / זמן',
  };
  
  const topModule = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  return moduleNames[topModule];
};
