import React, { useState, useEffect } from 'react';
import SimpleTask from './SimpleTask';
import ProgressBar from '../shared/ProgressBar';
import { useStudyStore } from '../../store/studyStore';

interface Props {
  onComplete: () => void;
}

const InterfaceA: React.FC<Props> = ({ onComplete }) => {
  const [currentTask, setCurrentTask] = useState(0);
  const [taskResults, setTaskResults] = useState<any[]>([]);
  const { addTaskResult } = useStudyStore();

  const tasks = [
    { id: 'A1', description: 'Find the "Settings" option in the navigation menu.', target: 'Settings' },
    { id: 'A2', description: 'Locate the "Profile" section and view your user information.', target: 'Profile' },
    { id: 'A3', description: 'Find and click on the "Help" button.', target: 'Help' },
  ];

  const handleTaskComplete = (result: any) => {
    const taskResult = {
      ...result,
      taskId: tasks[currentTask].id,
      interfaceId: 'A' as const,
      timestamp: new Date().toISOString(),
    };
    addTaskResult('A', taskResult);
    setTaskResults([...taskResults, taskResult]);

    if (currentTask < tasks.length - 1) {
      setCurrentTask(currentTask + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="card">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Interface A - Simple Navigation</h2>
          <span className="text-sm text-gray-500">
            Task {currentTask + 1} of {tasks.length}
          </span>
        </div>
        <ProgressBar current={currentTask + 1} total={tasks.length} />
        <p className="text-sm text-gray-600 mt-2">
          This interface uses simple navigation with minimal options.
        </p>
      </div>

      <SimpleTask 
        task={tasks[currentTask]} 
        onComplete={handleTaskComplete}
        interfaceType="A"
      />

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Navigation is simple and organized. Take your time to complete each task accurately.
        </p>
      </div>
    </div>
  );
};

export default InterfaceA;