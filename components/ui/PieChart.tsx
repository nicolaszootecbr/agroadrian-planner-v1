
import React from 'react';

interface PieChartProps {
  data: number[];
  labels: string[];
  colors: string[];
}

export const PieChart: React.FC<PieChartProps> = ({ data, labels, colors }) => {
  const total = data.reduce((acc, val) => acc + val, 0);
  if (total === 0) return <p className="text-center text-gray-500 py-8">Sem dados de custo para exibir o gráfico.</p>;

  let accumulatedPercentage = 0;
  const segments = data.map((value, index) => {
    const percentage = (value / total);
    const startAngle = accumulatedPercentage * 360;
    accumulatedPercentage += percentage;
    const endAngle = accumulatedPercentage * 360;

    return {
      percentage: percentage * 100,
      pathData: getArcPath(startAngle, endAngle),
      color: colors[index],
      label: labels[index],
      value: value
    };
  });
  
  function getCoordinatesForAngle(angle: number) {
    const radians = (angle - 90) * Math.PI / 180;
    return {
        x: 50 + 45 * Math.cos(radians),
        y: 50 + 45 * Math.sin(radians),
    }
  }

  function getArcPath(startAngle: number, endAngle: number) {
      const start = getCoordinatesForAngle(startAngle);
      const end = getCoordinatesForAngle(endAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
      return `M ${start.x} ${start.y} A 45 45 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  }


  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
      <div className="w-40 h-40 relative">
        <svg viewBox="0 0 100 100">
          {segments.map((segment, index) => (
             <path key={index} d={segment.pathData} stroke={segment.color} strokeWidth="10" fill="none" />
          ))}
        </svg>
      </div>
      <div className="w-full md:w-1/2">
        <h4 className="font-bold mb-2 text-gray-800">Distribuição de Custos Anuais</h4>
        <ul className="space-y-2 text-sm">
          {segments.map((segment, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }}></span>
                <span>{segment.label}</span>
              </div>
              <span className="font-semibold text-gray-700">
                {segment.percentage.toFixed(1)}% 
                <span className="text-xs text-gray-500 ml-1">(R$ {segment.value.toLocaleString('pt-BR', {maximumFractionDigits:0})})</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};