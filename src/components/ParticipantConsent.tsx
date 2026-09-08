import React, { useState } from 'react';
import { useStudyStore } from '../store/studyStore';

interface Props {
  onConsent: () => void;
}

const ParticipantConsent: React.FC<Props> = ({ onConsent }) => {
  const [agreed, setAgreed] = useState(false);
  const [participantId, setParticipantId] = useState('');
  const { setParticipantId: setStoreParticipantId } = useStudyStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed && participantId.trim()) {
      setStoreParticipantId(participantId.trim());
      onConsent();
    }
  };

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-4">Study Consent Form</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-2">Study Information</h2>
        <p className="text-sm text-gray-600 mb-2">
          You are invited to participate in a study evaluating mobile interface usability 
          and cognitive load. The study involves completing tasks on two different interfaces 
          and answering questionnaires.
        </p>
        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>Duration: Approximately 20-30 minutes</li>
          <li>You can withdraw at any time</li>
          <li>All data is anonymous</li>
          <li>No personal identifying information will be collected</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Participant ID (enter a unique identifier):
          </label>
          <input
            type="text"
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
            className="input-field"
            placeholder="e.g., P001"
            required
          />
        </div>

        <div className="mb-6">
          <label className="flex items-start space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm">
              I have read and understood the study information. I voluntarily agree 
              to participate in this study and understand that I can withdraw at any time.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!agreed || !participantId.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Study
        </button>
      </form>
    </div>
  );
};

export default ParticipantConsent;