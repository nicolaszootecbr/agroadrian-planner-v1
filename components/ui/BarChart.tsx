
import React from 'react';

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
    }[];
}

interface BarChartProps {
  data: ChartData;
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.datasets[0].data, 1);

    return (
        <div className="w-full">
            <div className="flex justify-around items-end h-40 p-2 space-x-2">
                {data.labels.map((label, index) => {
                    const value = data.datasets[0].data[index];
                    const barHeight = (value / maxValue) * 100;
                    const bgColor = data.datasets[0].backgroundColor[index];

                    return (
                        <div key={label} className="flex flex-col items-center flex-1">
                            <div className="text-sm font-bold text-gray-700">{value.toFixed(2)}</div>
                            <div
                                className="w-full rounded-t-md transition-all duration-500 ease-out"
                                style={{ height: `${barHeight}%`, backgroundColor: bgColor }}
                                title={`${label}: ${value.toFixed(2)}`}
                            >
                            </div>
                            <div className="text-xs text-center text-gray-500 mt-1">{label}</div>
                        </div>
                    );
                })}
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">{data.datasets[0].label}</p>
        </div>
    );
};
