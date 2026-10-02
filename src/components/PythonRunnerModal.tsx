import React, { useState } from 'react';
import { Terminal, Download, Copy, Check, X, AlertTriangle, Play, HelpCircle } from 'lucide-react';
import { PYTHON_APP_SCRIPT } from '../data/pythonScriptSource';
import { RAW_MD_CUESTIONARIO } from '../data/defaultData';

interface PythonRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryColor?: string;
}

export const PythonRunnerModal: React.FC<PythonRunnerModalProps> = ({
  isOpen,
  onClose,
  primaryColor = '#39A900'
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: primaryColor }}
            >
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Guía de Ejecución: Código Python & Streamlit
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paso a paso para correr tu script en tu máquina o usarlo en la web
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-slate-700 dark:text-slate-300">
          {/* Important note: already running here! */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex gap-3">
            <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-900 dark:text-emerald-200">
                ¡El código ya está completamente compilado y funcional en esta pantalla!
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                Todas las secciones del script (SIPOC, PHVA, Tríada de Desempeño, Matriz de Interacción, Alertas y Cuestionario) están activas en este navegador. Si deseas ejecutarlo en tu computador con Python local, sigue los pasos a continuación:
              </p>
            </div>
          </div>

          {/* Step 1: Files download */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-xs flex items-center justify-center font-mono">
                1
              </span>
              Descargar los archivos del proyecto
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              El script requiere 2 archivos en la misma carpeta: el código principal (<code>app.py</code>) y el banco de preguntas (<code>cuestionario_gestion_procesos.md</code>).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleDownloadFile(PYTHON_APP_SCRIPT, 'app.py', 'text/x-python')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40 transition-colors text-left"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">
                    Descargar app.py
                  </div>
                  <div className="text-[11px] text-slate-500">Script Streamlit principal</div>
                </div>
                <Download className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() =>
                  handleDownloadFile(
                    RAW_MD_CUESTIONARIO,
                    'cuestionario_gestion_procesos.md',
                    'text/markdown;charset=utf-8'
                  )
                }
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40 transition-colors text-left"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">
                    Descargar cuestionario.md
                  </div>
                  <div className="text-[11px] text-slate-500">Preguntas evaluativas Anexo 1</div>
                </div>
                <Download className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Step 2: Dependencies */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-xs flex items-center justify-center font-mono">
                2
              </span>
              Instalar librerías necesarias en la terminal
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Abre tu terminal (Command Prompt, PowerShell o VS Code Terminal) e instala las 3 dependencias requeridas:
            </p>
            <div className="relative group">
              <pre className="bg-slate-950 text-slate-200 p-3.5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                pip install streamlit pandas plotly
              </pre>
              <button
                onClick={() => handleCopy('pip install streamlit pandas plotly', 'cmd1')}
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs flex items-center gap-1"
              >
                {copiedKey === 'cmd1' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 3: Run command */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-xs flex items-center justify-center font-mono">
                3
              </span>
              Ejecutar la aplicación
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ubicado en la misma carpeta donde guardaste <code>app.py</code> y <code>cuestionario_gestion_procesos.md</code>, ejecuta:
            </p>
            <div className="relative group">
              <pre className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                streamlit run app.py
              </pre>
              <button
                onClick={() => handleCopy('streamlit run app.py', 'cmd2')}
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs flex items-center gap-1"
              >
                {copiedKey === 'cmd2' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Streamlit abrirá automáticamente la dirección <code>http://localhost:8501</code> en tu navegador.
            </p>
          </div>

          {/* Pitfalls & Solutions */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/30 space-y-2">
            <div className="font-bold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              Solución a Errores Comunes al Ejecutar:
            </div>
            <ul className="text-xs text-amber-800 dark:text-amber-200/90 list-disc list-inside space-y-1">
              <li>
                <strong>Error &apos;streamlit&apos; no se reconoce como comando:</strong> Asegúrate de haber marcado &quot;Add Python to PATH&quot; al instalar Python o usa <code>python -m streamlit run app.py</code>.
              </li>
              <li>
                <strong>No encuentra el archivo .md:</strong> Confirma que <code>cuestionario_gestion_procesos.md</code> está en la misma carpeta que <code>app.py</code> con ese nombre exacto.
              </li>
              <li>
                <strong>Caracteres extraños o tildes:</strong> Guarda ambos archivos con codificación UTF-8.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            Entendido, ¡volver al Dashboard!
          </button>
        </div>
      </div>
    </div>
  );
};
