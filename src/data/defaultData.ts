import { Process, PHVATask, QuizQuestion } from '../types';

export const DEFAULT_PROCESSES: Process[] = [
  {
    id: 1,
    nombre: 'Direccionamiento Estratégico',
    tipo: 'Estratégico',
    lider: 'Dirección General',
    entradas: 'Planes gubernamentales, Diagnósticos sectoriales',
    actividades: 'Planificación institucional, Asignación de recursos, Definición de políticas',
    salidas: 'Plan de Acción Anual, Objetivos Estratégicos',
    recursos: 'Equipo Directivo, Software de BI',
    controles: 'Revisiones trimestrales de dirección',
    eficacia: 95,
    eficiencia: 90,
    efectividad: 92.5
  },
  {
    id: 2,
    nombre: 'Diseño y Desarrollo Curricular',
    tipo: 'Misional',
    lider: 'Dirección de Formación',
    entradas: 'Necesidades del sector productivo, Normas de competencia',
    actividades: 'Elaboración de programas, Diseño de guías de aprendizaje',
    salidas: 'Programas de Formación Titulada y Complementaria',
    recursos: 'Diseñadores curriculares, Expertos temáticos',
    controles: 'Comités técnicos de centro',
    eficacia: 88,
    eficiencia: 85,
    efectividad: 86.5
  },
  {
    id: 3,
    nombre: 'Ejecución de la Formación Profesional',
    tipo: 'Misional',
    lider: 'Subdirección de Centro',
    entradas: 'Aspirantes matriculados, Guías de aprendizaje',
    actividades: 'Impartición de clases, Prácticas en taller, Evaluación',
    salidas: 'Aprendices certificados, Competencias desarrolladas',
    recursos: 'Instructores, Ambientes de aprendizaje, Materiales',
    controles: 'Seguimiento a la etapa lectiva y productiva',
    eficacia: 92,
    eficiencia: 88,
    efectividad: 90.0
  },
  {
    id: 4,
    nombre: 'Gestión de Compras y Suministros',
    tipo: 'De Apoyo',
    lider: 'Coordinación Administrativa',
    entradas: 'Solicitudes de contratación, Plan de compras',
    actividades: 'Licitación, Contratación, Recepción de bienes',
    salidas: 'Materiales e insumos entregados a centros',
    recursos: 'Plataforma SECOP, Presupuesto',
    controles: 'Auditoría de contratos, Verificación de inventario',
    eficacia: 78,
    eficiencia: 72,
    efectividad: 75.0
  },
  {
    id: 5,
    nombre: 'Evaluación y Auditoría Interna',
    tipo: 'De Evaluación',
    lider: 'Oficina de Control Interno',
    entradas: 'Plan anual de auditoría, Registros operacionales',
    actividades: 'Auditorías de calidad, Evaluación de riesgos',
    salidas: 'Informes de hallazgos, Planes de mejoramiento',
    recursos: 'Equipo auditor certificado',
    controles: 'Norma ISO 9001 / MECI',
    eficacia: 90,
    eficiencia: 94,
    efectividad: 92.0
  }
];

export const DEFAULT_PHVA_TASKS: PHVATask[] = [
  { id: '1', fase: 'Planear', tarea: 'Definir Objetivos de Calidad 2026', estado: 'Completado' },
  { id: '2', fase: 'Planear', tarea: 'Matriz de Riesgos operacionales', estado: 'En Proceso' },
  { id: '3', fase: 'Hacer', tarea: 'Ejecutar capacitaciones en procesos', estado: 'Completado' },
  { id: '4', fase: 'Hacer', tarea: 'Actualizar fichas de caracterización', estado: 'En Proceso' },
  { id: '5', fase: 'Verificar', tarea: 'Auditoría interna ciclo I', estado: 'Completado' },
  { id: '6', fase: 'Verificar', tarea: 'Medición de indicadores del Q3', estado: 'Pendiente' },
  { id: '7', fase: 'Actuar', tarea: 'Cierre de acciones correctivas de compras', estado: 'Pendiente' },
  { id: '8', fase: 'Actuar', tarea: 'Estandarización de lecciones aprendidas', estado: 'En Proceso' }
];

