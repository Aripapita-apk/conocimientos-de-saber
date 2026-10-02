/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Process,
  PHVATask,
  QuizQuestion,
  QuizResult,
  QuizHistoryEntry,
  PageId
} from './types';
import {
  DEFAULT_PROCESSES,
  DEFAULT_PHVA_TASKS,
  DEFAULT_MATRIX,
  DEFAULT_QUESTIONS
} from './data/defaultData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PythonRunnerModal } from './components/PythonRunnerModal';
import { ResumenView } from './components/views/ResumenView';
import { SipocView } from './components/views/SipocView';
import { MapaView } from './components/views/MapaView';
import { InteraccionesView } from './components/views/InteraccionesView';
import { PhvaView } from './components/views/PhvaView';
import { TriadaView } from './components/views/TriadaView';
import { AlertasView } from './components/views/AlertasView';
import { GestorView } from './components/views/GestorView';
import { DocView } from './components/views/DocView';
import { BusquedaView } from './components/views/BusquedaView';
import { QuizView } from './components/views/QuizView';

export default function App() {
  // Global State
  const [currentPage, setCurrentPage] = useState<PageId>('resumen');
  const [processes, setProcesses] = useState<Process[]>(DEFAULT_PROCESSES);
  const [phvaTasks, setPhvaTasks] = useState<PHVATask[]>(DEFAULT_PHVA_TASKS);
  const [matrix, setMatrix] = useState<number[][]>(DEFAULT_MATRIX);
  const [questions, setQuestions] = useState<QuizQuestion[]>(DEFAULT_QUESTIONS);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryEntry[]>([]);

  // Style State
  const [primaryColor, setPrimaryColor] = useState<string>('#39A900'); // Verde SENA
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isPythonGuideOpen, setIsPythonGuideOpen] = useState<boolean>(false);

  // Sync dark class on document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Adjust interaction matrix size whenever processes length changes
  const handleUpdateProcesses = (newProcesses: Process[]) => {
    const n = newProcesses.length;
    setProcesses(newProcesses);
    setMatrix((prev) => {
      const nextMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
      for (let i = 0; i < Math.min(n, prev.length); i++) {
        for (let j = 0; j < Math.min(n, prev[i]?.length || 0); j++) {
          nextMatrix[i][j] = prev[i][j];
        }
      }
      return nextMatrix;
    });
  };

  const handleAddProcess = (proc: Process) => {
    handleUpdateProcesses([...processes, proc]);
  };

  const handleModifyProcess = (updated: Process) => {
    setProcesses((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProcess = (id: number) => {
    handleUpdateProcesses(processes.filter((p) => p.id !== id));
  };

  // Compute active alert count for the badge
  const UMBRAL_MINIMO = 80;
  const criticalProcessesCount = processes.filter(
    (p) => p.eficacia < UMBRAL_MINIMO || p.eficiencia < UMBRAL_MINIMO || p.efectividad < UMBRAL_MINIMO
  ).length;
  const pendingActuarCount = phvaTasks.filter(
    (t) => t.fase === 'Actuar' && t.estado !== 'Completado'
  ).length > 0 ? 1 : 0;
  const alertCount = criticalProcessesCount + pendingActuarCount;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F7F4] text-slate-900'
      }`}
    >
      {/* Top Header */}
      <Header
        primaryColor={primaryColor}
        onColorChange={setPrimaryColor}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenPythonGuide={() => setIsPythonGuideOpen(true)}
        processes={processes}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
          primaryColor={primaryColor}
          onColorChange={setPrimaryColor}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          onOpenPythonGuide={() => setIsPythonGuideOpen(true)}
          alertCount={alertCount}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto pb-16">
            {currentPage === 'resumen' && (
              <ResumenView
                processes={processes}
                quizLast={quizResult}
                quizHistory={quizHistory}
                primaryColor={primaryColor}
                onNavigateToQuiz={() => setCurrentPage('quiz')}
              />
            )}

            {currentPage === 'sipoc' && (
              <SipocView
                processes={processes}
                onUpdateProcess={handleModifyProcess}
                primaryColor={primaryColor}
              />
            )}

            {currentPage === 'mapa' && (
              <MapaView processes={processes} primaryColor={primaryColor} />
            )}

            {currentPage === 'interacciones' && (
              <InteraccionesView
                processes={processes}
                matrix={matrix}
                onUpdateMatrix={setMatrix}
                primaryColor={primaryColor}
              />
            )}

            {currentPage === 'phva' && (
              <PhvaView
                tasks={phvaTasks}
                onUpdateTasks={setPhvaTasks}
                primaryColor={primaryColor}
              />
            )}

            {currentPage === 'triada' && (
              <TriadaView
                processes={processes}
                onUpdateProcess={handleModifyProcess}
                primaryColor={primaryColor}
              />
            )}

            {currentPage === 'alertas' && (
              <AlertasView
                processes={processes}
                phvaTasks={phvaTasks}
                quizLast={quizResult}
                primaryColor={primaryColor}
                onNavigateToQuiz={() => setCurrentPage('quiz')}
                onNavigateToPhva={() => setCurrentPage('phva')}
                onNavigateToSipoc={() => setCurrentPage('sipoc')}
              />
            )}

            {currentPage === 'gestor' && (
              <GestorView
                processes={processes}
                onAddProcess={handleAddProcess}
                onUpdateProcess={handleModifyProcess}
                onDeleteProcess={handleDeleteProcess}
                onResetProcesses={handleUpdateProcesses}
                primaryColor={primaryColor}
              />
            )}

            {currentPage === 'doc' && <DocView primaryColor={primaryColor} />}

            {currentPage === 'busqueda' && <BusquedaView primaryColor={primaryColor} />}

            {currentPage === 'quiz' && (
              <QuizView
                questions={questions}
                onSetQuestions={setQuestions}
                quizResult={quizResult}
                onSetQuizResult={setQuizResult}
                quizHistory={quizHistory}
                onAddHistory={(entry) => setQuizHistory((prev) => [...prev, entry])}
                primaryColor={primaryColor}
              />
            )}
          </div>
        </main>
      </div>

      {/* Python Execution Guide Modal */}
      <PythonRunnerModal
        isOpen={isPythonGuideOpen}
        onClose={() => setIsPythonGuideOpen(false)}
        primaryColor={primaryColor}
      />
    </div>
  );
}
