import React, { useState } from 'react';
import { useStudyStore } from '../../store/studyStore';

interface Props {
  onComplete: () => void;
}

const Demographics: React.FC<Props> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    education: '',
    techExperience: '5',
    deviceType: '',
  });
  
  const { setDemographics } = useStudyStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemographics({
      age: parseInt(formData.age),
      gender: formData.gender,
      education: formData.education,
      techExperience: parseInt(formData.techExperience),
      deviceType: formData.deviceType,
    });
    onComplete();
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Demographics Questionnaire</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Age:</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            className="input-field"
            min="18"
            max="100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender:</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            className="input-field"
            required
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Highest Education Level:</label>
          <select
            value={formData.education}
            onChange={(e) => setFormData({...formData, education: e.target.value})}
            className="input-field"
            required
          >
            <option value="">Select...</option>
            <option value="high-school">High School</option>
            <option value="some-college">Some College</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="phd">PhD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Technology Experience (1 = Novice, 10 = Expert):
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.techExperience}
            onChange={(e) => setFormData({...formData, techExperience: e.target.value})}
            className="w-full"
          />
          <div className="text-center text-sm font-medium">
            {formData.techExperience}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Primary Device Type:</label>
          <select
            value={formData.deviceType}
            onChange={(e) => setFormData({...formData, deviceType: e.target.value})}
            className="input-field"
            required
          >
            <option value="">Select...</option>
            <option value="desktop">Desktop Computer</option>
            <option value="laptop">Laptop</option>
            <option value="tablet">Tablet</option>
            <option value="smartphone">Smartphone</option>
          </select>
        </div>

        <button type="submit" className="btn-primary w-full">
          Continue
        </button>
      </form>
    </div>
  );
};

export default Demographics;