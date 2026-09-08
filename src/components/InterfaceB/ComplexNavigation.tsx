import React, { useState } from 'react';
import ComplexTask from './ComplexTask';
import ProgressBar from '../shared/ProgressBar';
import { useStudyStore } from '../../store/studyStore';

interface Props {
  onComplete: () => void;
}

const InterfaceB: React.FC<Props> = ({ onComplete }) => {
  const [currentTask, setCurrentTask] = useState(0);
  const [taskResults, setTaskResults] = useState<any[]>([]);
  const { addTaskResult } = useStudyStore();

  const tasks = [
    { id: 'B1', description: 'Navigate through the menu hierarchy to find "System Settings".', target: 'System Settings' },
    { id: 'B2', description: 'Locate "User Management" and find your profile information.', target: 'User Management' },
    { id: 'B3', description: 'Find the "Technical Support" section in the help documentation.', target: 'Technical Support' },
  ];

  const handleTaskComplete = (result: any) => {
    const taskResult = {
      ...result,
      taskId: tasks[currentTask].id,
      interfaceId: 'B' as const,
      timestamp: new Date().toISOString(),
    };
    addTaskResult('B', taskResult);
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
          <h2 className="text-xl font-bold">Interface B - Complex Navigation</h2>
          <span className="text-sm text-gray-500">
            Task {currentTask + 1} of {tasks.length}
          </span>
        </div>
        <ProgressBar current={currentTask + 1} total={tasks.length} />
        <p className="text-sm text-gray-600 mt-2">
          This interface has complex navigation with many options and hierarchical menus.
        </p>
      </div>

      <ComplexTask 
        task={tasks[currentTask]} 
        onComplete={handleTaskComplete}
        interfaceType="B"
      />

      <div className="mt-4 p-3 bg-orange-50 rounded-lg">
        <p className="text-sm text-orange-700">
          💡 <strong>Note:</strong> This interface has more complex navigation. Try to find the correct option efficiently.
        </p>
      </div>
    </div>
  );
};

export default InterfaceB;