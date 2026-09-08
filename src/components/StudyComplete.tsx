import React, { useState } from 'react';
import { useStudyStore } from '../store/studyStore';

const StudyComplete: React.FC = () => {
  const { exportData, resetStudy, setCurrentPhase } = useStudyStore();
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const downloadData = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study_data_${data.participantId}_${data.timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health');
      return response.ok;
    } catch {
      return false;
    }
  };

  const uploadData = async () => {
    setUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');
    
    try {
      // Check if server is running
      const serverRunning = await checkServerStatus();
      if (!serverRunning) {
        throw new Error('Server is not running. Please start the server first.');
      }

      const data = exportData();
      
      const response = await fetch('http://localhost:3001/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Data uploaded successfully:', result);
        setUploadStatus('success');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error.message || 'Failed to upload data');
    } finally {
      setUploading(false);
    }
  };

  const startNewStudy = () => {
    resetStudy();
    setCurrentPhase('consent');
  };

  return (
    <div className="card text-center">
      <div className="mb-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Study Complete!</h2>
        <p className="text-gray-600">
          Thank you for participating in this study. Your responses have been recorded.
        </p>
      </div>

      <div className="space-y-4">
        {/* Upload data to server */}
        <button
          onClick={uploadData}
          disabled={uploading}
          className={`btn-primary w-full ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? '📤 Uploading...' : '📤 Upload Data to Server'}
        </button>

        {uploadStatus === 'success' && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg border border-green-300">
            ✅ Data uploaded successfully! Your responses have been saved.
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
            <div className="font-semibold">❌ Failed to upload data</div>
            <div className="text-sm mt-1">{errorMessage}</div>
            <div className="text-xs mt-2 text-gray-600">
              Please make sure the server is running (npm start in server folder)
              <br />
              or download your data manually below.
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={downloadData}
            className="btn-secondary flex-1"
          >
            📥 Download JSON
          </button>
          <button
            onClick={() => {
              const data = exportData();
              const csv = convertToCSV(data);
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `study_data_${data.participantId}_${data.timestamp}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="btn-secondary flex-1"
          >
            📊 Download CSV
          </button>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg text-left">
          <h3 className="font-medium mb-2">What happens next?</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Your data will be anonymized and analyzed</li>
            <li>Results will be aggregated with other participants</li>
            <li>You can request to withdraw your data at any time</li>
          </ul>
        </div>

        <button
          onClick={startNewStudy}
          className="btn-secondary w-full"
        >
          🔄 Start New Study
        </button>
      </div>
    </div>
  );
};

// Helper function to convert data to CSV
function convertToCSV(data: any): string {
  const rows = [
    ['Participant ID', data.participantId],
    ['Age', data.demographics.age],
    ['Gender', data.demographics.gender],
    ['Education', data.demographics.education],
    ['Tech Experience', data.demographics.techExperience],
    ['Device Type', data.demographics.deviceType],
    [''],
    ['Interface A Tasks'],
    ['Task ID', 'Completion Time (s)', 'Errors', 'Success'],
  ];

  data.interfaceA.tasks.forEach((task: any) => {
    rows.push([task.taskId, task.completionTime, task.errors, task.success]);
  });

  rows.push(['']);
  rows.push(['Interface B Tasks']);
  rows.push(['Task ID', 'Completion Time (s)', 'Errors', 'Success']);

  data.interfaceB.tasks.forEach((task: any) => {
    rows.push([task.taskId, task.completionTime, task.errors, task.success]);
  });

  rows.push(['']);
  rows.push(['NASA-TLX Scores']);
  rows.push(['Dimension', 'Interface A', 'Interface B']);
  
  const dimensions = ['mentalDemand', 'physicalDemand', 'temporalDemand', 'performance', 'effort', 'frustration'];
  dimensions.forEach((dim) => {
    rows.push([
      dim,
      data.interfaceA.nasa_tlx[dim] || 0,
      data.interfaceB.nasa_tlx[dim] || 0,
    ]);
  });

  rows.push(['']);
  rows.push(['SUS Scores']);
  rows.push(['Question', 'Score']);
  for (let i = 0; i < 10; i++) {
    rows.push([`Q${i + 1}`, data.sus[i] || 0]);
  }

  return rows.map(row => row.join(',')).join('\n');
}

export default StudyComplete;