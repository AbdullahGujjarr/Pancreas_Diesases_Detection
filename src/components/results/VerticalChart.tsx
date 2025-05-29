
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
      <div className="flex items-center mb-8">
        <div className="w-6 h-6 bg-blue-500 rounded mr-3 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-700 mb-8 text-center">Probability Distribution</h3>
      
      <div className="flex justify-center items-end gap-8 h-96 mb-6">
        {sortedData.map(([disease, probability]) => {
          const height = (probability as number / maxValue) * 100;
          const percentage = ((probability as number) * 100).toFixed(1);
          
          return (
            <div 
              key={disease} 
              className="flex flex-col items-center group relative cursor-pointer"
            >
              {/* Percentage label on top with hover animation */}
              <div className="mb-3 text-lg font-bold text-gray-800 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110">
                {percentage}%
              </div>
              
              {/* Bar container */}
              <div className="relative">
                {/* Bar background with subtle grid */}
                <div className="w-20 h-80 bg-gray-50 rounded-lg relative border-2 border-gray-200 group-hover:border-gray-300 transition-all duration-300 overflow-hidden">
                  {/* Subtle grid lines */}
                  <div className="absolute inset-0">
                    {[20, 40, 60, 80].map(line => (
                      <div 
                        key={line}
                        className="absolute w-full border-t border-gray-200/50"
                        style={{ bottom: `${line}%` }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Animated bar with hover effects */}
                  <div 
                    className="w-full absolute bottom-0 rounded-lg transition-all duration-700 ease-out group-hover:scale-105 group-hover:shadow-lg"
                    style={{ 
                      height: `${height}%`,
                      background: getBarColor(probability as number),
                      animation: 'slide-up 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformOrigin: 'bottom',
                    }}
                  >
                    {/* Highlight effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-lg"></div>
                  </div>
                </div>
              </div>
              
              {/* Disease name label with improved typography */}
              <div className="mt-4 text-center max-w-24">
                <span className="text-sm font-semibold text-gray-700 leading-tight block transition-all duration-300 group-hover:text-gray-900 group-hover:scale-105">
                  {formatDiseaseName(disease)}
                </span>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                {formatDiseaseName(disease)}: {percentage}%
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalChart;
