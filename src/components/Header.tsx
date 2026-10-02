import React from 'react';
import { Printer, Download, Terminal, Sun, Moon, RotateCcw } from 'lucide-react';
import { Process } from '../types';

interface HeaderProps {
  primaryColor: string;
  onColorChange: (color: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenPythonGuide: () => void;
  processes: Process[];
}

export const Header: React.FC<HeaderProps> = ({
  primaryColor,
  onColorChange,
  isDark,
  onToggleTheme,
  onOpenPythonGuide,
  processes
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'id',
      'nombre',
      'tipo',
      'lider',
      'entradas',
      'actividades',
      'salidas',
      'recursos',
      'controles',
      'eficacia',
      'eficiencia',
      'efectividad'
    ];

    const rows = processes.map((p) => [
      p.id,
      `"${p.nombre.replace(/"/g, '""')}"`,
      `"${p.tipo.replace(/"/g, '""')}"`,
      `"${p.lider.replace(/"/g, '""')}"`,
      `"${p.entradas.replace(/"/g, '""')}"`,
      `"${p.actividades.replace(/"/g, '""')}"`,
      `"${p.salidas.replace(/"/g, '""')}"`,
      `"${p.recursos.replace(/"/g, '""')}"`,
      `"${p.controles.replace(/"/g, '""')}"`,
      p.eficacia,
      p.eficiencia,
      p.efectividad
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'procesos_sena_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 border-b border-[#144117] transition-colors"
      style={{ backgroundColor: '#1b5b24' }}
    >
      {/* Zone 1: Brand single text element */}
      <div className="flex items-center gap-2">
        <a href="#top" className="text-base font-bold tracking-tight text-white flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
          <span>SENA · Gestión por Procesos</span>
        </a>
        <span
          className="hidden md:inline text-xs text-emerald-100 font-normal px-2 py-0.5 rounded"
          style={{ backgroundColor: '#144117' }}
        >
          Anexo 1: Conocimientos del Saber
        </span>
      </div>

      {/* Zone 2: Navigation / Quick Indicator */}
      <div className="hidden lg:flex items-center gap-3 text-xs text-emerald-200">
        <span>Sistema de Gestión de la Calidad</span>
        <span aria-hidden="true">·</span>
        <span>Norma ISO 9001:2015</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums text-white">
          {processes.length} procesos activos
        </span>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenPythonGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
          title="Ver cómo ejecutar el código en Python"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ejecutar Python</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title="Imprimir vista o exportar a PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Imprimir</span>
        </button>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title="Exportar base de procesos en formato CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CSV</span>
        </button>

        <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

        {/* Theme mode toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 text-emerald-100 hover:bg-white/10 rounded-lg transition-colors"
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Color picker */}
        <div className="relative flex items-center" title="Personalizar color institucional">
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent p-0"
          />
        </div>

        {primaryColor !== '#39A900' && (
          <button
            onClick={() => onColorChange('#39A900')}
            className="p-1 text-emerald-200 hover:text-white"
            title="Restablecer al verde institucional SENA (#39A900)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
