const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Path to data files
const DATA_DIR = path.join(__dirname, '../analysis/data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`✅ Created data directory: ${DATA_DIR}`);
}

const CSV_FILE = path.join(DATA_DIR, 'all_participants.csv');
const JSON_FILE = path.join(DATA_DIR, 'all_participants.json');

// Initialize CSV file with headers if it doesn't exist
const initializeCSV = () => {
  if (!fs.existsSync(CSV_FILE)) {
    const headers = [
      'participant_id',
      'age',
      'gender',
      'education',
      'tech_experience',
      'device_type',
      'interface_a_avg_time',
      'interface_a_errors',
      'interface_a_success_rate',
      'interface_a_mental_demand',
      'interface_a_physical_demand',
      'interface_a_temporal_demand',
      'interface_a_performance',
      'interface_a_effort',
      'interface_a_frustration',
      'interface_b_avg_time',
      'interface_b_errors',
      'interface_b_success_rate',
      'interface_b_mental_demand',
      'interface_b_physical_demand',
      'interface_b_temporal_demand',
      'interface_b_performance',
      'interface_b_effort',
      'interface_b_frustration',
      'sus_score',
      'completion_date'
    ].join(',');
    
    fs.writeFileSync(CSV_FILE, headers + '\n');
    console.log('✅ CSV file initialized');
  }
};

// Initialize JSON file if it doesn't exist
const initializeJSON = () => {
  if (!fs.existsSync(JSON_FILE)) {
    fs.writeFileSync(JSON_FILE, JSON.stringify([], null, 2));
    console.log('✅ JSON file initialized');
  }
};

// Calculate SUS score
const calculateSUS = (susData) => {
  const scores = Object.values(susData);
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      sum += scores[i] - 1;
    } else {
      sum += 5 - scores[i];
    }
  }
  return sum * 2.5;
};

// Calculate averages from tasks
const calculateTaskAverages = (tasks) => {
  const completionTimes = tasks.map(t => t.completionTime);
  const errors = tasks.map(t => t.errors);
  const successes = tasks.filter(t => t.success).length;
  
  return {
    avgTime: completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length,
    totalErrors: errors.reduce((a, b) => a + b, 0),
    successRate: (successes / tasks.length) * 100
  };
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    dataDir: DATA_DIR,
    csvExists: fs.existsSync(CSV_FILE),
    jsonExists: fs.existsSync(JSON_FILE)
  });
});

