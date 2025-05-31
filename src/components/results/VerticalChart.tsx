
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

  // Enhanced professional color scheme with improved gradients
  const getBarColor = (probability: number) => {
    if (probability > 0.7) {
      // High probability - Enhanced red with metallic finish
      return 'linear-gradient(135deg, #FF4757 0%, #FF3742 25%, #FF2D42 50%, #E55039 75%, #C44569 100%)';
    } else if (probability > 0.5) {
      // Medium-high probability - Enhanced orange with depth
      return 'linear-gradient(135deg, #FF6348 0%, #FF5722 25%, #FF4500 50%, #E8590C 75%, #D84315 100%)';
    } else if (probability > 0.3) {
      // Medium probability - Enhanced amber with warmth
      return 'linear-gradient(135deg, #FFB142 0%, #FFA726 25%, #FF9800 50%, #F57C00 75%, #E65100 100%)';
    } else if (probability > 0.1) {
      // Low-medium probability - Enhanced light green
      return 'linear-gradient(135deg, #26de81 0%, #20bf6b 25%, #00b894 50%, #00a085 75%, #008975 100%)';
    } else {
      // Very low probability - Enhanced professional green
      return 'linear-gradient(135deg, #2ed573 0%, #1dd1a1 25%, #10ac84 50%, #00d2d3 75%, #0abde3 100%)';
    }
  };

  const getRiskLabel = (probability: number) => {
    if (probability > 0.7) return { text: 'High Risk', color: 'text-red-600' };
    if (probability > 0.5) return { text: 'Elevated Risk', color: 'text-orange-600' };
    if (probability > 0.3) return { text: 'Moderate Risk', color: 'text-amber-600' };
    if (probability > 0.1) return { text: 'Low Risk', color: 'text-green-600' };
    return { text: 'Very Low Risk', color: 'text-emerald-600' };
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50/30 to-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm">
      <div className="flex items-center mb-6 sm:mb-8">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-lg mr-3 sm:mr-4 flex items-center justify-center shadow-lg">
          <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{title}</h2>
      </div>
      
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-600 mb-6 sm:mb-8 lg:mb-10 text-center tracking-wide">Probability Distribution</h3>
      
      {/* Chart container without animations */}
      <div className="flex justify-center items-end gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6 h-64 sm:h-80 lg:h-96 mb-6 sm:mb-8 px-2">
        {sortedData.map(([disease, probability]) => {
          // Calculate proportional height based on actual probability (0-100% of container)
          const height = (probability as number) * 100;
          const percentage = ((probability as number) * 100).toFixed(1);
          const riskInfo = getRiskLabel(probability as number);
          
          return (
            <div 
              key={disease} 
              className="flex flex-col items-center group relative cursor-pointer flex-1 min-w-0 max-w-16 sm:max-w-20 lg:max-w-24"
            >
              {/* Percentage label */}
              <div className="mb-2 sm:mb-3 lg:mb-4 px-1 sm:px-2 lg:px-3 py-1 sm:py-2 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200/50">
                <span className="text-xs sm:text-sm lg:text-base font-bold text-gray-800">
                  {percentage}%
                </span>
              </div>
              
              {/* Bar container */}
              <div className="relative w-full">
                {/* Background container */}
                <div className="w-full h-48 sm:h-64 lg:h-80 bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 rounded-xl relative border border-gray-200/70 overflow-hidden">
                  
                  {/* Probability bar - no animations or shadows */}
                  <div 
                    className="w-full absolute bottom-0 rounded-xl"
                    style={{ 
                      height: `${height}%`,
                      background: getBarColor(probability as number),
                      minHeight: height < 2 ? '8px' : 'auto',
                    }}
                  >
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/15 to-white/30 rounded-xl"></div>
                    
                    {/* Top highlight for visible bars */}
                    {height > 5 && (
                      <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-white/60 via-white/80 to-white/60 rounded-t-xl"></div>
                    )}
                    
                    {/* Bottom depth effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-black/10 via-transparent to-black/10 rounded-b-xl"></div>
                  </div>
                </div>
              </div>
              
              {/* Disease name label */}
              <div className="mt-2 sm:mt-3 lg:mt-4 text-center w-full">
                <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight block break-words px-1">
                  {formatDiseaseName(disease)}
                </span>
              </div>

              {/* Tooltip */}
              <div className="absolute -top-20 sm:-top-24 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20 border border-gray-700/50">
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

      {/* Legend */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="flex items-center text-xs text-gray-600">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded mr-1 sm:mr-2"></div>
          <span className="whitespace-nowrap">High Risk (70%+)</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded mr-1 sm:mr-2"></div>
          <span className="whitespace-nowrap">Elevated (50-70%)</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded mr-1 sm:mr-2"></div>
          <span className="whitespace-nowrap">Moderate (30-50%)</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 rounded mr-1 sm:mr-2"></div>
          <span className="whitespace-nowrap">Low (&lt;30%)</span>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center pt-3 sm:pt-4 border-t border-gray-200/50">
        <p className="text-xs text-gray-500 font-medium">
          Proportional Probability Visualization • AI-Powered Medical Analysis
        </p>
      </div>
    </div>
  );
};

export default VerticalChart;
