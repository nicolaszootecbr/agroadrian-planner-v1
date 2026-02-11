
import React, { useState } from 'react';

interface InfoTooltipProps {
  text: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex ml-2">
      <button 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={(e) => { e.preventDefault(); setShow(!show); }}
        className="w-4 h-4 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold focus:outline-none"
        aria-label="Mais informações"
      >
        i
      </button>
      {show && (
        <div className="absolute z-10 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};
