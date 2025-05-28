
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

  // Function to get color based on probability (risk level)
  const getBarColor = (probability: number) => {
    if (probability > 0.5) {
      // High risk - red gradient
      return 'linear-gradient(to top, #DC2626, #F87171)';
    } else {
      // Low risk - green gradient
      return 'linear-gradient(to top, #059669, #34D399)';
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-blue-500 rounded mr-3 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      
      <h3 className="text-lg font-medium text-gray-700 mb-6">Probability Distribution</h3>
      
      <div className="flex justify-center items-end gap-12 h-80 mb-8">
        {sortedData.map(([disease, probability]) => {
          const height = (probability as number / maxValue) * 100;
          const percentage = ((probability as number) * 100).toFixed(1);
          
          return (
            <div 
              key={disease} 
              className="flex flex-col items-center group relative"
            >
              {/* Percentage label on top */}
              <div className="mb-2 text-sm font-medium text-gray-600">
                {percentage}%
              </div>
              
              {/* Bar container with Y-axis labels */}
              <div className="relative">
                {/* Y-axis labels */}
                <div className="absolute -left-8 h-64 flex flex-col justify-between text-xs text-gray-500">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                
                {/* Bar background */}
                <div className="w-16 h-64 bg-gray-100 rounded-sm relative border border-gray-200">
                  {/* Grid lines */}
                  <div className="absolute inset-0">
                    {[25, 50, 75].map(line => (
                      <div 
                        key={line}
                        className="absolute w-full border-t border-gray-200"
                        style={{ bottom: `${line * 0.64}%` }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Animated bar - color changes based on risk level */}
                  <div 
                    className="w-full absolute bottom-0 rounded-sm transition-all duration-1000 ease-out"
                    style={{ 
                      height: `${height * 0.64}%`,
                      background: getBarColor(probability as number),
                      animation: 'slide-up 1.5s ease-out'
                    }}
                  >
                    {/* Subtle highlight effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-sm"></div>
                  </div>
                </div>
              </div>
              
              {/* Disease name label */}
              <div className="mt-4 text-center max-w-20">
                <span className="text-xs font-medium text-gray-700 leading-tight block">
                  {formatDiseaseName(disease)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalChart;
