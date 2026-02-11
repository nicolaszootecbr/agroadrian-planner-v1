
import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ProgressBar } from './components/layout/ProgressBar';
import { PlanningModeSelector } from './components/layout/PlanningModeSelector';
import { DashboardModule } from './components/modules/DashboardModule';
import { AnimalModule } from './components/modules/AnimalModule';
import { TerraModule } from './components/modules/TerraModule';
import { SiloModule } from './components/modules/SiloModule';
import { PastoModule } from './components/modules/PastoModule';
import { ReportModule } from './components/modules/ReportModule';
import { CustoModule } from './components/modules/CustoModule';
import { PrintReport } from './components/layout/PrintReport';
import { BottomNav } from './components/layout/BottomNav';
import { useZootecnia } from './hooks/useZootecnia';
import { Module } from './types';

const App: React.FC = () => {
  const [planningModeSelected, setPlanningModeSelected] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<Module>(Module.Dashboard);
  const { 
    inputs, 
    setInput, 
    setForageInput, 
    setAnimalCategoryInput,
    setSiloMode,
    results, 
    saveScenario, 
    generateWhatsAppSummary,
    generateAuditReport,
    resetScenario,
    addForage,
    removeForage,
    addAnimalCategory,
    removeAnimalCategory,
  } = useZootecnia();

  const handleModeSelect = (mode: 'basic' | 'advanced') => {
    setSiloMode(mode);
    setPlanningModeSelected(true);
    setActiveModule(Module.Animal); // Direct user to the next logical step
  };

  const handleReset = () => {
    resetScenario();
    setActiveModule(Module.Dashboard);
    setPlanningModeSelected(false);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'Laudo-AgroAdrian-Planejamento';
    
    const afterPrint = () => {
      document.title = originalTitle;
      window.removeEventListener('afterprint', afterPrint);
    };
    window.addEventListener('afterprint', afterPrint);

    window.print();
  };

  const renderContent = () => {
    switch (activeModule) {
      case Module.Dashboard:
        return <DashboardModule results={results} />;
      case Module.Animal:
        return <AnimalModule inputs={inputs} onInputChange={setInput} onCategoryChange={setAnimalCategoryInput} addAnimalCategory={addAnimalCategory} removeAnimalCategory={removeAnimalCategory} />;
      case Module.Terra:
        return <TerraModule inputs={inputs} onInputChange={setInput} results={results} />;
      case Module.Silo:
        return <SiloModule inputs={inputs} onInputChange={setInput} results={results} />;
      case Module.Pasto:
        return <PastoModule inputs={inputs} onForageInputChange={setForageInput} onInputChange={setInput} results={results} addForage={addForage} removeForage={removeForage} />;
      case Module.Custo:
        return <CustoModule inputs={inputs} onForageInputChange={setForageInput} onInputChange={setInput} />;
      case Module.Report:
        return <ReportModule results={results} inputs={inputs} onGenerateReport={generateAuditReport} onPrint={handlePrint} />;
      default:
        return <DashboardModule results={results} />;
    }
  };

  if (!planningModeSelected) {
    return <PlanningModeSelector onSelectMode={handleModeSelect} />;
  }

  return (
    <>
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onSave={saveScenario}
            onExport={generateWhatsAppSummary}
            onPrint={handlePrint}
            onReset={handleReset}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pb-20 md:pb-0">
            <div className="container mx-auto px-6 py-8 max-w-4xl">
              <ProgressBar currentModule={activeModule} />
              <div className="mt-8">
                  {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
      <BottomNav activeModule={activeModule} setActiveModule={setActiveModule} />
      <PrintReport results={results} inputs={inputs} />
    </>
  );
};

export default App;