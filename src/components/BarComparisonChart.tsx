import React, { useState } from 'react';
import { Process } from '../types';

interface BarComparisonChartProps {
  processes: Process[];
  primaryColor?: string;
}

export const BarComparisonChart: React.FC<BarComparisonChartProps> = ({
  processes,
  primaryColor = '#39A900'
}) => {
  const [hoveredData, setHoveredData] = useState<{
    process: string;
    metric: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  if (processes.length === 0) {
    return <div className="p-8 text-center text-slate-500">No hay procesos para comparar.</div>;
  }

  const chartHeight = 260;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 60;
  const totalWidth = 600;

  const innerWidth = totalWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const groupWidth = innerWidth / processes.length;
  const barWidth = Math.min(22, (groupWidth - 16) / 3);

  const colors = {
    eficacia: primaryColor,
    eficiencia: '#3B82F6',
    efectividad: '#8B5CF6'
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Comparativo de la Tríada por Proceso
        </h4>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.eficacia }} />
            <span className="text-slate-600 dark:text-slate-300">Eficacia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.eficiencia }} />
            <span className="text-slate-600 dark:text-slate-300">Eficiencia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.efectividad }} />
            <span className="text-slate-600 dark:text-slate-300">Efectividad</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${totalWidth} ${chartHeight}`}
          className="w-full min-w-[500px] h-auto overflow-visible select-none"
        >
          {/* Horizontal grid lines: 0, 25, 50, 75, 100 */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = paddingTop + innerHeight - (val / 100) * innerHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={totalWidth - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  className="dark:stroke-slate-800"
                  strokeDasharray={val === 0 ? '' : '3 3'}
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Critical threshold line at 80% */}
          {(() => {
            const y80 = paddingTop + innerHeight - (80 / 100) * innerHeight;
            return (
              <g>
                <line
                  x1={paddingLeft}
                  y1={y80}
                  x2={totalWidth - paddingRight}
                  y2={y80}
                  stroke="#EF4444"
                  strokeDasharray="4 2"
                  strokeWidth="1"
                  strokeOpacity="0.7"
                />
                <text
                  x={totalWidth - paddingRight}
                  y={y80 - 4}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-red-500 font-semibold"
                >
                  Umbral Mínimo 80%
                </text>
              </g>
            );
          })()}

          {/* Bars grouped by process */}
          {processes.map((p, idx) => {
            const groupCenterX = paddingLeft + idx * groupWidth + groupWidth / 2;
            const metrics = [
              { key: 'eficacia', label: 'Eficacia', val: p.eficacia, color: colors.eficacia },
              { key: 'eficiencia', label: 'Eficiencia', val: p.eficiencia, color: colors.eficiencia },
              { key: 'efectividad', label: 'Efectividad', val: p.efectividad, color: colors.efectividad }
            ];

            const startX = groupCenterX - (metrics.length * barWidth) / 2;

            return (
              <g key={p.id}>
                {metrics.map((m, mIdx) => {
                  const bX = startX + mIdx * barWidth;
                  const bHeight = (Math.max(0, Math.min(100, m.val)) / 100) * innerHeight;
                  const bY = paddingTop + innerHeight - bHeight;

                  return (
                    <rect
                      key={m.key}
                      x={bX + 1}
                      y={bY}
                      width={barWidth - 2}
                      height={bHeight}
                      rx="3"
                      fill={m.color}
                      className="cursor-pointer transition-opacity hover:opacity-80"
                      onMouseEnter={() =>
                        setHoveredData({
                          process: p.nombre,
                          metric: m.label,
                          value: m.val,
                          x: bX + barWidth / 2,
                          y: bY
                        })
                      }
                      onMouseLeave={() => setHoveredData(null)}
                    />
                  );
                })}

                {/* X axis Process label */}
                <text
                  x={groupCenterX}
                  y={paddingTop + innerHeight + 18}
                  textAnchor="middle"
                  className="text-[10px] font-medium fill-slate-700 dark:fill-slate-300"
                >
                  {p.nombre.length > 18 ? `${p.nombre.slice(0, 16)}…` : p.nombre}
                </text>
                <text
                  x={groupCenterX}
                  y={paddingTop + innerHeight + 30}
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-slate-400 dark:fill-slate-500"
                >
                  {p.tipo}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {hoveredData && (
        <div
          className="absolute pointer-events-none bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg z-20 border border-slate-700 font-sans"
          style={{
            left: `${(hoveredData.x / totalWidth) * 100}%`,
            top: '40px',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="font-semibold">{hoveredData.process}</div>
          <div className="text-slate-300">
            {hoveredData.metric}: <span className="font-mono text-emerald-400 font-bold">{hoveredData.value}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
