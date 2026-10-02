export type ProcessType = 'Estratégico' | 'Misional' | 'De Apoyo' | 'De Evaluación';

export interface Process {
  id: number;
  nombre: string;
  tipo: ProcessType;
  lider: string;
  entradas: string;
  actividades: string;
  salidas: string;
  recursos: string;
  controles: string;
  eficacia: number;
  eficiencia: number;
  efectividad: number;
}

export type PHVAFase = 'Planear' | 'Hacer' | 'Verificar' | 'Actuar';
export type PHVAEstado = 'Pendiente' | 'En Proceso' | 'Completado';

export interface PHVATask {
  id: string;
  fase: PHVAFase;
  tarea: string;
  estado: PHVAEstado;
}

export interface QuizQuestion {
  n: number;
  modulo: string;
  enunciado: string;
  opciones: Record<string, string>; // 'A', 'B', 'C', 'D'
  correcta: string;
  justificacion: string;
}

export interface QuizResultDetail {
  n: number;
  modulo: string;
  enunciado: string;
  elegida: string | null;
  correcta: string;
  ok: boolean;
  texto_elegida: string;
  texto_correcta: string;
}

export interface ModuleScore {
  correctas: number;
  total: number;
  pct: number;
}

export interface QuizResult {
  correctas: number;
  total: number;
  pct: number;
  umbral: number;
  aprobado: boolean;
  sin_responder: number;
  por_modulo: Record<string, ModuleScore>;
  detalle: QuizResultDetail[];
  fecha: string;
}

export interface QuizHistoryEntry {
  intento: number;
  pct: number;
  correctas: number;
  total: number;
  fecha: string;
}

export type PageId =
  | 'resumen'
  | 'sipoc'
  | 'mapa'
  | 'interacciones'
  | 'phva'
  | 'triada'
  | 'alertas'
  | 'gestor'
  | 'doc'
  | 'busqueda'
  | 'quiz';
