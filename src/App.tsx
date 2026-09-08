import React, { useState, useEffect } from 'react';
import { StudyProvider } from './store/StudyContext';
import ParticipantConsent from './components/ParticipantConsent';
import Demographics from './components/surveys/Demographics';
import InterfaceA from './components/InterfaceA/SimpleNavigation';
import InterfaceB from './components/InterfaceB/ComplexNavigation';
import NASA_TLX from './components/surveys/NASA_TLX';
import SUS from './components/surveys/SUS';
import StudyComplete from './components/StudyComplete';
import { useStudyStore } from './store/studyStore';

function App() {
  const { currentPhase, participantId, setCurrentPhase } = useStudyStore();

  useEffect(() => {
    // If there's no participant ID but we're not on consent, reset
    if (!participantId && currentPhase !== 'consent') {
      setCurrentPhase('consent');
    }
  }, [participantId, currentPhase, setCurrentPhase]);

  const renderPhase = () => {
    switch(currentPhase) {
      case 'consent':
        return <ParticipantConsent onConsent={() => setCurrentPhase('demographics')} />;
      case 'demographics':
        return <Demographics onComplete={() => setCurrentPhase('interface_a')} />;
      case 'interface_a':
        return <InterfaceA onComplete={() => setCurrentPhase('nasa_tlx_a')} />;
      case 'nasa_tlx_a':
        return <NASA_TLX interfaceId="A" onComplete={() => setCurrentPhase('interface_b')} />;
      case 'interface_b':
        return <InterfaceB onComplete={() => setCurrentPhase('nasa_tlx_b')} />;
      case 'nasa_tlx_b':
        return <NASA_TLX interfaceId="B" onComplete={() => setCurrentPhase('sus')} />;
      case 'sus':
        return <SUS onComplete={() => setCurrentPhase('complete')} />;
      case 'complete':
        return <StudyComplete />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <StudyProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {participantId && currentPhase !== 'consent' && currentPhase !== 'complete' && (
            <div className="text-sm text-gray-500 mb-4">
              Participant: {participantId} | Phase: {currentPhase}
            </div>
          )}
          {renderPhase()}
        </div>
      </div>
    </StudyProvider>
  );
}

export default App;