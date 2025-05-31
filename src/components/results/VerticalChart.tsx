
import React from 'react';

interface VerticalChartProps {
  data: Record<string, number>;
  title: string;
}

const VerticalChart: React.FC<VerticalChartProps> = ({ data, title }) => {
  const formatDiseaseName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Sort data by probability for better visualization
  const sortedData = Object.entries(data).sort(([,a], [,b]) => (b as number) - (a as number));

  // Professional color scheme based on probability ranges
  const getBarColor = (probability: number) => {
    if (probability > 0.7) {
      // High probability - Professional red
      return 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)';
    } else if (probability > 0.5) {
      // Medium-high probability - Orange
      return 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%)';
    } else if (probability > 0.3) {
      // Medium probability - Amber
      return 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)';
    } else if (probability > 0.1) {
      // Low-medium probability - Light green
      return 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)';
    } else {
      // Very low probability - Professional green
      return 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)';
    }
  };

  const getGlowColor = (probability: number) => {
    if (probability > 0.7) return 'rgba(239, 68, 68, 0.4)';
    if (probability > 0.5) return 'rgba(249, 115, 22, 0.4)';
    if (probability > 0.3) return 'rgba(245, 158, 11, 0.4)';
    if (probability > 0.1) return 'rgba(34, 197, 94, 0.4)';
    return 'rgba(16, 185, 129, 0.4)';
  };

  const getRiskLabel = (probability: number) => {
    if (probability > 0.7) return { text: 'High Risk', color: 'text-red-600' };
    if (probability > 0.5) return { text: 'Elevated Risk', color: 'text-orange-600' };
    if (probability > 0.3) return { text: 'Moderate Risk', color: 'text-amber-600' };
    if (probability > 0.1) return { text: 'Low Risk', color: 'text-green-600' };
    return { text: 'Very Low Risk', color: 'text-emerald-600' };
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm">
      <div className="flex items-center mb-6 sm:mb-8">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3 sm:mr-4 flex items-center justify-center shadow-lg">
          <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{title}</h2>
      </div>
      
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-600 mb-6 sm:mb-8 lg:mb-10 text-center tracking-wide">Probability Distribution</h3>
      
      {/* Responsive chart container */}
      <div className="flex justify-center items-end gap-2 sm:gap-4 lg:gap-8 h-64 sm:h-80 lg:h-96 mb-6 sm:mb-8 overflow-x-auto">
        {sortedData.map(([disease, probability]) => {
          // Calculate proportional height based on actual probability (0-100% of container)
          const height = (probability as number) * 100;
          const percentage = ((probability as number) * 100).toFixed(1);
          const riskInfo = getRiskLabel(probability as number);
          
          return (
            <div 
              key={disease} 
              className="flex flex-col items-center group relative cursor-pointer transform transition-all duration-500 hover:scale-105 min-w-0 flex-shrink-0"
            >
              {/* Percentage label only - responsive sizing */}
              <div className="mb-2 sm:mb-3 lg:mb-4 px-2 sm:px-3 py-1 sm:py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 transition-all duration-300 group-hover:shadow-lg">
                <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 group-hover:text-gray-900">
                  {percentage}%
                </span>
              </div>
              
              {/* Bar container with responsive width */}
              <div className="relative w-12 sm:w-16 lg:w-20">
                {/* Background container - responsive height */}
                <div className="w-full h-48 sm:h-64 lg:h-80 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl relative border border-gray-200/70 group-hover:border-gray-300/70 transition-all duration-500 overflow-hidden shadow-inner">
                  
                  {/* Actual probability bar - proportional height */}
                  <div 
                    className="w-full absolute bottom-0 rounded-xl transition-all duration-1000 ease-out group-hover:scale-105"
                    style={{ 
                      height: `${height}%`,
                      background: getBarColor(probability as number),
                      animation: 'realBarGrowth 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      transformOrigin: 'bottom',
                      boxShadow: `0 0 20px ${getGlowColor(probability as number)}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                      minHeight: height < 2 ? '8px' : 'auto', // Ensure very small values are still visible
                    }}
                  >
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-xl"></div>
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-xl"></div>
                    
                    {/* Top highlight for visible bars */}
                    {height > 5 && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 rounded-t-xl"></div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Disease name label - responsive text */}
              <div className="mt-2 sm:mt-3 lg:mt-4 text-center max-w-16 sm:max-w-20 lg:max-w-24">
                <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight block transition-all duration-300 group-hover:text-gray-900 group-hover:scale-105 break-words">
                  {formatDiseaseName(disease)}
                </span>
              </div>

              {/* Enhanced tooltip - responsive positioning */}
              <div className="absolute -top-20 sm:-top-24 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 shadow-2xl border border-gray-700/50">
                <div className="text-center">
                  <div className="font-semibold">{formatDiseaseName(disease)}</div>
                  <div className="text-gray-300 text-xs mt-1">Probability: {percentage}%</div>
                  <div className={`text-xs mt-1 font-medium ${riskInfo.color.replace('text-', 'text-')}`}>
                    {riskInfo.text}
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced legend - responsive layout */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="flex items-center text-xs text-gray-600">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-red-600 rounded mr-1 sm:mr-2"></div>
          <span className="whitespace-nowrap">High Risk (70%+)</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded mr-1 sm:mr-2"></div>
          <span className="whitespace-nowrap">Elevated (50-70%)</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded mr-1 sm:mr-2"></div>
          <span className="whitespace-nowrap">Moderate (30-50%)</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-green-500 to-green-600 rounded mr-1 sm:mr-2"></div>
          <span className="whitespace-nowrap">Low (&lt;30%)</span>
        </div>
      </div>

      {/* Professional footer note - responsive text */}
      <div className="text-center pt-3 sm:pt-4 border-t border-gray-200/50">
        <p className="text-xs text-gray-500 font-medium">
          Proportional Probability Visualization • AI-Powered Medical Analysis
        </p>
      </div>
    </div>
  );
};

export default VerticalChart;
