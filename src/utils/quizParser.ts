import { QuizQuestion } from '../types';

export function parseCuestionarioMarkdown(texto: string): QuizQuestion[] {
  const normalized = texto.replace(/\r\n/g, '\n');
  const partes = normalized.split(/^##\s+Clave de Respuestas.*$/m);
  const cuerpo = partes[0] || '';
  const claveTxt = partes[1] || '';

  const clave: Record<number, { correcta: string; justificacion: string }> = {};
  const patronClave = /^\s*(\d+)\.\s+\*\*([A-D])\s*[—–-]\s*Justificaci[oó]n:?\*\*:\s*(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = patronClave.exec(claveTxt)) !== null) {
    const num = parseInt(match[1], 10);
    clave[num] = {
      correcta: match[2].trim().toUpperCase(),
      justificacion: match[3].trim()
    };
  }

  const lineas = cuerpo.split('\n');
  const preguntas: {
    n: number;
    modulo: string;
    enunciado: string;
    opciones: Record<string, string>;
  }[] = [];

  let moduloActual = 'General';
  let preguntaActual: {
    n: number;
    modulo: string;
    enunciado: string;
    opciones: Record<string, string>;
  } | null = null;

  for (const rawLinea of lineas) {
    const linea = rawLinea.trim();
    const matchMod = linea.match(/^###\s+(.+)$/);
    const matchPreg = linea.match(/^####\s+(\d+)\.\s+(.+)$/);
    const matchOpc = linea.match(/^-\s+\*\*([A-D])\)\*\*\s+(.+)$/);

    if (matchMod) {
      moduloActual = matchMod[1].trim();
    } else if (matchPreg) {
      preguntaActual = {
        n: parseInt(matchPreg[1], 10),
        modulo: moduloActual,
        enunciado: matchPreg[2].trim(),
        opciones: {}
      };
      preguntas.push(preguntaActual);
    } else if (matchOpc && preguntaActual) {
      preguntaActual.opciones[matchOpc[1].trim().toUpperCase()] = matchOpc[2].trim();
    }
  }

  const validas: QuizQuestion[] = [];
  for (const p of preguntas) {
    if (clave[p.n] && Object.keys(p.opciones).length >= 2 && p.opciones[clave[p.n].correcta]) {
      validas.push({
        n: p.n,
        modulo: p.modulo,
        enunciado: p.enunciado,
        opciones: p.opciones,
        correcta: clave[p.n].correcta,
        justificacion: clave[p.n].justificacion
      });
    }
  }

  return validas;
}
