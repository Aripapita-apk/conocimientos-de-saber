import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleColor?: string;
  primaryColor?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  subtitleColor,
  primaryColor = '#39A900',
  icon
}) => {
  return (
    <div
      className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md"
      style={{ borderLeftWidth: '5px', borderLeftColor: primaryColor }}
    >
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </div>
        {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
      </div>

      <div
        className="text-3xl font-extrabold my-2 tracking-tight font-mono tabular-nums"
        style={{ color: primaryColor }}
      >
        {value}
      </div>

      {subtitle && (
        <div
          className="text-xs font-medium"
          style={{ color: subtitleColor || '#64748B' }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
