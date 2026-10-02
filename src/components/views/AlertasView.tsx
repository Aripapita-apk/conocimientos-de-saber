import React from 'react';
import { Process, PHVATask, QuizResult } from '../../types';
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, ArrowRight, BookOpen } from 'lucide-react';

interface AlertasViewProps {
  processes: Process[];
  phvaTasks: PHVATask[];
  quizLast: QuizResult | null;
  primaryColor: string;
  onNavigateToQuiz: () => void;
  onNavigateToPhva: () => void;
  onNavigateToSipoc: () => void;
}

export const AlertasView: React.FC<AlertasViewProps> = ({
  processes,
  phvaTasks,
  quizLast,
  primaryColor,
  onNavigateToQuiz,
  onNavigateToPhva,
  onNavigateToSipoc
}) => {
  const UMBRAL_MINIMO = 80;

  // 1. Critical metrics
  const criticalProcesses = processes.filter(
    (p) => p.eficacia < UMBRAL_MINIMO || p.eficiencia < UMBRAL_MINIMO || p.efectividad < UMBRAL_MINIMO
  );

  // 2. Pending Actuar tasks
  const pendingActuar = phvaTasks.filter(
    (t) => t.fase === 'Actuar' && t.estado !== 'Completado'
  );

  // 3. Incomplete SIPOC
  const camposSIPOC = ['entradas', 'actividades', 'salidas', 'recursos', 'controles'] as const;
  const incompleteSipoc = processes.filter((p) =>
    camposSIPOC.some((c) => !p[c]?.trim() || p[c].toLowerCase() === 'por definir')
  );

  // 4. Weak quiz modules
  const weakModules = quizLast
    ? Object.entries(quizLast.por_modulo).filter(([, v]) => v.pct < quizLast.umbral)
    : [];

  const totalAlerts =
    criticalProcesses.length +
    (pendingActuar.length > 0 ? 1 : 0) +
    incompleteSipoc.length +
    weakModules.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Diagnóstico Operacional & Alertas de Error Frecuente
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Auditoría en tiempo real de fallos metodológicos, cuellos de botella y brechas de conocimiento
        </p>
      </div>

      {/* Summary status banner */}
      <div
        className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
          totalAlerts > 0
            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
            : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              totalAlerts > 0 ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {totalAlerts > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          </div>
          <div>
            <div
              className={`font-bold text-sm ${
                totalAlerts > 0 ? 'text-amber-950 dark:text-amber-200' : 'text-emerald-950 dark:text-emerald-200'
              }`}
            >
              {totalAlerts > 0
                ? `Se detectaron ${totalAlerts} puntos de atención metodológica`
                : '¡Excelente! Sistema sin alertas críticas activas'}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {totalAlerts > 0
                ? 'Revisa a continuación los hallazgos y aplica los planes de mejoramiento.'
                : 'Todos los indicadores superan el 80% y las acciones de mejora están cerradas.'}
            </p>
          </div>
        </div>
      </div>

      {/* Alert 1: Low indicators (< 80%) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          1. Desempeño Operacional por debajo del Umbral Mínimo (80%)
        </h3>

        {criticalProcesses.length === 0 ? (
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Todos los procesos se encuentran dentro del rango aceptable u óptimo (≥ 80%).</span>
          </div>
        ) : (
          <div className="space-y-2">
            {criticalProcesses.map((p) => {
              const bajos: string[] = [];
              if (p.eficacia < UMBRAL_MINIMO) bajos.push(`Eficacia: ${p.eficacia}%`);
              if (p.eficiencia < UMBRAL_MINIMO) bajos.push(`Eficiencia: ${p.eficiencia}%`);
              if (p.efectividad < UMBRAL_MINIMO) bajos.push(`Efectividad: ${p.efectividad}%`);

              return (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {p.nombre} ({p.tipo})
                      </div>
                      <div className="text-red-700 dark:text-red-300 font-mono text-[11px] mt-0.5">
                        Valores críticos: {bajos.join(' · ')}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-1">
                        Líder responsable: <strong>{p.lider}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px] italic sm:text-right">
                    Acción recomendada: Formular plan de contingencia y revisión de recursos asignados.
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alert 2: PHVA Actuar Phase */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          2. Estado del Cierre del Ciclo PHVA (Fase Actuar)
        </h3>

        {pendingActuar.length === 0 ? (
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Fase Actuar al día: no hay acciones correctivas o de estandarización pendientes.</span>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Hay {pendingActuar.length} acción(es) de mejora sin completar en la fase &quot;Actuar&quot;
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                  Tareas abiertas: {pendingActuar.map((t) => t.tarea).join('; ')}
                </div>
              </div>
            </div>
            <button
              onClick={onNavigateToPhva}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
            >
              Ir al Ciclo PHVA
            </button>
          </div>
        )}
      </div>

      {/* Alert 3: Incomplete SIPOC */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          3. Integridad de Fichas SIPOC
        </h3>

        {incompleteSipoc.length === 0 ? (
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>El 100% de los procesos tiene sus 5 campos de ficha caracterizados completamente.</span>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                {incompleteSipoc.length} proceso(s) tienen campos &quot;Por definir&quot; en su ficha SIPOC
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Procesos: {incompleteSipoc.map((p) => p.nombre).join(', ')}
              </div>
            </div>
            <button
              onClick={onNavigateToSipoc}
              className="px-3 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
            >
              Completar Fichas
            </button>
          </div>
        )}
      </div>

      {/* Alert 4: Quiz knowledge gaps */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          4. Diagnóstico de Conocimiento (Cuestionario Evaluativo Anexo 1)
        </h3>

        {!quizLast ? (
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Aún no has resuelto el cuestionario evaluativo para diagnosticar vacíos conceptuales.</span>
            </div>
            <button
              onClick={onNavigateToQuiz}
              className="px-3 py-1.5 text-white rounded-lg font-semibold text-xs whitespace-nowrap"
              style={{ backgroundColor: primaryColor }}
            >
              Resolver Cuestionario
            </button>
          </div>
        ) : weakModules.length === 0 ? (
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>
              ¡Excelente nivel teórico! Todos los módulos superaron el umbral de aprobación ({quizLast.umbral}%).
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Módulos por reforzar en la fundamentación conceptual:
              </div>
              <div className="text-amber-800 dark:text-amber-300 font-mono text-[11px] mt-0.5">
                {weakModules.map(([mod, data]) => `${mod} (${data.pct}%)`).join(' · ')}
              </div>
            </div>
            <button
              onClick={onNavigateToQuiz}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
            >
              Repasar Cuestionario
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
