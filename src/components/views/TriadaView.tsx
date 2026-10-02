import React, { useState } from 'react';
import { Process } from '../../types';
import { GaugeChart } from '../GaugeChart';
import { Info, Sliders } from 'lucide-react';

interface TriadaViewProps {
  processes: Process[];
  onUpdateProcess: (updated: Process) => void;
  primaryColor: string;
}

export const TriadaView: React.FC<TriadaViewProps> = ({
  processes,
  onUpdateProcess,
  primaryColor
}) => {
  const [selectedId, setSelectedId] = useState<number>(processes[0]?.id || 1);
  const selectedProcess = processes.find((p) => p.id === selectedId) || processes[0];

  const handleSliderChange = (key: 'eficacia' | 'eficiencia', val: number) => {
    if (!selectedProcess) return;
    const updated = { ...selectedProcess, [key]: val };
    // Automatically recalculate efectividad
    updated.efectividad = Number(((updated.eficacia + updated.eficiencia) / 2).toFixed(1));
    onUpdateProcess(updated);
  };

  if (!selectedProcess) {
    return <div className="p-8 text-center text-slate-500">No hay procesos registrados.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Tríada de Medición de Desempeño (Eficacia, Eficiencia y Efectividad)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Modelo analítico de evaluación de resultados, consumo de recursos e impacto integral
        </p>
      </div>

      {/* Conceptual cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            🎯 1. Eficacia (Cumplimiento de Metas)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Grado en que se realizan las actividades planificadas y se alcanzan las metas previstas. Mide el <strong>qué</strong> sin considerar el gasto.
          </p>
          <div className="text-[10px] font-mono text-slate-400 mt-2">
            Fórmula: (Resultados Logrados / Metas Planificadas) × 100
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            ⏱️ 2. Eficiencia (Uso de Recursos)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Relación entre el resultado alcanzado y los recursos utilizados (presupuesto, horas instructor, insumos). Mide el <strong>cómo</strong>.
          </p>
          <div className="text-[10px] font-mono text-slate-400 mt-2">
            Fórmula: (Recursos Programados / Recursos Reales Consumidos) × 100
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
            🌟 3. Efectividad (Impacto Integral)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Ponderación del impacto que conjuga cumplir con el objetivo con el aprovechamiento racional y óptimo de los recursos.
          </p>
          <div className="text-[10px] font-mono text-slate-400 mt-2">
            Fórmula: Síntesis ponderada (Eficacia + Eficiencia) / 2
          </div>
        </div>
      </div>

      {/* Process Selection bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Proceso a Evaluar:
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-hidden"
          >
            {processes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.tipo})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Líder responsable: <strong className="text-slate-800 dark:text-slate-200">{selectedProcess.lider}</strong>
        </div>
      </div>

      {/* 3 Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GaugeChart
          title="Eficacia (% Metas)"
          value={selectedProcess.eficacia}
          primaryColor={primaryColor}
        />
        <GaugeChart
          title="Eficiencia (% Recursos)"
          value={selectedProcess.eficiencia}
          primaryColor="#3B82F6"
        />
        <GaugeChart
          title="Efectividad (% Global)"
          value={selectedProcess.efectividad}
          primaryColor="#8B5CF6"
        />
      </div>

      {/* Interactive Sliders for Sensitivity Simulation */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>Simulador de Sensibilidad para: &quot;{selectedProcess.nombre}&quot;</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Ajustar Eficacia:</span>
              <span className="font-mono text-emerald-600 font-bold">{selectedProcess.eficacia}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedProcess.eficacia}
              onChange={(e) => handleSliderChange('eficacia', Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Incumplido)</span>
              <span>100% (Meta total)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Ajustar Eficiencia:</span>
              <span className="font-mono text-blue-600 font-bold">{selectedProcess.eficiencia}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedProcess.eficiencia}
              onChange={(e) => handleSliderChange('eficiencia', Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Despilfarro)</span>
              <span>100% (Óptimo uso)</span>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Al mover los controles deslizantes, la <strong>Efectividad</strong> se recalcula en tiempo real automáticamente ({selectedProcess.efectividad}%).
          </span>
        </div>
      </div>
    </div>
  );
};