export const DEFAULT_MATRIX: number[][] = [
  [0, 1, 1, 1, 1],
  [0, 0, 1, 0, 1],
  [0, 0, 0, 0, 1],
  [0, 1, 1, 0, 1],
  [1, 1, 1, 1, 0]
];

export const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    n: 1,
    modulo: 'Módulo 1: Fundamentos de la Gestión por Procesos',
    enunciado: '¿Cuál es la definición formal de un "Proceso" según la norma ISO 9001 y el marco del SENA?',
    opciones: {
      A: 'Un departamento formal dentro del organigrama con jerarquía definida y personal a cargo.',
      B: 'Un conjunto de actividades mutuamente relacionadas o que interactúan, las cuales transforman elementos de entrada en resultados (salidas).',
      C: 'Un documento estático que contiene los procedimientos disciplinarios de la organización.',
      D: 'Una tarea aislada ejecutada de forma esporádica por el personal directivo.'
    },
    correcta: 'B',
    justificacion: 'La norma ISO 9000/9001 y el Anexo 1 definen el proceso como el conjunto de actividades interrelacionadas que convierten insumos/entradas en salidas o resultados con valor agregado.'
  },
  {
    n: 2,
    modulo: 'Módulo 1: Fundamentos de la Gestión por Procesos',
    enunciado: '¿Cuál es la diferencia principal entre una gestión funcional (por departamentos) y una gestión por procesos?',
    opciones: {
      A: 'La gestión funcional se orienta al cliente externo, mientras que la de procesos solo atiende al jefe inmediato.',
      B: 'La gestión por procesos rompe los silos departamentales enfocándose en la cadena de valor horizontal y la satisfacción del cliente/aprendiz.',
      C: 'La gestión funcional no requiere jefes ni presupuestos.',
      D: 'No existe ninguna diferencia práctica entre ambos enfoques.'
    },
    correcta: 'B',
    justificacion: 'El enfoque por procesos supera la fragmentación de silos de la gestión tradicional por departamentos, integrando el flujo de trabajo hacia el usuario final.'
  },
  {
    n: 3,
    modulo: 'Módulo 2: Clasificación y Tipología de Procesos',
    enunciado: 'Los procesos que definen las políticas institucionales, los objetivos de largo plazo y el rumbo organizacional se clasifican como:',
    opciones: {
      A: 'Procesos Misionales o Clave',
      B: 'Procesos de Apoyo o Soporte',
      C: 'Procesos Estratégicos o Directivos',
      D: 'Procesos de Evaluación y Control'
    },
    correcta: 'C',
    justificacion: 'Los procesos estratégicos orientan a toda la entidad mediante la fijación de directrices, planeación institucional y asignación global de recursos.'
  },
  {
    n: 4,
    modulo: 'Módulo 2: Clasificación y Tipología de Procesos',
    enunciado: 'En el SENA, ¿cuál de los siguientes procesos es típicamente de carácter "Misional"?',
    opciones: {
      A: 'Mantenimiento de infraestructura y aseo',
      B: 'Ejecución de la Formación Profesional Integral',
      C: 'Gestión Contable y Financiera',
      D: 'Auditoría de Control Interno'
    },
    correcta: 'B',
    justificacion: 'Los procesos misionales representan la razón de ser de la entidad; para el SENA, formar integralmente a los aprendices es su misión central.'
  },
  {
    n: 5,
    modulo: 'Módulo 2: Clasificación y Tipología de Procesos',
    enunciado: '¿Cuál es la función primordial de los "Procesos de Apoyo" en una organización?',
    opciones: {
      A: 'Proveer los recursos humanos, tecnológicos, físicos y financieros requeridos para la operación de los demás procesos.',
      B: 'Tomar las decisiones de despido de la alta gerencia.',
      C: 'Atender directamente en ventanilla al beneficiario final sin interactuar con los procesos misionales.',
      D: 'Realizar únicamente las auditorías de ley ante entes externos.'
    },
    correcta: 'A',
    justificacion: 'Los procesos de apoyo suministran soporte operativo, logístico y de recursos para que los procesos misionales y estratégicos funcionen con continuidad.'
  },
  {
    n: 6,
    modulo: 'Módulo 3: Caracterización y Modelo SIPOC',
    enunciado: 'En la ficha de caracterización de un proceso, ¿qué representan las siglas de la herramienta SIPOC?',
    opciones: {
      A: 'Sistemas, Indicadores, Presupuestos, Operaciones, Clientes',
      B: 'Suppliers (Proveedores), Inputs (Entradas), Process (Proceso/Actividades), Outputs (Salidas), Customers (Clientes)',
      C: 'Sindicato, Inspectores, Planes, Obras, Calidad',
      D: 'Seguimiento, Innovación, Producto, Organización, Control'
    },
    correcta: 'B',
    justificacion: 'SIPOC corresponde al acrónimo de Proveedor, Entrada, Proceso, Salida y Cliente, base de la caracterización integral.'
  },
  {
    n: 7,
    modulo: 'Módulo 3: Caracterización y Modelo SIPOC',
    enunciado: '¿Por qué es indispensable identificar con precisión los "Controles" en la ficha de caracterización?',
    opciones: {
      A: 'Para sancionar inmediatamente a los funcionarios ante cualquier mínimo retraso.',
      B: 'Para verificar el cumplimiento de especificaciones, mitigar riesgos operacionales y asegurar la calidad del producto o servicio.',
      C: 'Para eliminar la necesidad de registrar entradas y salidas.',
      D: 'Porque la ley prohíbe tener procesos sin cámaras de vigilancia.'
    },
    correcta: 'B',
    justificacion: 'Los controles garantizan que las actividades se apeguen a criterios de calidad, normatividad y mitigación de riesgos operacionales.'
  },
  {
    n: 8,
    modulo: 'Módulo 4: Ciclo PHVA y Mejora Continua',
    enunciado: 'En el ciclo PHVA (Deming), la fase de "Planear" se enfoca en:',
    opciones: {
      A: 'Implementar las correcciones definitivas después de una quiebra financiera.',
      B: 'Establecer los objetivos, las metas, los recursos necesarios y los planes para lograrlos.',
      C: 'Medir únicamente las encuestas de clima laboral de fin de año.',
      D: 'Fabricar físicamente los productos en la línea de montaje.'
    },
    correcta: 'B',
    justificacion: 'Planear consiste en definir el horizonte, los objetivos, las metas numéricas y la metodología para alcanzarlos.'
  },
  {
    n: 9,
    modulo: 'Módulo 4: Ciclo PHVA y Mejora Continua',
    enunciado: 'Cuando durante una auditoría se detecta una desviación y el equipo formaliza un plan de acción correctiva y estandarización, ¿en qué fase del PHVA se sitúa?',
    opciones: {
      A: 'Planear',
      B: 'Hacer',
      C: 'Verificar',
      D: 'Actuar'
    },
    correcta: 'D',
    justificacion: 'La fase "Actuar" consiste en tomar decisiones para corregir desviaciones, estandarizar buenas prácticas y cerrar ciclos de mejora continua.'
  },
  {
    n: 10,
    modulo: 'Módulo 4: Ciclo PHVA y Mejora Continua',
    enunciado: '¿Cuál es el riesgo de ejecutar la fase "Hacer" sin haber completado un adecuado "Planear"?',
    opciones: {
      A: 'Que el ciclo se acelere y mejore sin esfuerzo.',
      B: 'Desperdicio de recursos, retrabajos, falta de foco en los objetivos y confusión en los roles del equipo.',
      C: 'Que los auditores no puedan solicitar vacaciones.',
      D: 'Ninguno, improvisar siempre genera mejores resultados que planificar.'
    },
    correcta: 'B',
    justificacion: 'Actuar sin planificar conduce a la dispersión de esfuerzos, gasto innecesario de presupuesto y descoordinación operativa.'
  },
  {
    n: 11,
    modulo: 'Módulo 5: Tríada de Desempeño',
    enunciado: 'El indicador que mide la relación porcentual entre los resultados obtenidos y las metas planificadas se denomina:',
    opciones: {
      A: 'Eficiencia',
      B: 'Eficacia',
      C: 'Efectividad',
      D: 'Rentabilidad pasiva'
    },
    correcta: 'B',
    justificacion: 'La Eficacia mide exclusivamente el grado de cumplimiento de metas y objetivos previstos, sin considerar el costo o insumo utilizado.'
  },
  {
    n: 12,
    modulo: 'Módulo 5: Tríada de Desempeño',
    enunciado: 'Un proceso que certificó a 1.000 aprendices (100% de la meta) pero gastó un 80% más del presupuesto asignado y el doble de tiempo fue:',
    opciones: {
      A: 'Eficaz pero ineficiente',
      B: 'Eficiente pero ineficaz',
      C: 'Totalmente efectivo en todo sentido',
      D: 'Ni eficaz ni oportuno'
    },
    correcta: 'A',
    justificacion: 'Cumplió la meta (fue eficaz), pero consumió un exceso de recursos económicos y temporales (baja eficiencia).'
  },
  {
    n: 13,
    modulo: 'Módulo 5: Tríada de Desempeño',
    enunciado: '¿Cómo se define y conceptualiza la "Efectividad" en la gestión pública y de calidad?',
    opciones: {
      A: 'La suma aritmética de las multas de la entidad.',
      B: 'El impacto integral que conjuga el logro de metas (eficacia) con el uso racional y óptimo de los recursos disponibles (eficiencia).',
      C: 'El tiempo transcurrido entre la radicación de un oficio y su archivo.',
      D: 'El número de reuniones de comité celebradas al mes.'
    },
    correcta: 'B',
    justificacion: 'La Efectividad representa la ponderación sintética de la eficacia y la eficiencia, reflejando el impacto real y sostenible.'
  },
  {
    n: 14,
    modulo: 'Módulo 1: Fundamentos de la Gestión por Procesos',
    enunciado: '¿Qué se entiende por "Silos Operativos" y por qué la gestión por procesos busca erradicarlos?',
    opciones: {
      A: 'Tanques de almacenamiento de granos en los centros agropecuarios.',
      B: 'Barreras de comunicación y aislamiento entre dependencias que frenan el flujo de valor y provocan demoras y reprocesos.',
      C: 'Archivos físicos protegidos contra incendios.',
      D: 'Mecanismos de cifrado de contraseñas institucionales.'
    },
    correcta: 'B',
    justificacion: 'Los silos organizacionales provocan que cada área trabaje de forma insular, desconociendo el impacto de sus entregas en los procesos receptores.'
  },
  {
    n: 15,
    modulo: 'Módulo 3: Caracterización y Modelo SIPOC',
    enunciado: 'Cuando una salida de un proceso de Compras es recibida por el proceso de Formación, ¿qué rol asume el proceso de Formación en esa relación?',
    opciones: {
      A: 'Proveedor externo',
      B: 'Cliente interno',
      C: 'Ente rector sancionatorio',
      D: 'Proceso ajeno sin vínculo'
    },
    correcta: 'B',
    justificacion: 'Dentro de la cadena de valor interna, el proceso que recibe insumos o productos de otro proceso actúa como su "Cliente interno".'
  }
];

