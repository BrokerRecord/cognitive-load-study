import React, { createContext, useContext, ReactNode } from 'react';
import { useStudyStore } from './studyStore';

const StudyContext = createContext<any>(null);

export const StudyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const store = useStudyStore();
  return (
    <StudyContext.Provider value={store}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};