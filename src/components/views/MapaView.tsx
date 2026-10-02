import React from 'react';
import { Process, ProcessType } from '../../types';
import { Compass, Target, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

interface MapaViewProps {
  processes: Process[];
  primaryColor: string;
}

export const MapaView: React.FC<MapaViewProps> = ({ processes, primaryColor }) => {
  const sections: {
    tipo: ProcessType;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      tipo: 'Estratégico',
      title: 'Procesos Estratégicos',
      description: 'Definen directrices, asignación de recursos y orientación institucional de largo plazo.',
      icon: <Compass className="w-4 h-4" />,
      color: primaryColor
    },
    {
      tipo: 'Misional',
      title: 'Procesos Misionales (Clave)',
      description: 'Constituyen la razón de ser del SENA y entregan valor directo al aprendiz y al sector productivo.',
      icon: <Target className="w-4 h-4" />,
      color: '#0284C7'
    },
    {
      tipo: 'De Apoyo',
      title: 'Procesos de Apoyo (Soporte)',
      description: 'Suministran talento humano, recursos tecnológicos, infraestructura y compras para los demás procesos.',
      icon: <Wrench className="w-4 h-4" />,
      color: '#64748B'
    },
    {
      tipo: 'De Evaluación',
      title: 'Procesos de Evaluación y Control',
      description: 'Miden, auditan, valoran riesgos y garantizan el mejoramiento continuo del sistema institucional.',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: '#0D9488'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Mapa de Procesos Institucional
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Estructura jerárquica y funcional de la cadena de valor según el Anexo 1
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((sec) => {
          const matching = processes.filter((p) => p.tipo === sec.tipo);
          return (
            <div
              key={sec.tipo}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: sec.color }}
                  >
                    {sec.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {sec.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">{sec.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {matching.length} {matching.length === 1 ? 'proceso' : 'procesos'}
                </span>
              </div>

              {matching.length === 0 ? (
                <div className="p-4 text-xs italic text-slate-400 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                  No hay procesos registrados en esta categoría. Puedes agregarlos desde el Gestor de Datos.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matching.map((p) => {
                    const isOptimal = p.efectividad >= 89;
                    const isCritical = p.efectividad < 80;

                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                        style={{ borderTopWidth: '4px', borderTopColor: sec.color }}
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                            {p.nombre}
                          </div>
                          <div className="text-[11px] text-slate-500 mb-2">
                            Líder: <strong className="text-slate-700 dark:text-slate-300">{p.lider}</strong>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {p.actividades}
                          </p>
                        </div>

                        <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Efectividad:</span>
                          <span
                            className="font-mono font-bold"
                            style={{
                              color: isOptimal ? '#22C55E' : isCritical ? '#EF4444' : '#EAB308'
                            }}
                          >
                            {p.efectividad}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