// Save participant data
app.post('/api/save-data', (req, res) => {
  console.log('📥 Received data from participant');
  
  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.participantId) {
      return res.status(400).json({ error: 'Missing participant ID' });
    }
    if (!data.demographics) {
      return res.status(400).json({ error: 'Missing demographics' });
    }
    if (!data.interfaceA || !data.interfaceA.tasks) {
      return res.status(400).json({ error: 'Missing interface A data' });
    }
    if (!data.interfaceB || !data.interfaceB.tasks) {
      return res.status(400).json({ error: 'Missing interface B data' });
    }

    console.log(`📊 Processing data for participant: ${data.participantId}`);

    // Calculate metrics for each interface
    const interfaceA_metrics = calculateTaskAverages(data.interfaceA.tasks);
    const interfaceB_metrics = calculateTaskAverages(data.interfaceB.tasks);
    
    // Calculate SUS score
    const susScore = calculateSUS(data.sus);

    // Prepare CSV row
    const csvRow = [
      data.participantId,
      data.demographics.age || '',
      data.demographics.gender || '',
      data.demographics.education || '',
      data.demographics.techExperience || '',
      data.demographics.deviceType || '',
      interfaceA_metrics.avgTime.toFixed(2),
      interfaceA_metrics.totalErrors,
      interfaceA_metrics.successRate.toFixed(1),
      data.interfaceA.nasa_tlx?.mentalDemand || 0,
      data.interfaceA.nasa_tlx?.physicalDemand || 0,
      data.interfaceA.nasa_tlx?.temporalDemand || 0,
      data.interfaceA.nasa_tlx?.performance || 0,
      data.interfaceA.nasa_tlx?.effort || 0,
      data.interfaceA.nasa_tlx?.frustration || 0,
      interfaceB_metrics.avgTime.toFixed(2),
      interfaceB_metrics.totalErrors,
      interfaceB_metrics.successRate.toFixed(1),
      data.interfaceB.nasa_tlx?.mentalDemand || 0,
      data.interfaceB.nasa_tlx?.physicalDemand || 0,
      data.interfaceB.nasa_tlx?.temporalDemand || 0,
      data.interfaceB.nasa_tlx?.performance || 0,
      data.interfaceB.nasa_tlx?.effort || 0,
      data.interfaceB.nasa_tlx?.frustration || 0,
      susScore.toFixed(1),
      new Date().toISOString()
    ].join(',');

    // Append to CSV
    fs.appendFileSync(CSV_FILE, csvRow + '\n');
    console.log(`✅ CSV data saved for ${data.participantId}`);

    // Also save full JSON data
    let existingData = [];
    if (fs.existsSync(JSON_FILE)) {
      try {
        const fileContent = fs.readFileSync(JSON_FILE, 'utf-8');
        existingData = JSON.parse(fileContent);
        if (!Array.isArray(existingData)) {
          existingData = [];
        }
      } catch (e) {
        console.warn('⚠️ JSON file corrupted, reinitializing');
        existingData = [];
      }
    }
    
    const participantData = {
      ...data,
      calculated_metrics: {
        interfaceA: interfaceA_metrics,
        interfaceB: interfaceB_metrics,
        susScore: susScore
      },
      savedAt: new Date().toISOString()
    };
    existingData.push(participantData);
    fs.writeFileSync(JSON_FILE, JSON.stringify(existingData, null, 2));
    console.log(`✅ JSON data saved for ${data.participantId}`);
    
    // Return success with calculated metrics
    res.json({
      success: true,
      participantId: data.participantId,
      metrics: {
        interfaceA: interfaceA_metrics,
        interfaceB: interfaceB_metrics,
        susScore: susScore
      },
      totalParticipants: existingData.length
    });

  } catch (error) {
    console.error('❌ Error saving data:', error);
    res.status(500).json({ 
      error: 'Failed to save data',
      details: error.message 
    });
  }
});

// Get all participants data
app.get('/api/get-data', (req, res) => {
  try {
    if (fs.existsSync(JSON_FILE)) {
      const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
      res.json(data);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Download CSV
app.get('/api/download-csv', (req, res) => {
  try {
    if (fs.existsSync(CSV_FILE)) {
      res.download(CSV_FILE);
    } else {
      res.status(404).json({ error: 'CSV file not found' });
    }
  } catch (error) {
    console.error('Error downloading CSV:', error);
    res.status(500).json({ error: 'Failed to download CSV' });
  }
});

// Get summary statistics
app.get('/api/summary', (req, res) => {
  try {
    if (!fs.existsSync(JSON_FILE)) {
      return res.json({ totalParticipants: 0 });
    }
    
    const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
    
    const summary = {
      totalParticipants: data.length,
      averageAge: data.reduce((sum, p) => sum + p.demographics.age, 0) / data.length || 0,
      genderDistribution: {},
      averageSUS: data.reduce((sum, p) => sum + p.calculated_metrics.susScore, 0) / data.length || 0,
      averageInterfaceA_Time: data.reduce((sum, p) => sum + p.calculated_metrics.interfaceA.avgTime, 0) / data.length || 0,
      averageInterfaceB_Time: data.reduce((sum, p) => sum + p.calculated_metrics.interfaceB.avgTime, 0) / data.length || 0,
    };
    
    data.forEach(p => {
      const gender = p.demographics.gender;
      summary.genderDistribution[gender] = (summary.genderDistribution[gender] || 0) + 1;
    });
    
    res.json(summary);
  } catch (error) {
    console.error('Error calculating summary:', error);
    res.status(500).json({ error: 'Failed to calculate summary' });
  }
});

// Start server
initializeCSV();
initializeJSON();

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 Cognitive Load Study - Data Collection Server');
  console.log('='.repeat(50));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
  console.log(`📊 CSV file: ${CSV_FILE}`);
  console.log(`📄 JSON file: ${JSON_FILE}`);
  console.log('='.repeat(50));
  console.log('\n✅ Server is ready to receive data!');
});