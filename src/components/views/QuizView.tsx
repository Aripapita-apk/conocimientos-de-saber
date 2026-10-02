import React, { useState, useMemo } from 'react';
import { QuizQuestion, QuizResult, QuizHistoryEntry } from '../../types';
import { MetricCard } from '../MetricCard';
import {
  GraduationCap,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  Upload,
  Sparkles,
  BarChart2,
  FileText
} from 'lucide-react';
import { parseCuestionarioMarkdown } from '../../utils/quizParser';
import { RAW_MD_CUESTIONARIO } from '../../data/defaultData';

interface QuizViewProps {
  questions: QuizQuestion[];
  onSetQuestions: (newQuestions: QuizQuestion[]) => void;
  quizResult: QuizResult | null;
  onSetQuizResult: (res: QuizResult | null) => void;
  quizHistory: QuizHistoryEntry[];
  onAddHistory: (entry: QuizHistoryEntry) => void;
  primaryColor: string;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  onSetQuestions,
  quizResult,
  onSetQuizResult,
  quizHistory,
  onAddHistory,
  primaryColor
}) => {
  // Quiz configuration
  const [mode, setMode] = useState<'Examen' | 'Práctica'>('Examen');
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(true);
  const [approvalThreshold, setApprovalThreshold] = useState<number>(70);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [subsetQuestions, setSubsetQuestions] = useState<number[] | null>(null);

  // Upload or custom markdown state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [customMarkdown, setCustomMarkdown] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Active questions (all or subset of failed)
  const activeQuestions = useMemo(() => {
    if (subsetQuestions === null) return questions;
    return questions.filter((q) => subsetQuestions.includes(q.n));
  }, [questions, subsetQuestions]);

  // Shuffled letters mapping per question
  const shuffledKeys = useMemo(() => {
    const map: Record<number, string[]> = {};
    activeQuestions.forEach((q) => {
      const keys = Object.keys(q.opciones);
      if (shuffleOptions) {
        // Deterministic or pseudorandom shuffle
        map[q.n] = [...keys].sort(() => Math.sin(q.n * 999) - 0.5);
      } else {
        map[q.n] = keys;
      }
    });
    return map;
  }, [activeQuestions, shuffleOptions]);

  // Group questions by Module
  const groupedModules = useMemo(() => {
    const groups: Record<string, QuizQuestion[]> = {};
    activeQuestions.forEach((q) => {
      const shortMod = q.modulo.split(':')[0].trim();
      if (!groups[shortMod]) groups[shortMod] = [];
      groups[shortMod].push(q);
    });
    return groups;
  }, [activeQuestions]);

  const moduleNames = Object.keys(groupedModules);
  const [activeTab, setActiveTab] = useState<string>(moduleNames[0] || '');

  // Keep activeTab valid
  React.useEffect(() => {
    if (moduleNames.length > 0 && !moduleNames.includes(activeTab)) {
      setActiveTab(moduleNames[0]);
    }
  }, [moduleNames, activeTab]);

  const answeredCount = Object.keys(selectedAnswers).filter(
    (k) => selectedAnswers[Number(k)] !== undefined
  ).length;

  const handleSelectOption = (qNum: number, letter: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qNum]: letter }));
  };

  const handleGradeQuiz = () => {
    const detalle = activeQuestions.map((p) => {
      const elegida = selectedAnswers[p.n] || null;
      const ok = elegida === p.correcta;
      const shortMod = p.modulo.split(':')[0].trim();
      return {
        n: p.n,
        modulo: shortMod,
        enunciado: p.enunciado,
        elegida,
        correcta: p.correcta,
        ok,
        texto_elegida: elegida ? p.opciones[elegida] || '' : '',
        texto_correcta: p.opciones[p.correcta] || ''
      };
    });

    const porModulo: Record<string, { correctas: number; total: number; pct: number }> = {};
    detalle.forEach((d) => {
      if (!porModulo[d.modulo]) porModulo[d.modulo] = { correctas: 0, total: 0, pct: 0 };
      porModulo[d.modulo].total++;
      if (d.ok) porModulo[d.modulo].correctas++;
    });

    Object.values(porModulo).forEach((m) => {
      m.pct = Math.round((m.correctas / m.total) * 100);
    });

    const total = activeQuestions.length;
    const correctas = detalle.filter((d) => d.ok).length;
    const pct = total > 0 ? Number(((correctas / total) * 100).toFixed(1)) : 0;

    const result: QuizResult = {
      correctas,
      total,
      pct,
      umbral: approvalThreshold,
      aprobado: pct >= approvalThreshold,
      sin_responder: detalle.filter((d) => d.elegida === null).length,
      por_modulo: porModulo,
      detalle,
      fecha: new Date().toLocaleDateString()
    };

    onSetQuizResult(result);
    setIsSubmitted(true);

    if (subsetQuestions === null) {
      onAddHistory({
        intento: quizHistory.length + 1,
        pct,
        correctas,
        total,
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  const handleRestart = (subset: number[] | null = null) => {
    setSubsetQuestions(subset);
    setSelectedAnswers({});
    setIsSubmitted(false);
    onSetQuizResult(null);
  };

  const handleDownloadResultsCSV = () => {
    if (!quizResult) return;
    const headers = [
      'Pregunta',
      'Módulo',
      'Enunciado',
      'Tu respuesta',
      'Respuesta correcta',
      'Resultado'
    ];

    const rows = quizResult.detalle.map((d) => [
      d.n,
      `"${d.modulo.replace(/"/g, '""')}"`,
      `"${d.enunciado.replace(/"/g, '""')}"`,
      `"${d.texto_elegida.replace(/"/g, '""')}"`,
      `"${d.texto_correcta.replace(/"/g, '""')}"`,
      d.elegida === null ? 'Sin responder' : d.ok ? 'Correcta' : 'Incorrecta'
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resultados_cuestionario_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleProcessUploadedMarkdown = () => {
    setUploadError(null);
    if (!customMarkdown.trim()) {
      setUploadError('Pega el contenido del cuestionario en Markdown.');
      return;
    }

    const parsed = parseCuestionarioMarkdown(customMarkdown);
    if (parsed.length === 0) {
      setUploadError(
        'No se pudieron extraer preguntas válidas. Verifica que contenga preguntas con ####, opciones A) a D) y la sección "## Clave de Respuestas".'
      );
      return;
    }

    onSetQuestions(parsed);
    handleRestart(null);
    setShowUploadModal(false);
    setCustomMarkdown('');
  };

  const failedQuestionNumbers = useMemo(() => {
    if (!quizResult) return [];
    return quizResult.detalle.filter((d) => !d.ok).map((d) => d.n);
  }, [quizResult]);

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            <span>Cuestionario Evaluativo: Gestión por Procesos</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluación sumativa y formativa fundamentada en el Anexo 1 del SENA ({questions.length} reactivos cargados)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Cargar Cuestionario (.md)
          </button>
        </div>
      </div>

      {subsetQuestions !== null && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between gap-4 text-xs">
          <div className="text-blue-900 dark:text-blue-200">
            <strong>🎯 Modo Repaso Focalizado:</strong> Estás practicando únicamente las{' '}
            {subsetQuestions.length} preguntas que fallaste en el intento anterior.
          </div>
          <button
            onClick={() => handleRestart(null)}
            className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Volver al cuestionario completo
          </button>
        </div>
      )}

      {/* KPI Cards & Configuration Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Preguntas Activas"
          value={activeQuestions.length}
          subtitle="Una sola respuesta correcta por reactivo"
          primaryColor={primaryColor}
        />

        <MetricCard
          title="Respondidas"
          value={`${answeredCount} / ${activeQuestions.length}`}
          subtitle={`Modo actual: ${mode}`}
          subtitleColor={answeredCount === activeQuestions.length ? '#22C55E' : '#64748B'}
          primaryColor={primaryColor}
        />

        <MetricCard
          title="Historial de Intentos"
          value={quizHistory.length}
          subtitle={
            quizHistory.length > 0
              ? `Mejor puntaje: ${Math.max(...quizHistory.map((h) => h.pct))}%`
              : 'Primer intento'
          }
          primaryColor={primaryColor}
        />
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>Progreso de respuesta</span>
          <span>{Math.round((answeredCount / (activeQuestions.length || 1)) * 100)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(answeredCount / (activeQuestions.length || 1)) * 100}%`,
              backgroundColor: primaryColor
            }}
          />
        </div>
      </div>

      {/* Options Accordion */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Modo:</span>
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
              <button
                onClick={() => setMode('Examen')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  mode === 'Examen'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Examen
              </button>
              <button
                onClick={() => setMode('Práctica')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  mode === 'Práctica'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Práctica inmediata
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={shuffleOptions}
              onChange={(e) => setShuffleOptions(e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <span>Mezclar orden de opciones</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Umbral mínimo: {approvalThreshold}%
          </span>
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={approvalThreshold}
            onChange={(e) => setApprovalThreshold(Number(e.target.value))}
            className="w-24 accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Results Section (if submitted) */}
      {isSubmitted && quizResult && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Resultado de la Evaluación
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                <span>{quizResult.aprobado ? '✅ Aprobado' : '📚 A Reforzar'}</span>
                <span
                  className="text-xl font-mono px-2.5 py-0.5 rounded-lg"
                  style={{
                    backgroundColor: quizResult.aprobado ? '#22C55E20' : '#EAB30820',
                    color: quizResult.aprobado ? '#22C55E' : '#EAB308'
                  }}
                >
                  {quizResult.pct.toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {quizResult.correctas} de {quizResult.total} respuestas correctas · Mínimo exigido: {quizResult.umbral}%
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleRestart(null)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Intentar de nuevo
              </button>

              {failedQuestionNumbers.length > 0 && (
                <button
                  onClick={() => handleRestart(failedQuestionNumbers)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                >
                  🎯 Repasar las {failedQuestionNumbers.length} falladas
                </button>
              )}

              <button
                onClick={handleDownloadResultsCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-lg transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                <Download className="w-3.5 h-3.5" /> Descargar Resultados (CSV)
              </button>
            </div>
          </div>

          {/* Module Breakdown Bar Graph */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4" /> Desempeño por Módulo Temático
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {Object.entries(quizResult.por_modulo).map(([modName, modScore]) => {
                const passed = modScore.pct >= quizResult.umbral;
                return (
                  <div
                    key={modName}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {modName}
                      </div>
                      <div
                        className="text-xl font-bold font-mono my-1"
                        style={{ color: passed ? '#22C55E' : '#EF4444' }}
                      >
                        {modScore.pct}%
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700/60">
                      <span>Aciertos:</span>
                      <span className="font-mono">
                        {modScore.correctas} / {modScore.total}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Module Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto space-x-2 pb-px">
        {moduleNames.map((modName) => {
          const list = groupedModules[modName] || [];
          const answeredInMod = list.filter((q) => selectedAnswers[q.n] !== undefined).length;
          const isActive = activeTab === modName;

          return (
            <button
              key={modName}
              onClick={() => setActiveTab(modName)}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>{modName}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {answeredInMod}/{list.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Questions */}
      <div className="space-y-4">
        {(groupedModules[activeTab] || []).map((q) => {
          const userChoice = selectedAnswers[q.n];
          const hasAnswered = userChoice !== undefined;
          const showInstantFeedback = mode === 'Práctica' && hasAnswered;
          const showFinalFeedback = isSubmitted;
          const showFeedback = showInstantFeedback || showFinalFeedback;
          const isCorrect = userChoice === q.correcta;
          const letters = shuffledKeys[q.n] || Object.keys(q.opciones);

          return (
            <div
              key={q.n}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-all"
              style={{
                borderLeftWidth: '5px',
                borderLeftColor: showFeedback
                  ? isCorrect
                    ? '#22C55E'
                    : '#EF4444'
                  : primaryColor
              }}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Pregunta #{q.n}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {q.modulo}
                  </span>
                </div>

                {showFeedback && (
                  <span
                    className="flex items-center gap-1 text-xs font-bold"
                    style={{ color: isCorrect ? '#22C55E' : '#EF4444' }}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Correcto
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />{' '}
                        {userChoice ? 'Incorrecto' : 'Sin responder'}
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Statement */}
              <div className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                {q.enunciado}
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {letters.map((letterKey, index) => {
                  const optionText = q.opciones[letterKey];
                  const isSelected = userChoice === letterKey;
                  const isTheCorrectOne = letterKey === q.correcta;

                  let optionStyle =
                    'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200';

                  if (isSelected && !showFeedback) {
                    optionStyle = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-medium ring-1 ring-emerald-500';
                  } else if (showFeedback) {
                    if (isTheCorrectOne) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                    } else if (isSelected && !isTheCorrectOne) {
                      optionStyle = 'border-red-400 bg-red-50 dark:bg-red-950/50 text-red-950 dark:text-red-200 ring-1 ring-red-400';
                    } else {
                      optionStyle = 'opacity-60 border-slate-200 dark:border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={letterKey}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.n, letterKey)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${optionStyle}`}
                    >
                      <span className="font-mono font-bold text-xs uppercase px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="leading-snug pt-0.5">{optionText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Justification Feedback */}
              {showFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed mt-2 ${
                    isCorrect
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                      : 'bg-red-50/80 dark:bg-red-950/30 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-900'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>
                      {isCorrect
                        ? '¡Respuesta acertada!'
                        : `Respuesta correcta: Opción ${q.correcta}) ${q.opciones[q.correcta]}`}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90">{q.justificacion}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      {!isSubmitted && (
        <div className="sticky bottom-4 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Respondidas: <strong>{answeredCount}</strong> de <strong>{activeQuestions.length}</strong>.
            {activeQuestions.length - answeredCount > 0 && (
              <span className="text-amber-600 dark:text-amber-400 ml-2">
                (Faltan {activeQuestions.length - answeredCount} por contestar)
              </span>
            )}
          </div>

          <button
            onClick={handleGradeQuiz}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-xl transition-all shadow-md hover:scale-[1.01]"
            style={{ backgroundColor: primaryColor }}
          >
            <CheckCircle2 className="w-4 h-4" /> Calificar Cuestionario
          </button>
        </div>
      )}

      {/* Upload custom markdown modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Cargar Banco de Preguntas Personalizado (.md)</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pega el contenido Markdown de tu archivo <code>cuestionario_gestion_procesos.md</code> o sube el archivo directamente:
            </p>

            {uploadError && (
              <div className="p-3 text-xs bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 rounded-lg">
                {uploadError}
              </div>
            )}

            <div>
              <input
                type="file"
                accept=".md,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setCustomMarkdown((event.target?.result as string) || '');
                    };
                    reader.readAsText(file, 'utf-8');
                  }
                }}
                className="text-xs text-slate-500 mb-2 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />

              <textarea
                rows={8}
                value={customMarkdown}
                onChange={(e) => setCustomMarkdown(e.target.value)}
                placeholder="Pega aquí el contenido Markdown completo con #### para preguntas y ## Clave de Respuestas..."
                className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCustomMarkdown(RAW_MD_CUESTIONARIO)}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Cargar plantilla predeterminada
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleProcessUploadedMarkdown}
                  className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  Procesar y Cargar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
