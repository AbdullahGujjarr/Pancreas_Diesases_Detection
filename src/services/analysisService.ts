import { v4 as uuidv4 } from 'uuid';

// Types for analysis results
export interface AnalysisResults {
  analysisId: string;
  timestamp: string;
  probabilities: Record<string, number>;
  heatmapData: number[][];
  explanations: Record<string, string>;
  confidence: number;
}

// Simulated API endpoint for disease analysis
const API_ENDPOINT = 'https://api.pancrescan.ai/v1/analyze';

export const analyzeImage = async (file: File): Promise<AnalysisResults> => {
  try {
    // In a real implementation, this would be an actual API call
    // For demo, we'll simulate an API response with realistic variations
    const response = await simulateApiCall(file);
    return response;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze image');
  }
};

const simulateApiCall = async (file: File): Promise<AnalysisResults> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate realistic probabilities based on image analysis patterns
  const baseProb = Math.random();
  const probabilities = generateRealisticProbabilities(baseProb);

  return {
    analysisId: uuidv4().substring(0, 8),
    timestamp: new Date().toISOString(),
    probabilities,
    heatmapData: generateDynamicHeatmap(),
    explanations: getDiseaseExplanations(),
    confidence: 0.92 + (Math.random() * 0.05)
  };
};

const generateRealisticProbabilities = (baseProbability: number): Record<string, number> => {
  // Simulate more realistic probability distributions
  const primaryDisease = Math.random() > 0.5 ? 'acute_pancreatitis' : 'pancreatic_cysts';
  const probabilities: Record<string, number> = {
    acute_pancreatitis: 0,
    pancreatic_cysts: 0,
    chronic_pancreatitis: 0,
    pancreatic_cancer: 0
  };

  // Set primary disease probability
  probabilities[primaryDisease] = 0.75 + (Math.random() * 0.2); // 75-95%

  // Distribute remaining probability realistically
  const remainingDiseases = Object.keys(probabilities).filter(d => d !== primaryDisease);
  remainingDiseases.forEach(disease => {
    probabilities[disease] = Math.random() * 0.08; // 0-8%
  });

  return probabilities;
};

const generateDynamicHeatmap = (): number[][] => {
  const size = 50;
  const heatmap = Array(size).fill(0).map(() => Array(size).fill(0));
  
  // Create multiple dynamic hotspots
  const numHotspots = 2 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numHotspots; i++) {
    const centerX = Math.floor(size * Math.random());
    const centerY = Math.floor(size * Math.random());
    const radius = Math.floor(size * (0.1 + Math.random() * 0.15));
    const intensity = 0.5 + Math.random() * 0.5;
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        
        if (distance < radius) {
          const value = intensity * Math.max(0, 1 - (distance / radius));
          heatmap[y][x] = Math.max(heatmap[y][x], value);
        }
      }
    }
  }
  
  return heatmap;
};

const getDiseaseExplanations = (): Record<string, string> => {
  return {
    pancreatic_cancer: 
      "Pancreatic cancer is characterized by the abnormal growth of cells in the pancreas. Early detection is crucial for improved outcomes. Common indicators include specific tissue density patterns and structural changes visible in imaging.",
    
    chronic_pancreatitis:
      "Chronic pancreatitis shows persistent inflammation patterns and potential calcifications. The analysis looks for characteristic changes in pancreatic tissue density and structure that develop over time.",
    
    pancreatic_cysts:
      "Pancreatic cysts appear as fluid-filled structures within the pancreas. The AI system analyzes their size, location, and characteristics to assess potential risks and type classification.",
    
    acute_pancreatitis:
      "Acute pancreatitis presents with inflammation patterns and potential fluid collections. The analysis identifies characteristic changes in pancreatic tissue and surrounding structures indicative of acute inflammation."
  };
};