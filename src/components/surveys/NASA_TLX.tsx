import React, { useState } from 'react';
import { useStudyStore } from '../../store/studyStore';

interface Props {
  interfaceId: 'A' | 'B';
  onComplete: () => void;
}

const NASA_TLX: React.FC<Props> = ({ interfaceId, onComplete }) => {
  const [ratings, setRatings] = useState({
    mentalDemand: 5,
    physicalDemand: 5,
    temporalDemand: 5,
    performance: 5,
    effort: 5,
    frustration: 5,
  });

  const { setNASA_TLX } = useStudyStore();

  const questions = [
    { key: 'mentalDemand', label: 'Mental Demand', description: 'How much mental and perceptual activity was required?' },
    { key: 'physicalDemand', label: 'Physical Demand', description: 'How much physical activity was required?' },
    { key: 'temporalDemand', label: 'Temporal Demand', description: 'How much time pressure did you feel?' },
    { key: 'performance', label: 'Performance', description: 'How successful were you in accomplishing the tasks?' },
    { key: 'effort', label: 'Effort', description: 'How hard did you have to work to accomplish your level of performance?' },
    { key: 'frustration', label: 'Frustration', description: 'How insecure, discouraged, irritated, or stressed did you feel?' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNASA_TLX(interfaceId, ratings);
    onComplete();
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">
        NASA Task Load Index (TLX) - Interface {interfaceId}
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Rate your experience with Interface {interfaceId} on each dimension.
        Higher ratings indicate higher workload.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q) => (
          <div key={q.key}>
            <label className="block font-medium mb-1">{q.label}</label>
            <p className="text-sm text-gray-500 mb-2">{q.description}</p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Low</span>
              <input
                type="range"
                min="0"
                max="10"
                value={ratings[q.key as keyof typeof ratings]}
                onChange={(e) => setRatings({
                  ...ratings,
                  [q.key]: parseInt(e.target.value)
                })}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">High</span>
              <span className="font-medium min-w-[2rem] text-center">
                {ratings[q.key as keyof typeof ratings]}
              </span>
            </div>
          </div>
        ))}

        <button type="submit" className="btn-primary w-full">
          Continue
        </button>
      </form>
    </div>
  );
};

export default NASA_TLX;