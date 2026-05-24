const fs = require('fs');
const path = require('path');

const glossaryData = [
  { term: 'AELEC', definition: 'Asociación Española de Empresas de Electricidad. Agrupa a las principales empresas del sector eléctrico español. Cofinanció el informe IIT-ICAI.' },
  { term: 'Área de Control', definition: 'Zona geográfica bajo responsabilidad de un Operador del Sistema (OS).' },
  { term: 'Colapso Q-V', definition: 'Inestabilidad de tensión en el plano potencia reactiva–voltaje. Mecanismo dominante del 28A (no colapso de frecuencia).' },
  { term: 'CSN', definition: 'Consejo de Seguridad Nacional de España. Publicó el informe oficial del Gobierno junto con REE.' },
  { term: 'Curva de capacidad reactiva (Capability Curve)', definition: 'Diagrama P-Q que delimita el espacio operativo de un generador en el plano potencia activa-reactiva.' },
  { term: 'Damping ratio', definition: 'El ratio de amortiguamiento (o amortiguamiento relativo) es un indicador adimensional que cuantifica la rapidez con la que una oscilación se atenúa tras una perturbación. Valores próximos al 5% se consideran un margen de seguridad operativo razonable en el sistema síncrono europeo; valores cercanos al 0% indican oscilaciones sostenidas, y valores negativos implican un crecimiento de la amplitud y, por tanto, un riesgo de inestabilidad.' },
  { term: 'EAS (ENTSO-E Awareness System)', definition: 'ENTSO-E Awareness System. Sistema de Conciencia Situacional de ENTSO-E que monitorea la estabilidad de la red europea en tiempo real.' },
  { term: 'Efecto Ferranti', definition: 'El Efecto Ferranti describe el fenómeno por el cual, en una línea de transporte de alta tensión operada con poca o ninguna carga, la tensión en el extremo receptor supera a la del extremo emisor. La causa es la admitancia capacitiva distribuida de la línea: con flujo de potencia activa reducido, la carga capacitiva no se compensa con el consumo inductivo de las cargas, y el resultado es una sobretensión proporcional a la longitud de la línea. Es un fenómeno especialmente relevante al energizar líneas de 400 kV en vacío.' },
  { term: 'ENTSO-E', definition: 'La Red Europea de Gestores de Redes de Transporte de Electricidad (ENTSO-E, por sus siglas en inglés: European Network of Transmission System Operators for Electricity) es la asociación que agrupa a 40 operadores técnicos de red (TSO) pertenecientes a 36 países europeos. Su mandato principal, derivado de los sucesivos paquetes legislativos de la Unión Europea, es garantizar la seguridad y fiabilidad de la operación del sistema interconectado europeo, facilitar la integración de energías renovables y establecer los códigos de red comunes (Network Codes) de obligado cumplimiento para todos los Estados miembros.' },
  { term: 'Estabilidad de tensión', definition: 'Capacidad del sistema para mantener tensiones dentro de límites operacionales tras perturbaciones. Requiere balance entre demanda y aportación de potencia reactiva.' },
  { term: 'Frecuencia nominal', definition: '50 Hz en el sistema europeo continental. El P.O. 1.1 define los límites de operación: f ∈ [49,0; 51,0] Hz en operación normal.' },
  { term: 'IGBT (Insulated Gate Bipolar Transistor)', definition: 'Semiconductor de potencia utilizado en inversores. Control de compuerta aislada permite conmutación rápida y eficiente.' },
  { term: 'Mallado', definition: 'Maniobra operativa de reconfiguración topológica que conecta subestaciones previamente separadas mediante líneas de 400 kV. En el 28A activó el efecto Ferranti.' },
  { term: 'Oscilaciones electromecánicas', definition: 'Modos oscilatorios asociados a la interacción entre generadores síncronos. Típicamente 0,1–2 Hz. En el 28A se detectó oscilación de 0,6 Hz.' },
  { term: 'Sincronismo', definition: 'Condición de operación donde todos los generadores rotan a la misma frecuencia angular. Pérdida de sincronismo = desconexión cascada.' },
  { term: 'SO GL (System Operation Guidelines)', definition: 'Directrices de Operación del Sistema emitidas por ENTSO-E. Establecen márgenes operacionales mínimos para estabilidad.' },
  { term: 'Impedancia de transferencia', definition: 'En sistemas de potencia, la impedancia de transferencia entre dos nudos representa la oposición eléctrica al flujo de potencia entre ellos. Una alta impedancia de transferencia implica una red débilmente acoplada, en la que pequeñas variaciones de potencia inyectada pueden producir grandes variaciones de tensión y de ángulo de fase, deteriorando la firmeza del sistema.' },
  { term: 'Oscilaciones forzadas y naturales', definition: 'Una oscilación es forzada cuando es inducida por una perturbación externa periódica —típicamente un fallo o un comportamiento anómalo en el lazo de control de un equipo concreto—, frente a las oscilaciones naturales o modos propios del sistema, cuya frecuencia viene determinada por la propia inercia y por las constantes electromecánicas de las máquinas síncronas conectadas.' },
  { term: 'Curvas de estabilidad de tensión Q-V', definition: 'Las curvas Q-V representan, para un nudo dado de la red, la relación entre la potencia reactiva inyectada o absorbida y la tensión resultante. La distancia entre el punto de operación y el punto de mínimo de la curva (nose point) define el margen de estabilidad de tensión: cuanto menor sea ese margen, mayor será el riesgo de un colapso de tensión ante perturbaciones adicionales.' },
  { term: 'Estabilizadores del Sistema de Potencia (PSS)', definition: 'Los PSS (Power System Stabilizers) son lazos de control adicionales instalados en el sistema de excitación de los grandes generadores síncronos que añaden amortiguamiento eléctrico a las oscilaciones electromecánicas del sistema.' },
  { term: 'Cambiadores de Tomas en Carga (OLTC)', definition: 'Un Cambiador de Tomas en Carga (OLTC, On-Load Tap Changer) es un mecanismo electromecánico instalado en los grandes transformadores de potencia que ajusta la relación de transformación —y, por tanto, la tensión de salida del secundario— sin interrumpir el flujo de energía. Regula la tensión ante variaciones lentas de carga, típicamente en un rango de ±10% con escalones discretos. Su tiempo característico de respuesta, condicionado por la inercia mecánica del motor y los engranajes, es del orden de varios segundos por escalón.' },
  { term: 'Sistema en por unidad (p.u.)', definition: 'El sistema por unidad (p.u.) es una convención de normalización utilizada en ingeniería eléctrica de potencia que expresa las magnitudes del sistema (tensión, corriente, potencia, impedancia) como cocientes adimensionales respecto a valores base de referencia.' },
  { term: 'Bucle de retroalimentación (Feedback loop)', definition: 'Un feedback loop positivo, o bucle de retroalimentación positiva, describe un mecanismo en el que una perturbación inicial provoca una respuesta del sistema que, en lugar de oponerse al desvío, lo amplifica. En el contexto del incidente, cada disparo de planta IBR redujo la absorción de reactiva, lo que elevó la tensión, lo que a su vez provocó nuevos disparos: la respuesta del sistema reforzaba la perturbación en lugar de amortiguarla.' },
  { term: 'Tasa de Cambio de Frecuencia (RoCoF)', definition: 'La Rate of Change of Frequency (RoCoF, tasa de cambio de frecuencia) cuantifica la velocidad de variación de la frecuencia del sistema ante una perturbación, expresada típicamente en Hz/s. Es el parámetro dinámico más crítico para la estabilidad transitoria: un RoCoF elevado reduce el tiempo disponible para que los sistemas de regulación actúen, acelerando la cascada de desconexiones de protecciones.' },
  { term: 'Procedimiento de Operación 1.6 (P.O. 1.6)', definition: 'El Procedimiento de Operación 1.6 es el protocolo de emergencia del sistema eléctrico español que establece los planes de salvaguarda y reposición del suministro ante incidentes críticos. Dictamina las estrategias de fragmentación topológica de la red en islas eléctricas independientes, las rutas de energización preferentes y el protocolo de priorización de arranque de las instalaciones de generación para restaurar el sistema tras un cero de tensión parcial o total.' },
  { term: 'Arranque autónomo (Black Start)', definition: 'La capacidad de Black Start (arranque autónomo o arranque en negro) es el servicio de ajuste por el cual ciertas instalaciones de generación pueden arrancar y comenzar a inyectar energía a la red sin necesidad de recibir tensión eléctrica externa.' },
  { term: 'Potencia de cortocircuito (Ssc)', definition: 'La Potencia de Cortocircuito (Ssc) en un nudo es la magnitud instantánea de corriente que el sistema puede inyectar ante una falta de tensión. Define la rigidez eléctrica del nudo: un Ssc elevado permite que las protecciones de distancia operen correctamente, que las protecciones de sobrecorriente se coordinen selectivamente y que los inversores mantengan sincronismo de sus algoritmos de control.' },
  { term: 'Relés de comprobación de sincronismo (Synchro-check)', definition: 'El relé synchro-check (función 25 ANSI) es un dispositivo de protección empleado en las maniobras de acoplamiento de sistemas eléctricos separados (islas). Su función es supervisar continuamente que la tensión, la frecuencia y el ángulo de fase a ambos lados de un interruptor abierto se encuentran dentro de unos márgenes de tolerancia preestablecidos.' },
  { term: 'Centros de Coordinación Regional (RCC)', definition: 'Los Centros de Coordinación Regional (RCC, Regional Coordination Centres) son entidades supranacionales establecidas por la normativa europea para facilitar la cooperación operativa entre los distintos Gestores de Redes de Transporte (TSO).' },
  { term: 'Reserva de Restauración de Frecuencia Automática (aFRR)', definition: 'La aFRR (automatic Frequency Restoration Reserve), históricamente conocida como regulación secundaria, es un servicio de ajuste del sistema que se activa automáticamente tras una desviación de frecuencia. Está controlado directamente por el AGC (Automatic Generation Control) del Operador del Sistema y su objetivo es devolver progresivamente la frecuencia a su valor nominal (50 Hz) y restituir los flujos en las interconexiones a sus programas pactados.' },
  { term: 'Centro de Control de Energías Renovables (CECRE)', definition: 'El Centro de Control de Energías Renovables (CECRE) es la entidad operativa de REE responsable de la monitorización y despacho en tiempo real de los parques renovables y los sistemas de almacenamiento, así como de la ejecución de los algoritmos de control de tensión a través del sistema VOLTAIRE.' },
  { term: 'Criterio N-1', definition: 'El Criterio N-1 es la norma de seguridad fundamental en la operación y planificación de sistemas eléctricos de potencia. Establece que el sistema debe ser capaz de mantener los parámetros de tensión y frecuencia dentro de los límites operativos normativos tras la pérdida contingente de cualquier elemento único, sin provocar cortes de suministro en cascada ni daños en los equipos.' },
  { term: 'Régimen de Renovables, Cogeneración y Residuos (RCR)', definition: 'El Régimen de Renovables, Cogeneración y Residuos (RCR) es el marco regulatorio del sistema eléctrico español que agrupa a las instalaciones de producción de energía eléctrica a partir de fuentes descarbonizadas.' },
  { term: 'Procedimiento de Operación 7.4 (P.O. 7.4)', definition: 'El P.O. 7.4 es la normativa técnica del sistema eléctrico español que regula el servicio de ajuste de control de tensión en la red de transporte. Define las obligaciones de los generadores para absorber o inyectar potencia reactiva (Q) en función de las consignas enviadas por el Operador del Sistema.' },
  { term: 'Compensador Síncrono Estático (STATCOM)', definition: 'Un STATCOM (Static Synchronous Compensator) es un dispositivo de compensación activa de potencia reactiva basado en electrónica de potencia (inversores VSC). A diferencia de las reactancias o los bancos de condensadores mecánicos de conmutación discreta, un STATCOM inyecta o absorbe potencia reactiva de forma continua, dinámica y casi instantánea.' },
  { term: 'Network Code on Requirements for Generators (NC RfG)', definition: 'El Network Code on Requirements for Generators es el código de red europeo establecido por ENTSO-E que armoniza los requisitos técnicos obligatorios que deben cumplir las instalaciones de generación para conectarse a la red. Ahora en su versión 2.0, propuesta tras el colapso ibérico, introduce la obligatoriedad de capacidades grid-forming.' },
  { term: 'Control Grid-forming frente a Grid-following', definition: 'Este concepto define el paradigma de control de los inversores. Un inversor grid-following (seguidor de red) se sincroniza pasivamente con la tensión y frecuencia preexistentes, dependiendo de la red externa para operar. Por el contrario, un inversor grid-forming (formador de red) actúa como una fuente de tensión ideal tras una impedancia: establece activamente su propia onda de tensión y frecuencia, permitiendo sostener la red de forma autónoma.' },
  { term: 'Protecciones de pérdida de sincronismo (OST)', definition: 'Los relés de pérdida de sincronismo (OST, Out-of-Step Tripping) son esquemas de protección sistémica diseñados para detectar divergencias angulares severas entre áreas interconectadas (deslizamiento de polos). Cuando la diferencia de fase angular excede los límites de estabilidad electromecánica, los relés abren automáticamente las líneas de interconexión para evitar daños estructurales.' },
  { term: 'Crisis communication failure', definition: 'En gestión de emergencias, un crisis communication failure describe el fallo institucional al no ocupar de forma oportuna el espacio informativo con mensajes verificables tras un incidente grave. Según el Chaos Communication Model, si la institución responsable no emite un relato claro durante la ventana crítica inicial (1-6 horas), el vacío discursivo es ocupado por narrativas alternativas o no verificadas.' },
  { term: 'Infodemia', definition: 'Término popularizado por la OMS para describir la sobrepoblación del espacio informativo con contenidos no verificados, erróneos o falsos que se propagan rápidamente en situaciones de crisis.' },
  { term: 'Encuadre mediático (Framing) y Agenda-shifting', definition: 'El framing es el proceso por el cual los medios seleccionan y enfatizan ciertos elementos de un hecho para proponer una interpretación causal concreta. Relacionado con esto, el agenda-shifting ocurre cuando un evento disruptivo es instrumentalizado mediáticamente para desplazar la atención y reabrir debates políticos o estructurales preexistentes.' },
  { term: 'Vacuum filling (Relleno del vacío informativo)', definition: 'El vacuum filling es el proceso estructural e inevitable mediante el cual la incertidumbre colectiva ante un desastre genera una demanda de respuestas que, si no es satisfecha por las instituciones oficiales, es cubierta espontáneamente por fuentes no autorizadas.' },
  { term: 'Emergent norm theory', definition: 'La teoría de las normas emergentes (Turner y Killian) sostiene que, frente a las visiones del pánico masivo, los grupos en situaciones de disrupción desarrollan espontáneamente nuevas reglas de comportamiento social adaptativo.' },
  { term: 'Outrage communication (Comunicación de indignación)', definition: 'Basado en el modelo de Sandman (Risk = Hazard + Outrage), este concepto indica que la percepción pública de un riesgo depende más de factores emocionales (indignación, percepción de negligencia) que de la evaluación técnica del peligro real.' },
  { term: 'Coste Nivelado de la Energía (LCOE)', definition: 'El Coste Nivelado de la Energía (LCOE) es la métrica económica estándar que compara el coste unitario de producción entre distintas tecnologías a lo largo de su vida útil. Su principal limitación sistémica es que ignora el valor de los servicios ancilares aportados a la red.' },
  { term: 'Servicios Esenciales de Confiabilidad (ERS)', definition: 'Los Servicios Esenciales de Confiabilidad (ERS) agrupan los atributos físicos indispensables para la operación segura de la red, tales como la inercia, la potencia de cortocircuito, la respuesta rápida de frecuencia y el control dinámico de tensión.' },
  { term: 'BESS con inversores Grid-Forming (BESS-GFM)', definition: 'Los Sistemas de Almacenamiento en Baterías con Inversores Formadores de Red (BESS-GFM) combinan alta densidad electroquímica con electrónica de potencia capaz de operar como una fuente de tensión ideal y autónoma.' },
  { term: 'Fast Frequency Response (FFR)', definition: 'La Respuesta Rápida de Frecuencia (FFR) es un servicio de estabilización subcíclica, diseñado para sistemas de electrónica de potencia, que inyecta un bloque masivo de potencia activa en la ventana temporal crítica (típicamente inferior a 0,25 s) previa a la actuación de los reguladores mecánicos tradicionales.' },
  { term: 'Estrategia Brownfield', definition: 'En ingeniería de infraestructuras energéticas, la estrategia Brownfield consiste en la reconversión de instalaciones industriales existentes —como las centrales térmicas o nucleares clausuradas— para dotarlas de nuevas funciones sistémicas, como convertirlas en compensadores síncronos.' },
  { term: 'Programa DS3 de EirGrid', definition: 'El programa Delivering a Secure, Sustainable Electricity System (DS3) es el marco pionero de servicios ancilares de EirGrid (Irlanda), diseñado para operar el sistema insular con penetraciones renovables asíncronas de hasta el 75%.' },
  { term: 'Vehicle-to-Grid (V2G)', definition: 'La tecnología Vehicle-to-Grid (V2G) habilita la bidireccionalidad de las baterías de los vehículos eléctricos, permitiéndoles inyectar potencia activa y reactiva hacia la red.' },
  { term: 'Relés de Deslastre de Carga (UFLS)', definition: 'El Under-Frequency Load Shedding (UFLS, deslastre automático de carga por baja frecuencia) es el mecanismo de último recurso del sistema de defensa: cuando la frecuencia cae por debajo de umbrales predefinidos, los relés de UFLS desconectan cargas de forma automática para restaurar el equilibrio generación-demanda.' },
  { term: 'Inercia Sintética', definition: 'La inercia sintética (o inercia virtual) es un algoritmo de control implementado en inversores GFM que emula matemáticamente el comportamiento de la ecuación de oscilación de un rotor electromecánico. El algoritmo mide continuamente la derivada temporal de la frecuencia (df/dt) y ajusta la potencia inyectada de forma proporcional.' },
  { term: 'Compensadores Síncronos (SynCons)', definition: 'Los Compensadores Síncronos son máquinas rotativas síncronas operadas en vacío —sin turbina primaria— que aportan inercia rotacional genuina y capacidad de inyección de corrientes de falta de 300–400% de su valor nominal.' },
  { term: 'Curva de Pato (Duck Curve)', definition: 'La curva de pato describe el perfil diario de demanda neta de regulación en sistemas con alta penetración solar: una depresión profunda durante las horas centrales del día seguida de una rampa vespertina pronunciada.' },
  { term: 'Sistema VOLTAIRE', definition: 'El sistema VOLTAIRE (integrado en el Centro de Control de Energías Renovables, CECRE) es la arquitectura implantada por REE para la regulación dinámica de tensión en el sistema peninsular. Opera en dos capas jerárquicas: la Regulación Terciaria y la Regulación Secundaria.' },
  { term: 'Power System Stabilizers y Power Oscillation Damping (PSS/POD)', definition: 'Los Power System Stabilizers (PSS) y los sistemas de Power Oscillation Damping (POD) son módulos de control adicionales instalados en inversores (especialmente en modo GFM) que inyectan señales contrafase diseñadas para amortiguar oscilaciones electromecánicas de pequeña y gran perturbación.' },
  { term: 'Headroom: Reserva de Capacidad del Inversor', definition: 'El headroom es la fracción de la capacidad aparente máxima que un inversor GFM debe mantener reservada sin utilizarla para la inyección de potencia activa en estado estacionario, con el fin de tener margen para responder a transitorios rápidos.' },
  { term: 'Low Voltage Ride Through (LVRT)', definition: 'El Low Voltage Ride Through (LVRT) es la capacidad de un inversor para mantener la inyección de energía durante un hueco de tensión en lugar de desconectarse por protección.' },
  { term: 'REE', definition: 'Red Eléctrica de España.' },
  { term: 'RoCoF', definition: 'Rate of Change of Frequency (df/dt).' },
  { term: 'IBR', definition: 'Inverter-Based Resources.' },
  { term: 'PNIEC', definition: 'Plan Nacional Integrado de Energía y Clima.' },
  { term: 'UFLS', definition: 'Under-Frequency Load Shedding.' },
  { term: 'HVDC', definition: 'High Voltage Direct Current.' },
  { term: 'GFL', definition: 'Grid-Following Inverter.' },
  { term: 'GFM', definition: 'Grid-Forming Inverter.' },
  { term: 'BESS', definition: 'Battery Energy Storage System.' },
  { term: 'PLL', definition: 'Phase-Locked Loop.' },
  { term: 'PMU', definition: 'Phasor Measurement Unit.' },
  { term: 'WAMS', definition: 'Wide Area Monitoring System.' },
  { term: 'SCADA', definition: 'Supervisory Control and Data Acquisition.' },
  { term: 'OLTC', definition: 'On-Load Tap Changer.' },
  { term: 'SCR', definition: 'Short Circuit Ratio.' },
  { term: 'ERS', definition: 'Essential Reliability Services.' },
  { term: 'FFR', definition: 'Fast Frequency Response.' },
  { term: 'CCGT', definition: 'Combined Cycle Gas Turbine.' },
  { term: 'EAS', definition: 'ENTSO-E Awareness System.' },
  { term: 'TSO', definition: 'Transmission System Operator.' },
  { term: 'RCC', definition: 'Regional Coordination Centre.' },
  { term: 'aFRR', definition: 'Automatic Frequency Restoration Reserve.' },
  { term: 'CECRE', definition: 'Centro de Control de Energías Renovables.' },
  { term: 'LCOE', definition: 'Levelized Cost of Energy.' },
  { term: 'OST', definition: 'Out-of-Step Tripping.' },
  { term: 'SynCon', definition: 'Synchronous Condenser.' },
  { term: 'V2G', definition: 'Vehicle-to-Grid.' },
];

