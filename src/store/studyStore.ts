import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type  { StudyPhase, StudyData, NASA_TLX_Data, SUS_Data, TaskResult } from '../types/study.types';

interface StudyState {
  participantId: string | null;
  currentPhase: StudyPhase;
  studyData: Partial<StudyData>;
  setParticipantId: (id: string) => void;
  setCurrentPhase: (phase: StudyPhase) => void;
  addTaskResult: (interfaceId: 'A' | 'B', result: TaskResult) => void;
  setNASA_TLX: (interfaceId: 'A' | 'B', data: NASA_TLX_Data) => void;
  setSUS: (data: SUS_Data) => void;
  setDemographics: (data: any) => void;
  resetStudy: () => void;
  exportData: () => StudyData;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      participantId: null,
      currentPhase: 'consent',
      studyData: {},

      setParticipantId: (id) => set({ participantId: id }),

      setCurrentPhase: (phase) => set({ currentPhase: phase }),

      addTaskResult: (interfaceId, result) => {
        const key = interfaceId === 'A' ? 'interfaceA' : 'interfaceB';
        set((state) => ({
          studyData: {
            ...state.studyData,
            [key]: {
              ...state.studyData[key],
              tasks: [...(state.studyData[key]?.tasks || []), result],
            },
          },
        }));
      },

      setNASA_TLX: (interfaceId, data) => {
        const key = interfaceId === 'A' ? 'interfaceA' : 'interfaceB';
        set((state) => ({
          studyData: {
            ...state.studyData,
            [key]: {
              ...state.studyData[key],
              nasa_tlx: data,
            },
          },
        }));
      },

      setSUS: (data) => {
        set((state) => ({
          studyData: {
            ...state.studyData,
            sus: data,
          },
        }));
      },

      setDemographics: (data) => {
        set((state) => ({
          studyData: {
            ...state.studyData,
            demographics: data,
          },
        }));
      },

      resetStudy: () => {
        // Clear all study data and reset to initial state
        set({
          participantId: null,
          currentPhase: 'consent',
          studyData: {},
        });
        // Clear the persisted storage
        localStorage.removeItem('cognitive-load-study-storage');
      },

      exportData: () => {
        const state = get();
        return {
          participantId: state.participantId!,
          demographics: state.studyData.demographics!,
          interfaceA: state.studyData.interfaceA!,
          interfaceB: state.studyData.interfaceB!,
          sus: state.studyData.sus!,
          timestamp: new Date().toISOString(),
        };
      },
    }),
    {
      name: 'cognitive-load-study-storage',
    }
  )
);