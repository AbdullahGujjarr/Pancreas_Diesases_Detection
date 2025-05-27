
import { AnalysisResult } from '../types/analysis';

export const parseAnalysisResult = (data: unknown): AnalysisResult => {
  if (typeof data === 'object' && data !== null) {
    const obj = data as any;
    return {
      probability: typeof obj.probability === 'number' ? obj.probability : 0,
      confidence: typeof obj.confidence === 'number' ? obj.confidence : 0,
      detectedAnomalies: Array.isArray(obj.detectedAnomalies) ? obj.detectedAnomalies : [],
      recommendations: Array.isArray(obj.recommendations) ? obj.recommendations : [],
      riskLevel: ['low', 'medium', 'high'].includes(obj.riskLevel) ? obj.riskLevel : 'low'
    };
  }
  
  // Return default values if parsing fails
  return {
    probability: 0,
    confidence: 0,
    detectedAnomalies: [],
    recommendations: [],
    riskLevel: 'low'
  };
};

export const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'high': return 'text-red-600 bg-red-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'low': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};
