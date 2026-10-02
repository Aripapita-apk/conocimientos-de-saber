import React, { useState } from 'react';

interface Slice {
  label: string;
  count: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  slices: Slice[];
  totalLabel?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  title,
  slices,
  totalLabel = 'Total'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = slices.reduce((acc, curr) => acc + curr.count, 0);

  if (total === 0) {
    return <div className="p-8 text-center text-slate-500">Sin datos para graficar.</div>;
  }

  const cx = 100;
  const cy = 100;
  const outerR = 75;
  const innerR = 48;

  let cumulativeAngle = -90; // Start at top (12 o'clock)

  const paths = slices.map((slice, i) => {
    const fraction = slice.count / total;
    const angle = fraction * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + outerR * Math.cos(toRad(startAngle));
    const y1 = cy + outerR * Math.sin(toRad(startAngle));
    const x2 = cx + outerR * Math.cos(toRad(endAngle));
    const y2 = cy + outerR * Math.sin(toRad(endAngle));

    const ix1 = cx + innerR * Math.cos(toRad(endAngle));
    const iy1 = cy + innerR * Math.sin(toRad(endAngle));
    const ix2 = cx + innerR * Math.cos(toRad(startAngle));
    const iy2 = cy + innerR * Math.sin(toRad(startAngle));

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2}`,
      'Z'
    ].join(' ');

    return {
      slice,
      pathData,
      fraction,
      index: i
    };
  });

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full">
      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h4>
      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 my-auto">
        <div className="relative w-44 h-44 shrink-0">
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            {paths.map(({ slice, pathData, index }) => (
              <path
                key={slice.label}
                d={pathData}
                fill={slice.color}
                opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.45}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
            {/* Center label */}
            <circle cx={cx} cy={cy} r={innerR - 1} fill="transparent" />
            <text
              x={cx}
              y={cy - 2}
              textAnchor="middle"
              className="text-xl font-bold font-mono fill-slate-900 dark:fill-white"
            >
              {hoveredIndex !== null ? slices[hoveredIndex].count : total}
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              className="text-[10px] uppercase font-semibold fill-slate-500 dark:fill-slate-400"
            >
              {hoveredIndex !== null ? slices[hoveredIndex].label : totalLabel}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 w-full max-w-[200px]">
          {slices.map((slice, i) => {
            const pct = Math.round((slice.count / total) * 100);
            return (
              <div
                key={slice.label}
                className={`flex items-center justify-between text-xs cursor-pointer p-1 rounded transition-colors ${
                  hoveredIndex === i ? 'bg-slate-100 dark:bg-slate-800' : ''
                }`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                    {slice.label}
                  </span>
                </div>
                <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0 ml-2">
                  {slice.count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
