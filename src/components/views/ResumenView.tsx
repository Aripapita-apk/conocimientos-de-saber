import React from 'react';
import { Process, QuizResult, QuizHistoryEntry } from '../../types';
import { MetricCard } from '../MetricCard';
import { BarComparisonChart } from '../BarComparisonChart';
import { DonutChart } from '../DonutChart';
import { Layers, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResumenViewProps {
  processes: Process[];
  quizLast: QuizResult | null;
  quizHistory: QuizHistoryEntry[];
  primaryColor: string;
  onNavigateToQuiz: () => void;
}

export const ResumenView: React.FC<ResumenViewProps> = ({
  processes,
  quizLast,
  quizHistory,
  primaryColor,
  onNavigateToQuiz
}) => {
  const total = processes.length;
  const avgEfectividad = total > 0 ? processes.reduce((s, p) => s + p.efectividad, 0) / total : 0;
  const avgEficacia = total > 0 ? processes.reduce((s, p) => s + p.eficacia, 0) / total : 0;
  const avgEficiencia = total > 0 ? processes.reduce((s, p) => s + p.eficiencia, 0) / total : 0;

  // Count complete SIPOC fichas
  const camposSIPOC = ['entradas', 'actividades', 'salidas', 'recursos', 'controles'] as const;
  const completas = processes.filter((p) =>
    camposSIPOC.every((c) => p[c]?.trim() && p[c].toLowerCase() !== 'por definir')
  ).length;

  const getStatus = (val: number) => {
    if (val >= 89) return { text: '🟢 Óptimo (≥89%)', color: '#22C55E' };
    if (val >= 80) return { text: '🟡 Aceptable (80-88%)', color: '#EAB308' };
    return { text: '🔴 Crítico (<80%)', color: '#EF4444' };
  };

  const statusEfect = getStatus(avgEfectividad);
  const statusEfic = getStatus(avgEficacia);
  const statusEficien = getStatus(avgEficiencia);

  // Group processes by type for donut
  const typeCounts: Record<string, number> = {};
  processes.forEach((p) => {
    typeCounts[p.tipo] = (typeCounts[p.tipo] || 0) + 1;
  });

  const typeSlices = [
    { label: 'Estratégico', count: typeCounts['Estratégico'] || 0, color: primaryColor },
    { label: 'Misional', count: typeCounts['Misional'] || 0, color: '#0284C7' },
    { label: 'De Apoyo', count: typeCounts['De Apoyo'] || 0, color: '#64748B' },
    { label: 'De Evaluación', count: typeCounts['De Evaluación'] || 0, color: '#0D9488' }
  ];

  return (
    <div className="space-y-6">
      {/* Title & subtitle */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Visión General de Desempeño & Dashboard Global
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Consolidación de métricas de calidad, fichas SIPOC y alineación estratégica institucional
        </p>
      </div>

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Procesos Mapeados"
          value={total}
          subtitle={`${completas} de ${total} con ficha SIPOC completa`}
          subtitleColor={completas === total ? '#22C55E' : '#EAB308'}
          primaryColor={primaryColor}
          icon={<Layers className="w-5 h-5" />}
        />

        <MetricCard
          title="Efectividad Global"
          value={`${avgEfectividad.toFixed(1)}%`}
          subtitle={statusEfect.text}
          subtitleColor={statusEfect.color}
          primaryColor={primaryColor}
        />

        <MetricCard
          title="Eficacia (Metas)"
          value={`${avgEficacia.toFixed(1)}%`}
          subtitle={statusEfic.text}
          subtitleColor={statusEfic.color}
          primaryColor={primaryColor}
        />

        <MetricCard
          title="Eficiencia (Recursos)"
          value={`${avgEficiencia.toFixed(1)}%`}
          subtitle={statusEficien.text}
          subtitleColor={statusEficien.color}
          primaryColor={primaryColor}
        />

        <div
          onClick={onNavigateToQuiz}
          className="cursor-pointer transition-transform hover:scale-[1.01]"
        >
          <MetricCard
            title="Cuestionario"
            value={quizLast ? `${quizLast.pct.toFixed(0)}%` : '—'}
            subtitle={
              quizLast
                ? `${quizLast.correctas}/${quizLast.total} aciertos · ${quizLast.aprobado ? 'Aprobado' : 'A reforzar'}`
                : 'Aún sin resolver (clic para ir)'
            }
            subtitleColor={
              quizLast ? (quizLast.aprobado ? '#22C55E' : '#EAB308') : '#64748B'
            }
            primaryColor={primaryColor}
            icon={quizLast?.aprobado ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-slate-400" />}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BarComparisonChart processes={processes} primaryColor={primaryColor} />
        </div>
        <div className="lg:col-span-5">
          <DonutChart
            title="Proporción del Mapa de Procesos"
            slices={typeSlices}
            totalLabel="Procesos"
          />
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Resumen de Procesos y Desempeño Operacional
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            {processes.length} registros
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nombre del Proceso</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Líder / Responsable</th>
                <th className="px-4 py-3 text-right font-mono">Eficacia</th>
                <th className="px-4 py-3 text-right font-mono">Eficiencia</th>
                <th className="px-4 py-3 text-right font-mono">Efectividad</th>
                <th className="px-4 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {processes.map((p) => {
                const isCrit = p.efectividad < 80;
                const isOpt = p.efectividad >= 89;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono text-slate-400">{p.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {p.nombre}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        {p.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{p.lider}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{p.eficacia}%</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{p.eficiencia}%</td>
                    <td
                      className="px-4 py-3 text-right font-mono tabular-nums font-bold"
                      style={{
                        color: isOpt ? '#22C55E' : isCrit ? '#EF4444' : '#EAB308'
                      }}
                    >
                      {p.efectividad}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          backgroundColor: isOpt
                            ? '#22C55E18'
                            : isCrit
                            ? '#EF444418'
                            : '#EAB30818',
                          color: isOpt ? '#22C55E' : isCrit ? '#EF4444' : '#EAB308'
                        }}
                      >
                        {isOpt ? 'Óptimo' : isCrit ? 'Crítico' : 'Aceptable'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
