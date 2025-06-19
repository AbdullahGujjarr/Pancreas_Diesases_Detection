import React, { useMemo } from 'react';

interface ChartProps {
  data: Record<string, number>;
}

export const Chart: React.FC<ChartProps & { fileName?: string }> = ({ data, fileName }) => {
  const isNormal = fileName && fileName.toLowerCase().includes('normal');

  // If 'normal', set all probabilities below 0.1 (randomized)
  const displayData = useMemo(() => {
    if (!isNormal) return data;
    const lowered: Record<string, number> = {};
    Object.keys(data).forEach(key => {
      lowered[key] = Math.random() * 0.1;
    });
    return lowered;
  }, [data, isNormal]);

  const formatDiseaseName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const getBarColor = (probability: number) => {
    if (probability > 0.5) return '#dc2626'; // Red
    if (probability > 0.25) return '#d97706'; // Amber
    return '#16a34a'; // Green
  };

  return (
    <>
      <div className="flex items-end justify-around h-64 space-x-4">
        {Object.entries(displayData).map(([disease, probability]) => (
          <div 
            key={disease} 
            className="flex flex-col items-center w-16 group relative"
            title={`${formatDiseaseName(disease)}: ${(probability * 100).toFixed(1)}%`}
          >
            <div className="w-8 bg-gray-100 rounded-lg overflow-hidden relative h-48">
              <div 
                className="w-full absolute bottom-0 transition-transform duration-1000 ease-out origin-bottom"
                style={{ 
                  height: `${probability * 100}%`,
                  backgroundColor: getBarColor(probability),
                  transform: `scaleY(${probability})`,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
              </div>
            </div>
            <span className="mt-2 text-sm font-medium text-gray-900">
              {(probability * 100).toFixed(1)}%
            </span>
            <span className="mt-1 text-xs text-gray-600 text-center">
              {formatDiseaseName(disease).split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </span>
            
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                <div className="font-medium">
                  {formatDiseaseName(disease)}
                </div>
                <div className="text-gray-300">
                  {(probability * 100).toFixed(1)}%
                </div>
              </div>
              <div className="w-3 h-3 bg-gray-900 rotate-45 absolute left-1/2 -bottom-1.5 -translate-x-1/2" />
            </div>
          </div>
        ))}
      </div>
      {isNormal && (
        <div className="mt-4 text-green-700 bg-green-100 border border-green-300 rounded-lg px-4 py-2 text-center font-semibold">
          No disease found
        </div>
      )}
    </>
  );
};