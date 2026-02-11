
import React from 'react';

interface SiloVisualizerProps {
  altura: number;
  larguraTopo: number;
  larguraFundo: number;
}

export const SiloVisualizer: React.FC<SiloVisualizerProps> = ({ altura, larguraTopo, larguraFundo }) => {
  const viewBoxWidth = 120;
  const viewBoxHeight = 60;
  
  const maxDim = Math.max(altura, larguraTopo, 5);
  
  const h = (altura / maxDim) * (viewBoxHeight * 0.8);
  const B = (larguraTopo / maxDim) * (viewBoxWidth * 0.8);
  const b = (larguraFundo / maxDim) * (viewBoxWidth * 0.8);
  
  const xOffsetB = (viewBoxWidth - B) / 2;
  const xOffsetb = (viewBoxWidth - b) / 2;
  
  const points = `${xOffsetB},${viewBoxHeight - h} ${xOffsetB + B},${viewBoxHeight - h} ${xOffsetb + b},${viewBoxHeight} ${xOffsetb},${viewBoxHeight}`;

  return (
    <div className="w-full text-xs text-gray-600">
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-auto transition-all duration-300">
        {/* Trapezoid Face */}
        <polygon points={points} fill="#A7F3D0" stroke="#10B981" strokeWidth="1" />
        
        {/* Dimension Lines and Labels */}
        {/* Altura (h) */}
        <line x1={xOffsetB - 5} y1={viewBoxHeight - h} x2={xOffsetB - 5} y2={viewBoxHeight} stroke="#6B7280" strokeWidth="0.5" strokeDasharray="2,2"/>
        <text x={xOffsetB - 7} y={viewBoxHeight - h/2} textAnchor="end" alignmentBaseline="middle">h</text>
        
        {/* Largura Topo (B) */}
        <line x1={xOffsetB} y1={viewBoxHeight - h - 5} x2={xOffsetB + B} y2={viewBoxHeight - h - 5} stroke="#6B7280" strokeWidth="0.5" strokeDasharray="2,2"/>
        <text x={viewBoxWidth/2} y={viewBoxHeight - h - 7} textAnchor="middle">B</text>

        {/* Largura Fundo (b) */}
        <line x1={xOffsetb} y1={viewBoxHeight + 5} x2={xOffsetb + b} y2={viewBoxHeight + 5} stroke="#6B7280" strokeWidth="0.5" strokeDasharray="2,2"/>
        <text x={viewBoxWidth/2} y={viewBoxHeight + 9} textAnchor="middle">b</text>
      </svg>
      <div className="flex justify-around mt-2">
          <span>h: {altura.toFixed(1)}m</span>
          <span>B: {larguraTopo.toFixed(1)}m</span>
          <span>b: {larguraFundo.toFixed(1)}m</span>
      </div>
    </div>
  );
};
