export interface Participant {
  id: string;
  age: number;
  gender: string;
  education: string;
  techExperience: number;
  deviceType: string;
}

export interface TaskResult {
  taskId: string;
  interfaceId: 'A' | 'B';
  completionTime: number;
  errors: number;
  reactionTimes: number[];
  success: boolean;
  timestamp: string;
}

export interface NASA_TLX_Data {
  mentalDemand: number;
  physicalDemand: number;
  temporalDemand: number;
  performance: number;
  effort: number;
  frustration: number;
}

export interface SUS_Data {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
}

export interface StudyData {
  participantId: string;
  demographics: Omit<Participant, 'id'>;
  interfaceA: {
    tasks: TaskResult[];
    nasa_tlx: NASA_TLX_Data;
  };
  interfaceB: {
    tasks: TaskResult[];
    nasa_tlx: NASA_TLX_Data;
  };
  sus: SUS_Data;
  timestamp: string;
}

export type StudyPhase = 
  | 'consent'
  | 'demographics'
  | 'interface_a'
  | 'nasa_tlx_a'
  | 'interface_b'
  | 'nasa_tlx_b'
  | 'sus'
  | 'complete';