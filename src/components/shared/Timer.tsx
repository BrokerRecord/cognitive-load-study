import React, { useState, useEffect } from 'react';

interface Props {
  startTime: number;
  isPaused?: boolean;
}

export const Timer: React.FC<Props> = ({ startTime, isPaused = false }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (isPaused) return; // Don't update timer when paused

    const interval = setInterval(() => {
      setElapsed((Date.now() - startTime) / 1000);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-gray-600">
        ⏱️ Time: {formatTime(elapsed)}
      </div>
      {isPaused && (
        <span className="text-green-600 font-medium">✓ Task Complete</span>
      )}
    </div>
  );
};