function slugify(text) {
  return text.toLowerCase()
             .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
             .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dash
             .replace(/^-+|-+$/g, ''); // trim dashes
}

const fileContent = `export const slugify = (text) => text.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const GLOSSARY_TERMS = [
\${glossaryData.map(t => \`  {
    id: slugify(\\\`\${t.term}\\\`),
    letter: '\${t.term[0].toUpperCase()}',
    term: \\\`\${t.term}\\\`,
    definition: \\\`\${t.definition}\\\`
  }\`).join(',\\n')}
];
`;

fs.writeFileSync(path.join(__dirname, 'tfg-antigravity-docs/src/data/glossary.js'), fileContent);

const bibliographyData = [
  { title: "ENTSO-E Expert Panel. Grid Incident in Spain and Portugal on 28 April 2025: ICS Investigation Expert Panel Factual Report. Inf. téc. European Network of Transmission System Operators for Electricity, 2025." },
  { title: "C. Batlle et al. The (Hopefully) Enlightening Blackout in Spain: Questions and Lessons for the Future. Inf. téc. MIT Center for Energy and Environmental Policy Research (CEEPR), 2025." },
  { title: "Gobierno de España - Consejo de Seguridad Nacional. Versión no confidencial del informe del comité para el análisis de las circunstancias que concurrieron en la crisis de electricidad del 28 de abril de 2025. Inf. téc. Ministerio para la Transición Ecológica y el Reto Demográfico, 2025." },
  { title: "Red Eléctrica de España (Dirección General de Operación). Incidente en el Sistema Eléctrico Peninsular Español el 28 de abril de 2025. Inf. téc. Redeia, 2025." },
  { title: "Instituto de Investigación Tecnológica (IIT) - Universidad Pontificia Comillas, Compass Lexecon e INESC TEC. Análisis de los acontecimientos que condujeron al apagón peninsular del 28 de abril de 2025 / Resumen del informe preliminar. Inf. téc. Universidad Pontificia Comillas, 2025." },
  { title: "A. Albustami y A. F. Taha. Replicación de la secuencia del colapso e interacción de acciones OA/AA. 2025." },
  { title: "FutuRed - Plataforma Española de Redes Eléctricas. Sistemas grid-forming: Electrónica de potencia para la estabilidad de la red. Inf. téc. Ministerio de Ciencia, Innovación y Universidades, mayo de 2024." },
  { title: "J. García y M. Pérez. «The Iberian Blackout: A Black Swan or a Gray Rhino?» En: Energy Policy Review (2025)." },
  { title: "J. D. Lara et al. April 28th 2025 Iberian Blackout: Analysis of available information. Inf. téc. National Renewable Energy Laboratory (NREL), 2025." },
  { title: "ENTSO-E Technical Group on Grid Forming Capability. Phase II Technical Report on Grid Forming Requirements. Inf. téc. European Network of Transmission System Operators for Electricity, nov. de 2025. url: https://www.entsoe.eu/news/2025/11/04/entso-e-publishes-phase-ii-technical-report-on-grid-forming-requirements/." },
  { title: "Comisión Nacional de los Mercados y la Competencia. Resolución de 12 de junio de 2025, por la que se modifican los procedimientos de operación para el desarrollo de un servicio de control de tensión en el sistema eléctrico peninsular español. BOE-A-2025-13076, Boletín Oficial del Estado núm. 153. Jun. de 2025. url: https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-13076." },
  { title: "Gobierno de España. Real Decreto 997/2025, de 5 de noviembre, por el que se aprueban medidas urgentes para el refuerzo del sistema eléctrico. BOE-A-2025-24997, Boletín Oficial del Estado. Nov. de 2025. url: https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-24997." },
  { title: "Agency for the Cooperation of Energy Regulators. Recommendation to the European Commission on the amended Network Code on Requirements for Generators (NC RfG 2.0) and on the amended Network Code on Demand Connection (NC DC 3.0). Inf. téc. ACER, diciembre de 2023." },
  { title: "ENTSO-E. Policy Paper on Market Design for Utility-Scale Energy Storage. Inf. téc. European Network of Transmission System Operators for Electricity, nov. de 2025. url: https://eepublicdownloads.blob.core.windows.net/public-cdn-container/documents/news-events/news/2025/2025-11-XX-Policy-Paper-Energy-Storage-Market-Design.pdf." },
  { title: "Javier Quintana. «El impacto de las energías renovables sobre el precio mayorista de la electricidad». En: Boletín Económico – Banco de España 2024.T3, Art. 09 (2024). Documento de Trabajo, Banco de España. url: https://www.bde.es/wbe/es/publicaciones/analisis-economico-investigacion/boletin-economico/2024t3-articulo-09." }
];

const biblioContent = `export const BIBLIOGRAPHY = [
\${bibliographyData.map((b, i) => \`  {
    id: \${i + 1},
    title: \\\`\${b.title}\\\`
  }\`).join(',\\n')}
];
`;

fs.writeFileSync(path.join(__dirname, 'tfg-antigravity-docs/src/data/bibliography.js'), biblioContent);

console.log("Data files generated successfully.");
