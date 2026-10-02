import React from 'react';
import {
  LayoutDashboard,
  Cog,
  Map,
  Repeat,
  RotateCw,
  Gauge,
  AlertTriangle,
  FileEdit,
  FileText,
  Search,
  GraduationCap,
  Terminal,
  RotateCcw
} from 'lucide-react';
import { PageId } from '../types';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  primaryColor: string;
  onColorChange: (color: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenPythonGuide: () => void;
  alertCount: number;
}

const MENU_ITEMS: { id: PageId; label: string; icon: React.ReactNode; num: string }[] = [
  { id: 'resumen', label: 'Resumen Ejecutivo & Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, num: '0' },
  { id: 'sipoc', label: '1. Caracterización & SIPOC', icon: <Cog className="w-4 h-4" />, num: '1' },
  { id: 'mapa', label: '2. Mapa de Procesos & Clasificación', icon: <Map className="w-4 h-4" />, num: '2' },
  { id: 'interacciones', label: '3. Interacciones y Cadena de Valor', icon: <Repeat className="w-4 h-4" />, num: '3' },
  { id: 'phva', label: '4. Ciclo PHVA (Mejora Continua)', icon: <RotateCw className="w-4 h-4" />, num: '4' },
  { id: 'triada', label: '5. Tríada de Desempeño', icon: <Gauge className="w-4 h-4" />, num: '5' },
  { id: 'alertas', label: '6. Alertas & Diagnóstico', icon: <AlertTriangle className="w-4 h-4" />, num: '6' },
  { id: 'gestor', label: '7. Gestor de Datos (Añadir/Editar)', icon: <FileEdit className="w-4 h-4" />, num: '7' },
  { id: 'doc', label: '8. Visor Documento Anexo 1', icon: <FileText className="w-4 h-4" />, num: '8' },
  { id: 'busqueda', label: '9. Búsqueda en Línea & Recursos', icon: <Search className="w-4 h-4" />, num: '9' },
  { id: 'quiz', label: '10. Cuestionario Evaluativo', icon: <GraduationCap className="w-4 h-4" />, num: '10' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  primaryColor,
  onColorChange,
  isDark,
  onToggleTheme,
  onOpenPythonGuide,
  alertCount
}) => {
  return (
    <aside
      className="w-64 shrink-0 text-white flex flex-col justify-between border-r border-[#144117] min-h-[calc(100vh-57px)]"
      style={{ backgroundColor: '#1d3626' }}
    >
      <div className="p-4 space-y-4">
        {/* Brand / Institution header */}
        <div className="pb-3 border-b border-emerald-900/60 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <div>
              <div className="font-bold text-sm text-white tracking-wide">SENA OPM</div>
              <div className="text-[11px] text-emerald-300 dark:text-slate-400">
                Gestión por Procesos
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80 dark:text-slate-400 px-3 py-1">
            Módulos del Sistema
          </div>
          {MENU_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left group ${
                  isActive
                    ? 'bg-white/15 dark:bg-white/10 text-white shadow-xs'
                    : 'text-emerald-100/80 dark:text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-white' : 'text-emerald-300 dark:text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.id === 'alertas' && alertCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-red-500 text-white font-bold shrink-0">
                    {alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Python execution callout button */}
        <div className="pt-2">
          <button
            onClick={onOpenPythonGuide}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-900/60 dark:bg-slate-900 border border-emerald-700/50 dark:border-slate-800 text-emerald-100 hover:text-white hover:bg-emerald-800/60 transition-all text-xs"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <div className="font-semibold text-[11px]">¿Cómo ejecutar en Python?</div>
                <div className="text-[10px] text-emerald-300/80 dark:text-slate-400">Ver script y comandos</div>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded text-white font-mono">
              CLI
            </span>
          </button>
        </div>
      </div>

      {/* Style & Theme customizer in sidebar (as in Streamlit script) */}
      <div className="p-4 border-t border-emerald-900/60 dark:border-slate-800/80 bg-emerald-950/40 dark:bg-slate-900/40 space-y-3 text-xs">
        <div className="text-[10px] uppercase font-semibold text-emerald-300 dark:text-slate-400 tracking-wider">
          Personalización Visual
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Theme switcher */}
          <div>
            <div className="text-[10px] text-emerald-200/70 dark:text-slate-400 mb-1">Tema:</div>
            <button
              onClick={onToggleTheme}
              className="w-full py-1 px-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors text-center"
            >
              {isDark ? '🌙 Oscuro' : '☀️ Claro'}
            </button>
          </div>

          {/* Color Picker */}
          <div>
            <div className="text-[10px] text-emerald-200/70 dark:text-slate-400 mb-1">Color Marca:</div>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-full h-7 rounded cursor-pointer border-0 bg-transparent p-0"
              />
            </div>
          </div>
        </div>

        {primaryColor !== '#39A900' && (
          <button
            onClick={() => onColorChange('#39A900')}
            className="w-full py-1 px-2 flex items-center justify-center gap-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Resetear a Verde SENA
          </button>
        )}

        <div className="text-[10px] text-emerald-300/60 dark:text-slate-500 pt-1 text-center">
          SENA · Calidad y Gestión
        </div>
      </div>
    </aside>
  );
};
