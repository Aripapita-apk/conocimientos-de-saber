export const PYTHON_APP_SCRIPT = `import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import json
import io
import os
import re
import html
import random
from urllib.parse import quote_plus
import streamlit.components.v1 as components

# ==========================================
# 1. CONFIGURACIÓN DE LA PÁGINA
# ==========================================
st.set_page_config(
    page_title="Dashboard de Gestión de Procesos - SENA & Plantilla",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ==========================================
# 1.1 CONSTANTES Y FUNCIONES DE APOYO
# ==========================================
RUTA_CUESTIONARIO = "cuestionario_gestion_procesos.md"  # debe estar junto a este archivo
UMBRAL_MINIMO = 80   # por debajo de este valor un indicador se marca como crítico
UMBRAL_OPTIMO = 89   # desde este valor un indicador se considera óptimo

MENU = {
    "resumen": "🏠 Resumen Ejecutivo & Dashboard",
    "sipoc": "⚙️ 1. Caracterización & SIPOC",
    "mapa": "🗺️ 2. Mapa de Procesos & Clasificación",
    "interacciones": "🔄 3. Interacciones y Cadena de Valor",
    "phva": "🔁 4. Ciclo PHVA (Mejora Continua)",
    "triada": "📊 5. Tríada de Desempeño",
    "alertas": "⚠️ 6. Alertas & Diagnóstico de Errores",
    "gestor": "📝 7. Gestor de Datos (Añadir/Editar)",
    "doc": "📄 8. Visor Documento Original (Anexo 1)",
    "busqueda": "🌐 9. Búsqueda en Línea & Recursos",
    "quiz": "🎓 10. Cuestionario Evaluativo",
}

def esc(texto):
    """Escapa un texto para mostrarlo con seguridad dentro de HTML."""
    return html.escape(str(texto))

def estado_desempeno(valor):
    """Semáforo de un indicador: devuelve (texto, color)."""
    if valor >= UMBRAL_OPTIMO:
        return "🟢 Óptimo", "#22C55E"
    if valor >= UMBRAL_MINIMO:
        return "🟡 Aceptable", "#EAB308"
    return "🔴 Crítico", "#EF4444"

def kpi_card(titulo, valor, subtitulo="", color_sub="#64748B"):
    return (
        '<div class="kpi-card">'
        f'<div class="kpi-title">{esc(titulo)}</div>'
        f'<div class="kpi-value">{valor}</div>'
        f'<div style="font-size:0.8rem; color:{color_sub};">{subtitulo}</div>'
        '</div>'
    )

def fichas_completas(df):
    if df.empty:
        return 0
    campos = ["entradas", "actividades", "salidas", "recursos", "controles"]
    total = 0
    for _, fila in df.iterrows():
        textos = [str(fila[c]).strip() for c in campos]
        if all(t and t.lower() != "por definir" for t in textos):
            total += 1
    return total

def ajustar_matriz(matriz, n):
    nueva = [[0] * n for _ in range(n)]
    for i in range(min(n, len(matriz))):
        for j in range(min(n, len(matriz[i]))):
            nueva[i][j] = int(matriz[i][j])
    return nueva

def parse_cuestionario(texto):
    texto = texto.replace("\\r\\n", "\\n")
    partes = re.split(r"^##\\s+Clave de Respuestas.*$", texto, maxsplit=1, flags=re.M)
    cuerpo = partes[0]
    clave_txt = partes[1] if len(partes) > 1 else ""

    clave = {}
    patron_clave = r"^\\s*(\\d+)\\.\\s+\\*\\*([A-D])\\s*[—–-]\\s*Justificaci[oó]n:?\\*\\*:?\\s*(.+)$"
    for m in re.finditer(patron_clave, clave_txt, flags=re.M):
        clave[int(m.group(1))] = (m.group(2), m.group(3).strip())

    preguntas, modulo, actual = [], "General", None
    for linea in cuerpo.splitlines():
        linea = linea.strip()
        m_mod = re.match(r"^###\\s+(.+)$", linea)
        m_preg = re.match(r"^####\\s+(\\d+)\\.\\s+(.+)$", linea)
        m_opc = re.match(r"^-\\s+\\*\\*([A-D])\\)\\*\\*\\s+(.+)$", linea)
        if m_mod:
            modulo = m_mod.group(1).strip()
        elif m_preg:
            actual = {"n": int(m_preg.group(1)), "modulo": modulo,
                      "enunciado": m_preg.group(2).strip(), "opciones": {}}
            preguntas.append(actual)
        elif m_opc and actual is not None:
            actual["opciones"][m_opc.group(1)] = m_opc.group(2).strip()

    validas = []
    for p in preguntas:
        if p["n"] in clave and len(p["opciones"]) >= 2 and clave[p["n"]][0] in p["opciones"]:
            p["correcta"], p["justificacion"] = clave[p["n"]]
            validas.append(p)
    return validas

def cargar_texto_cuestionario():
    carpetas = [os.path.dirname(os.path.abspath(__file__)), os.getcwd()]
    for carpeta in carpetas:
        ruta = os.path.join(carpeta, RUTA_CUESTIONARIO)
        if os.path.exists(ruta):
            with open(ruta, encoding="utf-8-sig") as f:
                return f.read()
    return None

def orden_opciones(pregunta, semilla, mezclar):
    letras = list(pregunta["opciones"].keys())
    if mezclar:
        random.Random(f"{semilla}-{pregunta['n']}").shuffle(letras)
    return letras

def calificar(preguntas, respuestas, umbral):
    detalle, por_modulo = [], {}
    for p in preguntas:
        elegida = respuestas.get(p["n"])
        ok = elegida == p["correcta"]
        corto = p["modulo"].split(":")[0].strip()
        detalle.append({
            "n": p["n"], "modulo": corto, "enunciado": p["enunciado"],
            "elegida": elegida, "correcta": p["correcta"], "ok": ok,
            "texto_elegida": p["opciones"].get(elegida, "") if elegida else "",
            "texto_correcta": p["opciones"][p["correcta"]],
        })
        mod = por_modulo.setdefault(corto, {"correctas": 0, "total": 0})
        mod["total"] += 1
        mod["correctas"] += 1 if ok else 0
    for mod in por_modulo.values():
        mod["pct"] = round(100 * mod["correctas"] / mod["total"], 1)
    total = len(preguntas)
    correctas = sum(1 for d in detalle if d["ok"])
    pct = round(100 * correctas / total, 1) if total else 0.0
    return {
        "correctas": correctas, "total": total, "pct": pct, "umbral": umbral,
        "aprobado": pct >= umbral,
        "sin_responder": sum(1 for d in detalle if d["elegida"] is None),
        "por_modulo": por_modulo, "detalle": detalle,
    }

def resultados_a_csv(res):
    filas = []
    for d in res["detalle"]:
        if d["elegida"] is None:
            estado = "Sin responder"
        else:
            estado = "Correcta" if d["ok"] else "Incorrecta"
        filas.append({
            "Pregunta": d["n"], "Módulo": d["modulo"], "Enunciado": d["enunciado"],
            "Tu respuesta": d["texto_elegida"], "Respuesta correcta": d["texto_correcta"],
            "Resultado": estado,
        })
    return pd.DataFrame(filas).to_csv(index=False).encode("utf-8-sig")

# ==========================================
# 2. INICIALIZACIÓN DE ESTADO
# ==========================================
if 'primary_color' not in st.session_state:
    st.session_state.primary_color = "#39A900"  # Verde SENA por defecto

if 'theme_mode' not in st.session_state:
    st.session_state.theme_mode = "Claro"

if 'processes' not in st.session_state:
    st.session_state.processes = [
        {
            "id": 1,
            "nombre": "Direccionamiento Estratégico",
            "tipo": "Estratégico",
            "lider": "Dirección General",
            "entradas": "Planes gubernamentales, Diagnósticos sectoriales",
            "actividades": "Planificación institucional, Asignación de recursos, Definición de políticas",
            "salidas": "Plan de Acción Anual, Objetivos Estratégicos",
            "recursos": "Equipo Directivo, Software de BI",
            "controles": "Revisiones trimestrales de dirección",
            "eficacia": 95,
            "eficiencia": 90,
            "efectividad": 92.5
        },
        {
            "id": 2,
            "nombre": "Diseño y Desarrollo Curricular",
            "tipo": "Misional",
            "lider": "Dirección de Formación",
            "entradas": "Necesidades del sector productivo, Normas de competencia",
            "actividades": "Elaboración de programas, Diseño de guías de aprendizaje",
            "salidas": "Programas de Formación Titulada y Complementaria",
            "recursos": "Diseñadores curriculares, Expertos temáticos",
            "controles": "Comités técnicos de centro",
            "eficacia": 88,
            "eficiencia": 85,
            "efectividad": 86.5
        },
        {
            "id": 3,
            "nombre": "Ejecución de la Formación Profesional",
            "tipo": "Misional",
            "lider": "Subdirección de Centro",
            "entradas": "Aspirantes matriculados, Guías de aprendizaje",
            "actividades": "Impartición de clases, Prácticas en taller, Evaluación",
            "salidas": "Aprendices certificados, Competencias desarrolladas",
            "recursos": "Instructores, Ambientes de aprendizaje, Materiales",
            "controles": "Seguimiento a la etapa lectiva y productiva",
            "eficacia": 92,
            "eficiencia": 88,
            "efectividad": 90.0
        },
        {
            "id": 4,
            "nombre": "Gestión de Compras y Suministros",
            "tipo": "De Apoyo",
            "lider": "Coordinación Administrativa",
            "entradas": "Solicitudes de contratación, Plan de compras",
            "actividades": "Licitación, Contratación, Recepción de bienes",
            "salidas": "Materiales e insumos entregados a centros",
            "recursos": "Plataforma SECOP, Presupuesto",
            "controles": "Auditoría de contratos, Verificación de inventario",
            "eficacia": 78,
            "eficiencia": 72,
            "efectividad": 75.0
        },
        {
            "id": 5,
            "nombre": "Evaluación y Auditoría Interna",
            "tipo": "De Evaluación",
            "lider": "Oficina de Control Interno",
            "entradas": "Plan anual de auditoría, Registros operacionales",
            "actividades": "Auditorías de calidad, Evaluación de riesgos",
            "salidas": "Informes de hallazgos, Planes de mejoramiento",
            "recursos": "Equipo auditor certificado",
            "controles": "Norma ISO 9001 / MECI",
            "eficacia": 90,
            "eficiencia": 94,
            "efectividad": 92.0
        }
    ]

if 'phva_tasks' not in st.session_state:
    st.session_state.phva_tasks = [
        {"fase": "Planear", "tarea": "Definir Objetivos de Calidad 2026", "estado": "Completado"},
        {"fase": "Planear", "tarea": "Matriz de Riesgos operacionales", "estado": "En Proceso"},
        {"fase": "Hacer", "tarea": "Ejecutar capacitaciones en procesos", "estado": "Completado"},
        {"fase": "Hacer", "tarea": "Actualizar fichas de caracterización", "estado": "En Proceso"},
        {"fase": "Verificar", "tarea": "Auditoría interna ciclo I", "estado": "Completado"},
        {"fase": "Verificar", "tarea": "Medición de indicadores del Q3", "estado": "Pendiente"},
        {"fase": "Actuar", "tarea": "Cierre de acciones correctivas de compras", "estado": "Pendiente"},
        {"fase": "Actuar", "tarea": "Estandarización de lecciones aprendidas", "estado": "En Proceso"}
    ]

if 'matrix' not in st.session_state:
    st.session_state.matrix = [
        [0, 1, 1, 1, 1],
        [0, 0, 1, 0, 1],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 0, 1],
        [1, 1, 1, 1, 0]
    ]

if 'quiz_attempt' not in st.session_state:
    st.session_state.quiz_attempt = 1
    st.session_state.quiz_seed = random.randint(1, 10**6)
    st.session_state.quiz_submitted = False
    st.session_state.quiz_subset = None
    st.session_state.quiz_result = None
    st.session_state.quiz_last = None
    st.session_state.quiz_history = []

# (Continuación del script completo de Streamlit)
print("Script listo para ejecutar con: streamlit run app.py")
`;
