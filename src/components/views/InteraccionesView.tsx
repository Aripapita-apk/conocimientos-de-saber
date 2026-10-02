import React from 'react';
import { Process } from '../../types';
import { Network, AlertCircle, Info, RefreshCw } from 'lucide-react';

interface InteraccionesViewProps {
  processes: Process[];
  matrix: number[][];
  onUpdateMatrix: (newMatrix: number[][]) => void;
  primaryColor: string;
}

export const InteraccionesView: React.FC<InteraccionesViewProps> = ({
  processes,
  matrix,
  onUpdateMatrix,
  primaryColor
}) => {
  const n = processes.length;

  // Toggle cell interaction 0 <-> 1
  const handleToggleCell = (row: number, col: number) => {
    const updated = matrix.map((r, rIdx) =>
      rIdx === row
        ? r.map((c, cIdx) => (cIdx === col ? (c === 1 ? 0 : 1) : c))
        : [...r]
    );
    onUpdateMatrix(updated);
  };

  // Reset to default sample
  const handleResetMatrix = () => {
    const fresh = Array.from({ length: n }, () => Array(n).fill(0));
    // Provide standard interactions
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && (i === 0 || j === n - 1 || (i === 3 && j === 2))) {
          fresh[i][j] = 1;
        }
      }
    }
    onUpdateMatrix(fresh);
  };

  // Metrics
  let totalInteractions = 0;
  const outDegree: number[] = Array(n).fill(0);
  const inDegree: number[] = Array(n).fill(0);

  for (let i = 0; i < Math.min(n, matrix.length); i++) {
    for (let j = 0; j < Math.min(n, matrix[i]?.length || 0); j++) {
      if (matrix[i][j] === 1) {
        totalInteractions++;
        outDegree[i]++;
        inDegree[j]++;
      }
    }
  }

  const maxPossible = n * (n - 1);
  const density = maxPossible > 0 ? (totalInteractions / maxPossible) * 100 : 0;

  // Detect silos: processes that have 0 incoming or 0 outgoing interactions
  const isolated = processes.filter((_, idx) => outDegree[idx] === 0 && inDegree[idx] === 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Interacciones entre Procesos & Evitación de Silos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Matriz de transferencia de información, insumos y valor agregado entre áreas
          </p>
        </div>

        <button
          onClick={handleResetMatrix}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reconfigurar Matriz
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-semibold uppercase">Intercambios Activos</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {totalInteractions} enlaces
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Conexiones directas registradas</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-semibold uppercase">Densidad de Red</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {density.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Fluidez de la cadena de valor</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 font-semibold uppercase">Silos Detectados</div>
          <div
            className="text-2xl font-bold font-mono mt-1"
            style={{ color: isolated.length > 0 ? '#EF4444' : '#22C55E' }}
          >
            {isolated.length} áreas
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isolated.length > 0 ? 'Riesgo de trabajo aislado' : 'Todos los procesos conectados'}
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-600" />
            <span>Matriz de Conexión (Haz clic en una celda para alternar el flujo 1 / 0)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Fila: Entrega insumo/información → Columna: Recibe
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <table className="min-w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-left font-semibold text-slate-700 dark:text-slate-300 w-48">
                  Entrega \ Recibe
                </th>
                {processes.map((colP, cIdx) => (
                  <th
                    key={colP.id}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center font-medium text-slate-700 dark:text-slate-300 min-w-[90px]"
                    title={colP.nombre}
                  >
                    <div className="font-mono text-[10px] text-slate-400">#{cIdx + 1}</div>
                    <div className="truncate max-w-[90px]">{colP.nombre}</div>
                  </th>
                ))}
                <th className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-center font-semibold text-slate-700 dark:text-slate-300">
                  Total Entrega
                </th>
              </tr>
            </thead>
            <tbody>
              {processes.map((rowP, rIdx) => (
                <tr key={rowP.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="p-2 border border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-white">
                    <span className="font-mono text-slate-400 mr-1.5">#{rIdx + 1}</span>
                    {rowP.nombre}
                  </td>
                  {processes.map((colP, cIdx) => {
                    const isSelf = rIdx === cIdx;
                    const isConnected = matrix[rIdx]?.[cIdx] === 1;

                    return (
                      <td
                        key={colP.id}
                        onClick={() => !isSelf && handleToggleCell(rIdx, cIdx)}
                        className={`p-2 border border-slate-200 dark:border-slate-800 text-center font-mono font-bold transition-all ${
                          isSelf
                            ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                            : isConnected
                            ? 'cursor-pointer text-white shadow-inner'
                            : 'cursor-pointer text-slate-300 dark:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        style={{
                          backgroundColor: isConnected && !isSelf ? primaryColor : undefined
                        }}
                        title={
                          isSelf
                            ? 'Mismo proceso'
                            : `${rowP.nombre} entrega a ${colP.nombre}: ${isConnected ? 'Sí (1)' : 'No (0)'}`
                        }
                      >
                        {isSelf ? '—' : isConnected ? '1' : '0'}
                      </td>
                    );
                  })}
                  <td className="p-2 border border-slate-200 dark:border-slate-800 text-center font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-800/20">
                    {outDegree[rIdx] || 0}
                  </td>
                </tr>
              ))}
              {/* Summary row: total incoming */}
              <tr className="bg-slate-100 dark:bg-slate-800/80 font-semibold">
                <td className="p-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  Total Recibe
                </td>
                {processes.map((_, cIdx) => (
                  <td
                    key={cIdx}
                    className="p-2 border border-slate-200 dark:border-slate-800 text-center font-mono font-bold text-slate-800 dark:text-slate-200"
                  >
                    {inDegree[cIdx] || 0}
                  </td>
                ))}
                <td className="p-2 border border-slate-200 dark:border-slate-800 text-center font-mono font-extrabold text-emerald-600">
                  {totalInteractions}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Advisory explanation */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex gap-3 text-xs text-slate-600 dark:text-slate-400">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-800 dark:text-slate-200">
            ¿Por qué es fundamental auditar las interacciones?
          </div>
          <p className="leading-relaxed">
            Según el Anexo 1 del SENA, los mayores retrasos y pérdidas de calidad no ocurren al interior de una oficina, sino en los puntos de contacto y traspaso entre procesos. Una matriz equilibrada garantiza que no existan cuellos de botella ni procesos insulares.
          </p>
        </div>
      </div>
    </div>
  );
};
