export interface TimeAllocation {
  leadingPeople: number;
  taskManagement: number;
  interfaceCoordination: number;
  changeLeadership: number;
  development: number;
  firefighting: number;
  other: number;
}

export interface ModuleRatings {
  interfacesFriction: number;
  interfacesClarity: number;
  changeTools: number;
  changeResistance: number;
  coachingDelegation: number;
  coachingConfidence: number;
  teamOpenness: number;
  teamCohesion: number;
}

export interface QuestionnaireData {
  responsibilities: string[];
  timeAllocation: TimeAllocation;
  burningChallenge: string;
  moduleRatings: ModuleRatings;
  priorities: string[];
}

export const initialTimeAllocation: TimeAllocation = {
  leadingPeople: 20,
  taskManagement: 20,
  interfaceCoordination: 15,
  changeLeadership: 10,
  development: 15,
  firefighting: 15,
  other: 5,
};

export const initialModuleRatings: ModuleRatings = {
  interfacesFriction: 3,
  interfacesClarity: 3,
  changeTools: 3,
  changeResistance: 3,
  coachingDelegation: 3,
  coachingConfidence: 3,
  teamOpenness: 3,
  teamCohesion: 3,
};

export const initialQuestionnaireData: QuestionnaireData = {
  responsibilities: [],
  timeAllocation: initialTimeAllocation,
  burningChallenge: '',
  moduleRatings: initialModuleRatings,
  priorities: ['interfaces', 'change', 'coaching', 'team'],
};
