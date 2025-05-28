
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
  
  const getBarColor = (probability: number) => {
    if (probability > 0.5) return 'bg-red-500'; // High risk - Red
    if (probability > 0.25) return 'bg-yellow-500'; // Medium risk - Yellow
    return 'bg-green-500'; // Low risk - Green
  };
  
  const getPercentageColor = (probability: number) => {
    if (probability > 0.5) return 'bg-red-500 text-white'; // High risk - Red
    if (probability > 0.25) return 'bg-yellow-500 text-white'; // Medium risk - Yellow
    return 'bg-green-500 text-white'; // Low risk - Green
  };

  const maxValue = Math.max(...Object.values(data));

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">{title}</h2>
      
      <div className="flex justify-center items-end gap-8 h-96">
        {Object.entries(data).map(([disease, probability]) => {
          const height = (probability / maxValue) * 100;
          
          return (
            <div 
              key={disease} 
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Percentage label on top */}
              <div className={`mb-4 px-4 py-2 rounded-full font-bold text-lg shadow-lg transform transition-all duration-300 group-hover:scale-110 ${getPercentageColor(probability)}`}>
                {(probability * 100).toFixed(1)}%
              </div>
              
              {/* Bar container */}
              <div className="w-20 h-80 bg-gray-200 rounded-xl relative overflow-hidden shadow-inner">
                {/* Animated bar */}
                <div 
                  className={`w-full absolute bottom-0 rounded-xl transition-all duration-1000 ease-out transform group-hover:scale-105 ${getBarColor(probability)} shadow-lg`}
                  style={{ 
                    height: `${height}%`,
                    animation: 'slide-up 1.5s ease-out'
                  }}
                >
                  {/* Glossy gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/30 rounded-xl"></div>
                  
                  {/* Highlight effect */}
                  <div className="absolute top-2 left-2 right-2 h-6 bg-white/30 rounded-lg blur-sm"></div>
                </div>
                
                {/* Grid lines for reference */}
                <div className="absolute inset-0 pointer-events-none">
                  {[25, 50, 75].map(line => (
                    <div 
                      key={line}
                      className="absolute w-full border-t border-gray-300/40"
                      style={{ bottom: `${line}%` }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Disease name label */}
              <div className="mt-4 text-center max-w-24">
                <span className="text-sm font-semibold text-gray-700 leading-tight">
                  {formatDiseaseName(disease).split(' ').map((word, i) => (
                    <div key={i} className="block">{word}</div>
                  ))}
                </span>
              </div>
              
              {/* Hover tooltip */}
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                <div className="bg-gray-900 text-white text-sm rounded-lg px-4 py-3 shadow-xl whitespace-nowrap">
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
      <div className="mt-8 flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-sm text-gray-600">Low Risk (≤25%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span className="text-sm text-gray-600">Medium Risk (25-50%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-sm text-gray-600">High Risk (&gt;50%)</span>
        </div>
      </div>
    </div>
  );
};

export default VerticalChart;
