import { useState, useEffect, useRef } from 'react';

interface TimerResult {
  elapsedTime: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  isRunning: boolean;
  isPaused: boolean;
}

export const useTaskTimer = (): TimerResult => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    if (!isRunning && !isPaused) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  return {
    elapsedTime,
    startTimer,
    stopTimer,
    resetTimer,
    isRunning,
    isPaused,
  };
};