import React, { useState } from 'react';
import { BookOpen, Search, Download, Printer, CheckCircle2 } from 'lucide-react';

interface DocViewProps {
  primaryColor: string;
}

export const DocView: React.FC<DocViewProps> = ({ primaryColor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const docSections = [
    {
      num: '1',
      title: 'Definición de Proceso',
      content:
        'Conjunto de actividades mutuamente relacionadas o que interactúan, las cuales transforman elementos de entrada en resultados (salidas). En el marco del SENA y la norma ISO 9001:2015, todo proceso tiene como objetivo aportar valor a los clientes (aprendices, empresarios y comunidad) mediante la optimización de recursos y la satisfacción de requisitos normativos.'
    },
    {
      num: '2',
      title: 'Elementos Clave de un Proceso (Modelo SIPOC)',
      content:
        '• Entradas (Inputs): Insumos, datos, normas y requisitos necesarios para comenzar la transformación.\n• Actividades: Conjunto secuencial y lógico de tareas operativas o intelectuales que añaden valor.\n• Salidas (Outputs): Productos, bienes, certificados o servicios entregados al cliente interno o externo.\n• Recursos: Talento humano, maquinaria, ambientes formativos, presupuesto y herramientas de TI.\n• Responsable / Dueño de Proceso: Cargo directivo o técnico que responde por la eficacia de la gestión.\n• Controles: Puntos de verificación, listas de chequeo, auditorías y límites de tolerancia para prevenir riesgos.\n• Indicadores: Métricas numéricas que evalúan el cumplimiento y desempeño.'
    },
    {
      num: '3',
      title: 'Clasificación y Tipología de Procesos',
      content:
        '• Estratégicos: Definen las políticas institucionales, directrices, asignación de recursos y orientación de largo plazo (p. ej. Direccionamiento Estratégico, Comunicaciones).\n• Misionales: Constituyen la razón de ser de la entidad y entregan valor directo al aprendiz y al sector productivo (p. ej. Diseño Curricular, Ejecución de la Formación Profesional).\n• De Apoyo o Soporte: Proveen los recursos físicos, tecnológicos, financieros y logísticos indispensables (p. ej. Gestión de Compras y Suministros, Talento Humano).\n• De Evaluación: Miden, auditan, monitorean riesgos y proponen acciones de mejoramiento continuo (p. ej. Control Interno, Auditoría de Calidad).'
    },
    {
      num: '4',
      title: 'Metodología del Ciclo PHVA (Deming)',
      content:
        '• Planear: Establecer los objetivos de calidad, las metas, los indicadores y los planes de acción.\n• Hacer: Implementar y ejecutar las actividades conforme a los procedimientos y registros establecidos.\n• Verificar: Realizar el seguimiento, medición de indicadores, auditorías y revisión de hallazgos.\n• Actuar: Tomar decisiones para mejorar continuamente el desempeño, cerrar no conformidades y estandarizar buenas prácticas.'
    },
    {
      num: '5',
      title: 'Tríada de Medición del Desempeño',
      content:
        '• Eficacia: Grado de cumplimiento de las metas planificadas (% Resultados logrados / Metas fijadas). No tiene en cuenta los costos o recursos.\n• Eficiencia: Relación óptima entre los resultados obtenidos y los recursos consumidos (tiempo, dinero, materiales).\n• Efectividad: Síntesis del impacto real que conjuga el logro de metas con la utilización óptima de los recursos disponibles. Es la medida suprema de impacto institucional.'
    },
    {
      num: '6',
      title: 'Gestión por Procesos vs. Silos Funcionales',
      content:
        'La gestión funcional tradicional aísla a las dependencias en "feudos" o "silos", donde cada área solo vela por sus tareas locales sin importar si la entrega hacia la siguiente etapa está demorada o incompleta. La gestión por procesos del SENA rompe esas barreras enfocándose horizontalmente en el flujo completo de la cadena de valor hacia la satisfacción del aprendiz y el sector productivo.'
    }
  ];

  const filteredSections = docSections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Visor de Documento: ANEXO 1 CONOCIMIENTOS DEL SABER
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Fundamentación teórica y normativa sobre Gestión por Procesos en el SENA
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Imprimir Documento
          </button>
        </div>
      </div>

      {/* Search inside doc */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar conceptos en el Anexo 1 (ej. SIPOC, Eficacia, Silos, Misional, PHVA)..."
          className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
      </div>

      {/* Document Sections Accordion/Cards */}
      <div className="space-y-4">
        {filteredSections.map((sec) => (
          <div
            key={sec.num}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-6 h-6 rounded-lg text-white font-mono font-bold text-xs flex items-center justify-center shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {sec.num}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{sec.title}</h3>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-8.5">
              {sec.content}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No se encontraron secciones que coincidan con &quot;{searchTerm}&quot;.
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Este marco conceptual es la base de auditorías de calidad en el SENA y sirve como sustento para el <strong>Cuestionario Evaluativo (Módulo 10)</strong>.
        </span>
      </div>
    </div>
  );
};
