
import React from 'react';
import { CalculatedResults, MotorZootecniaData } from '../../types';
import { LaudoTecnico } from './LaudoTecnico';

interface PrintReportProps {
  results: CalculatedResults;
  inputs: MotorZootecniaData;
}

export const PrintReport: React.FC<PrintReportProps> = ({ results, inputs }) => {
  return (
    <div id="print-report" className="hidden print:block">
        <LaudoTecnico results={results} inputs={inputs} />
    </div>
  );
};
