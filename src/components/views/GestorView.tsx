import React, { useState } from 'react';
import { Process, ProcessType } from '../../types';
import { Plus, Edit2, Trash2, Check, X, RotateCcw } from 'lucide-react';
import { DEFAULT_PROCESSES } from '../../data/defaultData';

interface GestorViewProps {
  processes: Process[];
  onAddProcess: (proc: Process) => void;
  onUpdateProcess: (proc: Process) => void;
  onDeleteProcess: (id: number) => void;
  onResetProcesses: (defaults: Process[]) => void;
  primaryColor: string;
}

export const GestorView: React.FC<GestorViewProps> = ({
  processes,
  onAddProcess,
  onUpdateProcess,
  onDeleteProcess,
  onResetProcesses,
  primaryColor
}) => {
  // New process form state
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<ProcessType>('Misional');
  const [lider, setLider] = useState('');
  const [eficacia, setEficacia] = useState(85);
  const [eficiencia, setEficiencia] = useState(80);
  const [entradas, setEntradas] = useState('');
  const [actividades, setActividades] = useState('');
  const [salidas, setSalidas] = useState('');
  const [recursos, setRecursos] = useState('');
  const [controles, setControles] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit modal / inline state
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanNombre = nombre.trim();
    if (!cleanNombre) {
      setErrorMsg('Por favor ingresa al menos el nombre del proceso.');
      return;
    }

    if (processes.some((p) => p.nombre.toLowerCase() === cleanNombre.toLowerCase())) {
      setErrorMsg('Ya existe un proceso con ese nombre. Usa un nombre distinto.');
      return;
    }

    const nextId = processes.length > 0 ? Math.max(...processes.map((p) => p.id)) + 1 : 1;
    const efectividad = Number(((eficacia + eficiencia) / 2).toFixed(1));

    const newProc: Process = {
      id: nextId,
      nombre: cleanNombre,
      tipo,
      lider: lider.trim() || 'Coordinación de Calidad',
      entradas: entradas.trim() || 'Por definir',
      actividades: actividades.trim() || 'Por definir',
      salidas: salidas.trim() || 'Por definir',
      recursos: recursos.trim() || 'Por definir',
      controles: controles.trim() || 'Por definir',
      eficacia,
      eficiencia,
      efectividad
    };

    onAddProcess(newProc);
    setSuccessMsg(`Proceso "${cleanNombre}" agregado exitosamente al Dashboard.`);

    // Clear form
    setNombre('');
    setLider('');
    setEntradas('');
    setActividades('');
    setSalidas('');
    setRecursos('');
    setControles('');
    setEficacia(85);
    setEficiencia(80);
  };

  const handleSaveEdit = () => {
    if (editingProcess) {
      const recalculated = {
        ...editingProcess,
        efectividad: Number(
          ((editingProcess.eficacia + editingProcess.eficiencia) / 2).toFixed(1)
        )
      };
      onUpdateProcess(recalculated);
      setEditingProcess(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Gestor de Datos: Añadir y Editar Procesos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Administración dinámica del catálogo institucional de procesos y métricas asociadas
          </p>
        </div>

        <button
          onClick={() => onResetProcesses(DEFAULT_PROCESSES)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
          title="Restaurar los 5 procesos predeterminados del Anexo 1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restaurar Predeterminados
        </button>
      </div>

      {/* Add new process Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Agregar Nuevo Proceso a la Plantilla</span>
        </h3>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Nombre del Proceso: *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Gestión de Bienestar al Aprendiz"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Tipo de Proceso:
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as ProcessType)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Estratégico">Estratégico</option>
                <option value="Misional">Misional</option>
                <option value="De Apoyo">De Apoyo</option>
                <option value="De Evaluación">De Evaluación</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Líder / Responsable:
              </label>
              <input
                type="text"
                value={lider}
                onChange={(e) => setLider(e.target.value)}
                placeholder="Ej. Coordinación Misional"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Triad initial values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Eficacia Inicial:</span>
                <span className="font-mono text-emerald-600">{eficacia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={eficacia}
                onChange={(e) => setEficacia(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Eficiencia Inicial:</span>
                <span className="font-mono text-blue-600">{eficiencia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={eficiencia}
                onChange={(e) => setEficiencia(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex flex-col justify-center text-center">
              <span className="text-[11px] text-slate-500">Efectividad calculada:</span>
              <span className="text-base font-bold font-mono text-purple-600">
                {((eficacia + eficiencia) / 2).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* SIPOC Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Entradas (Inputs):
              </label>
              <textarea
                rows={2}
                value={entradas}
                onChange={(e) => setEntradas(e.target.value)}
                placeholder="Insumos, planes o solicitudes requeridas..."
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Actividades Clave:
              </label>
              <textarea
                rows={2}
                value={actividades}
                onChange={(e) => setActividades(e.target.value)}
                placeholder="Etapas de transformación y ejecución..."
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Salidas (Outputs):
              </label>
              <textarea
                rows={2}
                value={salidas}
                onChange={(e) => setSalidas(e.target.value)}
                placeholder="Productos o servicios entregados..."
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              <Plus className="w-4 h-4" /> Guardar Proceso en el Dashboard
            </button>
          </div>
        </form>
      </div>

      {/* Existing processes list & management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Catálogo Actual de Procesos ({processes.length})
          </h3>
          <span className="text-xs text-slate-400">Edición rápida y eliminación</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Líder</th>
                <th className="px-4 py-3 text-right font-mono">Eficacia</th>
                <th className="px-4 py-3 text-right font-mono">Eficiencia</th>
                <th className="px-4 py-3 text-right font-mono">Efectividad</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {processes.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono text-slate-400">#{p.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                    {p.nombre}
                  </td>
                  <td className="px-4 py-3">{p.tipo}</td>
                  <td className="px-4 py-3 text-slate-500">{p.lider}</td>
                  <td className="px-4 py-3 text-right font-mono">{p.eficacia}%</td>
                  <td className="px-4 py-3 text-right font-mono">{p.eficiencia}%</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                    {p.efectividad}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setEditingProcess({ ...p })}
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Editar proceso"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProcess(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Eliminar proceso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editingProcess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Editar Proceso #{editingProcess.id}
              </h4>
              <button
                onClick={() => setEditingProcess(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nombre:</label>
                <input
                  type="text"
                  value={editingProcess.nombre}
                  onChange={(e) =>
                    setEditingProcess({ ...editingProcess, nombre: e.target.value })
                  }
                  className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Tipo:</label>
                  <select
                    value={editingProcess.tipo}
                    onChange={(e) =>
                      setEditingProcess({
                        ...editingProcess,
                        tipo: e.target.value as ProcessType
                      })
                    }
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Estratégico">Estratégico</option>
                    <option value="Misional">Misional</option>
                    <option value="De Apoyo">De Apoyo</option>
                    <option value="De Evaluación">De Evaluación</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Líder:</label>
                  <input
                    type="text"
                    value={editingProcess.lider}
                    onChange={(e) =>
                      setEditingProcess({ ...editingProcess, lider: e.target.value })
                    }
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="font-semibold block mb-1">
                    Eficacia (%): {editingProcess.eficacia}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingProcess.eficacia}
                    onChange={(e) =>
                      setEditingProcess({
                        ...editingProcess,
                        eficacia: Number(e.target.value)
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">
                    Eficiencia (%): {editingProcess.eficiencia}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingProcess.eficiencia}
                    onChange={(e) =>
                      setEditingProcess({
                        ...editingProcess,
                        eficiencia: Number(e.target.value)
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setEditingProcess(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                <Check className="w-3.5 h-3.5" /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
