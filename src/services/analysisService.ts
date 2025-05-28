
// Mock analysis service for demonstration

export interface AnalysisResults {
  analysisId: string;
  probabilities: Record<string, number>;
  explanations: Record<string, string>;
}

export const analyzeImage = async (_imageFile: File): Promise<AnalysisResults> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock response with realistic probabilities
  return {
    analysisId: `analysis_${Date.now()}`,
    probabilities: {
      acute_pancreatitis: 0.907,
      pancreatic_cysts: 0.039,
      chronic_pancreatitis: 0.070,
      pancreatic_cancer: 0.019
    },
    explanations: {
      acute_pancreatitis: "Acute pancreatitis is inflammation of the pancreas that develops quickly. Common symptoms include severe abdominal pain, nausea, and vomiting. Early diagnosis and treatment are crucial for preventing complications.",
      pancreatic_cysts: "Pancreatic cysts are fluid-filled sacs that can develop in the pancreas. Most are benign, but some may require monitoring or treatment depending on their characteristics and growth pattern.",
      chronic_pancreatitis: "Chronic pancreatitis is long-term inflammation that progressively damages the pancreas. It can lead to diabetes and digestive problems. Management focuses on pain control and enzyme replacement.",
      pancreatic_cancer: "Pancreatic cancer is a serious condition that requires immediate medical attention. Early detection significantly improves treatment outcomes. Symptoms may include abdominal pain, weight loss, and jaundice."
    }
  };
};
