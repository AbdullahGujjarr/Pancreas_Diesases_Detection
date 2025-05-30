
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

  const maxValue = Math.max(...Object.values(data));

  // Sort data by probability for better visualization
  const sortedData = Object.entries(data).sort(([,a], [,b]) => (b as number) - (a as number));

  // Professional color scheme based on medical standards
  const getBarGradient = (probability: number) => {
    if (probability > 0.7) {
      // Critical risk - Deep red with professional gradient
      return 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)';
    } else if (probability > 0.5) {
      // High risk - Orange-red gradient
      return 'linear-gradient(135deg, #EA580C 0%, #DC2626 50%, #B91C1C 100%)';
    } else if (probability > 0.3) {
      // Medium risk - Amber gradient
      return 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)';
    } else {
      // Low risk - Professional green gradient
      return 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)';
    }
  };

  const getGlowColor = (probability: number) => {
    if (probability > 0.7) return 'rgba(220, 38, 38, 0.4)';
    if (probability > 0.5) return 'rgba(234, 88, 12, 0.4)';
    if (probability > 0.3) return 'rgba(245, 158, 11, 0.4)';
    return 'rgba(16, 185, 129, 0.4)';
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-4 flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{title}</h2>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-600 mb-10 text-center tracking-wide">Risk Assessment Distribution</h3>
      
      <div className="flex justify-center items-end gap-12 h-96 mb-8">
        {sortedData.map(([disease, probability]) => {
          const height = (probability as number / maxValue) * 100;
          const percentage = ((probability as number) * 100).toFixed(1);
          
          return (
            <div 
              key={disease} 
              className="flex flex-col items-center group relative cursor-pointer transform transition-all duration-500 hover:scale-105"
            >
              {/* Enhanced percentage label */}
              <div className="mb-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 transition-all duration-300 group-hover:shadow-xl group-hover:scale-110">
                <span className="text-lg font-bold text-gray-800 group-hover:text-gray-900">
                  {percentage}%
                </span>
              </div>
              
              {/* Professional bar container */}
              <div className="relative">
                {/* Enhanced background with subtle pattern */}
                <div className="w-24 h-80 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl relative border border-gray-200/70 group-hover:border-gray-300/70 transition-all duration-500 overflow-hidden shadow-inner">
                  {/* Subtle grid pattern */}
                  <div className="absolute inset-0 opacity-30">
                    {[20, 40, 60, 80].map(line => (
                      <div 
                        key={line}
                        className="absolute w-full border-t border-gray-300/40"
                        style={{ bottom: `${line}%` }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Professional animated bar */}
                  <div 
                    className="w-full absolute bottom-0 rounded-xl transition-all duration-1000 ease-out group-hover:scale-105"
                    style={{ 
                      height: `${height}%`,
                      background: getBarGradient(probability as number),
                      animation: 'slideUpProfessional 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      transformOrigin: 'bottom',
                      boxShadow: `0 0 20px ${getGlowColor(probability as number)}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    }}
                  >
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-xl"></div>
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-xl"></div>
                    
                    {/* Top highlight */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 rounded-t-xl"></div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced disease name label */}
              <div className="mt-5 text-center max-w-28">
                <span className="text-sm font-semibold text-gray-700 leading-tight block transition-all duration-300 group-hover:text-gray-900 group-hover:scale-105">
                  {formatDiseaseName(disease)}
                </span>
              </div>

              {/* Professional tooltip */}
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 shadow-2xl border border-gray-700/50">
                <div className="text-center">
                  <div className="font-semibold">{formatDiseaseName(disease)}</div>
                  <div className="text-gray-300 text-xs mt-1">Risk Level: {percentage}%</div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Professional footer note */}
      <div className="text-center pt-4 border-t border-gray-200/50">
        <p className="text-xs text-gray-500 font-medium">
          Professional AI Analysis • Medical Grade Assessment
        </p>
      </div>
    </div>
  );
};

export default VerticalChart;
