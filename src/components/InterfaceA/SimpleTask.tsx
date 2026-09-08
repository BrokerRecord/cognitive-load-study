import React, { useState, useEffect, useRef } from 'react';
import { Timer } from '../shared/Timer';

interface Props {
  task: {
    id: string;
    description: string;
    target: string;
  };
  onComplete: (result: any) => void;
  interfaceType: 'A' | 'B';
}

const SimpleTask: React.FC<Props> = ({ task, onComplete, interfaceType }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [taskComplete, setTaskComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [showContent, setShowContent] = useState<{ [key: string]: boolean }>({});
  const startReactionRef = useRef<number>(Date.now());
  const taskCompletedRef = useRef(false);

  // Simple navigation options for Interface A with content
  const navItems = [
    { 
      id: 'Home', 
      content: 'Welcome to the Dashboard! Here you can see your recent activity and notifications.'
    },
    { 
      id: 'Profile', 
      content: '👤 User Profile\nName: John Doe\nEmail: john.doe@example.com\nMember since: January 2024\nRole: Participant'
    },
    { 
      id: 'Settings', 
      content: '⚙️ Settings\nLanguage: English\nNotifications: Enabled\nPrivacy: Standard'
    },
    { 
      id: 'Help', 
      content: '❓ Help Center\nFAQ: Frequently Asked Questions\nContact Support: support@example.com\nDocumentation: Available online'
    },
    { 
      id: 'About', 
      content: 'ℹ️ About This Application\nVersion: 2.0.1\nLast Updated: March 2026\nPurpose: Cognitive Load Study'
    },
    { 
      id: 'Contact', 
      content: '📧 Contact Information\nEmail: contact@example.com\nPhone: +1 (555) 123-4567\nOffice Hours: 9AM - 5PM EST'
    },
  ];

  const handleOptionClick = (option: string) => {
    // Don't process clicks if task is already complete
    if (taskCompletedRef.current) return;

    const reactionTime = Date.now() - startReactionRef.current;
    setReactionTimes([...reactionTimes, reactionTime]);
    startReactionRef.current = Date.now();

    // Show content for any clicked option
    setShowContent(prev => ({ ...prev, [option]: true }));

    // Check if this is the target
    if (option === task.target) {
      setSelectedOption(option);
      setTaskComplete(true);
      taskCompletedRef.current = true;
      
      const completionTime = (Date.now() - startTime) / 1000;
      
      // Small delay before completing to let the user see the content
      setTimeout(() => {
        onComplete({
          completionTime,
          errors: errorCount,
          reactionTimes,
          success: true,
          selectedOption: option,
        });
      }, 1500);
    } else {
      // Wrong option - increment error count
      setErrorCount(errorCount + 1);
      // Visual feedback for error
      const element = document.getElementById(`nav-${option}`);
      if (element) {
        element.style.backgroundColor = '#fee2e2';
        element.style.borderColor = '#ef4444';
        setTimeout(() => {
          element.style.backgroundColor = '';
          element.style.borderColor = '';
        }, 500);
      }
    }
  };

  // Reset reaction timer when task changes
  useEffect(() => {
    startReactionRef.current = Date.now();
    taskCompletedRef.current = false;
    setTaskComplete(false);
    setSelectedOption(null);
    setShowContent({});
  }, [task]);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Task:</h3>
        <p className="text-gray-700">{task.description}</p>
      </div>

      {/* Timer - stops when task is complete */}
      <Timer startTime={startTime} isPaused={taskComplete} />

      {/* Navigation Grid */}
      <div className="grid grid-cols-2 gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => handleOptionClick(item.id)}
            className={`p-3 border-2 rounded-lg transition-all text-left ${
              selectedOption === item.id 
                ? 'bg-green-100 border-green-500' 
                : taskComplete 
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            disabled={taskComplete}
          >
            <div className="font-medium">{item.id}</div>
            {showContent[item.id] && (
              <div className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                {item.content}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Feedback Messages */}
      {selectedOption && (
        <div className="p-3 bg-green-100 text-green-700 rounded-lg border border-green-300">
          <div className="font-semibold">✅ Task completed successfully!</div>
          <div className="text-sm mt-1">
            You found the "{selectedOption}" section. Completion time: {((Date.now() - startTime) / 1000).toFixed(1)}s
          </div>
        </div>
      )}

      {errorCount > 0 && !taskComplete && (
        <div className="p-2 text-sm text-orange-600 bg-orange-50 rounded-lg border border-orange-200">
          ⚠️ Incorrect selections: {errorCount}
        </div>
      )}

      {/* Progress indicator */}
      <div className="text-xs text-gray-400 text-center">
        {!taskComplete && 'Click on the correct option to complete the task'}
        {taskComplete && 'Task completed! Moving to next task...'}
      </div>
    </div>
  );
};

export default SimpleTask;