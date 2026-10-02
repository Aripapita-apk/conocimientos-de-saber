import React, { useState } from 'react';
import { PHVATask, PHVAFase, PHVAEstado } from '../../types';
import { DonutChart } from '../DonutChart';
import { Plus, Check, Clock, AlertCircle, Trash2 } from 'lucide-react';

interface PhvaViewProps {
  tasks: PHVATask[];
  onUpdateTasks: (newTasks: PHVATask[]) => void;
  primaryColor: string;
}

export const PhvaView: React.FC<PhvaViewProps> = ({
  tasks,
  onUpdateTasks,
  primaryColor
}) => {
  const [newFase, setNewFase] = useState<PHVAFase>('Planear');
  const [newTarea, setNewTarea] = useState('');
  const [newEstado, setNewEstado] = useState<PHVAEstado>('Pendiente');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarea.trim()) return;

    const newTask: PHVATask = {
      id: Date.now().toString(),
      fase: newFase,
      tarea: newTarea.trim(),
      estado: newEstado
    };

    onUpdateTasks([...tasks, newTask]);
    setNewTarea('');
  };

  const handleToggleStatus = (id: string) => {
    const cycle: Record<PHVAEstado, PHVAEstado> = {
      Pendiente: 'En Proceso',
      'En Proceso': 'Completado',
      Completado: 'Pendiente'
    };

    const updated = tasks.map((t) => (t.id === id ? { ...t, estado: cycle[t.estado] } : t));
    onUpdateTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== id));
  };

  // Group counts by phase
  const counts: Record<PHVAFase, number> = {
    Planear: 0,
    Hacer: 0,
    Verificar: 0,
    Actuar: 0
  };
  tasks.forEach((t) => {
    counts[t.fase] = (counts[t.fase] || 0) + 1;
  });

  const slices = [
    { label: 'Planear', count: counts.Planear, color: '#3B82F6' },
    { label: 'Hacer', count: counts.Hacer, color: primaryColor },
    { label: 'Verificar', count: counts.Verificar, color: '#EAB308' },
    { label: 'Actuar', count: counts.Actuar, color: '#EF4444' }
  ];

  const fasesInfo = [
    {
      fase: 'Planear' as PHVAFase,
      desc: 'Definir objetivos de calidad, matrices de riesgos y asignación de recursos.',
      color: '#3B82F6'
    },
    {
      fase: 'Hacer' as PHVAFase,
      desc: 'Ejecutar procesos formativos, inducciones y actualización de fichas SIPOC.',
      color: primaryColor
    },
    {
      fase: 'Verificar' as PHVAFase,
      desc: 'Realizar auditorías internas, medir indicadores y evaluar conformidad.',
      color: '#EAB308'
    },
    {
      fase: 'Actuar' as PHVAFase,
      desc: 'Cerrar acciones correctivas, estandarizar buenas prácticas y reajustar metas.',
      color: '#EF4444'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Ciclo PHVA (Planear - Hacer - Verificar - Actuar)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Espiral de mejora continua y control de iniciativas operacionales y de calidad
        </p>
      </div>

      {/* Top row: Donut chart & Add Task form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <DonutChart
            title="Distribución de Iniciativas en el Ciclo PHVA"
            slices={slices}
            totalLabel="Tareas"
          />
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            ➕ Registrar Nueva Acción o Tarea PHVA
          </h4>
          <form onSubmit={handleAddTask} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Fase del Ciclo:
                </label>
                <select
                  value={newFase}
                  onChange={(e) => setNewFase(e.target.value as PHVAFase)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                >
                  <option value="Planear">Planear (Objetivos y Riesgos)</option>
                  <option value="Hacer">Hacer (Ejecución)</option>
                  <option value="Verificar">Verificar (Medición y Auditoría)</option>
                  <option value="Actuar">Actuar (Cierre y Estandarización)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Estado Inicial:
                </label>
                <select
                  value={newEstado}
                  onChange={(e) => setNewEstado(e.target.value as PHVAEstado)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Descripción de la Tarea / Iniciativa:
              </label>
              <input
                type="text"
                value={newTarea}
                onChange={(e) => setNewTarea(e.target.value)}
                placeholder="Ej. Revisión anual del procedimiento de compras..."
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                <Plus className="w-4 h-4" /> Agregar al Tablero
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 4 PHVA Columns / Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {fasesInfo.map((info) => {
          const faseTasks = tasks.filter((t) => t.fase === info.fase);
          return (
            <div
              key={info.fase}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between"
              style={{ borderTopWidth: '4px', borderTopColor: info.color }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                    <span>{info.fase}</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    {faseTasks.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-4">{info.desc}</p>

                <div className="space-y-2">
                  {faseTasks.length === 0 ? (
                    <div className="p-3 text-[11px] text-center italic text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      Sin tareas registradas
                    </div>
                  ) : (
                    faseTasks.map((t) => {
                      const isDone = t.estado === 'Completado';
                      const inProgress = t.estado === 'En Proceso';

                      return (
                        <div
                          key={t.id}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex flex-col justify-between gap-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                        >
                          <div className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                            {t.tarea}
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60">
                            <button
                              onClick={() => handleToggleStatus(t.id)}
                              className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                isDone
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : inProgress
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                              title="Haz clic para cambiar el estado"
                            >
                              {isDone ? (
                                <Check className="w-3 h-3" />
                              ) : inProgress ? (
                                <Clock className="w-3 h-3" />
                              ) : (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              <span>{t.estado}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteTask(t.id)}
                              className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                              title="Eliminar tarea"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
