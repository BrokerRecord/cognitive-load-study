import { useState, useCallback } from 'react';

interface ErrorTracker {
  errors: number;
  errorTypes: Record<string, number>;
  addError: (errorType?: string) => void;
  resetErrors: () => void;
  getErrorRate: (totalAttempts: number) => number;
}

export const useErrorTracker = (): ErrorTracker => {
  const [errors, setErrors] = useState(0);
  const [errorTypes, setErrorTypes] = useState<Record<string, number>>({});

  const addError = useCallback((errorType: string = 'general') => {
    setErrors(prev => prev + 1);
    setErrorTypes(prev => ({
      ...prev,
      [errorType]: (prev[errorType] || 0) + 1
    }));
  }, []);

  const resetErrors = useCallback(() => {
    setErrors(0);
    setErrorTypes({});
  }, []);

  const getErrorRate = useCallback((totalAttempts: number): number => {
    if (totalAttempts === 0) return 0;
    return errors / totalAttempts;
  }, [errors]);

  return {
    errors,
    errorTypes,
    addError,
    resetErrors,
    getErrorRate,
  };
};