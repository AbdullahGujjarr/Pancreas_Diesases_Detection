
export interface AnalysisResult {
  probability: number;
  confidence: number;
  detectedAnomalies: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface HeatmapData {
  x: number;
  y: number;
  intensity: number;
}

export interface AnalysisResponse {
  result: AnalysisResult;
  heatmapData: HeatmapData[];
  metadata: {
    processingTime: number;
    imageQuality: string;
    timestamp: string;
  };
}
