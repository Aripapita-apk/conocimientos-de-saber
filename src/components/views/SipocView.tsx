import React, { useState } from 'react';
import { Process } from '../../types';
import { UserCheck, Layers, ArrowRight, Check } from 'lucide-react';

interface SipocViewProps {
  processes: Process[];
  onUpdateProcess: (updated: Process) => void;
  primaryColor: string;
}

export const SipocView: React.FC<SipocViewProps> = ({
  processes,
  onUpdateProcess,
  primaryColor
}) => {
  const [selectedId, setSelectedId] = useState<number>(processes[0]?.id || 1);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const selectedProcess = processes.find((p) => p.id === selectedId) || processes[0];

  const [editForm, setEditForm] = useState<Process | null>(null);

  const handleStartEdit = () => {
    if (selectedProcess) {
      setEditForm({ ...selectedProcess });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editForm) {
      onUpdateProcess(editForm);
      setIsEditing(false);
    }
  };

  if (!selectedProcess) {
    return <div className="p-8 text-center text-slate-500">No hay procesos disponibles.</div>;
  }

  const pData = isEditing && editForm ? editForm : selectedProcess;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Caracterización de Procesos (Modelo SIPOC)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Estructuración de Proveedores, Entradas, Actividades, Salidas y Clientes según ISO 9001
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                <Check className="w-3.5 h-3.5" /> Guardar Cambios
              </button>
            </>
          ) : (
            <button
              onClick={handleStartEdit}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Editar esta Ficha
            </button>
          )}
        </div>
      </div>

      {/* Process selector and info strip */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
            Seleccionar Proceso:
          </label>
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(Number(e.target.value));
              setIsEditing(false);
            }}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            {processes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id}. {p.nombre} ({p.tipo})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <UserCheck className="w-4 h-4 text-slate-400" />
            <span>Líder:</span>
            <strong className="text-slate-800 dark:text-slate-200">{pData.lider}</strong>
          </div>
          <div className="h-3 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Tipo:</span>
            <span
              className="px-2 py-0.5 rounded font-semibold text-[11px]"
              style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
            >
              {pData.tipo}
            </span>
          </div>
          <div className="h-3 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div className="text-slate-600 dark:text-slate-400 font-mono">
            Efectividad: <strong className="text-slate-900 dark:text-white">{pData.efectividad}%</strong>
          </div>
        </div>
      </div>

      {/* SIPOC 5 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Entradas */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col justify-between min-h-[220px]">
          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider pb-2 border-b-2 flex items-center gap-1.5 mb-3"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <span>📥</span>
              <span>1. Entradas (Inputs)</span>
            </div>
            {isEditing && editForm ? (
              <textarea
                value={editForm.entradas}
                onChange={(e) => setEditForm({ ...editForm, entradas: e.target.value })}
                rows={5}
                className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            ) : (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {pData.entradas || <span className="italic text-slate-400">Por definir</span>}
              </p>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            Insumos, datos, normas y requisitos
          </div>
        </div>

        {/* Actividades */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col justify-between min-h-[220px]">
          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider pb-2 border-b-2 flex items-center gap-1.5 mb-3"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <span>🔄</span>
              <span>2. Actividades (Process)</span>
            </div>
            {isEditing && editForm ? (
              <textarea
                value={editForm.actividades}
                onChange={(e) => setEditForm({ ...editForm, actividades: e.target.value })}
                rows={5}
                className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            ) : (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {pData.actividades || <span className="italic text-slate-400">Por definir</span>}
              </p>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            Flujo de transformación de valor
          </div>
        </div>

        {/* Salidas */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col justify-between min-h-[220px]">
          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider pb-2 border-b-2 flex items-center gap-1.5 mb-3"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <span>📤</span>
              <span>3. Salidas (Outputs)</span>
            </div>
            {isEditing && editForm ? (
              <textarea
                value={editForm.salidas}
                onChange={(e) => setEditForm({ ...editForm, salidas: e.target.value })}
                rows={5}
                className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            ) : (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {pData.salidas || <span className="italic text-slate-400">Por definir</span>}
              </p>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            Productos, servicios y resultados
          </div>
        </div>

        {/* Recursos */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col justify-between min-h-[220px]">
          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider pb-2 border-b-2 flex items-center gap-1.5 mb-3"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <span>🛠️</span>
              <span>4. Recursos</span>
            </div>
            {isEditing && editForm ? (
              <textarea
                value={editForm.recursos}
                onChange={(e) => setEditForm({ ...editForm, recursos: e.target.value })}
                rows={5}
                className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            ) : (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {pData.recursos || <span className="italic text-slate-400">Por definir</span>}
              </p>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            Talento humano, software, equipos
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col justify-between min-h-[220px]">
          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider pb-2 border-b-2 flex items-center gap-1.5 mb-3"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              <span>🛡️</span>
              <span>5. Controles</span>
            </div>
            {isEditing && editForm ? (
              <textarea
                value={editForm.controles}
                onChange={(e) => setEditForm({ ...editForm, controles: e.target.value })}
                rows={5}
                className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            ) : (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {pData.controles || <span className="italic text-slate-400">Por definir</span>}
              </p>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            Puntos de inspección, normas y comités
          </div>
        </div>
      </div>

      {/* Guide notes */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
        <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Regla de Calidad ISO 9001:</strong> Toda salida de un proceso debe convertirse en la entrada o beneficio de otro proceso (cliente interno) o del usuario final (aprendiz/sociedad).
        </span>
      </div>
    </div>
  );
};
