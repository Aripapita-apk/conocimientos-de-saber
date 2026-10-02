import React, { useState } from 'react';
import { Search, ExternalLink, Globe, BookMarked, Sparkles } from 'lucide-react';

interface BusquedaViewProps {
  primaryColor: string;
}

export const BusquedaView: React.FC<BusquedaViewProps> = ({ primaryColor }) => {
  const [query, setQuery] = useState('Norma ISO 9001:2015 gestión por procesos SENA');

  const suggestedQueries = [
    'Norma ISO 9001:2015 gestión por procesos SENA',
    'Matriz SIPOC ejemplos prácticos educación',
    'Ciclo PHVA en el sector público colombiano',
    'Indicadores de eficacia, eficiencia y efectividad DNP',
    'MECI Modelo Estándar de Control Interno Colombia'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Búsqueda de Información Complementaria & Recursos
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Consultas rápidas sobre normatividad ISO 9001, guías de calidad SENA y bancos de recursos
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <label className="text-xs font-bold text-slate-900 dark:text-white block">
          🔍 Buscar normativa, ISO 9001 o guías de procesos:
        </label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe un tema o concepto a consultar..."
            className="w-full text-xs p-3 pl-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px]">Sugerencias frecuentes:</span>
          {suggestedQueries.map((item) => (
            <button
              key={item}
              onClick={() => setQuery(item)}
              className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* External Action Links */}
      {query.trim() && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Enlaces directos generados para: &quot;{query}&quot;
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    Buscar en Google Académico y Web
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Artículos, decretos oficiales, manuales y normas
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </a>

            <a
              href={`https://unsplash.com/s/photos/${encodeURIComponent(query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                  <BookMarked className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    Buscar Imágenes e Infografías
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Recursos gráficos sobre procesos en Unsplash
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </a>
          </div>
        </div>
      )}

      {/* Useful Official Reference Portals */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Portales Institucionales de Referencia
        </h4>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <a
              href="https://www.sena.edu.co"
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-slate-900 dark:text-white font-medium"
            >
              Portal Oficial SENA (Servicio Nacional de Aprendizaje)
            </a>
            <span className="text-slate-400">— Políticas de calidad institucional</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <a
              href="https://www.iso.org/iso-9001-quality-management.html"
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-slate-900 dark:text-white font-medium"
            >
              ISO 9001 Quality Management Standard
            </a>
            <span className="text-slate-400">— Estándar internacional para sistemas de calidad</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <a
              href="https://www.funcionpublica.gov.co/mipg"
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-slate-900 dark:text-white font-medium"
            >
              MIPG (Modelo Integrado de Planeación y Gestión)
            </a>
            <span className="text-slate-400">— Función Pública Colombia</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
