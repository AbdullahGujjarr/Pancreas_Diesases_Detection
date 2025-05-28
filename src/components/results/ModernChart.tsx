
import React from 'react';

interface ModernChartProps {
  data: Record<string, number>;
  title: string;
}

const ModernChart: React.FC<ModernChartProps> = ({ data, title }) => {
  const formatDiseaseName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const getBarColor = (probability: number) => {
    if (probability > 0.5) return 'from-red-500 to-red-600'; // High risk - Red gradient
    if (probability > 0.25) return 'from-yellow-500 to-orange-500'; // Medium risk - Yellow/Orange gradient
    return 'from-green-400 to-green-500'; // Low risk - Green gradient
  };
  
  const getBarShadow = (probability: number) => {
    if (probability > 0.5) return 'shadow-red-200';
    if (probability > 0.25) return 'shadow-yellow-200';
    return 'shadow-green-200';
  };

  const maxValue = Math.max(...Object.values(data));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
      
      <div className="flex items-end justify-between h-80 gap-4 px-4">
        {Object.entries(data).map(([disease, probability]) => {
          const height = (probability / maxValue) * 100;
          const isHighest = probability === maxValue;
          
          return (
            <div 
              key={disease} 
              className="flex flex-col items-center flex-1 group"
            >
              {/* Value label on top */}
              <div className={`mb-2 transition-all duration-300 ${isHighest ? 'scale-110' : 'group-hover:scale-105'}`}>
                <span className={`text-lg font-bold px-3 py-1 rounded-full text-white shadow-lg ${
                  probability > 0.5 ? 'bg-red-500' : 
                  probability > 0.25 ? 'bg-yellow-500' : 'bg-green-500'
                }`}>
                  {(probability * 100).toFixed(1)}%
                </span>
              </div>
              
              {/* Bar container */}
              <div className="w-full h-64 bg-gray-100 rounded-lg relative overflow-hidden shadow-inner">
                {/* Animated bar */}
                <div 
                  className={`w-full absolute bottom-0 rounded-lg transition-all duration-1000 ease-out bg-gradient-to-t ${getBarColor(probability)} ${getBarShadow(probability)} shadow-lg transform group-hover:scale-105`}
                  style={{ 
                    height: `${height}%`,
                    animation: 'slide-up 1s ease-out'
                  }}
                >
                  {/* Glossy effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 rounded-lg"></div>
                  
                  {/* Highlight effect */}
                  <div className="absolute top-0 left-1/4 w-1/2 h-8 bg-white/30 rounded-full blur-sm"></div>
                </div>
                
                {/* Grid lines for better readability */}
                <div className="absolute inset-0 pointer-events-none">
                  {[25, 50, 75].map(line => (
                    <div 
                      key={line}
                      className="absolute w-full border-t border-gray-200/50"
                      style={{ bottom: `${line}%` }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Disease name label */}
              <div className="mt-3 text-center">
                <span className="text-sm font-semibold text-gray-700 leading-tight">
                  {formatDiseaseName(disease).split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </span>
              </div>
              
              {/* Hover tooltip */}
              <div className="absolute bottom-full mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
                <div className="bg-gray-900 text-white text-sm rounded-lg px-4 py-3 shadow-xl transform -translate-x-1/2 left-1/2">
                  <div className="font-semibold text-center">
                    {formatDiseaseName(disease)}
                  </div>
                  <div className="text-gray-300 text-center mt-1">
                    Probability: {(probability * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400 text-center mt-1">
                    {probability > 0.5 ? 'High Risk' : probability > 0.25 ? 'Medium Risk' : 'Low Risk'}
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-t from-green-400 to-green-500"></div>
          <span className="text-sm text-gray-600">Low Risk (≤25%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-t from-yellow-500 to-orange-500"></div>
          <span className="text-sm text-gray-600">Medium Risk (25-50%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-t from-red-500 to-red-600"></div>
          <span className="text-sm text-gray-600">High Risk (&gt;50%)</span>
        </div>
      </div>
    </div>
  );
};

export default ModernChart;
