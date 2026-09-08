import React, { useState } from 'react';
import { useStudyStore } from '../../store/studyStore';

interface Props {
  onComplete: () => void;
}

const SUS: React.FC<Props> = ({ onComplete }) => {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const { setSUS } = useStudyStore();

  const questions = [
    'I think that I would like to use this system frequently.',
    'I found the system unnecessarily complex.',
    'I thought the system was easy to use.',
    'I think that I would need the support of a technical person to be able to use this system.',
    'I found the various functions in this system were well integrated.',
    'I thought there was too much inconsistency in this system.',
    'I would imagine that most people would learn to use this system very quickly.',
    'I found the system very cumbersome to use.',
    'I felt very confident using the system.',
    'I needed to learn a lot of things before I could get going with this system.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(responses).length === 10) {
      setSUS(responses);
      onComplete();
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">System Usability Scale (SUS)</h2>
      <p className="text-sm text-gray-600 mb-6">
        Rate your agreement with each statement based on your experience with both interfaces.
        1 = Strongly Disagree, 5 = Strongly Agree
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <p className="mb-2">{index + 1}. {q}</p>
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={num}
                    checked={responses[index] === num}
                    onChange={() => setResponses({...responses, [index]: num})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{num}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button 
          type="submit" 
          className="btn-primary w-full"
          disabled={Object.keys(responses).length !== 10}
        >
          Complete Study
        </button>
      </form>
    </div>
  );
};

export default SUS;