export const RAW_MD_CUESTIONARIO = `## Cuestionario Evaluativo de Gestión por Procesos (SENA - Anexo 1)

### Módulo 1: Fundamentos de la Gestión por Procesos
#### 1. ¿Cuál es la definición formal de un "Proceso" según la norma ISO 9001 y el marco del SENA?
- **A)** Un departamento formal dentro del organigrama con jerarquía definida y personal a cargo.
- **B)** Un conjunto de actividades mutuamente relacionadas o que interactúan, las cuales transforman elementos de entrada en resultados (salidas).
- **C)** Un documento estático que contiene los procedimientos disciplinarios de la organización.
- **D)** Una tarea aislada ejecutada de forma esporádica por el personal directivo.

#### 2. ¿Cuál es la diferencia principal entre una gestión funcional (por departamentos) y una gestión por procesos?
- **A)** La gestión funcional se orienta al cliente externo, mientras que la de procesos solo atiende al jefe inmediato.
- **B)** La gestión por procesos rompe los silos departamentales enfocándose en la cadena de valor horizontal y la satisfacción del cliente/aprendiz.
- **C)** La gestión funcional no requiere jefes ni presupuestos.
- **D)** No existe ninguna diferencia práctica entre ambos enfoques.

### Módulo 2: Clasificación y Tipología de Procesos
#### 3. Los procesos que definen las políticas institucionales, los objetivos de largo plazo y el rumbo organizacional se clasifican como:
- **A)** Procesos Misionales o Clave
- **B)** Procesos de Apoyo o Soporte
- **C)** Procesos Estratégicos o Directivos
- **D)** Procesos de Evaluación y Control

#### 4. En el SENA, ¿cuál de los siguientes procesos es típicamente de carácter "Misional"?
- **A)** Mantenimiento de infraestructura y aseo
- **B)** Ejecución de la Formación Profesional Integral
- **C)** Gestión Contable y Financiera
- **D)** Auditoría de Control Interno

#### 5. ¿Cuál es la función primordial de los "Procesos de Apoyo" en una organización?
- **A)** Proveer los recursos humanos, tecnológicos, físicos y financieros requeridos para la operación de los demás procesos.
- **B)** Tomar las decisiones de despido de la alta gerencia.
- **C)** Atender directamente en ventanilla al beneficiario final sin interactuar con los procesos misionales.
- **D)** Realizar únicamente las auditorías de ley ante entes externos.

### Módulo 3: Caracterización y Modelo SIPOC
#### 6. En la ficha de caracterización de un proceso, ¿qué representan las siglas de la herramienta SIPOC?
- **A)** Sistemas, Indicadores, Presupuestos, Operaciones, Clientes
- **B)** Suppliers (Proveedores), Inputs (Entradas), Process (Proceso/Actividades), Outputs (Salidas), Customers (Clientes)
- **C)** Sindicato, Inspectores, Planes, Obras, Calidad
- **D)** Seguimiento, Innovación, Producto, Organización, Control

#### 7. ¿Por qué es indispensable identificar con precisión los "Controles" en la ficha de caracterización?
- **A)** Para sancionar inmediatamente a los funcionarios ante cualquier mínimo retraso.
- **B)** Para verificar el cumplimiento de especificaciones, mitigar riesgos operacionales y asegurar la calidad del producto o servicio.
- **C)** Para eliminar la necesidad de registrar entradas y salidas.
- **D)** Porque la ley prohíbe tener procesos sin cámaras de vigilancia.

### Módulo 4: Ciclo PHVA y Mejora Continua
#### 8. En el ciclo PHVA (Deming), la fase de "Planear" se enfoca en:
- **A)** Implementar las correcciones definitivas después de una quiebra financiera.
- **B)** Establecer los objetivos, las metas, los recursos necesarios y los planes para lograrlos.
- **C)** Medir únicamente las encuestas de clima laboral de fin de año.
- **D)** Fabricar físicamente los productos en la línea de montaje.

#### 9. Cuando durante una auditoría se detecta una desviación y el equipo formaliza un plan de acción correctiva y estandarización, ¿en qué fase del PHVA se sitúa?
- **A)** Planear
- **B)** Hacer
- **C)** Verificar
- **D)** Actuar

#### 10. ¿Cuál es el riesgo de ejecutar la fase "Hacer" sin haber completado un adecuado "Planear"?
- **A)** Que el ciclo se acelere y mejore sin esfuerzo.
- **B)** Desperdicio de recursos, retrabajos, falta de foco en los objetivos y confusión en los roles del equipo.
- **C)** Que los auditores no puedan solicitar vacaciones.
- **D)** Ninguno, improvisar siempre genera mejores resultados que planificar.

### Módulo 5: Tríada de Desempeño
#### 11. El indicador que mide la relación porcentual entre los resultados obtenidos y las metas planificadas se denomina:
- **A)** Eficiencia
- **B)** Eficacia
- **C)** Efectividad
- **D)** Rentabilidad pasiva

#### 12. Un proceso que certificó a 1.000 aprendices (100% de la meta) pero gastó un 80% más del presupuesto asignado y el doble de tiempo fue:
- **A)** Eficaz pero ineficiente
- **B)** Eficiente pero ineficaz
- **C)** Totalmente efectivo en todo sentido
- **D)** Ni eficaz ni oportuno

#### 13. ¿Cómo se define y conceptualiza la "Efectividad" en la gestión pública y de calidad?
- **A)** La suma aritmética de las multas de la entidad.
- **B)** El impacto integral que conjuga el logro de metas (eficacia) con el uso racional y óptimo de los recursos disponibles (eficiencia).
- **C)** El tiempo transcurrido entre la radicación de un oficio y su archivo.
- **D)** El número de reuniones de comité celebradas al mes.

### Módulo 1: Fundamentos de la Gestión por Procesos
#### 14. ¿Qué se entiende por "Silos Operativos" y por qué la gestión por procesos busca erradicarlos?
- **A)** Tanques de almacenamiento de granos en los centros agropecuarios.
- **B)** Barreras de comunicación y aislamiento entre dependencias que frenan el flujo de valor y provocan demoras y reprocesos.
- **C)** Archivos físicos protegidos contra incendios.
- **D)** Mecanismos de cifrado de contraseñas institucionales.

### Módulo 3: Caracterización y Modelo SIPOC
#### 15. Cuando una salida de un proceso de Compras es recibida por el proceso de Formación, ¿qué rol asume el proceso de Formación en esa relación?
- **A)** Proveedor externo
- **B)** Cliente interno
- **C)** Ente rector sancionatorio
- **D)** Proceso ajeno sin vínculo

## Clave de Respuestas
1. **B — Justificación**: La norma ISO 9000/9001 y el Anexo 1 definen el proceso como el conjunto de actividades interrelacionadas que convierten insumos/entradas en salidas o resultados con valor agregado.
2. **B — Justificación**: El enfoque por procesos supera la fragmentación de silos de la gestión tradicional por departamentos, integrando el flujo de trabajo hacia el usuario final.
3. **C — Justificación**: Los procesos estratégicos orientan a toda la entidad mediante la fijación de directrices, planeación institucional y asignación global de recursos.
4. **B — Justificación**: Los procesos misionales representan la razón de ser de la entidad; para el SENA, formar integralmente a los aprendices es su misión central.
5. **A — Justificación**: Los procesos de apoyo suministran soporte operativo, logístico y de recursos para que los procesos misionales y estratégicos funcionen con continuidad.
6. **B — Justificación**: SIPOC corresponde al acrónimo de Proveedor, Entrada, Proceso, Salida y Cliente, base de la caracterización integral.
7. **B — Justificación**: Los controles garantizan que las actividades se apeguen a criterios de calidad, normatividad y mitigación de riesgos operacionales.
8. **B — Justificación**: Planear consiste en definir el horizonte, los objetivos, las metas numéricas y la metodología para alcanzarlos.
9. **D — Justificación**: La fase "Actuar" consiste en tomar decisiones para corregir desviaciones, estandarizar buenas prácticas y cerrar ciclos de mejora continua.
10. **B — Justificación**: Actuar sin planificar conduce a la dispersión de esfuerzos, gasto innecesario de presupuesto y descoordinación operativa.
11. **B — Justificación**: La Eficacia mide exclusivamente el grado de cumplimiento de metas y objetivos previstos, sin considerar el costo o insumo utilizado.
12. **A — Justificación**: Cumplió la meta (fue eficaz), pero consumió un exceso de recursos económicos y temporales (baja eficiencia).
13. **B — Justificación**: La Efectividad representa la ponderación sintética de la eficacia y la eficiencia, reflejando el impacto real y sostenible.
14. **B — Justificación**: Los silos organizacionales provocan que cada área trabaje de forma insular, desconociendo el impacto de sus entregas en los procesos receptores.
15. **B — Justificación**: Dentro de la cadena de valor interna, el proceso que recibe insumos o productos de otro proceso actúa como su "Cliente interno".
`;
