import React from 'react';

interface GaugeChartProps {
  title: string;
  value: number; // 0 to 100
  primaryColor?: string;
  height?: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  title,
  value,
  primaryColor = '#39A900',
  height = 220
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  // Determine status and color
  let statusText = 'Crítico (< 80%)';
  let statusColor = '#EF4444';
  if (clampedValue >= 89) {
    statusText = 'Óptimo (≥ 89%)';
    statusColor = '#22C55E';
  } else if (clampedValue >= 80) {
    statusText = 'Aceptable (80 - 88%)';
    statusColor = '#EAB308';
  }

  // Semicircle dimensions:
  // Angle: -180 deg to 0 deg
  const cx = 150;
  const cy = 135;
  const radius = 95;
  const strokeWidth = 18;

  // Arc calculation helper
  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  // Convert 0..100 to angle in degrees: 0% = 180 deg (left), 100% = 360 deg (right)
  const valAngle = 180 + (clampedValue / 100) * 180;
  const needleAngle = (clampedValue / 100) * 180 - 180; // for transform rotate around (cx, cy)

  // Arc paths for zones:
  // Red zone: 0 to 80% -> 180 to 324 deg
  // Yellow zone: 80 to 89% -> 324 to 340.2 deg
  // Green zone: 89 to 100% -> 340.2 to 360 deg
  const redPath = describeArc(cx, cy, radius, 180, 180 + 0.8 * 180);
  const yellowPath = describeArc(cx, cy, radius, 180 + 0.8 * 180, 180 + 0.89 * 180);
  const greenPath = describeArc(cx, cy, radius, 180 + 0.89 * 180, 360);

  // Active value arc path
  const valueArc = describeArc(cx, cy, radius - 16, 180, valAngle);

  return (
    <div className="flex flex-col items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
      <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</div>
      <svg
        viewBox="0 0 300 170"
        style={{ width: '100%', maxWidth: '280px', height: `${height * 0.75}px` }}
        className="overflow-visible"
      >
        {/* Background track */}
        <path
          d={describeArc(cx, cy, radius, 180, 360)}
          fill="none"
          stroke="#e2e8f0"
          className="dark:stroke-slate-800"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Zones */}
        <path
          d={redPath}
          fill="none"
          stroke="#EF4444"
          strokeOpacity="0.25"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={yellowPath}
          fill="none"
          stroke="#EAB308"
          strokeOpacity="0.25"
          strokeWidth={strokeWidth}
        />
        <path
          d={greenPath}
          fill="none"
          stroke="#22C55E"
          strokeOpacity="0.25"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value track arc */}
        {clampedValue > 0 && (
          <path
            d={valueArc}
            fill="none"
            stroke={primaryColor}
            strokeWidth="6"
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Center needle indicator */}
        <g transform={`rotate(${needleAngle}, ${cx}, ${cy})`} className="transition-transform duration-700 ease-out">
          <line
            x1={cx}
            y1={cy}
            x2={cx + radius - 20}
            y2={cy}
            stroke={primaryColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx={cx + radius - 20} cy={cy} r="4" fill={primaryColor} />
        </g>
        <circle cx={cx} cy={cy} r="7" fill={primaryColor} />
        <circle cx={cx} cy={cy} r="3" fill="#ffffff" />

        {/* Value text in center */}
        <text
          x={cx}
          y={cy - 22}
          textAnchor="middle"
          className="font-mono font-extrabold fill-slate-900 dark:fill-white text-2xl"
        >
          {clampedValue.toFixed(1)}%
        </text>

        {/* Range labels */}
        <text x={cx - radius - 5} y={cy + 16} textAnchor="start" className="text-[10px] fill-slate-400 font-mono">
          0%
        </text>
        <text x={cx + radius + 5} y={cy + 16} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
          100%
        </text>
      </svg>

      <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold" style={{ color: statusColor }}>
        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
        <span>{statusText}</span>
      </div>
    </div>
  );
};
