import { useState, useRef, useCallback } from 'react';

interface ReactionTimeResult {
  reactionTimes: number[];
  currentReactionTime: number | null;
  startReactionTimer: () => void;
  stopReactionTimer: () => number;
  getAverageReactionTime: () => number;
  resetReactionTimes: () => void;
}

export const useReactionTime = (): ReactionTimeResult => {
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentReactionTime, setCurrentReactionTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startReactionTimer = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);

  const stopReactionTimer = useCallback((): number => {
    const reactionTime = Date.now() - startTimeRef.current;
    setCurrentReactionTime(reactionTime);
    setReactionTimes(prev => [...prev, reactionTime]);
    return reactionTime;
  }, []);

  const getAverageReactionTime = useCallback((): number => {
    if (reactionTimes.length === 0) return 0;
    const sum = reactionTimes.reduce((acc, val) => acc + val, 0);
    return sum / reactionTimes.length;
  }, [reactionTimes]);

  const resetReactionTimes = useCallback(() => {
    setReactionTimes([]);
    setCurrentReactionTime(null);
  }, []);

  return {
    reactionTimes,
    currentReactionTime,
    startReactionTimer,
    stopReactionTimer,
    getAverageReactionTime,
    resetReactionTimes,
  };
};