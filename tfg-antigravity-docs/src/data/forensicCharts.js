// src/data/forensicCharts.js
// Mapa maestro de las 23 gráficas forenses organizadas en 5 categorías temáticas.

export const CATEGORIES = [
  {
    id: 'cat1',
    name: 'Demanda y Sistema',
    question: '¿Qué se esperaba que consumiera el sistema y qué ocurrió realmente?',
    color: '#C0392B',
    colorLight: 'rgba(192,57,43,0.12)',
    icon: '⚡',
  },
  {
    id: 'cat2',
    name: 'Generación y Capacidad',
    question: '¿Qué podía generar el sistema, qué estaba generando y por qué tecnología?',
    color: '#E67E22',
    colorLight: 'rgba(230,126,34,0.12)',
    icon: '🏭',
  },
  {
    id: 'cat3',
    name: 'Mercados y Precios',
    question: '¿Qué señales económicas emitió el sistema antes, durante y después del colapso?',
    color: '#D4AC0D',
    colorLight: 'rgba(212,172,13,0.12)',
    icon: '📈',
  },
  {
    id: 'cat4',
    name: 'Interconexiones y Flujos',
    question: '¿Cómo se comportaron las fronteras eléctricas antes, durante y después del apagón?',
    color: '#27AE60',
    colorLight: 'rgba(39,174,96,0.12)',
    icon: '🔗',
  },
  {
    id: 'cat5',
    name: 'Balance, Estabilidad y Respuesta',
    question: '¿Cómo perdió el operador el control del sistema y cómo intentó recuperarlo?',
    color: '#2471A3',
    colorLight: 'rgba(36,113,163,0.12)',
    icon: '⚖️',
  },
];

// Marcadores de la línea de tiempo (en minutos desde medianoche CEST = UTC+2)
export const TIMELINE_MARKERS = [
  { id: 'osc1', timeUTC: '10:03', timeCEST: '12:03', label: 'Primera oscilación', severity: 'critical', relatedCharts: ['chart-1', 'chart-3', 'chart-14'] },
  { id: 'osc2', timeUTC: '10:19', timeCEST: '12:19', label: 'Segunda oscilación', severity: 'critical', relatedCharts: ['chart-1', 'chart-14', 'chart-18'] },
  { id: 'sync', timeUTC: '10:33', timeCEST: '12:33', label: 'Pérdida de sincronismo', severity: 'critical', relatedCharts: ['chart-1', 'chart-2', 'chart-14', 'chart-15', 'chart-18', 'chart-19'] },
  { id: 'island', timeUTC: '10:35', timeCEST: '12:35', label: 'Islandización ibérica', severity: 'critical', relatedCharts: ['chart-13', 'chart-14', 'chart-15', 'chart-16', 'chart-17'] },
  { id: 'peak', timeUTC: '11:45', timeCEST: '13:45', label: 'Pico de déficit', severity: 'warning', relatedCharts: ['chart-18', 'chart-19', 'chart-20'] },
  { id: 'recovery', timeUTC: '16:15', timeCEST: '18:15', label: 'Inicio recuperación', severity: 'recovery', relatedCharts: ['chart-1', 'chart-2', 'chart-18', 'chart-23'] },
  { id: 'restored', timeUTC: '05:00+1', timeCEST: '~07:00 (29A)', label: 'Restauración completa', severity: 'recovery', relatedCharts: ['chart-1', 'chart-2'] },
];

// Las 23 gráficas
export const CHARTS = [
  // ── CAT 1: DEMANDA Y SISTEMA ──────────────────────────────────────────
  {
    id: 'chart-1',
    categoryId: 'cat1',
    tema: 'T1',
    order: 1,
    title: 'Demanda Peninsular',
    fullTitle: 'Evolución de la demanda eléctrica en España — 28 y 29 de abril de 2025',
    subtitle: 'Demanda Real vs. Programada vs. Prevista · resolución 5 minutos',
    sourceBadge: 'ESIOS',
    techCode: 'Indicadores 1293, 1775, 460',
    stars: 5,
    component: 'DemandaChart',
    componentPath: '@site/src/components/EsiosCharts/DemandaChart',
    desc: `Durante la mañana del 28 de abril, la demanda real peninsular se situaba entre 19.000 y 27.000 MW — muy por debajo de la punta histórica (>45.000 MW) y coherente con un lunes de primavera con alta generación solar. Las curvas de programación y previsión se solapaban con la demanda real con una desviación inferior al 2 %, demostrando que el escenario de baja carga era perfectamente anticipado por el operador. Esta aparente normalidad hace aún más llamativo lo que ocurre a continuación: entre las 12:30 y las 12:35 CEST la demanda real cae de 25.184 MW a 0 MW en un escalón vertical. La programación y la previsión se anulan simultáneamente. Los propios equipos de telemedida SCADA dejan de transmitir porque pierden su alimentación eléctrica. No es una caída gradual; es un cero de tensión certificado.

La recuperación es escalonada y extremadamente lenta. A partir de las 13:05 CEST aparecen valores testimoniales — 37 MW, luego 204 MW — que crecen a lo largo de la tarde y la noche siguientes. No es hasta la madrugada del 29 de abril cuando la demanda vuelve a superar los 20.000 MW, y la jornada completa del 29 transcurre en proceso de normalización progresiva. El sistema necesitó casi 19 horas para restablecer el suministro en toda la península.`,
    rel: `Esta es la gráfica más importante del análisis. Es el electrocardiograma plano del sistema ibérico. Con resolución de 5 minutos, documenta el instante exacto del colapso total, la ausencia de señales de deterioro gradual previo en la demanda (lo que confirma que el fallo fue dinámico y ultrarrápido), y la lentitud de la restauración mediante estrategias Top-Down (soporte desde Francia) y Bottom-Up (arranque autónomo de centrales hidroeléctricas). Es el punto de entrada obligatorio de cualquier análisis forense del 28-A.`,
    desc_en: `During the morning of April 28, the peninsular real demand was between 19,000 and 27,000 MW — well below the historical peak (>45,000 MW) and consistent with a spring Monday with high solar generation. The scheduled and forecast curves overlapped with the real demand with a deviation of less than 2%, demonstrating that the low-load scenario was perfectly anticipated by the operator. This apparent normality makes what follows all the more striking: between 12:30 and 12:35 CEST, real demand fell from 25,184 MW to 0 MW in a vertical step. Scheduled and forecast values were cancelled simultaneously. The SCADA telemetry units themselves stopped transmitting because they lost their power supply. This was not a gradual drop; it was a certified voltage zero.

Recovery was stepped and extremely slow. From 13:05 CEST, token values appeared — 37 MW, then 204 MW — growing throughout the following afternoon and night. It was not until the early hours of April 29 that demand again exceeded 20,000 MW, and the full day of the 29th was spent in progressive normalisation. The system needed almost 19 hours to restore supply across the entire peninsula.`,
    rel_en: `This is the most important chart in the analysis. It is the flat electrocardiogram of the Iberian system. With 5-minute resolution, it documents the exact moment of total collapse, the absence of prior gradual degradation signals in demand (confirming that the failure was dynamic and ultra-fast), and the slowness of restoration via Top-Down strategies (support from France) and Bottom-Up (autonomous start-up of hydroelectric plants). It is the mandatory entry point for any forensic analysis of the 28-A event.`,
    desc_pt: `Durante a manhã de 28 de abril, a procura real peninsular situava-se entre 19.000 e 27.000 MW — muito abaixo do pico histórico (>45.000 MW) e coerente com uma segunda-feira de primavera com alta geração solar. As curvas de programação e previsão sobrepunham-se à procura real com um desvio inferior a 2%, demonstrando que o cenário de baixa carga era perfeitamente antecipado pelo operador. Esta aparente normalidade torna ainda mais notório o que acontece a seguir: entre as 12:30 e as 12:35 CEST, a procura real caiu de 25.184 MW para 0 MW num degrau vertical. A programação e a previsão anularam-se simultaneamente. Os próprios equipamentos de telemedição SCADA deixaram de transmitir por perderem a alimentação elétrica. Não foi uma queda gradual; foi um zero de tensão certificado.

A recuperação foi escalonada e extremamente lenta. A partir das 13:05 CEST surgiram valores residuais — 37 MW, depois 204 MW — que cresceram ao longo da tarde e da noite seguintes. Só na madrugada de 29 de abril é que a procura voltou a superar os 20.000 MW, e o dia completo de 29 decorreu em processo de normalização progressiva. O sistema necessitou de quase 19 horas para restabelecer o fornecimento em toda a península.`,
    rel_pt: `Este é o gráfico mais importante da análise. É o electrocardiograma plano do sistema ibérico. Com resolução de 5 minutos, documenta o instante exato do colapso total, a ausência de sinais de deterioração gradual prévia na procura (o que confirma que a falha foi dinâmica e ultra-rápida), e a lentidão da restauração mediante estratégias Top-Down (apoio de França) e Bottom-Up (arranque autónomo de centrais hidroelétricas). É o ponto de entrada obrigatório de qualquer análise forense do 28-A.`,
    desc_fr: `Le matin du 28 avril, la demande réelle péninsulaire se situait entre 19 000 et 27 000 MW — bien en dessous du pic historique (>45 000 MW) et cohérente avec un lundi de printemps à forte production solaire. Les courbes de programmation et de prévision se superposaient à la demande réelle avec un écart inférieur à 2 %, démontrant que le scénario de faible charge était parfaitement anticipé par l'opérateur. Cette apparente normalité rend d'autant plus frappant ce qui suit : entre 12h30 et 12h35 CEST, la demande réelle est passée de 25 184 MW à 0 MW en une marche verticale. La programmation et la prévision ont été annulées simultanément. Les équipements de télémesure SCADA ont eux-mêmes cessé de transmettre faute d'alimentation électrique. Ce n'était pas une chute progressive ; c'était un zéro de tension certifié.

La reprise s'est effectuée par paliers et de manière extrêmement lente. À partir de 13h05 CEST, des valeurs symboliques sont apparues — 37 MW, puis 204 MW — croissant tout au long de l'après-midi et de la nuit suivantes. Ce n'est qu'aux premières heures du 29 avril que la demande a de nouveau dépassé les 20 000 MW, et la journée complète du 29 s'est déroulée dans un processus de normalisation progressive. Le système a nécessité près de 19 heures pour rétablir l'approvisionnement dans toute la péninsule.`,
    rel_fr: `Il s'agit du graphique le plus important de l'analyse. C'est l'électrocardiogramme plat du système ibérique. Avec une résolution de 5 minutes, il documente l'instant précis de l'effondrement total, l'absence de signaux de dégradation progressive préalable dans la demande (ce qui confirme que la défaillance était dynamique et ultra-rapide), et la lenteur de la restauration via les stratégies Top-Down (soutien depuis la France) et Bottom-Up (démarrage autonome des centrales hydroélectriques). C'est le point d'entrée obligatoire de toute analyse forensique de l'événement du 28-A.`,
    desc_it: `Durante la mattina del 28 aprile, la domanda reale peninsulare si collocava tra 19.000 e 27.000 MW — ben al di sotto del picco storico (>45.000 MW) e coerente con un lunedì primaverile ad alta generazione solare. Le curve di programmazione e di previsione si sovrapponevano alla domanda reale con uno scarto inferiore al 2%, dimostrando che lo scenario di basso carico era perfettamente anticipato dall'operatore. Questa apparente normalità rende ancora più sorprendente ciò che accade successivamente: tra le 12:30 e le 12:35 CEST la domanda reale è scesa da 25.184 MW a 0 MW in uno scalino verticale. La programmazione e la previsione si sono annullate simultaneamente. Gli stessi apparati di telemisurazione SCADA hanno smesso di trasmettere per mancanza di alimentazione elettrica. Non fu una caduta graduale; fu un annullamento certificato della tensione.

Il recupero fu scaglionato ed estremamente lento. A partire dalle 13:05 CEST comparvero valori residuali — 37 MW, poi 204 MW — che crebbero nel corso del pomeriggio e della notte successivi. Solo alle prime ore del 29 aprile la domanda tornò a superare i 20.000 MW, e l'intera giornata del 29 si svolse in un processo di normalizzazione progressiva. Il sistema impiegò quasi 19 ore per ripristinare la fornitura in tutta la penisola.`,
    rel_it: `Questo è il grafico più importante dell'analisi. È l'elettrocardiogramma piatto del sistema iberico. Con risoluzione di 5 minuti, documenta l'istante esatto del collasso totale, l'assenza di segnali di deterioramento graduale precedente nella domanda (confermando che il guasto fu dinamico e ultra-rapido), e la lentezza del ripristino mediante strategie Top-Down (supporto dalla Francia) e Bottom-Up (avviamento autonomo delle centrali idroelettriche). È il punto di ingresso obbligatorio di qualsiasi analisi forense del 28-A.`,
    desc_de: `Am Morgen des 28. April lag die reale Netzlast der Iberischen Halbinsel zwischen 19.000 und 27.000 MW — weit unter dem historischen Spitzenwert (>45.000 MW) und typisch für einen Frühlingsmontag mit hoher Solarstromproduktion. Die Fahrplan- und Prognosekurven deckten sich mit der Echtzeitnachfrage mit einer Abweichung von unter 2 %, was zeigt, dass das Niedriglastszenario vom Netzbetreiber vollständig antizipiert worden war. Diese scheinbare Normalität macht das Folgende umso auffälliger: Zwischen 12:30 und 12:35 CEST fiel die Reallast von 25.184 MW auf 0 MW in einer senkrechten Stufe. Fahrplan und Prognose wurden gleichzeitig annulliert. Die SCADA-Fernmessgeräte selbst hörten auf zu senden, weil sie ihre Stromversorgung verloren. Es war kein allmählicher Rückgang; es war ein zertifizierter Spannungsnullpunkt.

Die Erholung verlief stufenweise und extrem langsam. Ab 13:05 CEST tauchten symbolische Werte auf — 37 MW, dann 204 MW — die im Laufe des Nachmittags und der folgenden Nacht wuchsen. Erst in den frühen Morgenstunden des 29. April überstieg die Last wieder 20.000 MW, und der gesamte 29. verlief im Zeichen progressiver Normalisierung. Das System benötigte fast 19 Stunden, um die Versorgung auf der gesamten Halbinsel wiederherzustellen.`,
    rel_de: `Dies ist das wichtigste Diagramm der Analyse. Es ist das flache Elektrokardiogramm des iberischen Systems. Mit 5-Minuten-Auflösung dokumentiert es den genauen Zeitpunkt des vollständigen Zusammenbruchs, das Fehlen vorheriger allmählicher Verschlechterungssignale in der Nachfrage (was bestätigt, dass der Fehler dynamisch und ultraschnell war), und die Langsamkeit der Wiederherstellung durch Top-Down-Strategien (Unterstützung aus Frankreich) und Bottom-Up-Strategien (autonomer Start von Wasserkraftwerken). Es ist der obligatorische Einstiegspunkt für jede forensische Analyse des Ereignisses vom 28-A.`,
  },
  {
    id: 'chart-2',
    categoryId: 'cat1',
    tema: 'T1',
    order: 2,
    title: 'Total Load — ES + PT',
    fullTitle: 'Demanda real frente a previsión day-ahead — España y Portugal',
    subtitle: 'CTA|ES y CTA|PT · 28–29 de abril de 2025 · MTU horario',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 6.1.A&B',
    stars: 5,
    component: 'TotalLoadChart',
    componentPath: '@site/src/components/EntsoeCharts/TotalLoadChart',
    desc: `Esta gráfica compara la demanda real horaria con la previsión day-ahead para España y Portugal durante los dos días del evento. Antes del colapso, la demanda real española se situaba entre 25.000 y 27.000 MW, con una precisión de previsión superior al 98 %. A partir de las 10:00–11:00 UTC los valores de demanda real para España desaparecen: los equipos de telemedida SCADA pierden alimentación. En Portugal, en cambio, sí se registra la caída: la demanda real se desploma hasta 90–92 MW — apenas el 2 % de lo previsto — permanece en valores testimoniales durante horas y comienza a recuperarse lentamente a partir de las 20:00–21:00 UTC.

La recuperación española no arroja valores de demanda real significativos hasta las 22:00–23:00 del 29 de abril (22.801 MW), confirmando que el proceso de restauración completo requirió casi 19 horas desde el colapso. La demanda portuguesa actúa como "termómetro" del proceso de re-energización.`,
    rel: `Este es el único indicador que permite responder con precisión horaria la pregunta forense clave: ¿fue el apagón un evento exclusivamente español o un colapso sistémico ibérico? La simultaneidad o el desfase entre la caída de España y la de Portugal en los intervalos MTU determina si hubo cascada transfronteriza (ES → PT) o desacoplamiento simultáneo del sistema MIBEL. La precisión de las previsiones day-ahead demuestra que el escenario operativo era perfectamente conocido: el fallo del 28-A no fue un "cisne negro", sino una gestión de riesgo inadecuada ante condiciones previstas.`,
    desc_en: `This chart compares hourly actual demand against the day-ahead forecast for Spain and Portugal during the two days of the event. Before the collapse, Spain's actual demand was between 25,000 and 27,000 MW, with forecast accuracy above 98%. From 10:00–11:00 UTC, actual demand values for Spain disappeared: SCADA telemetry units lost power. In Portugal, however, the drop was recorded: actual demand plummeted to 90–92 MW — barely 2% of the forecast — remaining at token values for hours before beginning a slow recovery from 20:00–21:00 UTC.

Spain's recovery did not produce significant actual demand values until 22:00–23:00 on April 29 (22,801 MW), confirming that the full restoration process required nearly 19 hours from the collapse. Portuguese demand acts as a "thermometer" for the re-energisation process.`,
    rel_en: `This is the only indicator that allows the key forensic question to be answered with hourly precision: was the blackout exclusively a Spanish event or a systemic Iberian collapse? The simultaneity or lag between Spain's and Portugal's drops in MTU intervals determines whether there was a cross-border cascade (ES → PT) or a simultaneous decoupling of the MIBEL system. The accuracy of the day-ahead forecasts demonstrates that the operational scenario was perfectly known: the 28-A failure was not a "black swan", but inadequate risk management in the face of anticipated conditions.`,
    desc_pt: `Este gráfico compara a procura real horária com a previsão day-ahead para Espanha e Portugal durante os dois dias do evento. Antes do colapso, a procura real espanhola situava-se entre 25.000 e 27.000 MW, com uma precisão de previsão superior a 98%. A partir das 10:00–11:00 UTC os valores de procura real para Espanha desaparecem: os equipamentos de telemedição SCADA perdem alimentação. Em Portugal, pelo contrário, a queda é registada: a procura real despenca para 90–92 MW — apenas 2% do previsto — permanecendo em valores residuais durante horas antes de começar a recuperar lentamente a partir das 20:00–21:00 UTC.

A recuperação espanhola não produz valores significativos de procura real até às 22:00–23:00 de 29 de abril (22.801 MW), confirmando que o processo de restauro completo exigiu quase 19 horas desde o colapso. A procura portuguesa funciona como "termómetro" do processo de re-energização.`,
    rel_pt: `Este é o único indicador que permite responder com precisão horária à questão forense central: o apagão foi um evento exclusivamente espanhol ou um colapso sistémico ibérico? A simultaneidade ou o desfasamento entre a queda de Espanha e a de Portugal nos intervalos MTU determina se houve cascata transfronteiriça (ES → PT) ou desacoplamento simultâneo do sistema MIBEL. A precisão das previsões day-ahead demonstra que o cenário operativo era perfeitamente conhecido: a falha do 28-A não foi um "cisne negro", mas uma gestão de risco inadequada face a condições previstas.`,
    desc_fr: `Ce graphique compare la demande réelle horaire à la prévision day-ahead pour l'Espagne et le Portugal pendant les deux jours de l'événement. Avant l'effondrement, la demande réelle espagnole se situait entre 25 000 et 27 000 MW, avec une précision de prévision supérieure à 98 %. À partir de 10h00–11h00 UTC, les valeurs de demande réelle pour l'Espagne ont disparu : les équipements de télémesure SCADA ont perdu leur alimentation. Au Portugal, en revanche, la chute a bien été enregistrée : la demande réelle a chuté à 90–92 MW — à peine 2 % de la prévision — restant à des valeurs symboliques pendant des heures avant de commencer à se redresser lentement à partir de 20h00–21h00 UTC.

La reprise espagnole n'a pas produit de valeurs significatives de demande réelle avant 22h00–23h00 le 29 avril (22 801 MW), confirmant que le processus de restauration complet a nécessité près de 19 heures depuis l'effondrement. La demande portugaise joue le rôle de "thermomètre" du processus de ré-énergisation.`,
    rel_fr: `C'est le seul indicateur permettant de répondre avec une précision horaire à la question forensique clé : la panne était-elle un événement exclusivement espagnol ou un effondrement systémique ibérique ? La simultanéité ou le décalage entre les chutes de l'Espagne et du Portugal dans les intervalles MTU détermine s'il y a eu une cascade transfrontalière (ES → PT) ou un découplage simultané du système MIBEL. La précision des prévisions day-ahead démontre que le scénario opérationnel était parfaitement connu : la défaillance du 28-A n'était pas un "cygne noir", mais une gestion des risques inadéquate face à des conditions prévisibles.`,
    desc_it: `Questo grafico confronta la domanda reale oraria con la previsione day-ahead per Spagna e Portogallo durante i due giorni dell'evento. Prima del collasso, la domanda reale spagnola si collocava tra 25.000 e 27.000 MW, con una precisione di previsione superiore al 98%. A partire dalle 10:00–11:00 UTC i valori di domanda reale per la Spagna sono scomparsi: le unità di telemisurazione SCADA hanno perso alimentazione. In Portogallo, invece, il calo è stato registrato: la domanda reale è crollata a 90–92 MW — appena il 2% della previsione — rimanendo a valori simbolici per ore prima di iniziare a riprendersi lentamente a partire dalle 20:00–21:00 UTC.

La ripresa spagnola non ha prodotto valori significativi di domanda reale fino alle 22:00–23:00 del 29 aprile (22.801 MW), confermando che il processo di ripristino completo ha richiesto quasi 19 ore dal collasso. La domanda portoghese funge da "termometro" del processo di ri-energizzazione.`,
    rel_it: `Questo è l'unico indicatore che consente di rispondere con precisione oraria alla domanda forense chiave: il blackout fu un evento esclusivamente spagnolo o un collasso sistemico iberico? La simultaneità o il ritardo tra la caduta della Spagna e quella del Portogallo negli intervalli MTU determina se vi fu una cascata transfrontaliera (ES → PT) o un disaccoppiamento simultaneo del sistema MIBEL. La precisione delle previsioni day-ahead dimostra che lo scenario operativo era perfettamente noto: il guasto del 28-A non fu un "cigno nero", ma una gestione del rischio inadeguata di fronte a condizioni previste.`,
    desc_de: `Dieses Diagramm vergleicht die tatsächliche Stundenlast mit der Day-ahead-Prognose für Spanien und Portugal während der zwei Tage des Ereignisses. Vor dem Zusammenbruch lag Spaniens reale Nachfrage zwischen 25.000 und 27.000 MW, mit einer Prognosegenauigkeit von über 98%. Ab 10:00–11:00 UTC verschwanden die realen Nachfragewerte für Spanien: SCADA-Fernmessgeräte verloren die Stromversorgung. In Portugal hingegen wurde der Einbruch registriert: die reale Nachfrage fiel auf 90–92 MW — kaum 2% der Prognose — und blieb stundenlang bei symbolischen Werten, bevor ab 20:00–21:00 UTC eine langsame Erholung einsetzte.

Spaniens Erholung produzierte bis 22:00–23:00 Uhr am 29. April keine signifikanten Nachfragewerte (22.801 MW), was bestätigt, dass der vollständige Wiederherstellungsprozess fast 19 Stunden nach dem Zusammenbruch dauerte. Die portugiesische Nachfrage fungiert als "Thermometer" des Wiederbelebungsprozesses.`,
    rel_de: `Dies ist der einzige Indikator, der es ermöglicht, die zentrale forensische Frage mit stündlicher Genauigkeit zu beantworten: War der Blackout ein ausschließlich spanisches Ereignis oder ein systemischer iberischer Kollaps? Die Gleichzeitigkeit oder Zeitverzögerung zwischen dem Einbruch Spaniens und Portugals in den MTU-Intervallen bestimmt, ob es eine grenzüberschreitende Kaskade (ES → PT) oder eine gleichzeitige Entkopplung des MIBEL-Systems gab. Die Genauigkeit der Day-ahead-Prognosen zeigt, dass das operative Szenario perfekt bekannt war: Das Versagen des 28-A war kein „schwarzer Schwan", sondern ein unzureichendes Risikomanagement angesichts erwarteter Bedingungen.`,
  },
  {
    id: 'chart-3',
    categoryId: 'cat1',
    tema: 'T1',
    order: 3,
    title: 'Programa de Producción',
    fullTitle: 'Desglose de la energía programada en los mercados de producción',
    subtitle: 'España, 28 de abril de 2025 (MWh)',
    sourceBadge: 'ESIOS',
    techCode: 'Mercado de Producción',
    stars: 4,
    component: 'ProgramacionChart',
    componentPath: '@site/src/components/EsiosCharts/ProgramacionChart',
    desc: `Esta gráfica muestra el desglose de la energía total programada para el 28 de abril en los distintos segmentos del mercado de producción español: mercado diario SPOT (18.592,3 MWh), restricciones técnicas Fase I (4.383,6 MWh), mercado intradiario (2.420,3 MWh), restricciones en tiempo real (305,2 MWh), intradiario continuo (66,7 MWh), reserva de reemplazo RR (900 MWh), regulación terciaria mFRR (639,8 MWh) y regulación secundaria aFRR (222,3 MWh). El volumen total programado asciende a 27.811,76 MWh.

El colapso de las 12:33 CEST anuló físicamente toda esta programación de forma instantánea. La energía no suministrada estimada para el conjunto del evento se sitúa entre 150.000 y 180.000 MWh, varias veces superior al volumen diario aquí programado.`,
    rel: `La anulación simultánea de todos los segmentos de mercado — SPOT, intradiario, restricciones, reservas — confirma el carácter total del cero de tensión: no fue una interrupción parcial ni un problema circunscrito a una zona geográfica. Esta gráfica es la prueba documental más directa del blackout sistémico desde la perspectiva de los mercados.`,
    desc_en: `This chart shows the breakdown of total scheduled energy for April 28 across the different segments of the Spanish production market: day-ahead SPOT market (18,592.3 MWh), technical constraints Phase I (4,383.6 MWh), intraday market (2,420.3 MWh), real-time constraints (305.2 MWh), continuous intraday (66.7 MWh), replacement reserve RR (900 MWh), tertiary regulation mFRR (639.8 MWh) and secondary regulation aFRR (222.3 MWh). Total scheduled volume amounted to 27,811.76 MWh.

The collapse at 12:33 CEST physically cancelled all of this scheduling instantaneously. The estimated unserved energy for the entire event is between 150,000 and 180,000 MWh, several times greater than the daily volume scheduled here.`,
    rel_en: `The simultaneous cancellation of all market segments — SPOT, intraday, constraints, reserves — confirms the total nature of the voltage zero: it was not a partial interruption nor a problem confined to a geographic area. This chart is the most direct documentary evidence of the systemic blackout from the markets' perspective.`,
    desc_pt: `Este gráfico mostra a repartição da energia total programada para 28 de abril nos diferentes segmentos do mercado de produção espanhol: mercado diário SPOT (18.592,3 MWh), restrições técnicas Fase I (4.383,6 MWh), mercado intradiário (2.420,3 MWh), restrições em tempo real (305,2 MWh), intradiário contínuo (66,7 MWh), reserva de substituição RR (900 MWh), regulação terciária mFRR (639,8 MWh) e regulação secundária aFRR (222,3 MWh). O volume total programado ascendeu a 27.811,76 MWh.

O colapso das 12:33 CEST anulou fisicamente toda esta programação de forma instantânea. A energia não fornecida estimada para o conjunto do evento situa-se entre 150.000 e 180.000 MWh, várias vezes superior ao volume diário aqui programado.`,
    rel_pt: `A anulação simultânea de todos os segmentos de mercado — SPOT, intradiário, restrições, reservas — confirma o caráter total do zero de tensão: não foi uma interrupção parcial nem um problema circunscrito a uma zona geográfica. Este gráfico é a prova documental mais direta do blackout sistémico na perspetiva dos mercados.`,
    desc_fr: `Ce graphique montre la décomposition de l'énergie totale programmée pour le 28 avril dans les différents segments du marché de production espagnol : marché journalier SPOT (18 592,3 MWh), contraintes techniques Phase I (4 383,6 MWh), marché infrajournalier (2 420,3 MWh), contraintes en temps réel (305,2 MWh), infrajournalier continu (66,7 MWh), réserve de remplacement RR (900 MWh), régulation tertiaire mFRR (639,8 MWh) et régulation secondaire aFRR (222,3 MWh). Le volume total programmé s'est élevé à 27 811,76 MWh.

L'effondrement de 12h33 CEST a physiquement annulé toute cette programmation de manière instantanée. L'énergie non fournie estimée pour l'ensemble de l'événement se situe entre 150 000 et 180 000 MWh, plusieurs fois supérieure au volume journalier programmé ici.`,
    rel_fr: `L'annulation simultanée de tous les segments de marché — SPOT, infrajournalier, contraintes, réserves — confirme le caractère total du zéro de tension : il ne s'agissait pas d'une interruption partielle ni d'un problème circonscrit à une zone géographique. Ce graphique est la preuve documentaire la plus directe du blackout systémique du point de vue des marchés.`,
    desc_it: `Questo grafico mostra la ripartizione dell'energia totale programmata per il 28 aprile nei diversi segmenti del mercato di produzione spagnolo: mercato giornaliero SPOT (18.592,3 MWh), restrizioni tecniche Fase I (4.383,6 MWh), mercato infragiornaliero (2.420,3 MWh), restrizioni in tempo reale (305,2 MWh), infragiornaliero continuo (66,7 MWh), riserva di sostituzione RR (900 MWh), regolazione terziaria mFRR (639,8 MWh) e regolazione secondaria aFRR (222,3 MWh). Il volume totale programmato ammontava a 27.811,76 MWh.

Il collasso delle 12:33 CEST ha annullato fisicamente tutta questa programmazione in modo istantaneo. L'energia non fornita stimata per l'intero evento si colloca tra 150.000 e 180.000 MWh, molte volte superiore al volume giornaliero qui programmato.`,
    rel_it: `L'annullamento simultaneo di tutti i segmenti di mercato — SPOT, infragiornaliero, restrizioni, riserve — conferma il carattere totale dell'azzeramento della tensione: non fu un'interruzione parziale né un problema circoscritto a un'area geografica. Questo grafico è la prova documentale più diretta del blackout sistemico dalla prospettiva dei mercati.`,
    desc_de: `Dieses Diagramm zeigt die Aufschlüsselung der gesamten geplanten Energie für den 28. April in den verschiedenen Segmenten des spanischen Produktionsmarktes: Day-ahead-SPOT-Markt (18.592,3 MWh), technische Einschränkungen Phase I (4.383,6 MWh), Intraday-Markt (2.420,3 MWh), Echtzeit-Einschränkungen (305,2 MWh), kontinuierlicher Intraday (66,7 MWh), Ersatzreserve RR (900 MWh), Tertiärregelung mFRR (639,8 MWh) und Sekundärregelung aFRR (222,3 MWh). Das gesamte geplante Volumen belief sich auf 27.811,76 MWh.

Der Zusammenbruch um 12:33 CEST annullierte diese gesamte Planung physisch und augenblicklich. Die geschätzte nicht gelieferte Energie für das gesamte Ereignis liegt zwischen 150.000 und 180.000 MWh, ein Vielfaches des hier geplanten Tagesvolumens.`,
    rel_de: `Die gleichzeitige Annullierung aller Marktsegmente — SPOT, Intraday, Einschränkungen, Reserven — bestätigt den vollständigen Charakter des Spannungsnulls: Es handelte sich weder um eine teilweise Unterbrechung noch um ein auf einen geografischen Bereich beschränktes Problem. Dieses Diagramm ist der direkteste dokumentarische Beweis für den systemischen Blackout aus der Perspektive der Märkte.`,
  },

  // ── CAT 2: GENERACIÓN Y CAPACIDAD ─────────────────────────────────────
  {
    id: 'chart-4',
    categoryId: 'cat2',
    tema: 'T2',
    order: 1,
    title: 'Potencia Disponible por Tecnología',
    fullTitle: 'Comparativa de potencia disponible por tecnología',
    subtitle: 'Madrugada del 28 y 29 de abril de 2025 (MW)',
    sourceBadge: 'ESIOS',
    techCode: 'ESIOS Potencia',
    stars: 4,
    component: 'PotenciaChart',
    componentPath: '@site/src/components/EsiosCharts/PotenciaChart',
    desc: `Esta gráfica compara, para las 00:00 de cada jornada, la potencia instalada total, la disponible operativamente y la indisponible. En la madrugada del 28 de abril, la potencia disponible total era de 39.077,5 MW frente a una potencia instalada de 51.709,5 MW — con 19.238,2 MW indisponibles. Por tecnología destacan los ciclos combinados de gas (16.660,7 MW disponibles), la hidráulica de embalse (13.518,7 MW), la nuclear (5.820,1 MW) y el bombeo (2.153,9 MW).

Sin embargo, la potencia disponible en la madrugada contrasta radicalmente con la generación real durante el colapso. A mediodía del 28, los ciclos combinados generaban únicamente 2.775 MW de los 16.660 MW disponibles. La brecha entre potencia disponible y potencia efectivamente despachada es la huella del mecanismo de orden de mérito económico.`,
    rel: `Esta gráfica refuta con datos la hipótesis más extendida en el debate público: el sistema tenía potencia más que suficiente para cubrir la demanda. Con 39 GW disponibles frente a una demanda de 25 GW, no existía ningún déficit de recursos físicos. El colapso no fue un fallo de generación, sino un fallo de red precipitado por la decisión de mercado de no despachar la generación síncrona disponible.`,
    desc_en: `This chart compares, at midnight of each day, total installed capacity, operationally available capacity, and unavailable capacity. In the early hours of April 28, total available capacity was 39,077.5 MW against installed capacity of 51,709.5 MW — with 19,238.2 MW unavailable. By technology, the standouts were combined-cycle gas turbines (16,660.7 MW available), reservoir hydropower (13,518.7 MW), nuclear (5,820.1 MW), and pumped storage (2,153.9 MW).

However, the available capacity in the early hours contrasts radically with actual generation during the collapse. At noon on the 28th, combined-cycle plants were generating only 2,775 MW out of the 16,660 MW available. The gap between available capacity and actually dispatched capacity is the imprint of the economic merit order mechanism.`,
    rel_en: `This chart refutes with data the most widespread hypothesis in the public debate: the system had more than enough capacity to cover demand. With 39 GW available against a demand of 25 GW, there was no physical resource deficit. The collapse was not a generation failure, but a grid failure precipitated by the market decision not to dispatch the available synchronous generation.`,
    desc_pt: `Este gráfico compara, para as 00:00 de cada jornada, a potência instalada total, a disponível operacionalmente e a indisponível. Na madrugada de 28 de abril, a potência disponível total era de 39.077,5 MW face a uma potência instalada de 51.709,5 MW — com 19.238,2 MW indisponíveis. Por tecnologia, destacam-se as centrais de ciclo combinado a gás (16.660,7 MW disponíveis), a hidroelétrica de albufeira (13.518,7 MW), a nuclear (5.820,1 MW) e o bombagem (2.153,9 MW).

No entanto, a potência disponível na madrugada contrasta radicalmente com a geração real durante o colapso. Ao meio-dia do dia 28, as centrais de ciclo combinado geravam apenas 2.775 MW dos 16.660 MW disponíveis. A diferença entre potência disponível e potência efetivamente despachada é a marca do mecanismo de ordem de mérito económico.`,
    rel_pt: `Este gráfico refuta com dados a hipótese mais difundida no debate público: o sistema tinha potência mais do que suficiente para cobrir a procura. Com 39 GW disponíveis face a uma procura de 25 GW, não existia qualquer défice de recursos físicos. O colapso não foi uma falha de geração, mas uma falha de rede precipitada pela decisão de mercado de não despachar a geração síncrona disponível.`,
    desc_fr: `Ce graphique compare, à minuit de chaque journée, la puissance installée totale, la puissance disponible opérationnellement et la puissance indisponible. Dans la nuit du 28 avril, la puissance disponible totale était de 39 077,5 MW face à une puissance installée de 51 709,5 MW — avec 19 238,2 MW indisponibles. Par technologie, on retiendra les cycles combinés à gaz (16 660,7 MW disponibles), l'hydraulique de réservoir (13 518,7 MW), le nucléaire (5 820,1 MW) et le pompage (2 153,9 MW).

Cependant, la puissance disponible dans la nuit contraste radicalement avec la production réelle lors de l'effondrement. À midi le 28, les cycles combinés ne produisaient que 2 775 MW sur les 16 660 MW disponibles. L'écart entre puissance disponible et puissance effectivement dispatchée est l'empreinte du mécanisme de mérite d'ordre économique.`,
    rel_fr: `Ce graphique réfute avec des données l'hypothèse la plus répandue dans le débat public : le système disposait de plus que suffisamment de puissance pour couvrir la demande. Avec 39 GW disponibles face à une demande de 25 GW, il n'existait aucun déficit de ressources physiques. L'effondrement n'était pas une défaillance de production, mais une défaillance de réseau précipitée par la décision du marché de ne pas dispatcher la production synchrone disponible.`,
    desc_it: `Questo grafico confronta, alle 00:00 di ogni giornata, la potenza totale installata, quella disponibile operativamente e quella non disponibile. Nelle prime ore del 28 aprile, la potenza disponibile totale era di 39.077,5 MW rispetto a una potenza installata di 51.709,5 MW — con 19.238,2 MW non disponibili. Per tecnologia, spiccano i cicli combinati a gas (16.660,7 MW disponibili), l'idroelettrico da serbatoio (13.518,7 MW), il nucleare (5.820,1 MW) e il pompaggio (2.153,9 MW).

Tuttavia, la potenza disponibile nelle prime ore contrasta radicalmente con la generazione reale durante il collasso. A mezzogiorno del 28, i cicli combinati generavano solo 2.775 MW dei 16.660 MW disponibili. Il divario tra potenza disponibile e potenza effettivamente dispacciata è l'impronta del meccanismo di ordine di merito economico.`,
    rel_it: `Questo grafico confuta con dati l'ipotesi più diffusa nel dibattito pubblico: il sistema aveva potenza più che sufficiente per coprire la domanda. Con 39 GW disponibili rispetto a una domanda di 25 GW, non esisteva alcun deficit di risorse fisiche. Il collasso non fu un guasto di generazione, ma un guasto di rete precipitato dalla decisione di mercato di non dispacciare la generazione sincrona disponibile.`,
    desc_de: `Dieses Diagramm vergleicht für Mitternacht jedes Tages die gesamte installierte Leistung, die betrieblich verfügbare Leistung und die nicht verfügbare Leistung. In den frühen Morgenstunden des 28. April betrug die gesamte verfügbare Leistung 39.077,5 MW gegenüber einer installierten Leistung von 51.709,5 MW — mit 19.238,2 MW nicht verfügbar. Nach Technologie stachen Gasturbinen-Kombikraftwerke (16.660,7 MW verfügbar), Speicherwasserkraft (13.518,7 MW), Kernkraft (5.820,1 MW) und Pumpspeicher (2.153,9 MW) hervor.

Die verfügbare Leistung in den frühen Morgenstunden steht jedoch in radikalem Gegensatz zur tatsächlichen Erzeugung während des Zusammenbruchs. Mittags am 28. erzeugten Kombikraftwerke nur 2.775 MW der verfügbaren 16.660 MW. Die Lücke zwischen verfügbarer und tatsächlich eingesetzter Leistung ist der Abdruck des wirtschaftlichen Merit-Order-Mechanismus.`,
    rel_de: `Dieses Diagramm widerlegt mit Daten die im öffentlichen Diskurs verbreitetste Hypothese: Das System hatte mehr als genug Kapazität, um die Nachfrage zu decken. Mit 39 GW verfügbar gegenüber einer Nachfrage von 25 GW gab es kein Defizit an physischen Ressourcen. Der Zusammenbruch war kein Erzeugungsversagen, sondern ein Netzversagen, das durch die Marktentscheidung ausgelöst wurde, die verfügbare Synchrongenerierung nicht einzusetzen.`,
  },
  {
    id: 'chart-5',
    categoryId: 'cat2',
    tema: 'T1',
    order: 2,
    title: 'Installed Capacity per Type',
    fullTitle: 'Capacidad instalada del sistema eléctrico peninsular por tipo de tecnología',
    subtitle: '2025 (MW) — Iberian Peninsula',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 14.1.A',
    stars: 4,
    component: 'InstalledCapacityChart',
    componentPath: '@site/src/components/EntsoeCharts/InstalledCapacityChart',
    desc: `Esta gráfica muestra la capacidad de generación eléctrica instalada en la Península Ibérica desglosada por tecnología. La capacidad total asciende a 121.873 MW: eólica onshore (30.932 MW), solar fotovoltaica (29.047 MW), fósil gas (29.943 MW), hidráulica de embalse (15.765 MW), nuclear (7.117 MW), bombeo hidroeléctrico (3.418 MW) y carbón (1.820 MW). La capacidad síncrona convencional suma aproximadamente 61 GW.

La trampa es la diferencia entre capacidad instalada y capacidad efectivamente despachada. El 28 de abril, por orden de mérito económico, la práctica totalidad de los 29 GW de ciclos combinados estaban apagados. El mix instantáneo estaba dominado al 82 % por IBR — fundamentalmente solar fotovoltaica — con apenas 7 GW de generación síncrona activa.`,
    rel: `La capacidad instalada síncrona no sirve si está desconectada por razones de mercado. Esta gráfica debe leerse junto con la de generación real: la primera muestra los recursos disponibles en papel; la segunda los que estaban operativos en el momento crítico. La diferencia — más de 25 GW de generación síncrona instalada pero no despachada — es la vulnerabilidad estructural que hizo posible el apagón.`,
    desc_en: `This chart shows the installed electricity generation capacity on the Iberian Peninsula broken down by technology. Total capacity amounts to 121,873 MW: onshore wind (30,932 MW), solar photovoltaic (29,047 MW), fossil gas (29,943 MW), reservoir hydro (15,765 MW), nuclear (7,117 MW), pumped hydro (3,418 MW), and coal (1,820 MW). Conventional synchronous capacity totals approximately 61 GW.

The trap is the difference between installed capacity and actually dispatched capacity. On April 28, due to economic merit order, virtually all 29 GW of combined-cycle plants were offline. The instantaneous mix was dominated 82% by IBR — mainly solar photovoltaic — with barely 7 GW of active synchronous generation.`,
    rel_en: `Installed synchronous capacity is useless if disconnected for market reasons. This chart must be read alongside the actual generation chart: the first shows paper resources; the second shows what was operational at the critical moment. The difference — more than 25 GW of installed but undispatched synchronous generation — is the structural vulnerability that made the blackout possible.`,
    desc_pt: `Este gráfico mostra a capacidade de geração elétrica instalada na Península Ibérica discriminada por tecnologia. A capacidade total ascende a 121.873 MW: eólica onshore (30.932 MW), solar fotovoltaica (29.047 MW), gás fóssil (29.943 MW), hidroelétrica de albufeira (15.765 MW), nuclear (7.117 MW), bombagem hidroelétrica (3.418 MW) e carvão (1.820 MW). A capacidade síncrona convencional soma aproximadamente 61 GW.

A armadilha está na diferença entre capacidade instalada e capacidade efetivamente despachada. No dia 28 de abril, por ordem de mérito económico, praticamente a totalidade dos 29 GW de ciclos combinados estava desligada. O mix instantâneo era dominado em 82% por IBR — fundamentalmente solar fotovoltaica — com apenas 7 GW de geração síncrona ativa.`,
    rel_pt: `A capacidade síncrona instalada não serve de nada se estiver desligada por razões de mercado. Este gráfico deve ser lido em conjunto com o de geração real: o primeiro mostra os recursos disponíveis em papel; o segundo os que estavam operacionais no momento crítico. A diferença — mais de 25 GW de geração síncrona instalada mas não despachada — é a vulnerabilidade estrutural que tornou possível o apagão.`,
    desc_fr: `Ce graphique montre la capacité de production d'électricité installée dans la péninsule ibérique ventilée par technologie. La capacité totale s'élève à 121 873 MW : éolien terrestre (30 932 MW), solaire photovoltaïque (29 047 MW), gaz fossile (29 943 MW), hydraulique de réservoir (15 765 MW), nucléaire (7 117 MW), pompage hydraulique (3 418 MW) et charbon (1 820 MW). La capacité synchrone conventionnelle totalise environ 61 GW.

Le piège réside dans la différence entre capacité installée et capacité effectivement dispatchée. Le 28 avril, par ordre de mérite économique, la quasi-totalité des 29 GW de cycles combinés était arrêtée. Le mix instantané était dominé à 82 % par les IBR — principalement le solaire photovoltaïque — avec à peine 7 GW de production synchrone active.`,
    rel_fr: `La capacité synchrone installée est inutile si elle est déconnectée pour des raisons de marché. Ce graphique doit être lu conjointement avec celui de la production réelle : le premier montre les ressources disponibles sur le papier ; le second celles qui étaient opérationnelles au moment critique. La différence — plus de 25 GW de production synchrone installée mais non dispatchée — est la vulnérabilité structurelle qui a rendu la panne possible.`,
    desc_it: `Questo grafico mostra la capacità di generazione elettrica installata nella Penisola Iberica suddivisa per tecnologia. La capacità totale ammonta a 121.873 MW: eolico onshore (30.932 MW), solare fotovoltaico (29.047 MW), gas fossile (29.943 MW), idroelettrico da serbatoio (15.765 MW), nucleare (7.117 MW), pompaggio idroelettrico (3.418 MW) e carbone (1.820 MW). La capacità sincrona convenzionale somma circa 61 GW.

La trappola sta nella differenza tra capacità installata e capacità effettivamente dispacciata. Il 28 aprile, per ordine di merito economico, la quasi totalità dei 29 GW di cicli combinati era spenta. Il mix istantaneo era dominato per l'82% da IBR — principalmente solare fotovoltaico — con appena 7 GW di generazione sincrona attiva.`,
    rel_it: `La capacità sincrona installata è inutile se scollegata per ragioni di mercato. Questo grafico deve essere letto insieme a quello della generazione reale: il primo mostra le risorse disponibili sulla carta; il secondo quelle che erano operative nel momento critico. La differenza — oltre 25 GW di generazione sincrona installata ma non dispacciata — è la vulnerabilità strutturale che ha reso possibile il blackout.`,
    desc_de: `Dieses Diagramm zeigt die installierte Stromerzeugungskapazität auf der Iberischen Halbinsel nach Technologie aufgeschlüsselt. Die Gesamtkapazität beläuft sich auf 121.873 MW: Onshore-Wind (30.932 MW), Photovoltaik (29.047 MW), fossiles Gas (29.943 MW), Speicherwasserkraft (15.765 MW), Kernkraft (7.117 MW), Pumpspeicher (3.418 MW) und Kohle (1.820 MW). Die konventionelle Synchronkapazität beträgt insgesamt etwa 61 GW.

Die Falle liegt im Unterschied zwischen installierter und tatsächlich eingesetzter Kapazität. Am 28. April waren aufgrund der wirtschaftlichen Merit Order praktisch alle 29 GW der Gaskombikraftwerke abgeschaltet. Der Momentan-Mix wurde zu 82% von IBR dominiert — hauptsächlich Photovoltaik — mit kaum 7 GW aktiver Synchrongenerierung.`,
    rel_de: `Installierte Synchronkapazität nützt nichts, wenn sie aus Marktgründen abgetrennt ist. Dieses Diagramm muss zusammen mit dem Diagramm der tatsächlichen Erzeugung gelesen werden: Das erste zeigt die Ressourcen auf dem Papier; das zweite zeigt, was im kritischen Moment betriebsbereit war. Der Unterschied — mehr als 25 GW installierter, aber nicht eingesetzter Synchrongenerierung — ist die strukturelle Schwachstelle, die den Blackout ermöglichte.`,
  },
  {
    id: 'chart-6',
    categoryId: 'cat2',
    tema: 'T2',
    order: 3,
    title: 'Actual Generation per Unit',
    fullTitle: 'Generación real por unidad de producción — Estado del mix durante el colapso',
    subtitle: '28 de abril de 2025 (MW)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 16.1.A',
    stars: 5,
    component: 'ActualGenerationChart',
    componentPath: '@site/src/components/EntsoeCharts/ActualGenerationChart',
    desc: `Estas gráficas muestran la potencia activa generada por cada unidad de producción en el período inmediatamente posterior al colapso. Los datos agregados por tecnología presentan el siguiente estado del mix durante la crisis: generación solar en 0 MW (caída total), eólica onshore en apenas 152 MW (menos del 5 % de la previsión), ciclos combinados de gas en 2.775 MW, nuclear en 3.369 MW, hidráulica de embalse en 1.012 MW y bombeo hidroeléctrico en 1.416 MW.

El ranking de las 20 unidades individuales con mayor generación está encabezado por las centrales nucleares: Vandellós (1.044 MW), Ascó 2 (1.004 MW), Ascó 1 (681 MW) y Almaraz 2 (643 MW). Ninguna instalación solar o eólica aparece en este ranking.`,
    rel: `Esta gráfica es la más directa del análisis de causalidad técnica. Demuestra que el colapso no fue causado por falta de recurso primario, sino por la desconexión masiva de los inversores IBR a consecuencia de las sobretensiones. La generación síncrona remanente — nuclear (~3,4 GW), ciclos combinados (~2,8 GW) e hidráulica (~2,4 GW) — constituyó el único andamiaje electromagnético del sistema en los segundos del colapso. Sin esas máquinas rotatorias, no habría habido posibilidad de Black Start.`,
    desc_en: `These charts show the active power generated by each production unit in the period immediately following the collapse. Data aggregated by technology presents the following mix status during the crisis: solar generation at 0 MW (total drop), onshore wind at barely 152 MW (less than 5% of forecast), combined-cycle gas at 2,775 MW, nuclear at 3,369 MW, reservoir hydro at 1,012 MW, and pumped hydro at 1,416 MW.

The ranking of the 20 individual units with highest generation is led by nuclear plants: Vandellós (1,044 MW), Ascó 2 (1,004 MW), Ascó 1 (681 MW), and Almaraz 2 (643 MW). No solar or wind installation appears in this ranking.`,
    rel_en: `This chart is the most direct in the technical causality analysis. It demonstrates that the collapse was not caused by a lack of primary resource, but by the massive disconnection of IBR inverters as a consequence of overvoltages. The remaining synchronous generation — nuclear (~3.4 GW), combined-cycle (~2.8 GW), and hydro (~2.4 GW) — constituted the only electromagnetic scaffolding of the system in the seconds of the collapse. Without those rotating machines, there would have been no possibility of a Black Start.`,
    desc_pt: `Estes gráficos mostram a potência ativa gerada por cada unidade de produção no período imediatamente posterior ao colapso. Os dados agregados por tecnologia apresentam o seguinte estado do mix durante a crise: geração solar a 0 MW (queda total), eólica onshore a apenas 152 MW (menos de 5% da previsão), ciclos combinados a gás a 2.775 MW, nuclear a 3.369 MW, hidroelétrica de albufeira a 1.012 MW e bombagem hidroelétrica a 1.416 MW.

O ranking das 20 unidades individuais com maior geração é liderado pelas centrais nucleares: Vandellós (1.044 MW), Ascó 2 (1.004 MW), Ascó 1 (681 MW) e Almaraz 2 (643 MW). Nenhuma instalação solar ou eólica aparece neste ranking.`,
    rel_pt: `Este gráfico é o mais direto na análise de causalidade técnica. Demonstra que o colapso não foi causado por falta de recurso primário, mas pela desconexão massiva dos inversores IBR em consequência das sobretensões. A geração síncrona remanescente — nuclear (~3,4 GW), ciclos combinados (~2,8 GW) e hidráulica (~2,4 GW) — constituiu o único suporte eletromagnético do sistema nos segundos do colapso. Sem essas máquinas rotativas, não teria havido possibilidade de Black Start.`,
    desc_fr: `Ces graphiques montrent la puissance active produite par chaque unité de production dans la période immédiatement après l'effondrement. Les données agrégées par technologie présentent l'état suivant du mix pendant la crise : production solaire à 0 MW (chute totale), éolien terrestre à seulement 152 MW (moins de 5 % de la prévision), cycles combinés à gaz à 2 775 MW, nucléaire à 3 369 MW, hydraulique de réservoir à 1 012 MW et pompage hydraulique à 1 416 MW.

Le classement des 20 unités individuelles avec la plus grande production est dominé par les centrales nucléaires : Vandellós (1 044 MW), Ascó 2 (1 004 MW), Ascó 1 (681 MW) et Almaraz 2 (643 MW). Aucune installation solaire ou éolienne n'apparaît dans ce classement.`,
    rel_fr: `Ce graphique est le plus direct dans l'analyse de causalité technique. Il démontre que l'effondrement n'a pas été causé par un manque de ressource primaire, mais par la déconnexion massive des onduleurs IBR à la suite des surtensions. La production synchrone restante — nucléaire (~3,4 GW), cycles combinés (~2,8 GW) et hydraulique (~2,4 GW) — a constitué le seul échafaudage électromagnétique du système dans les secondes de l'effondrement. Sans ces machines tournantes, il n'y aurait eu aucune possibilité de Black Start.`,
    desc_it: `Questi grafici mostrano la potenza attiva generata da ciascuna unità di produzione nel periodo immediatamente successivo al collasso. I dati aggregati per tecnologia presentano il seguente stato del mix durante la crisi: generazione solare a 0 MW (caduta totale), eolico onshore a soli 152 MW (meno del 5% della previsione), cicli combinati a gas a 2.775 MW, nucleare a 3.369 MW, idroelettrico da serbatoio a 1.012 MW e pompaggio idroelettrico a 1.416 MW.

La classifica delle 20 unità individuali con maggiore generazione è guidata dalle centrali nucleari: Vandellós (1.044 MW), Ascó 2 (1.004 MW), Ascó 1 (681 MW) e Almaraz 2 (643 MW). Nessun impianto solare o eolico appare in questa classifica.`,
    rel_it: `Questo grafico è il più diretto nell'analisi di causalità tecnica. Dimostra che il collasso non fu causato dalla mancanza di risorsa primaria, ma dalla disconnessione massiccia degli inverter IBR a seguito delle sovratensioni. La generazione sincrona rimanente — nucleare (~3,4 GW), cicli combinati (~2,8 GW) e idroelettrica (~2,4 GW) — costituì l'unica struttura elettromagnetica del sistema nei secondi del collasso. Senza quelle macchine rotanti, non ci sarebbe stata alcuna possibilità di Black Start.`,
    desc_de: `Diese Diagramme zeigen die von jeder Produktionseinheit im Zeitraum unmittelbar nach dem Zusammenbruch erzeugte Wirkleistung. Nach Technologie aggregierte Daten zeigen folgenden Mix-Status während der Krise: Solarstromerzeugung bei 0 MW (Totalausfall), Onshore-Wind bei kaum 152 MW (weniger als 5% der Prognose), Gas-Kombikraftwerke bei 2.775 MW, Kernkraft bei 3.369 MW, Speicherwasserkraft bei 1.012 MW und Pumpspeicher bei 1.416 MW.

Das Ranking der 20 einzelnen Einheiten mit der höchsten Erzeugung wird von Kernkraftwerken angeführt: Vandellós (1.044 MW), Ascó 2 (1.004 MW), Ascó 1 (681 MW) und Almaraz 2 (643 MW). Keine Solar- oder Windanlage erscheint in diesem Ranking.`,
    rel_de: `Dieses Diagramm ist das direkteste in der technischen Kausalitätsanalyse. Es zeigt, dass der Zusammenbruch nicht durch einen Mangel an Primärressourcen verursacht wurde, sondern durch die massenhafte Abschaltung von IBR-Wechselrichtern infolge von Überspannungen. Die verbleibende Synchrongenerierung — Kernkraft (~3,4 GW), Kombikraftwerke (~2,8 GW) und Wasserkraft (~2,4 GW) — bildete das einzige elektromagnetische Gerüst des Systems in den Sekunden des Zusammenbruchs. Ohne diese rotierenden Maschinen hätte es keine Möglichkeit eines Black Starts gegeben.`,
  },
  {
    id: 'chart-7',
    categoryId: 'cat1',
    tema: 'T1',
    order: 4,
    title: 'Water Reservoirs & Hydro',
    fullTitle: 'Almacenamiento en embalses y plantas hidroeléctricas — España, 2025',
    subtitle: 'MWh por semana',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 16.1.D',
    stars: 3,
    component: 'HydroReservoirChart',
    componentPath: '@site/src/components/EntsoeCharts/HydroReservoirChart',
    desc: `Esta gráfica muestra la evolución semanal del agua almacenada en los embalses y plantas hidroeléctricas españolas a lo largo de 2025. El apagón del 28 de abril de 2025 ocurrió en la semana 18, con un almacenamiento de 15,0 TWh — fase de llenado acelerado, nivel intermedio-alto, prácticamente en el máximo histórico de la serie.

Este volumen disponible fue determinante para el proceso de restauración. Las centrales hidroeléctricas de embalse, con capacidad de arranque autónomo (Black Start) sin necesidad de energía externa, fueron las primeras unidades en re-energizar tramos aislados de la red.`,
    rel: `La hidraulicidad no fue un factor limitante en el colapso del 28-A. Con 15 TWh almacenados, los embalses tenían capacidad suficiente para sostener el proceso de restauración durante días. La fortuna hidrológica de ese abril — año excepcionalmente húmedo — fue un factor crítico positivo en la velocidad de recuperación. Sin ese "pulmón hidráulico", el proceso de Black Start habría requerido días en lugar de las ~19 horas registradas.`,
    desc_en: `This chart shows the weekly evolution of water stored in Spanish reservoirs and hydroelectric plants throughout 2025. The blackout of April 28, 2025 occurred in week 18, with storage of 15.0 TWh — a phase of accelerated filling, intermediate-high level, practically at the historical maximum of the series.

This available volume was decisive for the restoration process. Reservoir hydroelectric plants, with autonomous start-up capability (Black Start) without needing external energy, were the first units to re-energise isolated sections of the grid.`,
    rel_en: `Hydraulicity was not a limiting factor in the 28-A collapse. With 15 TWh stored, the reservoirs had sufficient capacity to sustain the restoration process for days. The hydrological fortune of that April — an exceptionally wet year — was a critical positive factor in the speed of recovery. Without that "hydraulic lung", the Black Start process would have required days instead of the ~19 hours recorded.`,
    desc_pt: `Este gráfico mostra a evolução semanal da água armazenada nas albufeiras e centrais hidroelétricas espanholas ao longo de 2025. O apagão de 28 de abril de 2025 ocorreu na semana 18, com um armazenamento de 15,0 TWh — fase de enchimento acelerado, nível intermédio-alto, praticamente no máximo histórico da série.

Este volume disponível foi determinante para o processo de restauração. As centrais hidroelétricas de albufeira, com capacidade de arranque autónomo (Black Start) sem necessidade de energia externa, foram as primeiras unidades a re-energizar troços isolados da rede.`,
    rel_pt: `A hidraulicidade não foi um fator limitante no colapso do 28-A. Com 15 TWh armazenados, as albufeiras tinham capacidade suficiente para sustentar o processo de restauração durante dias. A fortuna hidrológica desse abril — ano excecionalmente húmido — foi um fator positivo crítico na velocidade de recuperação. Sem esse "pulmão hidráulico", o processo de Black Start teria exigido dias em vez das ~19 horas registadas.`,
    desc_fr: `Ce graphique montre l'évolution hebdomadaire de l'eau stockée dans les réservoirs et les centrales hydroélectriques espagnoles tout au long de 2025. La panne du 28 avril 2025 s'est produite à la semaine 18, avec un stockage de 15,0 TWh — phase de remplissage accéléré, niveau intermédiaire-élevé, pratiquement au maximum historique de la série.

Ce volume disponible a été déterminant pour le processus de restauration. Les centrales hydroélectriques à réservoir, avec une capacité de démarrage autonome (Black Start) sans nécessiter d'énergie externe, ont été les premières unités à ré-énergiser des tronçons isolés du réseau.`,
    rel_fr: `L'hydraulicité n'a pas été un facteur limitant dans l'effondrement du 28-A. Avec 15 TWh stockés, les réservoirs avaient une capacité suffisante pour soutenir le processus de restauration pendant des jours. La fortune hydrologique de cet avril — une année exceptionnellement humide — a été un facteur positif critique dans la rapidité de la reprise. Sans ce "poumon hydraulique", le processus de Black Start aurait nécessité des jours au lieu des ~19 heures enregistrées.`,
    desc_it: `Questo grafico mostra l'evoluzione settimanale dell'acqua immagazzinata nei serbatoi e negli impianti idroelettrici spagnoli nel corso del 2025. Il blackout del 28 aprile 2025 si è verificato nella settimana 18, con uno stoccaggio di 15,0 TWh — fase di riempimento accelerato, livello intermedio-alto, praticamente al massimo storico della serie.

Questo volume disponibile fu determinante per il processo di ripristino. Le centrali idroelettriche da serbatoio, con capacità di avviamento autonomo (Black Start) senza necessità di energia esterna, furono le prime unità a ri-energizzare tratti isolati della rete.`,
    rel_it: `L'idraulicità non fu un fattore limitante nel collasso del 28-A. Con 15 TWh immagazzinati, i serbatoi avevano capacità sufficiente per sostenere il processo di ripristino per giorni. La fortuna idrologica di quell'aprile — anno eccezionalmente piovoso — fu un fattore positivo critico nella velocità di recupero. Senza quel "polmone idraulico", il processo di Black Start avrebbe richiesto giorni invece delle ~19 ore registrate.`,
    desc_de: `Dieses Diagramm zeigt die wöchentliche Entwicklung des in spanischen Stauseen und Wasserkraftwerken gespeicherten Wassers im Jahr 2025. Der Blackout vom 28. April 2025 ereignete sich in Woche 18, mit einem Speicherstand von 15,0 TWh — eine Phase beschleunigter Füllung, mittleres bis hohes Niveau, praktisch am historischen Maximum der Reihe.

Dieses verfügbare Volumen war entscheidend für den Wiederherstellungsprozess. Speicherwasserkraftwerke mit autonomer Startfähigkeit (Black Start) ohne externe Energie waren die ersten Einheiten, die isolierte Netzabschnitte wieder mit Strom versorgten.`,
    rel_de: `Die Hydraulizität war kein limitierender Faktor beim Zusammenbruch des 28-A. Mit 15 TWh gespeichertem Wasser hatten die Stauseen ausreichende Kapazität, um den Wiederherstellungsprozess tagelang aufrechtzuerhalten. Das hydrologische Glück dieses Aprils — ein außergewöhnlich nasses Jahr — war ein entscheidend positiver Faktor für die Erholungsgeschwindigkeit. Ohne diese „hydraulische Lunge" hätte der Black-Start-Prozess Tage statt der ~19 aufgezeichneten Stunden gedauert.`,
  },
  {
    id: 'chart-8',
    categoryId: 'cat1',
    tema: 'T1',
    order: 5,
    title: 'Otros Indicadores — CO₂ + Renovables',
    fullTitle: 'Porcentaje de generación libre de CO₂ y previsiones renovables',
    subtitle: '27–29 de abril de 2025',
    sourceBadge: 'ESIOS',
    techCode: 'Indicadores 151, 541, 1395',
    stars: 4,
    component: 'GenericEsiosChartCO2',
    componentPath: null, // se renderiza con GenericEsiosChart
    componentProps: { dataUrl: '/data/esios/otros-indicadores.json', title: 'Generación libre de CO₂ (%)', unit: '%', includeKeys: ['Porcentaje de generación libre de CO2'] },
    desc: `Este indicador compuesto mide en tiempo real la fracción de la generación eléctrica peninsular procedente de fuentes libres de emisiones directas. Durante la mañana del 28 de abril, el índice superó el 90 %, llegando a alcanzar el 91,2 % a las 11:30 CEST — el nivel más alto registrado en un día laborable hasta esa fecha.

La caída es instantánea y total: de 91 % a 0 % en los segundos del cero de tensión, reflejando la desconexión masiva y simultánea de solar, eólica y nuclear. La recuperación gradual durante el 29 de abril documenta el ritmo de la restauración: primero la nuclear y la hidráulica síncrona, luego el ciclo combinado de gas, y finalmente la reintegración progresiva de los inversores renovables.`,
    rel: `El sistema colapsó en su punto de máxima "limpieza" ambiental, con el 91 % de generación libre de emisiones. Esta paradoja es la refutación más directa de la narrativa que atribuyó el apagón a un exceso de renovables: el problema no fue la cantidad de energía renovable, sino la ausencia de la inercia y la potencia reactiva inductiva que solo proporcionan las máquinas rotatorias síncronas.`,
    desc_en: `This composite indicator measures in real time the fraction of peninsular electricity generation coming from sources free of direct emissions. During the morning of April 28, the index exceeded 90%, reaching 91.2% at 11:30 CEST — the highest level recorded on a working day up to that date.

The drop is instantaneous and total: from 91% to 0% in the seconds of the voltage zero, reflecting the massive and simultaneous disconnection of solar, wind, and nuclear. The gradual recovery during April 29 documents the pace of restoration: first nuclear and synchronous hydro, then gas combined cycle, and finally the progressive reintegration of renewable inverters.`,
    rel_en: `The system collapsed at its point of maximum environmental "cleanliness", with 91% emission-free generation. This paradox is the most direct refutation of the narrative that attributed the blackout to an excess of renewables: the problem was not the quantity of renewable energy, but the absence of the inertia and inductive reactive power provided only by synchronous rotating machines.`,
    desc_pt: `Este indicador composto mede em tempo real a fração da geração elétrica peninsular proveniente de fontes livres de emissões diretas. Durante a manhã de 28 de abril, o índice superou os 90%, atingindo 91,2% às 11:30 CEST — o nível mais elevado registado num dia útil até essa data.

A queda é instantânea e total: de 91% para 0% nos segundos do zero de tensão, refletindo a desconexão massiva e simultânea de solar, eólica e nuclear. A recuperação gradual durante o dia 29 de abril documenta o ritmo da restauração: primeiro o nuclear e a hidráulica síncrona, depois o ciclo combinado a gás, e finalmente a reintegração progressiva dos inversores renováveis.`,
    rel_pt: `O sistema colapsou no seu ponto de máxima "limpeza" ambiental, com 91% de geração livre de emissões. Este paradoxo é a refutação mais direta da narrativa que atribuiu o apagão a um excesso de renováveis: o problema não foi a quantidade de energia renovável, mas a ausência da inércia e da potência reativa indutiva que apenas as máquinas rotativas síncronas fornecem.`,
    desc_fr: `Cet indicateur composite mesure en temps réel la fraction de la production électrique péninsulaire provenant de sources sans émissions directes. Le matin du 28 avril, l'indice a dépassé 90 %, atteignant 91,2 % à 11h30 CEST — le niveau le plus élevé enregistré un jour ouvrable jusqu'à cette date.

La chute est instantanée et totale : de 91 % à 0 % dans les secondes du zéro de tension, reflétant la déconnexion massive et simultanée du solaire, de l'éolien et du nucléaire. La reprise progressive le 29 avril documente le rythme de la restauration : d'abord le nucléaire et l'hydraulique synchrone, puis le cycle combiné à gaz, et enfin la réintégration progressive des onduleurs renouvelables.`,
    rel_fr: `Le système s'est effondré à son point de maximum de "propreté" environnementale, avec 91 % de production sans émissions. Ce paradoxe est la réfutation la plus directe du discours attribuant la panne à un excès d'énergies renouvelables : le problème n'était pas la quantité d'énergie renouvelable, mais l'absence de l'inertie et de la puissance réactive inductive que seules les machines tournantes synchrones fournissent.`,
    desc_it: `Questo indicatore composito misura in tempo reale la frazione della generazione elettrica peninsulare proveniente da fonti prive di emissioni dirette. Durante la mattina del 28 aprile, l'indice ha superato il 90%, raggiungendo il 91,2% alle 11:30 CEST — il livello più alto registrato in un giorno lavorativo fino a quella data.

Il calo è istantaneo e totale: dal 91% allo 0% nei secondi dell'azzeramento della tensione, riflettendo la disconnessione massiccia e simultanea di solare, eolico e nucleare. La graduale ripresa durante il 29 aprile documenta il ritmo del ripristino: prima il nucleare e l'idroelettrico sincrono, poi il ciclo combinato a gas, e infine la progressiva reintegrazione degli inverter rinnovabili.`,
    rel_it: `Il sistema è collassato nel suo punto di massima "pulizia" ambientale, con il 91% di generazione priva di emissioni. Questo paradosso è la confutazione più diretta della narrativa che attribuiva il blackout a un eccesso di rinnovabili: il problema non fu la quantità di energia rinnovabile, ma l'assenza dell'inerzia e della potenza reattiva induttiva che solo le macchine rotanti sincrone forniscono.`,
    desc_de: `Dieser zusammengesetzte Indikator misst in Echtzeit den Anteil der peninsulären Stromerzeugung aus Quellen ohne direkte Emissionen. Am Morgen des 28. April überschritt der Index 90% und erreichte um 11:30 CEST 91,2% — den höchsten an einem Werktag bis dato verzeichneten Wert.

Der Rückgang ist augenblicklich und total: von 91% auf 0% in den Sekunden des Spannungsnulls, was die massenhafte und gleichzeitige Abschaltung von Solar, Wind und Kernkraft widerspiegelt. Die allmähliche Erholung am 29. April dokumentiert das Tempo der Wiederherstellung: zuerst Kernkraft und synchrone Wasserkraft, dann Gaskombikraftwerke, und schließlich die schrittweise Wiedereingliederung erneuerbarer Wechselrichter.`,
    rel_de: `Das System brach an seinem Punkt maximaler ökologischer "Sauberkeit" zusammen, mit 91% emissionsfreier Erzeugung. Dieses Paradoxon ist die direkteste Widerlegung der Erzählung, die den Blackout einem Übermaß an erneuerbaren Energien zuschrieb: Das Problem war nicht die Menge erneuerbarer Energie, sondern das Fehlen der Trägheit und induktiven Blindleistung, die nur synchrone rotierende Maschinen liefern.`,
  },

  // ── CAT 3: MERCADOS Y PRECIOS ──────────────────────────────────────────
  {
    id: 'chart-9',
    categoryId: 'cat3',
    tema: 'T3',
    order: 1,
    title: 'Mercados y Precios — SPOT vs PVPC',
    fullTitle: 'Comparativa de precios eléctricos — Mercado SPOT mayorista vs. PVPC 2.0TD',
    subtitle: '28–29 de abril de 2025, €/MWh',
    sourceBadge: 'ESIOS',
    techCode: 'Indicadores 600 y 1001',
    stars: 5,
    component: 'PreciosChart',
    componentPath: '@site/src/components/EsiosCharts/PreciosChart',
    desc: `Durante la mañana del 28 de abril, el precio SPOT cayó a valores negativos — mínimo de –3,00 €/MWh en la hora 12:00–13:00 CEST — como consecuencia del excedente de generación solar fotovoltaica que desplazó por orden de mérito a los ciclos combinados de gas. Simultáneamente, el precio PVPC se mantenía por encima de 130 €/MWh en la misma franja horaria. La brecha entre ambas curvas — precio mayorista negativo frente a tarifa minorista elevada — es la señal económica más clara del desequilibrio estructural.

El apagón no alteró directamente los precios horarios ya fijados el día anterior, pero sus consecuencias sí se reflejan en los días siguientes: durante la noche del 28 y el día 29, el precio SPOT se recuperó hasta 35 €/MWh por el mayor uso de generación de gas en la Operación Reforzada de REE.`,
    rel: `El precio negativo del SPOT en la hora del colapso no es una consecuencia del apagón — se fijó 24 horas antes — sino una señal de alarma que el sistema no supo leer. Un precio mayorista negativo indica que el mercado estaba expulsando la generación síncrona (gas) precisamente cuando más se necesitaba su inercia y capacidad de absorción de reactiva. El apagón fue, en parte, el coste de un diseño de mercado que no internaliza los servicios esenciales de fiabilidad.`,
    desc_en: `During the morning of April 28, the SPOT price fell to negative values — a minimum of –3.00 €/MWh in the 12:00–13:00 CEST hour — as a consequence of the surplus of solar photovoltaic generation that displaced combined-cycle gas plants via merit order. Simultaneously, the PVPC price remained above 130 €/MWh in the same time slot. The gap between both curves — negative wholesale price vs. high retail tariff — is the clearest economic signal of structural imbalance.

The blackout did not directly alter the hourly prices already fixed the previous day, but its consequences were reflected in subsequent days: during the night of the 28th and the day of the 29th, the SPOT price recovered to 35 €/MWh due to increased gas generation use in REE's Reinforced Operation.`,
    rel_en: `The negative SPOT price in the hour of the collapse is not a consequence of the blackout — it was fixed 24 hours earlier — but an alarm signal that the system failed to read. A negative wholesale price indicates that the market was expelling synchronous generation (gas) precisely when its inertia and reactive absorption capacity were most needed. The blackout was, in part, the cost of a market design that does not internalise essential reliability services.`,
    desc_pt: `Durante a manhã de 28 de abril, o preço SPOT caiu para valores negativos — mínimo de –3,00 €/MWh na hora 12:00–13:00 CEST — em consequência do excedente de geração solar fotovoltaica que deslocou, por ordem de mérito, os ciclos combinados a gás. Simultaneamente, o preço PVPC mantinha-se acima de 130 €/MWh na mesma franja horária. A diferença entre as duas curvas — preço grossista negativo face à tarifa retalhista elevada — é o sinal económico mais claro do desequilíbrio estrutural.

O apagão não alterou diretamente os preços horários já fixados no dia anterior, mas as suas consequências refletem-se nos dias seguintes: durante a noite do dia 28 e o dia 29, o preço SPOT recuperou até 35 €/MWh pelo maior uso de geração a gás na Operação Reforçada da REE.`,
    rel_pt: `O preço SPOT negativo na hora do colapso não é uma consequência do apagão — foi fixado 24 horas antes — mas um sinal de alarme que o sistema não soube interpretar. Um preço grossista negativo indica que o mercado estava a expulsar a geração síncrona (gás) precisamente quando mais se necessitava da sua inércia e capacidade de absorção de reativa. O apagão foi, em parte, o custo de um design de mercado que não internaliza os serviços essenciais de fiabilidade.`,
    desc_fr: `Le matin du 28 avril, le prix SPOT a chuté à des valeurs négatives — un minimum de –3,00 €/MWh dans la tranche horaire 12h00–13h00 CEST — en conséquence de l'excédent de production photovoltaïque solaire qui a évincé les cycles combinés à gaz par ordre de mérite. Simultanément, le prix PVPC se maintenait au-dessus de 130 €/MWh dans la même tranche horaire. L'écart entre les deux courbes — prix de gros négatif face au tarif de détail élevé — est le signal économique le plus clair du déséquilibre structurel.

La panne n'a pas directement modifié les prix horaires déjà fixés la veille, mais ses conséquences se reflètent dans les jours suivants : pendant la nuit du 28 et la journée du 29, le prix SPOT s'est redressé à 35 €/MWh en raison de l'utilisation accrue de la production de gaz dans l'Opération Renforcée de REE.`,
    rel_fr: `Le prix SPOT négatif dans l'heure de l'effondrement n'est pas une conséquence de la panne — il a été fixé 24 heures plus tôt — mais un signal d'alarme que le système n'a pas su lire. Un prix de gros négatif indique que le marché expulsait la production synchrone (gaz) précisément au moment où son inertie et sa capacité d'absorption de réactive étaient le plus nécessaires. La panne a été, en partie, le coût d'un design de marché qui n'internalise pas les services essentiels de fiabilité.`,
    desc_it: `Durante la mattina del 28 aprile, il prezzo SPOT è sceso a valori negativi — minimo di –3,00 €/MWh nell'ora 12:00–13:00 CEST — come conseguenza dell'eccedenza di generazione solare fotovoltaica che ha spiazzato per ordine di merito i cicli combinati a gas. Contemporaneamente, il prezzo PVPC si manteneva sopra i 130 €/MWh nella stessa fascia oraria. Il divario tra le due curve — prezzo all'ingrosso negativo contro tariffa al dettaglio elevata — è il segnale economico più chiaro dello squilibrio strutturale.

Il blackout non ha alterato direttamente i prezzi orari già fissati il giorno precedente, ma le sue conseguenze si riflettono nei giorni successivi: durante la notte del 28 e il giorno del 29, il prezzo SPOT si è ripreso fino a 35 €/MWh per il maggiore utilizzo della generazione a gas nell'Operazione Potenziata di REE.`,
    rel_it: `Il prezzo SPOT negativo nell'ora del collasso non è una conseguenza del blackout — fu fissato 24 ore prima — ma un segnale di allarme che il sistema non seppe interpretare. Un prezzo all'ingrosso negativo indica che il mercato stava espellendo la generazione sincrona (gas) proprio quando più si necessitava della sua inerzia e capacità di assorbimento di reattiva. Il blackout fu, in parte, il costo di un design di mercato che non internalizza i servizi essenziali di affidabilità.`,
    desc_de: `Am Morgen des 28. April fiel der SPOT-Preis auf negative Werte — ein Minimum von –3,00 €/MWh in der Stunde 12:00–13:00 CEST — als Folge des Überschusses an solarer Photovoltaik-Erzeugung, die Gaskombikraftwerke durch Merit Order verdrängte. Gleichzeitig blieb der PVPC-Preis im gleichen Zeitfenster über 130 €/MWh. Die Lücke zwischen beiden Kurven — negativer Großhandelspreis gegenüber hohem Einzelhandelstarif — ist das klarste wirtschaftliche Signal des strukturellen Ungleichgewichts.

Der Blackout änderte nicht direkt die am Vortag bereits festgesetzten Stundenpreise, aber seine Folgen spiegelten sich in den darauffolgenden Tagen wider: In der Nacht des 28. und am Tag des 29. erholte sich der SPOT-Preis auf 35 €/MWh durch den verstärkten Einsatz der Gaserzeugung in REEs Verstärktem Betrieb.`,
    rel_de: `Der negative SPOT-Preis in der Stunde des Zusammenbruchs ist keine Folge des Blackouts — er wurde 24 Stunden zuvor festgelegt — sondern ein Alarmsignal, das das System nicht zu lesen wusste. Ein negativer Großhandelspreis zeigt, dass der Markt synchrone Erzeugung (Gas) genau dann verdrängte, als deren Trägheit und Blindleistungsabsorptionskapazität am dringendsten benötigt wurden. Der Blackout war zum Teil der Preis eines Marktdesigns, das wesentliche Zuverlässigkeitsdienstleistungen nicht internalisiert.`,
  },
  {
    id: 'chart-10',
    categoryId: 'cat3',
    tema: 'T3',
    order: 2,
    title: 'Precio Final Desglosado',
    fullTitle: 'Componentes del precio final de la electricidad',
    subtitle: 'España, 28 de abril de 2025, hora 00:00 CEST (€/MWh)',
    sourceBadge: 'ESIOS',
    techCode: 'ESIOS Precio Final',
    stars: 3,
    component: 'PrecioEnergiaChart',
    componentPath: '@site/src/components/EsiosCharts/PrecioEnergiaChart',
    desc: `Este gráfico desglosa el precio final de la electricidad en España (51,52 €/MWh) para la primera hora del 28 de abril. Los componentes principales son: mercado diario (24,63 €/MWh), restricciones técnicas Fase I (27,93 €/MWh), mercado intradiario (–0,17 €/MWh) y procesos del operador del sistema (–0,88 €/MWh).

El dato más revelador no es el precio final, sino la proporción de sus componentes: las restricciones técnicas (27,93 €/MWh) superan al precio del mercado diario (24,63 €/MWh) en esa primera hora. El coste de mantener el sistema físicamente estable ya era mayor que el coste de la energía en sí misma en la madrugada del día del apagón.`,
    rel: `Esta gráfica demuestra que el coste de la estabilidad del sistema — restricciones técnicas, servicios de ajuste, reservas — estaba oculto en los componentes regulados del precio final mucho antes del colapso. El apagón no lo creó: lo hizo visible de forma extrema. Sirve para cuantificar que el sistema ya operaba con costes de equilibrio anómalos antes de las 12:33 CEST.`,
    desc_en: `This chart breaks down the final electricity price in Spain (51.52 €/MWh) for the first hour of April 28. The main components are: day-ahead market (24.63 €/MWh), technical constraints Phase I (27.93 €/MWh), intraday market (–0.17 €/MWh), and system operator processes (–0.88 €/MWh).

The most revealing figure is not the final price, but the proportion of its components: technical constraints (27.93 €/MWh) exceed the day-ahead market price (24.63 €/MWh) in that first hour. The cost of keeping the system physically stable was already greater than the cost of the energy itself in the early hours of the day of the blackout.`,
    rel_en: `This chart demonstrates that the cost of system stability — technical constraints, balancing services, reserves — was hidden in the regulated components of the final price long before the collapse. The blackout did not create it: it made it visible in extreme form. It serves to quantify that the system was already operating with abnormal balancing costs before 12:33 CEST.`,
    desc_pt: `Este gráfico decompõe o preço final da eletricidade em Espanha (51,52 €/MWh) para a primeira hora de 28 de abril. Os componentes principais são: mercado diário (24,63 €/MWh), restrições técnicas Fase I (27,93 €/MWh), mercado intradiário (–0,17 €/MWh) e processos do operador do sistema (–0,88 €/MWh).

O dado mais revelador não é o preço final, mas a proporção dos seus componentes: as restrições técnicas (27,93 €/MWh) superam o preço do mercado diário (24,63 €/MWh) nessa primeira hora. O custo de manter o sistema fisicamente estável já era superior ao custo da própria energia na madrugada do dia do apagão.`,
    rel_pt: `Este gráfico demonstra que o custo da estabilidade do sistema — restrições técnicas, serviços de ajuste, reservas — estava oculto nos componentes regulados do preço final muito antes do colapso. O apagão não o criou: tornou-o visível de forma extrema. Serve para quantificar que o sistema já operava com custos de equilíbrio anómalos antes das 12:33 CEST.`,
    desc_fr: `Ce graphique décompose le prix final de l'électricité en Espagne (51,52 €/MWh) pour la première heure du 28 avril. Les composantes principales sont : marché journalier (24,63 €/MWh), contraintes techniques Phase I (27,93 €/MWh), marché infrajournalier (–0,17 €/MWh) et processus de l'opérateur de système (–0,88 €/MWh).

La donnée la plus révélatrice n'est pas le prix final, mais la proportion de ses composantes : les contraintes techniques (27,93 €/MWh) dépassent le prix du marché journalier (24,63 €/MWh) dans cette première heure. Le coût de maintien de la stabilité physique du système était déjà supérieur au coût de l'énergie elle-même aux premières heures du jour de la panne.`,
    rel_fr: `Ce graphique démontre que le coût de la stabilité du système — contraintes techniques, services d'ajustement, réserves — était caché dans les composantes régulées du prix final bien avant l'effondrement. La panne ne l'a pas créé : elle l'a rendu visible de manière extrême. Il sert à quantifier que le système fonctionnait déjà avec des coûts d'équilibre anormaux avant 12h33 CEST.`,
    desc_it: `Questo grafico scompone il prezzo finale dell'elettricità in Spagna (51,52 €/MWh) per la prima ora del 28 aprile. I componenti principali sono: mercato giornaliero (24,63 €/MWh), restrizioni tecniche Fase I (27,93 €/MWh), mercato infragiornaliero (–0,17 €/MWh) e processi dell'operatore di sistema (–0,88 €/MWh).

Il dato più rivelatore non è il prezzo finale, ma la proporzione delle sue componenti: le restrizioni tecniche (27,93 €/MWh) superano il prezzo del mercato giornaliero (24,63 €/MWh) in quella prima ora. Il costo di mantenere il sistema fisicamente stabile era già superiore al costo dell'energia stessa nelle prime ore del giorno del blackout.`,
    rel_it: `Questo grafico dimostra che il costo della stabilità del sistema — restrizioni tecniche, servizi di bilanciamento, riserve — era nascosto nelle componenti regolate del prezzo finale molto prima del collasso. Il blackout non lo ha creato: lo ha reso visibile in forma estrema. Serve a quantificare che il sistema operava già con costi di bilanciamento anomali prima delle 12:33 CEST.`,
    desc_de: `Dieses Diagramm schlüsselt den endgültigen Strompreis in Spanien (51,52 €/MWh) für die erste Stunde des 28. April auf. Die Hauptkomponenten sind: Day-ahead-Markt (24,63 €/MWh), technische Einschränkungen Phase I (27,93 €/MWh), Intraday-Markt (–0,17 €/MWh) und Systemoperatorprozesse (–0,88 €/MWh).

Das aufschlussreichste Datum ist nicht der Endpreis, sondern das Verhältnis seiner Komponenten: Technische Einschränkungen (27,93 €/MWh) übersteigen in dieser ersten Stunde den Day-ahead-Marktpreis (24,63 €/MWh). Die Kosten für die physische Systemstabilität überstiegen bereits in den frühen Morgenstunden des Blackout-Tages die Energiekosten selbst.`,
    rel_de: `Dieses Diagramm zeigt, dass die Kosten der Systemstabilität — technische Einschränkungen, Ausgleichsdienstleistungen, Reserven — lange vor dem Zusammenbruch in den regulierten Komponenten des Endpreises verborgen waren. Der Blackout hat sie nicht geschaffen: Er hat sie in extremer Form sichtbar gemacht. Es dient dazu zu quantifizieren, dass das System bereits vor 12:33 CEST mit anomalen Ausgleichskosten operierte.`,
  },
  {
    id: 'chart-11',
    categoryId: 'cat3',
    tema: 'T3',
    order: 3,
    title: 'Energy Prices — Europa',
    fullTitle: 'Precios day-ahead del mercado mayorista ibérico (OMIE)',
    subtitle: 'España y Portugal, 28–29 de abril de 2025 (€/MWh)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 12.1.C / TR 12.1.D',
    stars: 4,
    component: 'EnergyPricesChart',
    componentPath: '@site/src/components/EntsoeCharts/EnergyPricesChart',
    desc: `Esta gráfica muestra la evolución horaria de los precios del mercado diario (day-ahead) para España y Portugal — que comparten el mercado mayorista MIBEL — durante los días del evento. Entre las 08:00 y las 16:00 CEST caen a valores negativos, alcanzando un mínimo de –3,00 €/MWh en la hora 12:00–13:00, coincidiendo con el pico de producción solar.

El precio negativo de las 12:00–13:00 fue fijado 24 horas antes del apagón, no como consecuencia de él. Al día siguiente, 29 de abril, el repunte vespertino (35 €/MWh a las 22:00) refleja el mayor uso de gas para asegurar la estabilidad en la Operación Reforzada.`,
    rel: `El precio negativo del SPOT en la hora del colapso es una señal de alarma que el sistema no interpretó correctamente. Indica que el mercado mayorista estaba expulsando activamente la generación síncrona (gas) cuando más se necesitaba su inercia y capacidad de absorción de reactiva. Esta gráfica evidencia que el diseño de mercado basado exclusivamente en coste marginal no internaliza los servicios esenciales de fiabilidad.`,
    desc_en: `This chart shows the hourly evolution of day-ahead market prices for Spain and Portugal — which share the MIBEL wholesale market — during the days of the event. Between 08:00 and 16:00 CEST they fell to negative values, reaching a minimum of –3.00 €/MWh in the 12:00–13:00 hour, coinciding with the solar production peak.

The negative price of 12:00–13:00 was fixed 24 hours before the blackout, not as a consequence of it. The following day, April 29, the afternoon rebound (35 €/MWh at 22:00) reflects the greater use of gas to ensure stability in the Reinforced Operation.`,
    rel_en: `The negative SPOT price in the hour of the collapse is an alarm signal that the system did not correctly interpret. It indicates that the wholesale market was actively expelling synchronous generation (gas) when its inertia and reactive absorption capacity were most needed. This chart shows that market design based exclusively on marginal cost does not internalise essential reliability services.`,
    desc_pt: `Este gráfico mostra a evolução horária dos preços do mercado diário (day-ahead) para Espanha e Portugal — que partilham o mercado grossista MIBEL — durante os dias do evento. Entre as 08:00 e as 16:00 CEST caem para valores negativos, atingindo um mínimo de –3,00 €/MWh na hora 12:00–13:00, coincidindo com o pico de produção solar.

O preço negativo das 12:00–13:00 foi fixado 24 horas antes do apagão, não como consequência dele. No dia seguinte, 29 de abril, a recuperação vespertina (35 €/MWh às 22:00) reflete o maior uso de gás para assegurar a estabilidade na Operação Reforçada.`,
    rel_pt: `O preço SPOT negativo na hora do colapso é um sinal de alarme que o sistema não interpretou corretamente. Indica que o mercado grossista estava a expulsar ativamente a geração síncrona (gás) quando mais se necessitava da sua inércia e capacidade de absorção de reativa. Este gráfico evidencia que o design de mercado baseado exclusivamente no custo marginal não internaliza os serviços essenciais de fiabilidade.`,
    desc_fr: `Ce graphique montre l'évolution horaire des prix du marché journalier (day-ahead) pour l'Espagne et le Portugal — qui partagent le marché de gros MIBEL — pendant les jours de l'événement. Entre 08h00 et 16h00 CEST, ils tombent à des valeurs négatives, atteignant un minimum de –3,00 €/MWh dans la tranche 12h00–13h00, coïncidant avec le pic de production solaire.

Le prix négatif de 12h00–13h00 a été fixé 24 heures avant la panne, non comme conséquence de celle-ci. Le lendemain, 29 avril, le rebond vespéral (35 €/MWh à 22h00) reflète le recours accru au gaz pour assurer la stabilité dans l'Opération Renforcée.`,
    rel_fr: `Le prix SPOT négatif dans l'heure de l'effondrement est un signal d'alarme que le système n'a pas interprété correctement. Il indique que le marché de gros expulsait activement la production synchrone (gaz) au moment où son inertie et sa capacité d'absorption de réactive étaient le plus nécessaires. Ce graphique démontre que le design de marché basé exclusivement sur le coût marginal n'internalise pas les services essentiels de fiabilité.`,
    desc_it: `Questo grafico mostra l'evoluzione oraria dei prezzi del mercato giornaliero (day-ahead) per Spagna e Portogallo — che condividono il mercato all'ingrosso MIBEL — durante i giorni dell'evento. Tra le 08:00 e le 16:00 CEST scendono a valori negativi, raggiungendo un minimo di –3,00 €/MWh nell'ora 12:00–13:00, coincidendo con il picco di produzione solare.

Il prezzo negativo delle 12:00–13:00 fu fissato 24 ore prima del blackout, non come sua conseguenza. Il giorno seguente, 29 aprile, il rimbalzo pomeridiano (35 €/MWh alle 22:00) riflette il maggiore utilizzo del gas per garantire la stabilità nell'Operazione Potenziata.`,
    rel_it: `Il prezzo SPOT negativo nell'ora del collasso è un segnale di allarme che il sistema non interpretò correttamente. Indica che il mercato all'ingrosso stava espellendo attivamente la generazione sincrona (gas) quando più si necessitava della sua inerzia e capacità di assorbimento di reattiva. Questo grafico evidenzia che il design di mercato basato esclusivamente sul costo marginale non internalizza i servizi essenziali di affidabilità.`,
    desc_de: `Dieses Diagramm zeigt die stündliche Entwicklung der Day-ahead-Marktpreise für Spanien und Portugal — die den MIBEL-Großhandelsmarkt teilen — während der Ereignistage. Zwischen 08:00 und 16:00 CEST fielen sie auf negative Werte und erreichten ein Minimum von –3,00 €/MWh in der Stunde 12:00–13:00, zeitgleich mit dem Solarerzeugungsgipfel.

Der negative Preis von 12:00–13:00 wurde 24 Stunden vor dem Blackout festgesetzt, nicht als dessen Folge. Am folgenden Tag, 29. April, spiegelt der nachmittägliche Anstieg (35 €/MWh um 22:00 Uhr) den verstärkten Gaseinsatz zur Stabilitätssicherung im Verstärkten Betrieb wider.`,
    rel_de: `Der negative SPOT-Preis in der Stunde des Zusammenbruchs ist ein Alarmsignal, das das System nicht korrekt interpretierte. Er zeigt, dass der Großhandelsmarkt aktiv synchrone Erzeugung (Gas) verdrängte, als deren Trägheit und Blindleistungsabsorptionskapazität am dringendsten benötigt wurden. Dieses Diagramm zeigt, dass ein ausschließlich auf Grenzkosten basierendes Marktdesign wesentliche Zuverlässigkeitsdienstleistungen nicht internalisiert.`,
  },
  {
    id: 'chart-12',
    categoryId: 'cat3',
    tema: 'T3',
    order: 4,
    title: 'Precios de Desvíos Tiempo Real',
    fullTitle: 'Precios de desvíos y restricciones técnicas en tiempo real',
    subtitle: '28–29 de abril de 2025 (€/MWh)',
    sourceBadge: 'ESIOS',
    techCode: 'Indicador 151, 541, 1395',
    stars: 4,
    component: 'GenericEsiosChartDesvios',
    componentPath: null,
    componentProps: { dataUrl: '/data/esios/precios-desvios-tiempo-real.json', title: 'Precios de Desvíos Tiempo Real (28-29 Abril)', unit: '€/MWh' },
    desc: `Esta gráfica de doble eje superpone tres capas de información: el porcentaje de generación libre de CO₂, las previsiones de producción eólica y solar, y los precios de pago por desvíos y de restricciones técnicas (€/MWh). Los precios de restricciones técnicas se mantenían en torno a 145–150 €/MWh y los precios de desvíos oscilaban entre 50 y 276 €/MWh: valores elevados pero no excepcionales para un sistema con alta penetración renovable.

El colapso de las 12:33 CEST provoca el desplome instantáneo del porcentaje de generación limpia de 91 % a 0 %. La recuperación es lenta: el índice supera el 50 % hacia las 18:00 CEST del 28 de abril.`,
    rel: `El sistema colapsó en su punto de máxima "limpieza" ambiental, con el 91 % de generación libre de emisiones. Esta paradoja es la refutación más directa de la narrativa que atribuyó el apagón a un exceso de renovables. La gráfica también documenta el alto coste de los precios de desvíos y restricciones en los minutos previos al colapso: el termómetro del estrés operativo antes de la caída definitiva.`,
    desc_en: `This dual-axis chart overlays three layers of information: the percentage of CO₂-free generation, wind and solar production forecasts, and the prices for imbalance payments and technical constraints (€/MWh). Technical constraint prices were around 145–150 €/MWh and imbalance prices fluctuated between 50 and 276 €/MWh: high but not exceptional values for a system with high renewable penetration.

The collapse at 12:33 CEST caused the instantaneous drop in the clean generation percentage from 91% to 0%. Recovery was slow: the index exceeded 50% around 18:00 CEST on April 28.`,
    rel_en: `The system collapsed at its point of maximum environmental "cleanliness", with 91% emission-free generation. This paradox is the most direct refutation of the narrative attributing the blackout to an excess of renewables. The chart also documents the high cost of imbalance and constraint prices in the minutes before the collapse: the thermometer of operational stress before the final drop.`,
    desc_pt: `Este gráfico de duplo eixo sobrepõe três camadas de informação: a percentagem de geração livre de CO₂, as previsões de produção eólica e solar, e os preços de pagamento por desvios e de restrições técnicas (€/MWh). Os preços das restrições técnicas mantinham-se em torno de 145–150 €/MWh e os preços de desvios oscilavam entre 50 e 276 €/MWh: valores elevados mas não excecionais para um sistema com alta penetração renovável.

O colapso das 12:33 CEST provoca a queda instantânea da percentagem de geração limpa de 91% para 0%. A recuperação é lenta: o índice supera os 50% por volta das 18:00 CEST do dia 28 de abril.`,
    rel_pt: `O sistema colapsou no seu ponto de máxima "limpeza" ambiental, com 91% de geração livre de emissões. Este paradoxo é a refutação mais direta da narrativa que atribuiu o apagão a um excesso de renováveis. O gráfico também documenta o elevado custo dos preços de desvios e restrições nos minutos anteriores ao colapso: o termómetro do stress operativo antes da queda definitiva.`,
    desc_fr: `Ce graphique à double axe superpose trois couches d'information : le pourcentage de production sans CO₂, les prévisions de production éolienne et solaire, et les prix des paiements pour déséquilibres et des contraintes techniques (€/MWh). Les prix des contraintes techniques se maintenaient autour de 145–150 €/MWh et les prix des déséquilibres oscillaient entre 50 et 276 €/MWh : des valeurs élevées mais non exceptionnelles pour un système à forte pénétration renouvelable.

L'effondrement de 12h33 CEST provoque la chute instantanée du pourcentage de production propre de 91 % à 0 %. La reprise est lente : l'indice dépasse 50 % vers 18h00 CEST le 28 avril.`,
    rel_fr: `Le système s'est effondré à son point de maximum de "propreté" environnementale, avec 91 % de production sans émissions. Ce paradoxe est la réfutation la plus directe du discours attribuant la panne à un excès d'énergies renouvelables. Le graphique documente également le coût élevé des prix des déséquilibres et des contraintes dans les minutes précédant l'effondrement : le thermomètre du stress opérationnel avant la chute définitive.`,
    desc_it: `Questo grafico a doppio asse sovrappone tre strati di informazione: la percentuale di generazione libera da CO₂, le previsioni di produzione eolica e solare, e i prezzi di pagamento per gli sbilanciamenti e le restrizioni tecniche (€/MWh). I prezzi delle restrizioni tecniche si mantenevano intorno a 145–150 €/MWh e i prezzi degli sbilanciamenti oscillavano tra 50 e 276 €/MWh: valori elevati ma non eccezionali per un sistema con alta penetrazione rinnovabile.

Il collasso delle 12:33 CEST provoca il crollo istantaneo della percentuale di generazione pulita dal 91% allo 0%. Il recupero è lento: l'indice supera il 50% verso le 18:00 CEST del 28 aprile.`,
    rel_it: `Il sistema è collassato nel suo punto di massima "pulizia" ambientale, con il 91% di generazione priva di emissioni. Questo paradosso è la confutazione più diretta della narrativa che attribuiva il blackout a un eccesso di rinnovabili. Il grafico documenta anche l'elevato costo dei prezzi degli sbilanciamenti e delle restrizioni nei minuti precedenti il collasso: il termometro dello stress operativo prima della caduta definitiva.`,
    desc_de: `Dieses Doppelachsen-Diagramm überlagert drei Informationsebenen: den Prozentsatz der CO₂-freien Erzeugung, Wind- und Solarproduktionsprognosen und die Preise für Ausgleichszahlungen und technische Einschränkungen (€/MWh). Die Preise für technische Einschränkungen lagen bei etwa 145–150 €/MWh und die Ausgleichspreise schwankten zwischen 50 und 276 €/MWh: hohe, aber für ein System mit hohem erneuerbarem Anteil nicht außergewöhnliche Werte.

Der Zusammenbruch um 12:33 CEST verursachte den sofortigen Einbruch des Anteils sauberer Erzeugung von 91% auf 0%. Die Erholung war langsam: Der Index überschritt um 18:00 CEST am 28. April 50%.`,
    rel_de: `Das System brach an seinem Punkt maximaler ökologischer "Sauberkeit" zusammen, mit 91% emissionsfreier Erzeugung. Dieses Paradoxon ist die direkteste Widerlegung der Erzählung, die den Blackout einem Übermaß an erneuerbaren Energien zuschrieb. Das Diagramm dokumentiert auch die hohen Kosten der Ausgleichs- und Einschränkungspreise in den Minuten vor dem Zusammenbruch: das Thermometer des operativen Stresses vor dem endgültigen Einbruch.`,
  },

  // ── CAT 4: INTERCONEXIONES Y FLUJOS ───────────────────────────────────
  {
    id: 'chart-13',
    categoryId: 'cat4',
    tema: 'T4',
    order: 1,
    title: 'Saldos por Frontera (P48)',
    fullTitle: 'Saldos netos de intercambio programados (P48)',
    subtitle: 'España con Francia, Portugal, Marruecos y Andorra · 28–29 de abril de 2025 (MW/h)',
    sourceBadge: 'ESIOS',
    techCode: 'Indicadores 10209 y 10210',
    stars: 4,
    component: 'GenericEsiosChartSaldos',
    componentPath: null,
    componentProps: { dataUrl: '/data/esios/saldos-horarios-por-frontera.json', title: 'Saldos Horarios por Frontera (28-29 Abril)', unit: 'MW' },
    desc: `Esta gráfica muestra la evolución horaria del saldo neto de intercambios de electricidad programados (P48) entre España y sus fronteras. En la madrugada del 28 de abril, España importaba de Francia (–2.590 MW) y exportaba a Portugal. La situación cambia a partir de las 09:00–10:00 CEST: España pasa a importar simultáneamente de Francia (–1.757 MW a las 11:00) y de Portugal (–2.228 MW a las 11:00), con un saldo total de importación de –4.755 MW a las 11:00 CEST — justo noventa minutos antes del colapso.

El colapso anuló todos los saldos programados (valores cero desde las 13:00 del 28 hasta las 06:00 del 29 de abril). La recuperación de intercambios durante el 29 fue intermitente y a baja escala.`,
    rel: `El máximo de importación de –4.755 MW a las 11:00 CEST (solo 90 minutos antes del colapso) demuestra que el sistema ibérico ya era deficitario en generación propia y dependía de aportaciones externas récord para mantenerse estable. Los datos comerciales P48 mostraban aparente normalidad operativa mientras la red ya estaba en espiral de inestabilidad.`,
    desc_en: `This chart shows the hourly evolution of the net balance of scheduled electricity exchanges (P48) between Spain and its borders. In the early hours of April 28, Spain was importing from France (–2,590 MW) and exporting to Portugal. The situation changed from 09:00–10:00 CEST: Spain began importing simultaneously from France (–1,757 MW at 11:00) and from Portugal (–2,228 MW at 11:00), with a total import balance of –4,755 MW at 11:00 CEST — just ninety minutes before the collapse.

The collapse cancelled all scheduled balances (zero values from 13:00 on the 28th until 06:00 on April 29). The recovery of exchanges during the 29th was intermittent and at low scale.`,
    rel_en: `The maximum import of –4,755 MW at 11:00 CEST (just 90 minutes before the collapse) demonstrates that the Iberian system was already deficient in own generation and depended on record external contributions to remain stable. The P48 commercial data showed apparent operational normality while the grid was already in an instability spiral.`,
    desc_pt: `Este gráfico mostra a evolução horária do saldo líquido de intercâmbios de eletricidade programados (P48) entre Espanha e as suas fronteiras. Na madrugada de 28 de abril, Espanha importava de França (–2.590 MW) e exportava para Portugal. A situação muda a partir das 09:00–10:00 CEST: Espanha passa a importar simultaneamente de França (–1.757 MW às 11:00) e de Portugal (–2.228 MW às 11:00), com um saldo total de importação de –4.755 MW às 11:00 CEST — apenas noventa minutos antes do colapso.

O colapso anulou todos os saldos programados (valores zero desde as 13:00 do dia 28 até às 06:00 de 29 de abril). A recuperação de intercâmbios durante o dia 29 foi intermitente e a baixa escala.`,
    rel_pt: `O máximo de importação de –4.755 MW às 11:00 CEST (apenas 90 minutos antes do colapso) demonstra que o sistema ibérico já era deficitário em geração própria e dependia de contribuições externas recorde para se manter estável. Os dados comerciais P48 mostravam aparente normalidade operativa enquanto a rede já estava em espiral de instabilidade.`,
    desc_fr: `Ce graphique montre l'évolution horaire du solde net des échanges d'électricité programmés (P48) entre l'Espagne et ses frontières. Dans la nuit du 28 avril, l'Espagne importait de France (–2 590 MW) et exportait vers le Portugal. La situation a changé à partir de 09h00–10h00 CEST : l'Espagne a commencé à importer simultanément de France (–1 757 MW à 11h00) et du Portugal (–2 228 MW à 11h00), avec un solde d'importation total de –4 755 MW à 11h00 CEST — juste quatre-vingt-dix minutes avant l'effondrement.

L'effondrement a annulé tous les soldes programmés (valeurs nulles de 13h00 le 28 jusqu'à 06h00 le 29 avril). La reprise des échanges pendant le 29 a été intermittente et à faible échelle.`,
    rel_fr: `L'importation maximale de –4 755 MW à 11h00 CEST (seulement 90 minutes avant l'effondrement) démontre que le système ibérique était déjà déficitaire en production propre et dépendait d'apports externes records pour rester stable. Les données commerciales P48 montraient une normalité opérationnelle apparente tandis que le réseau était déjà en spirale d'instabilité.`,
    desc_it: `Questo grafico mostra l'evoluzione oraria del saldo netto degli scambi di elettricità programmati (P48) tra Spagna e le sue frontiere. Nelle prime ore del 28 aprile, la Spagna importava dalla Francia (–2.590 MW) ed esportava verso il Portogallo. La situazione è cambiata a partire dalle 09:00–10:00 CEST: la Spagna ha iniziato a importare simultaneamente dalla Francia (–1.757 MW alle 11:00) e dal Portogallo (–2.228 MW alle 11:00), con un saldo totale di importazione di –4.755 MW alle 11:00 CEST — solo novanta minuti prima del collasso.

Il collasso ha annullato tutti i saldi programmati (valori zero dalle 13:00 del 28 fino alle 06:00 del 29 aprile). La ripresa degli scambi durante il 29 fu intermittente e su scala ridotta.`,
    rel_it: `Il massimo di importazione di –4.755 MW alle 11:00 CEST (solo 90 minuti prima del collasso) dimostra che il sistema iberico era già deficitario in generazione propria e dipendeva da apporti esterni record per restare stabile. I dati commerciali P48 mostravano un'apparente normalità operativa mentre la rete era già in spirale di instabilità.`,
    desc_de: `Dieses Diagramm zeigt die stündliche Entwicklung des Nettosaldos der geplanten Stromaustauschs (P48) zwischen Spanien und seinen Grenzen. In den frühen Morgenstunden des 28. April importierte Spanien aus Frankreich (–2.590 MW) und exportierte nach Portugal. Die Situation änderte sich ab 09:00–10:00 CEST: Spanien begann gleichzeitig aus Frankreich (–1.757 MW um 11:00) und aus Portugal (–2.228 MW um 11:00) zu importieren, mit einem Gesamt-Importsaldo von –4.755 MW um 11:00 CEST — genau neunzig Minuten vor dem Zusammenbruch.

Der Zusammenbruch annullierte alle geplanten Salden (Nullwerte von 13:00 Uhr am 28. bis 06:00 Uhr am 29. April). Die Erholung der Austausche am 29. war intermittierend und in geringem Umfang.`,
    rel_de: `Der maximale Import von –4.755 MW um 11:00 CEST (nur 90 Minuten vor dem Zusammenbruch) zeigt, dass das iberische System bereits bei der Eigenerzeugung defizitär war und auf rekordverdächtige externe Beiträge angewiesen war, um stabil zu bleiben. Die kommerziellen P48-Daten zeigten scheinbare operative Normalität, während das Netz bereits in einer Instabilitätsspirale war.`,
  },
  {
    id: 'chart-14',
    categoryId: 'cat4',
    tema: 'T4',
    order: 2,
    title: 'Cross-Border Physical Flows',
    fullTitle: 'Flujos físicos reales en las interconexiones de España',
    subtitle: 'España–Francia y España–Portugal · 28–29 de abril de 2025 (MW)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 12.1.G',
    stars: 5,
    component: 'CrossBorderFlowsChart',
    componentPath: '@site/src/components/EntsoeCharts/CrossBorderFlowsChart',
    desc: `Esta gráfica muestra la evolución horaria de los flujos de potencia activa física (MW) en las fronteras de España con Francia y Portugal. A partir de las 07:00 UTC, el flujo con Portugal se invirtió: España comenzó a exportar hacia Portugal (más de 2.300 MW), consecuencia del excedente solar que hundía los precios a valores negativos.

El colapso se manifestó primero en la frontera francesa. En el intervalo 10:00–11:00 UTC, las exportaciones a Francia se anularon por completo: las protecciones OST (Out of Step) abrieron las líneas AC transpirenaicas aislando a España del continente. No fue hasta las 22:00–23:00 UTC del 29 de abril cuando reaparecieron flujos significativos — casi 36 horas después del inicio del apagón.`,
    rel: `La cronología de los cierres de frontera — España primero, Portugal después — permite reconstruir la secuencia exacta del aislamiento ibérico. La apertura de las líneas transpirenaicas a las 10:33 UTC (12:33 CEST) no fue una consecuencia del apagón: fue su detonante inmediato. El intento del sistema de importar más de 4.600 MW de emergencia desde Francia — muy por encima de la capacidad prevista de 550 MW — provocó la pérdida de sincronismo y la apertura automática de los circuitos.`,
    desc_en: `This chart shows the hourly evolution of actual physical active power flows (MW) at Spain's borders with France and Portugal. From 07:00 UTC, the flow with Portugal reversed: Spain began exporting to Portugal (more than 2,300 MW), a consequence of the solar surplus that was pushing prices to negative values.

The collapse manifested first at the French border. In the 10:00–11:00 UTC interval, exports to France were completely cancelled: OST (Out of Step) protections opened the trans-Pyrenean AC lines, isolating Spain from the continent. It was not until 22:00–23:00 UTC on April 29 that significant flows reappeared — almost 36 hours after the start of the blackout.`,
    rel_en: `The chronology of border closures — Spain first, Portugal afterwards — allows the exact sequence of Iberian isolation to be reconstructed. The opening of the trans-Pyrenean lines at 10:33 UTC (12:33 CEST) was not a consequence of the blackout: it was its immediate trigger. The system's attempt to import more than 4,600 MW of emergency power from France — far above the forecasted capacity of 550 MW — caused the loss of synchronism and the automatic opening of the circuits.`,
    desc_pt: `Este gráfico mostra a evolução horária dos fluxos de potência ativa física (MW) nas fronteiras de Espanha com França e Portugal. A partir das 07:00 UTC, o fluxo com Portugal inverteu-se: Espanha começou a exportar para Portugal (mais de 2.300 MW), consequência do excedente solar que baixava os preços a valores negativos.

O colapso manifestou-se primeiro na fronteira francesa. No intervalo 10:00–11:00 UTC, as exportações para França foram completamente anuladas: as proteções OST (Out of Step) abriram as linhas AC transpirenaicas isolando Espanha do continente. Só às 22:00–23:00 UTC de 29 de abril é que reapareceram fluxos significativos — quase 36 horas após o início do apagão.`,
    rel_pt: `A cronologia dos fechos de fronteira — Espanha primeiro, Portugal depois — permite reconstruir a sequência exata do isolamento ibérico. A abertura das linhas transpirenaicas às 10:33 UTC (12:33 CEST) não foi consequência do apagão: foi o seu detonador imediato. A tentativa do sistema de importar mais de 4.600 MW de emergência de França — muito acima da capacidade prevista de 550 MW — provocou a perda de sincronismo e a abertura automática dos circuitos.`,
    desc_fr: `Ce graphique montre l'évolution horaire des flux de puissance active physique réelle (MW) aux frontières de l'Espagne avec la France et le Portugal. À partir de 07h00 UTC, le flux avec le Portugal s'est inversé : l'Espagne a commencé à exporter vers le Portugal (plus de 2 300 MW), conséquence de l'excédent solaire qui faisait chuter les prix à des valeurs négatives.

L'effondrement s'est manifesté d'abord à la frontière française. Dans l'intervalle 10h00–11h00 UTC, les exportations vers la France ont été complètement annulées : les protections OST (Out of Step) ont ouvert les lignes AC transpyrénéennes, isolant l'Espagne du continent. Ce n'est qu'à 22h00–23h00 UTC le 29 avril que des flux significatifs sont réapparus — presque 36 heures après le début de la panne.`,
    rel_fr: `La chronologie des fermetures de frontières — l'Espagne d'abord, le Portugal ensuite — permet de reconstituer la séquence exacte de l'isolement ibérique. L'ouverture des lignes transpyrénéennes à 10h33 UTC (12h33 CEST) n'était pas une conséquence de la panne : c'en était le déclencheur immédiat. La tentative du système d'importer plus de 4 600 MW d'urgence depuis la France — bien au-delà de la capacité prévue de 550 MW — a provoqué la perte de synchronisme et l'ouverture automatique des circuits.`,
    desc_it: `Questo grafico mostra l'evoluzione oraria dei flussi di potenza attiva fisica reale (MW) alle frontiere della Spagna con Francia e Portogallo. A partire dalle 07:00 UTC, il flusso con il Portogallo si è invertito: la Spagna ha iniziato a esportare verso il Portogallo (oltre 2.300 MW), conseguenza dell'eccedenza solare che affossava i prezzi a valori negativi.

Il collasso si è manifestato prima alla frontiera francese. Nell'intervallo 10:00–11:00 UTC, le esportazioni verso la Francia sono state completamente annullate: le protezioni OST (Out of Step) hanno aperto le linee AC transpirenaiche isolando la Spagna dal continente. Solo alle 22:00–23:00 UTC del 29 aprile sono riapparsi flussi significativi — quasi 36 ore dopo l'inizio del blackout.`,
    rel_it: `La cronologia delle chiusure di frontiera — Spagna prima, Portogallo dopo — consente di ricostruire l'esatta sequenza dell'isolamento iberico. L'apertura delle linee transpirenaiche alle 10:33 UTC (12:33 CEST) non fu una conseguenza del blackout: ne fu il detonatore immediato. Il tentativo del sistema di importare più di 4.600 MW di emergenza dalla Francia — ben oltre la capacità prevista di 550 MW — provocò la perdita di sincronismo e l'apertura automatica dei circuiti.`,
    desc_de: `Dieses Diagramm zeigt die stündliche Entwicklung der tatsächlichen physischen Wirkleistungsflüsse (MW) an Spaniens Grenzen mit Frankreich und Portugal. Ab 07:00 UTC kehrte sich der Fluss mit Portugal um: Spanien begann nach Portugal zu exportieren (mehr als 2.300 MW), eine Folge des Solarüberschusses, der die Preise auf negative Werte drückte.

Der Zusammenbruch zeigte sich zuerst an der französischen Grenze. Im Intervall 10:00–11:00 UTC wurden die Exporte nach Frankreich vollständig annulliert: OST-Schutzeinrichtungen (Out of Step) öffneten die transpyrenäischen Wechselstromleitungen und isolierten Spanien vom Kontinent. Erst um 22:00–23:00 UTC am 29. April erschienen wieder signifikante Flüsse — fast 36 Stunden nach Beginn des Blackouts.`,
    rel_de: `Die Chronologie der Grenzschließungen — Spanien zuerst, Portugal danach — erlaubt die Rekonstruktion der genauen Sequenz der iberischen Isolation. Die Öffnung der transpyrenäischen Leitungen um 10:33 UTC (12:33 CEST) war keine Folge des Blackouts: Sie war sein unmittelbarer Auslöser. Der Versuch des Systems, mehr als 4.600 MW Notfallstrom aus Frankreich zu importieren — weit über der prognostizierten Kapazität von 550 MW — verursachte den Synchronismusverlust und die automatische Öffnung der Leitungen.`,
  },
  {
    id: 'chart-15',
    categoryId: 'cat4',
    tema: 'T4',
    order: 3,
    title: 'Scheduled Commercial Exchanges',
    fullTitle: 'Saldo neto de intercambios comerciales programados',
    subtitle: 'España con Francia y Portugal · 28 de abril de 2025 (MW, resolución 15 min)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 12.1.F',
    stars: 4,
    component: 'ScheduledCommercialExchangesChart',
    componentPath: '@site/src/components/EntsoeCharts/ScheduledCommercialExchangesChart',
    desc: `Esta gráfica muestra el saldo neto de los intercambios comerciales de electricidad programados (day-ahead) entre España y sus fronteras. A partir de las 09:00 UTC, el saldo total se volvió fuertemente exportador, con picos de casi 5.000 MW hacia las 10:00–11:00 UTC, coincidiendo con las horas de máxima producción solar y precios negativos en el mercado mayorista.

Minutos antes del colapso (10:33 UTC), el saldo comercial programado seguía siendo exportador (~2.500 MW netos). Sin embargo, los flujos físicos reales en ese instante se habían invertido violentamente: España intentaba importar más de 4.600 MW de emergencia desde Francia.`,
    rel: `La brecha entre la programación comercial (exportador a 2.500 MW) y la realidad física (importación de emergencia a 4.600 MW) en el mismo instante es la demostración más gráfica del desacoplamiento entre los modelos de seguridad basados en datos de mercado estáticos y la dinámica real de la red. El sistema europeo de alerta (EAS) etiquetó al bloque ibérico como "Normal" hasta el instante del blackout.`,
    desc_en: `This chart shows the net balance of scheduled commercial electricity exchanges (day-ahead) between Spain and its borders. From 09:00 UTC, the total balance became strongly exporting, with peaks of nearly 5,000 MW around 10:00–11:00 UTC, coinciding with the hours of maximum solar production and negative prices in the wholesale market.

Minutes before the collapse (10:33 UTC), the scheduled commercial balance was still exporting (~2,500 MW net). However, the actual physical flows at that instant had violently reversed: Spain was attempting to import more than 4,600 MW of emergency power from France.`,
    rel_en: `The gap between the commercial schedule (exporting at 2,500 MW) and the physical reality (emergency import at 4,600 MW) at the same instant is the most graphic demonstration of the decoupling between security models based on static market data and the actual dynamics of the grid. The European Alert System (EAS) labelled the Iberian block as "Normal" until the instant of the blackout.`,
    desc_pt: `Este gráfico mostra o saldo líquido dos intercâmbios comerciais de eletricidade programados (day-ahead) entre Espanha e as suas fronteiras. A partir das 09:00 UTC, o saldo total tornou-se fortemente exportador, com picos de quase 5.000 MW por volta das 10:00–11:00 UTC, coincidindo com as horas de máxima produção solar e preços negativos no mercado grossista.

Minutos antes do colapso (10:33 UTC), o saldo comercial programado continuava a ser exportador (~2.500 MW líquidos). No entanto, os fluxos físicos reais nesse instante tinham-se invertido violentamente: Espanha tentava importar mais de 4.600 MW de emergência de França.`,
    rel_pt: `A diferença entre a programação comercial (exportador a 2.500 MW) e a realidade física (importação de emergência a 4.600 MW) no mesmo instante é a demonstração mais gráfica do desacoplamento entre os modelos de segurança baseados em dados de mercado estáticos e a dinâmica real da rede. O sistema europeu de alerta (EAS) classificou o bloco ibérico como "Normal" até ao instante do blackout.`,
    desc_fr: `Ce graphique montre le solde net des échanges commerciaux d'électricité programmés (day-ahead) entre l'Espagne et ses frontières. À partir de 09h00 UTC, le solde total est devenu fortement exportateur, avec des pics de près de 5 000 MW vers 10h00–11h00 UTC, coïncidant avec les heures de production solaire maximale et les prix négatifs sur le marché de gros.

Minutes avant l'effondrement (10h33 UTC), le solde commercial programmé était encore exportateur (~2 500 MW nets). Cependant, les flux physiques réels à cet instant s'étaient violemment inversés : l'Espagne tentait d'importer plus de 4 600 MW d'urgence depuis la France.`,
    rel_fr: `L'écart entre la programmation commerciale (exportateur à 2 500 MW) et la réalité physique (importation d'urgence à 4 600 MW) au même instant est la démonstration la plus éloquente du découplage entre les modèles de sécurité basés sur des données de marché statiques et la dynamique réelle du réseau. Le système européen d'alerte (EAS) a étiqueté le bloc ibérique comme "Normal" jusqu'à l'instant du blackout.`,
    desc_it: `Questo grafico mostra il saldo netto degli scambi commerciali di elettricità programmati (day-ahead) tra Spagna e le sue frontiere. A partire dalle 09:00 UTC, il saldo totale è diventato fortemente esportatore, con picchi di quasi 5.000 MW verso le 10:00–11:00 UTC, coincidendo con le ore di massima produzione solare e prezzi negativi nel mercato all'ingrosso.

Minuti prima del collasso (10:33 UTC), il saldo commerciale programmato era ancora esportatore (~2.500 MW netti). Tuttavia, i flussi fisici reali in quell'istante si erano invertiti violentemente: la Spagna tentava di importare più di 4.600 MW di emergenza dalla Francia.`,
    rel_it: `Il divario tra la programmazione commerciale (esportatore a 2.500 MW) e la realtà fisica (importazione di emergenza a 4.600 MW) nello stesso istante è la dimostrazione più grafica del disaccoppiamento tra i modelli di sicurezza basati su dati di mercato statici e la dinamica reale della rete. Il sistema europeo di allerta (EAS) ha etichettato il blocco iberico come "Normale" fino all'istante del blackout.`,
    desc_de: `Dieses Diagramm zeigt den Nettosaldo der geplanten kommerziellen Stromaustauschs (Day-ahead) zwischen Spanien und seinen Grenzen. Ab 09:00 UTC wurde der Gesamtsaldo stark exportierend, mit Spitzenwerten von fast 5.000 MW gegen 10:00–11:00 UTC, zeitgleich mit den Stunden maximaler Solarproduktion und negativen Preisen im Großhandelsmarkt.

Minuten vor dem Zusammenbruch (10:33 UTC) war der geplante kommerzielle Saldo noch exportierend (~2.500 MW netto). Die tatsächlichen physischen Flüsse in diesem Moment hatten sich jedoch gewaltsam umgekehrt: Spanien versuchte, mehr als 4.600 MW Notfallstrom aus Frankreich zu importieren.`,
    rel_de: `Die Lücke zwischen dem kommerziellen Fahrplan (Export bei 2.500 MW) und der physischen Realität (Notimport bei 4.600 MW) im selben Moment ist die anschaulichste Demonstration der Entkopplung zwischen Sicherheitsmodellen, die auf statischen Marktdaten basieren, und der tatsächlichen Netzdynamik. Das europäische Warnsystem (EAS) kennzeichnete den iberischen Block bis zum Moment des Blackouts als "Normal".`,
  },
  {
    id: 'chart-16',
    categoryId: 'cat4',
    tema: 'T4',
    order: 4,
    title: 'Subastas Explícitas de Capacidad',
    fullTitle: 'Subastas explícitas de capacidad de interconexión',
    subtitle: 'España–Francia y España–Portugal, abril 2025 (MW y €/MWh)',
    sourceBadge: 'ESIOS',
    techCode: 'JAO (Joint Allocation Office)',
    stars: 3,
    component: 'SubastasChart',
    componentPath: '@site/src/components/EsiosCharts/SubastasChart',
    desc: `Esta gráfica muestra la capacidad asignada en las subastas mensuales y anuales de interconexión transfronteriza para España–Francia y España–Portugal. Las subastas explícitas son el mecanismo por el cual los agentes del mercado reservan capacidad de transporte en las interconexiones internacionales con antelación.

El colapso del 28 de abril anuló físicamente toda la capacidad contratada. Los agentes que habían adquirido derechos de transmisión en estas subastas no pudieron materializar sus derechos porque la infraestructura que los soporta había dejado de funcionar. Esto genera incumplimientos contractuales, mecanismos de compensación obligatorios y reclamaciones regulatorias.`,
    rel: `Esta gráfica cuantifica el volumen de comercio transfronterizo europeo bloqueado por el apagón y vincula el evento técnico con sus consecuencias jurídico-comerciales en el mercado europeo de electricidad. El impacto no se limitó al sistema eléctrico español: afectó a agentes de mercado de Francia, Portugal y otros países. Es la prueba documental del alcance transnacional del daño económico del 28-A.`,
    desc_en: `This chart shows the capacity allocated in monthly and annual explicit auctions for cross-border interconnection for Spain–France and Spain–Portugal. Explicit auctions are the mechanism by which market participants reserve transmission capacity on international interconnections in advance.

The collapse of April 28 physically cancelled all contracted capacity. Agents who had acquired transmission rights in these auctions were unable to materialise their rights because the supporting infrastructure had stopped functioning. This generates contractual breaches, mandatory compensation mechanisms, and regulatory claims.`,
    rel_en: `This chart quantifies the volume of European cross-border trade blocked by the blackout and links the technical event with its legal-commercial consequences in the European electricity market. The impact was not limited to the Spanish electricity system: it affected market participants from France, Portugal, and other countries. It is the documentary proof of the transnational scope of the economic damage of the 28-A.`,
    desc_pt: `Este gráfico mostra a capacidade alocada nos leilões mensais e anuais explícitos de interconexão transfronteiriça para Espanha–França e Espanha–Portugal. Os leilões explícitos são o mecanismo pelo qual os agentes de mercado reservam capacidade de transporte nas interconexões internacionais com antecedência.

O colapso de 28 de abril anulou fisicamente toda a capacidade contratada. Os agentes que tinham adquirido direitos de transmissão nestes leilões não conseguiram materializar os seus direitos porque a infraestrutura que os suporta tinha deixado de funcionar. Isso gera incumprimentos contratuais, mecanismos de compensação obrigatórios e reclamações regulatórias.`,
    rel_pt: `Este gráfico quantifica o volume de comércio transfronteiriço europeu bloqueado pelo apagão e vincula o evento técnico às suas consequências jurídico-comerciais no mercado europeu de eletricidade. O impacto não se limitou ao sistema elétrico espanhol: afetou agentes de mercado de França, Portugal e outros países. É a prova documental do alcance transnacional do dano económico do 28-A.`,
    desc_fr: `Ce graphique montre la capacité allouée dans les enchères explicites mensuelles et annuelles d'interconnexion transfrontalière pour l'Espagne–France et l'Espagne–Portugal. Les enchères explicites sont le mécanisme par lequel les acteurs du marché réservent à l'avance de la capacité de transport sur les interconnexions internationales.

L'effondrement du 28 avril a physiquement annulé toute la capacité contractée. Les acteurs qui avaient acquis des droits de transport dans ces enchères n'ont pas pu matérialiser leurs droits car l'infrastructure qui les supporte avait cessé de fonctionner. Cela génère des manquements contractuels, des mécanismes de compensation obligatoires et des réclamations réglementaires.`,
    rel_fr: `Ce graphique quantifie le volume de commerce transfrontalier européen bloqué par la panne et relie l'événement technique à ses conséquences juridico-commerciales sur le marché européen de l'électricité. L'impact ne s'est pas limité au système électrique espagnol : il a affecté des acteurs du marché français, portugais et d'autres pays. C'est la preuve documentaire de la portée transnationale des dommages économiques du 28-A.`,
    desc_it: `Questo grafico mostra la capacità assegnata nelle aste esplicite mensili e annuali di interconnessione transfrontaliera per Spagna–Francia e Spagna–Portogallo. Le aste esplicite sono il meccanismo con cui gli operatori di mercato riservano in anticipo capacità di trasporto sulle interconnessioni internazionali.

Il collasso del 28 aprile ha annullato fisicamente tutta la capacità contrattata. Gli operatori che avevano acquisito diritti di trasmissione in queste aste non hanno potuto materializzare i propri diritti perché l'infrastruttura che li supporta aveva smesso di funzionare. Ciò genera inadempienze contrattuali, meccanismi di compensazione obbligatori e reclami regolatori.`,
    rel_it: `Questo grafico quantifica il volume di commercio transfrontaliero europeo bloccato dal blackout e collega l'evento tecnico alle sue conseguenze giuridico-commerciali nel mercato europeo dell'elettricità. L'impatto non si è limitato al sistema elettrico spagnolo: ha coinvolto operatori di mercato di Francia, Portogallo e altri paesi. È la prova documentale della portata transnazionale del danno economico del 28-A.`,
    desc_de: `Dieses Diagramm zeigt die in expliziten monatlichen und jährlichen Auktionen für grenzüberschreitende Verbindungen zugeteilte Kapazität für Spanien–Frankreich und Spanien–Portugal. Explizite Auktionen sind der Mechanismus, mit dem Marktteilnehmer im Voraus Übertragungskapazität auf internationalen Verbindungen reservieren.

Der Zusammenbruch am 28. April annullierte physisch alle kontrahierten Kapazitäten. Agenten, die in diesen Auktionen Übertragungsrechte erworben hatten, konnten ihre Rechte nicht verwirklichen, weil die unterstützende Infrastruktur aufgehört hatte zu funktionieren. Dies erzeugt Vertragsverstöße, obligatorische Entschädigungsmechanismen und regulatorische Ansprüche.`,
    rel_de: `Dieses Diagramm quantifiziert das durch den Blackout blockierte Volumen des europäischen grenzüberschreitenden Handels und verbindet das technische Ereignis mit seinen rechtlich-kommerziellen Konsequenzen auf dem europäischen Strommarkt. Die Auswirkungen beschränkten sich nicht auf das spanische Stromsystem: Sie betrafen Marktteilnehmer aus Frankreich, Portugal und anderen Ländern. Es ist der dokumentarische Beweis für den transnationalen Umfang des wirtschaftlichen Schadens des 28-A.`,
  },
  {
    id: 'chart-17',
    categoryId: 'cat4',
    tema: 'T4',
    order: 5,
    title: 'Forecast Transfer Capacities',
    fullTitle: 'Capacidades de transferencia previstas en las interconexiones',
    subtitle: 'España–Francia y España–Portugal · 28–29 de abril de 2025 (MW)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 11.1',
    stars: 4,
    component: 'ForecastTransferChart',
    componentPath: '@site/src/components/EntsoeCharts/ForecastTransferChart',
    desc: `Esta gráfica muestra los límites de intercambio de electricidad declarados para el mercado diario (day-ahead) en las interconexiones de España. Para la mañana del 28 de abril, la capacidad de exportación España → Francia mostraba una reducción progresiva: de unos 3.000 MW entre las 00:00 y las 08:00, bajaba a 2.300 MW entre las 09:00 y las 15:00, y en las horas previas al colapso (10:00–12:00 CEST) descendía a 550 MW.

El 29 de abril muestra una configuración diferente: la capacidad España → Francia se mantiene en 2.960 MW durante la madrugada pero se reduce a 550 MW entre las 09:00 y las 12:00, reflejando el proceso de resincronización asimétrica.`,
    rel: `La reducción de la capacidad declarada España → Francia a 550 MW en las horas del colapso (cuando el sistema necesitaba importar más de 4.600 MW de emergencia) evidencia un desacoplamiento crítico entre los modelos de seguridad estáticos y la realidad dinámica del sistema. Los flujos físicos reales durante la cascada intentaron superar en más de ocho veces la capacidad prevista, provocando la apertura de las líneas por protecciones de pérdida de sincronismo.`,
    desc_en: `This chart shows the declared electricity exchange limits for the day-ahead market on Spain's interconnections. For the morning of April 28, the Spain → France export capacity showed a progressive reduction: from around 3,000 MW between 00:00 and 08:00, it dropped to 2,300 MW between 09:00 and 15:00, and in the hours before the collapse (10:00–12:00 CEST) it fell to 550 MW.

April 29 shows a different configuration: Spain → France capacity was maintained at 2,960 MW during the early hours but was reduced to 550 MW between 09:00 and 12:00, reflecting the asymmetric resynchronisation process.`,
    rel_en: `The reduction of the declared Spain → France capacity to 550 MW in the hours of the collapse (when the system needed to import more than 4,600 MW of emergency power) evidences a critical decoupling between static security models and the dynamic reality of the system. The actual physical flows during the cascade attempted to exceed the forecasted capacity by more than eight times, causing the lines to open through loss-of-synchronism protections.`,
    desc_pt: `Este gráfico mostra os limites de intercâmbio de eletricidade declarados para o mercado diário (day-ahead) nas interconexões de Espanha. Para a manhã de 28 de abril, a capacidade de exportação Espanha → França mostrava uma redução progressiva: de cerca de 3.000 MW entre as 00:00 e as 08:00, baixava para 2.300 MW entre as 09:00 e as 15:00, e nas horas anteriores ao colapso (10:00–12:00 CEST) descia para 550 MW.

O dia 29 de abril mostra uma configuração diferente: a capacidade Espanha → França mantém-se em 2.960 MW durante a madrugada mas reduz-se para 550 MW entre as 09:00 e as 12:00, refletindo o processo de ressincronização assimétrica.`,
    rel_pt: `A redução da capacidade declarada Espanha → França para 550 MW nas horas do colapso (quando o sistema precisava de importar mais de 4.600 MW de emergência) evidencia um desacoplamento crítico entre os modelos de segurança estáticos e a realidade dinâmica do sistema. Os fluxos físicos reais durante a cascata tentaram superar em mais de oito vezes a capacidade prevista, provocando a abertura das linhas por proteções de perda de sincronismo.`,
    desc_fr: `Ce graphique montre les limites d'échange d'électricité déclarées pour le marché journalier (day-ahead) sur les interconnexions de l'Espagne. Pour la matinée du 28 avril, la capacité d'exportation Espagne → France montrait une réduction progressive : d'environ 3 000 MW entre 00h00 et 08h00, elle baissait à 2 300 MW entre 09h00 et 15h00, et dans les heures précédant l'effondrement (10h00–12h00 CEST) elle descendait à 550 MW.

Le 29 avril montre une configuration différente : la capacité Espagne → France se maintient à 2 960 MW pendant la nuit mais se réduit à 550 MW entre 09h00 et 12h00, reflétant le processus de resynchronisation asymétrique.`,
    rel_fr: `La réduction de la capacité déclarée Espagne → France à 550 MW dans les heures de l'effondrement (quand le système avait besoin d'importer plus de 4 600 MW d'urgence) met en évidence un découplage critique entre les modèles de sécurité statiques et la réalité dynamique du système. Les flux physiques réels pendant la cascade ont tenté de dépasser de plus de huit fois la capacité prévue, provoquant l'ouverture des lignes par les protections de perte de synchronisme.`,
    desc_it: `Questo grafico mostra i limiti di scambio di elettricità dichiarati per il mercato giornaliero (day-ahead) sulle interconnessioni della Spagna. Per la mattina del 28 aprile, la capacità di esportazione Spagna → Francia mostrava una riduzione progressiva: da circa 3.000 MW tra le 00:00 e le 08:00, scendeva a 2.300 MW tra le 09:00 e le 15:00, e nelle ore precedenti il collasso (10:00–12:00 CEST) calava a 550 MW.

Il 29 aprile mostra una configurazione diversa: la capacità Spagna → Francia si mantiene a 2.960 MW durante le prime ore ma si riduce a 550 MW tra le 09:00 e le 12:00, riflettendo il processo di risincronizzazione asimmetrica.`,
    rel_it: `La riduzione della capacità dichiarata Spagna → Francia a 550 MW nelle ore del collasso (quando il sistema aveva bisogno di importare più di 4.600 MW di emergenza) evidenzia un disaccoppiamento critico tra i modelli di sicurezza statici e la realtà dinamica del sistema. I flussi fisici reali durante la cascata hanno tentato di superare di più di otto volte la capacità prevista, provocando l'apertura delle linee per le protezioni di perdita di sincronismo.`,
    desc_de: `Dieses Diagramm zeigt die deklarierten Stromaustauschlimits für den Day-ahead-Markt an Spaniens Verbindungen. Für den Morgen des 28. April zeigte die Exportkapazität Spanien → Frankreich eine schrittweise Reduzierung: von etwa 3.000 MW zwischen 00:00 und 08:00 Uhr fiel sie auf 2.300 MW zwischen 09:00 und 15:00 Uhr, und in den Stunden vor dem Zusammenbruch (10:00–12:00 CEST) sank sie auf 550 MW.

Der 29. April zeigt eine andere Konfiguration: Die Kapazität Spanien → Frankreich blieb in den frühen Morgenstunden bei 2.960 MW, wurde aber zwischen 09:00 und 12:00 Uhr auf 550 MW reduziert, was den asymmetrischen Resynchronisierungsprozess widerspiegelt.`,
    rel_de: `Die Reduzierung der deklarierten Kapazität Spanien → Frankreich auf 550 MW in den Stunden des Zusammenbruchs (als das System mehr als 4.600 MW Notfallstrom importieren musste) belegt eine kritische Entkopplung zwischen statischen Sicherheitsmodellen und der dynamischen Realität des Systems. Die tatsächlichen physischen Flüsse während der Kaskade versuchten, die prognostizierte Kapazität um mehr als das Achtfache zu überschreiten, was zur Öffnung der Leitungen durch Synchronismusverlust-Schutzvorrichtungen führte.`,
  },

  // ── CAT 5: BALANCE, ESTABILIDAD Y RESPUESTA ───────────────────────────
  {
    id: 'chart-18',
    categoryId: 'cat5',
    tema: 'T5',
    order: 1,
    title: 'Current Balancing State',
    fullTitle: 'Evolución del desequilibrio eléctrico (imbalance) — España',
    subtitle: '28–29 de abril de 2025 (MWh cada 15 minutos)',
    sourceBadge: 'ENTSO-E',
    techCode: 'GL EB 12.3.A + TR 17.1.G&H',
    stars: 5,
    component: 'CurrentBalancingStateChart',
    componentPath: '@site/src/components/EntsoeCharts/CurrentBalancingStateChart',
    desc: `Esta gráfica muestra el volumen de desequilibrio entre generación y demanda en el sistema español, en intervalos de 15 minutos. Durante la madrugada y la mañana del 28 de abril, el desequilibrio se mantuvo en valores moderados (generalmente por debajo de 200 MWh). El deterioro comienza a las 10:00–10:15 UTC (12:00–12:15 CEST), con valores progresivos de 123,8 MWh, 346,7 MWh, 616,2 MWh hasta alcanzar un pico de 1.690,4 MWh entre las 13:45 y las 14:00 UTC.

La transición de déficit a superávit se produjo a las 18:15–18:30 UTC, gracias a la Operación Reforzada de REE: el mantenimiento forzado de grupos síncronos incluso por encima de la demanda real.`,
    rel: `El pico de déficit de 1.690 MWh alcanzado más de tres horas después del colapso es la prueba cuantitativa más directa de que el blackout no fue un evento instantáneo y concluido, sino el inicio de una crisis operativa prolongada. La red no pudo recuperar el equilibrio generación–demanda hasta bien entrada la tarde, y la estrategia de corrección supuso un sobrecoste económico significativo.`,
    desc_en: `This chart shows the volume of imbalance between generation and demand in the Spanish system, in 15-minute intervals. During the early hours and morning of April 28, the imbalance remained at moderate values (generally below 200 MWh). Deterioration began at 10:00–10:15 UTC (12:00–12:15 CEST), with progressive values of 123.8 MWh, 346.7 MWh, 616.2 MWh until reaching a peak of 1,690.4 MWh between 13:45 and 14:00 UTC.

The transition from deficit to surplus occurred at 18:15–18:30 UTC, thanks to REE's Reinforced Operation: the forced maintenance of synchronous units even above actual demand.`,
    rel_en: `The deficit peak of 1,690 MWh reached more than three hours after the collapse is the most direct quantitative proof that the blackout was not an instantaneous and concluded event, but the start of a prolonged operational crisis. The grid could not recover the generation-demand balance until well into the afternoon, and the correction strategy entailed a significant economic surcharge.`,
    desc_pt: `Este gráfico mostra o volume de desequilíbrio entre geração e procura no sistema espanhol, em intervalos de 15 minutos. Durante a madrugada e a manhã de 28 de abril, o desequilíbrio manteve-se em valores moderados (geralmente abaixo de 200 MWh). A deterioração começou às 10:00–10:15 UTC (12:00–12:15 CEST), com valores progressivos de 123,8 MWh, 346,7 MWh, 616,2 MWh até atingir um pico de 1.690,4 MWh entre as 13:45 e as 14:00 UTC.

A transição de défice para superávit ocorreu às 18:15–18:30 UTC, graças à Operação Reforçada da REE: a manutenção forçada de grupos síncronos mesmo acima da procura real.`,
    rel_pt: `O pico de défice de 1.690 MWh atingido mais de três horas após o colapso é a prova quantitativa mais direta de que o blackout não foi um evento instantâneo e concluído, mas o início de uma crise operativa prolongada. A rede não conseguiu recuperar o equilíbrio geração–procura até bem entrar a tarde, e a estratégia de correção implicou um sobrecusto económico significativo.`,
    desc_fr: `Ce graphique montre le volume de déséquilibre entre production et consommation dans le système espagnol, en intervalles de 15 minutes. Dans la nuit et le matin du 28 avril, le déséquilibre s'est maintenu à des valeurs modérées (généralement inférieures à 200 MWh). La dégradation a commencé à 10h00–10h15 UTC (12h00–12h15 CEST), avec des valeurs progressives de 123,8 MWh, 346,7 MWh, 616,2 MWh jusqu'à atteindre un pic de 1 690,4 MWh entre 13h45 et 14h00 UTC.

La transition du déficit au surplus s'est produite à 18h15–18h30 UTC, grâce à l'Opération Renforcée de REE : le maintien forcé de groupes synchrones même au-delà de la demande réelle.`,
    rel_fr: `Le pic de déficit de 1 690 MWh atteint plus de trois heures après l'effondrement est la preuve quantitative la plus directe que le blackout n'était pas un événement instantané et conclu, mais le début d'une crise opérationnelle prolongée. Le réseau n'a pas pu retrouver l'équilibre production–consommation avant bien après-midi, et la stratégie de correction a entraîné un surcoût économique significatif.`,
    desc_it: `Questo grafico mostra il volume di squilibrio tra generazione e domanda nel sistema spagnolo, in intervalli di 15 minuti. Durante le prime ore e la mattina del 28 aprile, lo squilibrio si è mantenuto a valori moderati (generalmente sotto i 200 MWh). Il deterioramento è iniziato alle 10:00–10:15 UTC (12:00–12:15 CEST), con valori progressivi di 123,8 MWh, 346,7 MWh, 616,2 MWh fino a raggiungere un picco di 1.690,4 MWh tra le 13:45 e le 14:00 UTC.

La transizione da deficit a surplus si è verificata alle 18:15–18:30 UTC, grazie all'Operazione Potenziata di REE: il mantenimento forzato di gruppi sincroni anche al di sopra della domanda reale.`,
    rel_it: `Il picco di deficit di 1.690 MWh raggiunto più di tre ore dopo il collasso è la prova quantitativa più diretta che il blackout non fu un evento istantaneo e concluso, ma l'inizio di una crisi operativa prolungata. La rete non riuscì a recuperare l'equilibrio generazione–domanda fino a ben oltre il pomeriggio, e la strategia di correzione comportò un significativo sovracosto economico.`,
    desc_de: `Dieses Diagramm zeigt das Volumen des Ungleichgewichts zwischen Erzeugung und Nachfrage im spanischen System in 15-Minuten-Intervallen. In den frühen Morgenstunden und am Morgen des 28. April blieb das Ungleichgewicht bei moderaten Werten (generell unter 200 MWh). Die Verschlechterung begann um 10:00–10:15 UTC (12:00–12:15 CEST), mit progressiven Werten von 123,8 MWh, 346,7 MWh, 616,2 MWh bis zu einem Spitzenwert von 1.690,4 MWh zwischen 13:45 und 14:00 UTC.

Der Übergang vom Defizit zum Überschuss erfolgte um 18:15–18:30 UTC dank REEs Verstärktem Betrieb: die erzwungene Aufrechterhaltung synchroner Einheiten auch über der tatsächlichen Nachfrage.`,
    rel_de: `Der Defizitgipfel von 1.690 MWh, der mehr als drei Stunden nach dem Zusammenbruch erreicht wurde, ist der direkteste quantitative Beweis dafür, dass der Blackout kein augenblickliches und abgeschlossenes Ereignis war, sondern der Beginn einer anhaltenden operativen Krise. Das Netz konnte das Erzeugung-Nachfrage-Gleichgewicht erst weit in den Nachmittag hinein wiederherstellen, und die Korrektionsstrategie verursachte erhebliche Mehrkosten.`,
  },
  {
    id: 'chart-19',
    categoryId: 'cat5',
    tema: 'T5',
    order: 2,
    title: 'Imbalance — Volumen MW',
    fullTitle: 'Volumen de desequilibrio entre generación y demanda — España',
    subtitle: '28–29 de abril de 2025 (MWh cada 15 min)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 17.1.G&H',
    stars: 5,
    component: 'ImbalanceChart',
    componentPath: '@site/src/components/EntsoeCharts/ImbalanceChart',
    desc: `Esta gráfica muestra el desequilibrio entre generación y demanda en el sistema español con resolución de 15 minutos, expresado en MWh. Valores positivos indican déficit de generación; negativos, superávit. Durante la mañana del 28 de abril, el desequilibrio se mantuvo moderado (0–200 MWh). El deterioro comenzó a las 10:00–10:15 UTC: 123,8 MWh, 346,7 MWh, 616,2 MWh, hasta alcanzar el pico de 1.690,4 MWh entre las 13:45 y 14:00 UTC.

La transición a superávit (18:15–18:30 UTC) marcó la activación plena de la Operación Reforzada: el mantenimiento forzado de grupos síncronos incluso por encima de la demanda real.`,
    rel: `El pico de déficit de 1.690 MWh alcanzado más de tres horas después del colapso es la prueba cuantitativa de que el blackout no fue un evento instantáneo y concluido. Esta gráfica cierra la brecha entre el evento físico del colapso y sus consecuencias operativas durante las 19 horas de restauración.`,
    desc_en: `This chart shows the imbalance between generation and demand in the Spanish system with 15-minute resolution, expressed in MWh. Positive values indicate a generation deficit; negative values, a surplus. During the morning of April 28, the imbalance remained moderate (0–200 MWh). Deterioration began at 10:00–10:15 UTC: 123.8 MWh, 346.7 MWh, 616.2 MWh, until reaching the peak of 1,690.4 MWh between 13:45 and 14:00 UTC.

The transition to surplus (18:15–18:30 UTC) marked the full activation of the Reinforced Operation: the forced maintenance of synchronous units even above actual demand.`,
    rel_en: `The deficit peak of 1,690 MWh reached more than three hours after the collapse is quantitative proof that the blackout was not an instantaneous and concluded event. This chart closes the gap between the physical collapse event and its operational consequences during the 19 hours of restoration.`,
    desc_pt: `Este gráfico mostra o desequilíbrio entre geração e procura no sistema espanhol com resolução de 15 minutos, expresso em MWh. Valores positivos indicam défice de geração; negativos, superávit. Durante a manhã de 28 de abril, o desequilíbrio manteve-se moderado (0–200 MWh). A deterioração começou às 10:00–10:15 UTC: 123,8 MWh, 346,7 MWh, 616,2 MWh, até atingir o pico de 1.690,4 MWh entre as 13:45 e 14:00 UTC.

A transição para superávit (18:15–18:30 UTC) marcou a ativação plena da Operação Reforçada: a manutenção forçada de grupos síncronos mesmo acima da procura real.`,
    rel_pt: `O pico de défice de 1.690 MWh atingido mais de três horas após o colapso é prova quantitativa de que o blackout não foi um evento instantâneo e concluído. Este gráfico fecha a lacuna entre o evento físico do colapso e as suas consequências operativas durante as 19 horas de restauração.`,
    desc_fr: `Ce graphique montre le déséquilibre entre production et consommation dans le système espagnol avec une résolution de 15 minutes, exprimé en MWh. Les valeurs positives indiquent un déficit de production ; les valeurs négatives, un excédent. Le matin du 28 avril, le déséquilibre s'est maintenu modéré (0–200 MWh). La dégradation a commencé à 10h00–10h15 UTC : 123,8 MWh, 346,7 MWh, 616,2 MWh, jusqu'à atteindre le pic de 1 690,4 MWh entre 13h45 et 14h00 UTC.

La transition vers l'excédent (18h15–18h30 UTC) a marqué l'activation complète de l'Opération Renforcée : le maintien forcé de groupes synchrones même au-delà de la demande réelle.`,
    rel_fr: `Le pic de déficit de 1 690 MWh atteint plus de trois heures après l'effondrement est la preuve quantitative que le blackout n'était pas un événement instantané et conclu. Ce graphique comble l'écart entre l'événement physique de l'effondrement et ses conséquences opérationnelles pendant les 19 heures de restauration.`,
    desc_it: `Questo grafico mostra lo squilibrio tra generazione e domanda nel sistema spagnolo con risoluzione di 15 minuti, espresso in MWh. Valori positivi indicano un deficit di generazione; negativi, un surplus. Durante la mattina del 28 aprile, lo squilibrio si è mantenuto moderato (0–200 MWh). Il deterioramento è iniziato alle 10:00–10:15 UTC: 123,8 MWh, 346,7 MWh, 616,2 MWh, fino a raggiungere il picco di 1.690,4 MWh tra le 13:45 e le 14:00 UTC.

La transizione a surplus (18:15–18:30 UTC) ha segnato la piena attivazione dell'Operazione Potenziata: il mantenimento forzato di gruppi sincroni anche al di sopra della domanda reale.`,
    rel_it: `Il picco di deficit di 1.690 MWh raggiunto più di tre ore dopo il collasso è prova quantitativa che il blackout non fu un evento istantaneo e concluso. Questo grafico colma il divario tra l'evento fisico del collasso e le sue conseguenze operative durante le 19 ore di ripristino.`,
    desc_de: `Dieses Diagramm zeigt das Ungleichgewicht zwischen Erzeugung und Nachfrage im spanischen System mit 15-Minuten-Auflösung, ausgedrückt in MWh. Positive Werte zeigen ein Erzeugungsdefizit an; negative Werte einen Überschuss. Am Morgen des 28. April blieb das Ungleichgewicht moderat (0–200 MWh). Die Verschlechterung begann um 10:00–10:15 UTC: 123,8 MWh, 346,7 MWh, 616,2 MWh, bis zu einem Spitzenwert von 1.690,4 MWh zwischen 13:45 und 14:00 UTC.

Der Übergang zum Überschuss (18:15–18:30 UTC) markierte die vollständige Aktivierung des Verstärkten Betriebs: die erzwungene Aufrechterhaltung synchroner Einheiten auch über der tatsächlichen Nachfrage.`,
    rel_de: `Der Defizitgipfel von 1.690 MWh, der mehr als drei Stunden nach dem Zusammenbruch erreicht wurde, ist der quantitative Beweis, dass der Blackout kein augenblickliches und abgeschlossenes Ereignis war. Dieses Diagramm schließt die Lücke zwischen dem physischen Zusammenbruchsereignis und seinen operativen Konsequenzen während der 19 Stunden Wiederherstellung.`,
  },
  {
    id: 'chart-20',
    categoryId: 'cat5',
    tema: 'T5',
    order: 3,
    title: 'Imbalance Prices',
    fullTitle: 'Precios de los desvíos de balance — España',
    subtitle: '28–29 de abril de 2025 (€/MWh)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 17.1.G&H',
    stars: 4,
    component: 'ImbalancePricesChart',
    componentPath: '@site/src/components/EntsoeCharts/ImbalancePricesChart',
    desc: `Esta gráfica muestra la evolución de los precios de los desvíos de balance en España durante el evento. Los precios de desvíos reflejan el coste marginal de activar reservas de frecuencia (aFRR, mFRR) para corregir los desequilibrios entre generación y demanda. En los intervalos previos al colapso, los precios de desvíos mostraban valores elevados, indicando un sistema bajo estrés operativo.

Durante la crisis, los precios de desvíos se desplomaron técnicamente a cero o a valores no representativos, porque el mecanismo de mercado de desvíos dejó de funcionar al colapsar la red. La recuperación de precios significativos durante la Operación Reforzada documenta el coste extraordinario de reactivar el sistema.`,
    rel: `Los precios de desvíos son el termómetro más sensible del estrés operativo en tiempo real. Su evolución en las horas previas al colapso muestra señales de tensión que los modelos de seguridad estáticos no captaron. Su desaparición durante el blackout y su reaparición durante la Operación Reforzada documentan el ciclo completo de colapso y recuperación desde la perspectiva de los mercados de balance.`,
    desc_en: `This chart shows the evolution of balance imbalance prices in Spain during the event. Imbalance prices reflect the marginal cost of activating frequency reserves (aFRR, mFRR) to correct imbalances between generation and demand. In the intervals before the collapse, imbalance prices showed high values, indicating a system under operational stress.

During the crisis, imbalance prices technically collapsed to zero or non-representative values, because the market mechanism for imbalances stopped functioning when the grid collapsed. The recovery of significant prices during the Reinforced Operation documents the extraordinary cost of reactivating the system.`,
    rel_en: `Imbalance prices are the most sensitive thermometer of real-time operational stress. Their evolution in the hours before the collapse shows stress signals that static security models did not capture. Their disappearance during the blackout and their reappearance during the Reinforced Operation document the complete cycle of collapse and recovery from the perspective of balancing markets.`,
    desc_pt: `Este gráfico mostra a evolução dos preços dos desvios de balanço em Espanha durante o evento. Os preços dos desvios refletem o custo marginal de ativar reservas de frequência (aFRR, mFRR) para corrigir os desequilíbrios entre geração e procura. Nos intervalos anteriores ao colapso, os preços dos desvios mostravam valores elevados, indicando um sistema sob stress operativo.

Durante a crise, os preços dos desvios colapsaram tecnicamente para zero ou para valores não representativos, porque o mecanismo de mercado de desvios deixou de funcionar quando a rede colapsou. A recuperação de preços significativos durante a Operação Reforçada documenta o custo extraordinário de reativar o sistema.`,
    rel_pt: `Os preços dos desvios são o termómetro mais sensível do stress operativo em tempo real. A sua evolução nas horas anteriores ao colapso mostra sinais de tensão que os modelos de segurança estáticos não captaram. O seu desaparecimento durante o blackout e o seu reaparecimento durante a Operação Reforçada documentam o ciclo completo de colapso e recuperação na perspetiva dos mercados de balanço.`,
    desc_fr: `Ce graphique montre l'évolution des prix des déséquilibres de balance en Espagne pendant l'événement. Les prix des déséquilibres reflètent le coût marginal d'activation des réserves de fréquence (aFRR, mFRR) pour corriger les déséquilibres entre production et consommation. Dans les intervalles précédant l'effondrement, les prix des déséquilibres montraient des valeurs élevées, indiquant un système sous stress opérationnel.

Pendant la crise, les prix des déséquilibres se sont techniquement effondrés à zéro ou à des valeurs non représentatives, car le mécanisme de marché des déséquilibres a cessé de fonctionner lors de l'effondrement du réseau. La reprise de prix significatifs pendant l'Opération Renforcée documente le coût extraordinaire de la réactivation du système.`,
    rel_fr: `Les prix des déséquilibres sont le thermomètre le plus sensible du stress opérationnel en temps réel. Leur évolution dans les heures précédant l'effondrement montre des signaux de tension que les modèles de sécurité statiques n'ont pas captés. Leur disparition pendant le blackout et leur réapparition pendant l'Opération Renforcée documentent le cycle complet d'effondrement et de reprise du point de vue des marchés d'équilibrage.`,
    desc_it: `Questo grafico mostra l'evoluzione dei prezzi degli squilibri di bilanciamento in Spagna durante l'evento. I prezzi degli sbilanciamenti riflettono il costo marginale di attivazione delle riserve di frequenza (aFRR, mFRR) per correggere gli squilibri tra generazione e domanda. Negli intervalli precedenti il collasso, i prezzi degli sbilanciamenti mostravano valori elevati, indicando un sistema sotto stress operativo.

Durante la crisi, i prezzi degli sbilanciamenti sono tecnicamente crollati a zero o a valori non rappresentativi, perché il meccanismo di mercato per gli sbilanciamenti ha smesso di funzionare quando la rete è collassata. Il recupero di prezzi significativi durante l'Operazione Potenziata documenta il costo straordinario di riattivare il sistema.`,
    rel_it: `I prezzi degli sbilanciamenti sono il termometro più sensibile dello stress operativo in tempo reale. La loro evoluzione nelle ore precedenti il collasso mostra segnali di tensione che i modelli di sicurezza statici non hanno catturato. La loro scomparsa durante il blackout e la loro ricomparsa durante l'Operazione Potenziata documentano il ciclo completo di collasso e recupero dalla prospettiva dei mercati di bilanciamento.`,
    desc_de: `Dieses Diagramm zeigt die Entwicklung der Ausgleichspreise für Abweichungen in Spanien während des Ereignisses. Ausgleichspreise spiegeln die Grenzkosten der Aktivierung von Frequenzreserven (aFRR, mFRR) zur Korrektur von Ungleichgewichten zwischen Erzeugung und Nachfrage wider. In den Intervallen vor dem Zusammenbruch zeigten die Ausgleichspreise hohe Werte und signalisierten damit ein System unter operativem Stress.

Während der Krise brachen die Ausgleichspreise technisch auf Null oder nicht repräsentative Werte ein, weil der Marktmechanismus für Ausgleiche beim Netzzusammenbruch aufhörte zu funktionieren. Die Erholung signifikanter Preise während des Verstärkten Betriebs dokumentiert die außerordentlichen Kosten der Systemreaktivierung.`,
    rel_de: `Ausgleichspreise sind das empfindlichste Thermometer für operativen Stress in Echtzeit. Ihre Entwicklung in den Stunden vor dem Zusammenbruch zeigt Stresssignale, die statische Sicherheitsmodelle nicht erfasst haben. Ihr Verschwinden während des Blackouts und ihr Wiederauftauchen während des Verstärkten Betriebs dokumentieren den vollständigen Zyklus von Zusammenbruch und Erholung aus der Perspektive der Ausgleichsmärkte.`,
  },
  {
    id: 'chart-21',
    categoryId: 'cat5',
    tema: 'T5',
    order: 4,
    title: 'FRR Capacity — Reservas',
    fullTitle: 'Capacidad real y prevista de Reserva de Restauración de Frecuencia',
    subtitle: 'España — 2025 (MW por trimestre)',
    sourceBadge: 'ENTSO-E',
    techCode: 'SO GL 188–189',
    stars: 4,
    component: 'FrrCapacityChart',
    componentPath: '@site/src/components/EntsoeCharts/FrrCapacityChart',
    desc: `Esta gráfica muestra la capacidad de Reserva de Restauración de Frecuencia (FRR) — tanto para subir como bajar generación — que el operador español (REE) tenía disponible durante 2025. La capacidad prevista (outlook) era de 1600 MW tanto en subida como en bajada. La capacidad real disponible fue, de media, de ~1190 MW en Q2, con un mínimo de 889 MW (subida) y un máximo puntual de 1624 MW (bajada).

El segundo trimestre (Q2) incluye el fatídico 28 de abril. El desencadenante fue la súbita pérdida de importación desde Francia (~1200 MW). Para compensar ese déficit, la FRR automática debería haber saltado en segundos. Sin embargo, parte de la reserva estaba siendo utilizada en otros propósitos o no era suficientemente rápida.`,
    rel: `La capacidad FRR disponible en el momento del colapso (~889 MW en el peor caso del Q2) era inferior al déficit que debía compensar (~1200 MW perdidos desde Francia instantáneamente). Esta gráfica cuantifica la insuficiencia de reservas activas en el instante crítico y explica por qué el mecanismo automático de respuesta de frecuencia no fue capaz de contener la cascada de desconexiones.`,
    desc_en: `This chart shows the Frequency Restoration Reserve (FRR) capacity — both for upward and downward regulation — that the Spanish operator (REE) had available during 2025. The forecast capacity (outlook) was 1,600 MW for both upward and downward regulation. The actual available capacity averaged ~1,190 MW in Q2, with a minimum of 889 MW (upward) and a peak of 1,624 MW (downward).

The second quarter (Q2) includes the fateful April 28. The trigger was the sudden loss of import from France (~1,200 MW). To compensate for that deficit, the automatic FRR should have activated within seconds. However, part of the reserve was being used for other purposes or was not sufficiently fast.`,
    rel_en: `The FRR capacity available at the time of the collapse (~889 MW in the worst case of Q2) was less than the deficit it needed to compensate (~1,200 MW lost from France instantaneously). This chart quantifies the insufficiency of active reserves at the critical instant and explains why the automatic frequency response mechanism was unable to contain the cascade of disconnections.`,
    desc_pt: `Este gráfico mostra a capacidade de Reserva de Restauração de Frequência (FRR) — tanto para subida como para descida de geração — que o operador espanhol (REE) tinha disponível durante 2025. A capacidade prevista (outlook) era de 1.600 MW tanto em subida como em descida. A capacidade real disponível foi, em média, de ~1.190 MW no Q2, com um mínimo de 889 MW (subida) e um máximo pontual de 1.624 MW (descida).

O segundo trimestre (Q2) inclui o fatídico 28 de abril. O desencadeador foi a súbita perda de importação de França (~1.200 MW). Para compensar esse défice, a FRR automática deveria ter atuado em segundos. No entanto, parte da reserva estava a ser utilizada para outros fins ou não era suficientemente rápida.`,
    rel_pt: `A capacidade FRR disponível no momento do colapso (~889 MW no pior caso do Q2) era inferior ao défice que devia compensar (~1.200 MW perdidos de França instantaneamente). Este gráfico quantifica a insuficiência de reservas ativas no instante crítico e explica por que o mecanismo automático de resposta de frequência não foi capaz de conter a cascata de desconexões.`,
    desc_fr: `Ce graphique montre la capacité de Réserve de Restauration de Fréquence (FRR) — aussi bien pour monter que pour descendre la production — dont disposait l'opérateur espagnol (REE) en 2025. La capacité prévue (outlook) était de 1 600 MW tant en hausse qu'en baisse. La capacité réelle disponible était, en moyenne, de ~1 190 MW au T2, avec un minimum de 889 MW (hausse) et un maximum ponctuel de 1 624 MW (baisse).

Le deuxième trimestre (T2) comprend le fatidique 28 avril. Le déclencheur a été la soudaine perte d'importation depuis la France (~1 200 MW). Pour compenser ce déficit, la FRR automatique aurait dû s'activer en quelques secondes. Cependant, une partie de la réserve était utilisée à d'autres fins ou n'était pas suffisamment rapide.`,
    rel_fr: `La capacité FRR disponible au moment de l'effondrement (~889 MW dans le pire cas du T2) était inférieure au déficit qu'elle devait compenser (~1 200 MW perdus depuis la France instantanément). Ce graphique quantifie l'insuffisance des réserves actives à l'instant critique et explique pourquoi le mécanisme automatique de réponse en fréquence n'a pas été capable de contenir la cascade de déconnexions.`,
    desc_it: `Questo grafico mostra la capacità di Riserva di Ripristino della Frequenza (FRR) — sia per la regolazione verso l'alto che verso il basso — che l'operatore spagnolo (REE) aveva disponibile nel 2025. La capacità prevista (outlook) era di 1.600 MW sia in salita che in discesa. La capacità reale disponibile fu, in media, di ~1.190 MW nel Q2, con un minimo di 889 MW (salita) e un massimo puntuale di 1.624 MW (discesa).

Il secondo trimestre (Q2) include il fatidico 28 aprile. Il detonatore fu la súbita perdita di importazione dalla Francia (~1.200 MW). Per compensare quel deficit, la FRR automatica avrebbe dovuto attivarsi in pochi secondi. Tuttavia, parte della riserva era utilizzata per altri scopi o non era sufficientemente rapida.`,
    rel_it: `La capacità FRR disponibile nel momento del collasso (~889 MW nel caso peggiore del Q2) era inferiore al deficit che doveva compensare (~1.200 MW persi dalla Francia istantaneamente). Questo grafico quantifica l'insufficienza delle riserve attive nell'istante critico e spiega perché il meccanismo automatico di risposta in frequenza non fu in grado di contenere la cascata di disconnessioni.`,
    desc_de: `Dieses Diagramm zeigt die Frequency Restoration Reserve (FRR)-Kapazität — sowohl für Aufwärts- als auch für Abwärtsregelung — die dem spanischen Netzbetreiber (REE) im Jahr 2025 zur Verfügung stand. Die prognostizierte Kapazität (Outlook) betrug 1.600 MW für beide Richtungen. Die tatsächlich verfügbare Kapazität betrug im Q2 durchschnittlich ~1.190 MW, mit einem Minimum von 889 MW (aufwärts) und einem Spitzenwert von 1.624 MW (abwärts).

Das zweite Quartal (Q2) umfasst den verhängnisvollen 28. April. Der Auslöser war der plötzliche Verlust des Imports aus Frankreich (~1.200 MW). Um dieses Defizit auszugleichen, hätte die automatische FRR innerhalb von Sekunden ansprechen müssen. Jedoch wurde ein Teil der Reserve für andere Zwecke genutzt oder war nicht schnell genug.`,
    rel_de: `Die im Moment des Zusammenbruchs verfügbare FRR-Kapazität (~889 MW im schlimmsten Fall des Q2) war geringer als das auszugleichende Defizit (~1.200 MW, die augenblicklich aus Frankreich verloren gingen). Dieses Diagramm quantifiziert die Unzulänglichkeit der aktiven Reserven im kritischen Moment und erklärt, warum der automatische Frequenzregelmechanismus nicht in der Lage war, die Kaskade von Abschaltungen aufzuhalten.`,
  },
  {
    id: 'chart-22',
    categoryId: 'cat5',
    tema: 'T5',
    order: 5,
    title: 'Cost of Congestion Management',
    fullTitle: 'Costes mensuales de gestión de congestión (countertrading)',
    subtitle: 'España, enero–diciembre 2025 (€)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 13.1.C',
    stars: 3,
    component: 'CostCongestionChart',
    componentPath: '@site/src/components/EntsoeCharts/CostCongestionChart',
    desc: `Esta gráfica muestra los costes mensuales asociados a la gestión de congestiones en la red de transporte española. Los datos revelan una tendencia decreciente durante el primer trimestre: 8.811.122 € en enero, 6.900.011 € en febrero, 4.144.098 € en marzo. A partir de abril, el coste se anula completamente (0 €) hasta octubre.

El coste cero de abril es el dato más revelador. No indica ausencia de problemas de congestión, sino exactamente lo contrario: cuando el sistema colapsó el 28 de abril, las operaciones de countertrading y redespacho dejaron de tener sentido porque ya no existía un flujo de potencia coordinado que gestionar. Los elevados costes de los tres meses previos evidencian que el sistema ya operaba con márgenes ajustados.`,
    rel: `Los costes de gestión de congestión de enero–marzo (varios millones de euros mensuales) son la señal financiera de un sistema que operaba sistemáticamente al límite de sus capacidades de transporte. El apagón de abril no fue un evento imprevisto en términos estructurales: la red venía acumulando presión durante meses. La transición abrupta a coste cero en abril refleja la desaparición del sistema como entidad operativa, no su mejora.`,
    desc_en: `This chart shows the monthly costs associated with congestion management on the Spanish transmission grid. The data reveals a decreasing trend during the first quarter: €8,811,122 in January, €6,900,011 in February, €4,144,098 in March. From April onwards, the cost was completely zeroed (€0) until October.

The zero cost in April is the most revealing datum. It does not indicate the absence of congestion problems, but exactly the opposite: when the system collapsed on April 28, countertrading and redispatch operations ceased to make sense because there was no longer a coordinated power flow to manage. The high costs of the previous three months show that the system was already operating with tight margins.`,
    rel_en: `The congestion management costs of January–March (several million euros per month) are the financial signal of a system that was systematically operating at the limit of its transport capacities. The April blackout was not an unforeseen event in structural terms: the grid had been accumulating pressure for months. The abrupt transition to zero cost in April reflects the disappearance of the system as an operational entity, not its improvement.`,
    desc_pt: `Este gráfico mostra os custos mensais associados à gestão de congestionamentos na rede de transporte espanhola. Os dados revelam uma tendência decrescente durante o primeiro trimestre: 8.811.122 € em janeiro, 6.900.011 € em fevereiro, 4.144.098 € em março. A partir de abril, o custo anula-se completamente (0 €) até outubro.

O custo zero de abril é o dado mais revelador. Não indica ausência de problemas de congestionamento, mas exatamente o contrário: quando o sistema colapsou a 28 de abril, as operações de countertrading e redespacho deixaram de fazer sentido porque já não existia um fluxo de potência coordenado para gerir. Os elevados custos dos três meses anteriores evidenciam que o sistema já operava com margens ajustadas.`,
    rel_pt: `Os custos de gestão de congestionamento de janeiro–março (vários milhões de euros mensais) são o sinal financeiro de um sistema que operava sistematicamente no limite das suas capacidades de transporte. O apagão de abril não foi um evento imprevisto em termos estruturais: a rede vinha acumulando pressão durante meses. A transição abrupta para custo zero em abril reflete o desaparecimento do sistema como entidade operativa, não a sua melhoria.`,
    desc_fr: `Ce graphique montre les coûts mensuels associés à la gestion des congestions sur le réseau de transport espagnol. Les données révèlent une tendance décroissante au cours du premier trimestre : 8 811 122 € en janvier, 6 900 011 € en février, 4 144 098 € en mars. À partir d'avril, le coût s'annule complètement (0 €) jusqu'en octobre.

Le coût zéro d'avril est la donnée la plus révélatrice. Il n'indique pas l'absence de problèmes de congestion, mais exactement le contraire : lorsque le système s'est effondré le 28 avril, les opérations de countertrading et de redispatching n'avaient plus de sens car il n'existait plus de flux de puissance coordonné à gérer. Les coûts élevés des trois mois précédents montrent que le système fonctionnait déjà avec des marges réduites.`,
    rel_fr: `Les coûts de gestion des congestions de janvier à mars (plusieurs millions d'euros par mois) sont le signal financier d'un système qui fonctionnait systématiquement à la limite de ses capacités de transport. La panne d'avril n'était pas un événement imprévu sur le plan structurel : le réseau accumulait des pressions depuis des mois. La transition abrupte vers un coût zéro en avril reflète la disparition du système en tant qu'entité opérationnelle, non son amélioration.`,
    desc_it: `Questo grafico mostra i costi mensili associati alla gestione delle congestioni nella rete di trasmissione spagnola. I dati rivelano una tendenza decrescente durante il primo trimestre: 8.811.122 € a gennaio, 6.900.011 € a febbraio, 4.144.098 € a marzo. A partire da aprile, il costo si azzera completamente (0 €) fino ad ottobre.

Il costo zero di aprile è il dato più rivelatore. Non indica l'assenza di problemi di congestione, ma esattamente il contrario: quando il sistema è collassato il 28 aprile, le operazioni di countertrading e redespacho hanno smesso di avere senso perché non esisteva più un flusso di potenza coordinato da gestire. Gli elevati costi dei tre mesi precedenti evidenziano che il sistema operava già con margini ridotti.`,
    rel_it: `I costi di gestione delle congestioni di gennaio–marzo (diversi milioni di euro mensili) sono il segnale finanziario di un sistema che operava sistematicamente al limite delle sue capacità di trasporto. Il blackout di aprile non fu un evento imprevisto in termini strutturali: la rete stava accumulando pressione da mesi. La brusca transizione a costo zero in aprile riflette la scomparsa del sistema come entità operativa, non il suo miglioramento.`,
    desc_de: `Dieses Diagramm zeigt die monatlichen Kosten für das Engpassmanagement im spanischen Übertragungsnetz. Die Daten zeigen einen rückläufigen Trend im ersten Quartal: 8.811.122 € im Januar, 6.900.011 € im Februar, 4.144.098 € im März. Ab April wurden die Kosten vollständig auf Null gesetzt (0 €) bis Oktober.

Die Nullkosten im April sind das aufschlussreichste Datum. Sie deuten nicht auf das Fehlen von Engpassproblemen hin, sondern auf das Gegenteil: Als das System am 28. April zusammenbrach, hatten Countertrading- und Redispatch-Operationen keinen Sinn mehr, weil es keinen koordinierten Leistungsfluss mehr zu verwalten gab. Die hohen Kosten der vorangegangenen drei Monate zeigen, dass das System bereits mit knappen Margen betrieben wurde.`,
    rel_de: `Die Engpassmanagementkosten von Januar bis März (mehrere Millionen Euro pro Monat) sind das finanzielle Signal eines Systems, das systematisch an der Grenze seiner Transportkapazitäten betrieben wurde. Der April-Blackout war strukturell gesehen kein unvorhergesehenes Ereignis: Das Netz hatte monatelang Druck angesammelt. Der abrupte Übergang zu Nullkosten im April spiegelt das Verschwinden des Systems als operative Einheit wider, nicht seine Verbesserung.`,
  },
  {
    id: 'chart-23',
    categoryId: 'cat6',
    tema: 'T6',
    order: 6,
    title: 'Fall-backs y Protocolos Emergencia',
    fullTitle: 'Desconexiones de TSOs y activación de procedimientos de contingencia',
    subtitle: 'Europa, 28–29 de abril de 2025',
    sourceBadge: 'ENTSO-E',
    techCode: 'IFs IN 7.2 / mFRR 3.11 / aFRR 3.10',
    stars: 5,
    component: 'FallbacksChart',
    componentPath: '@site/src/components/EntsoeCharts/FallbacksChart',
    desc: `Esta visualización representa los períodos en los que distintos operadores de red europeos declararon desconexiones parciales o totales de sus sistemas, activando procedimientos de contingencia (fallback). Para España, la desconexión del proceso IN comenzó a las 10:34 UTC (12:34 CEST) — un minuto después del colapso — y se prolongó hasta las 22:00 UTC. Portugal registró desconexiones similares. Otros países (Estonia, Letonia, Lituania, Finlandia, Suiza) también activaron fallbacks.

La ausencia de fallbacks automáticos preventivos en los minutos previos al colapso es tan significativa como su activación masiva posterior. El sistema no escaló por niveles de emergencia: el EAS etiquetó al sistema ibérico como "Normal" a las 12:32:00 CEST y registró el estado de "Blackout" a las 12:33:29 CEST, sin ningún estado intermedio.`,
    rel: `Esta gráfica documenta dos fallos: el primero, la ausencia de activación preventiva de procedimientos de contingencia antes del colapso; el segundo, la propagación de disrupciones operativas a múltiples TSOs europeos una vez producido el blackout ibérico. Señala una brecha estructural en el sistema de alerta temprana europeo para capturar la dinámica rápida de tensión en redes de baja inercia.`,
    desc_en: `This visualisation represents the periods during which various European network operators declared partial or total disconnections of their systems, activating contingency procedures (fallback). For Spain, the disconnection of the IN process began at 10:34 UTC (12:34 CEST) — one minute after the collapse — and lasted until 22:00 UTC. Portugal recorded similar disconnections. Other countries (Estonia, Latvia, Lithuania, Finland, Switzerland) also activated fallbacks.

The absence of preventive automatic fallbacks in the minutes before the collapse is as significant as their massive subsequent activation. The system did not escalate through emergency levels: the EAS labelled the Iberian system as "Normal" at 12:32:00 CEST and recorded the "Blackout" state at 12:33:29 CEST, with no intermediate state.`,
    rel_en: `This chart documents two failures: the first, the absence of preventive activation of contingency procedures before the collapse; the second, the propagation of operational disruptions to multiple European TSOs once the Iberian blackout occurred. It points to a structural gap in the European early warning system for capturing the rapid voltage dynamics in low-inertia grids.`,
    desc_pt: `Esta visualização representa os períodos em que diferentes operadores de rede europeus declararam desconexões parciais ou totais dos seus sistemas, ativando procedimentos de contingência (fallback). Para Espanha, a desconexão do processo IN começou às 10:34 UTC (12:34 CEST) — um minuto após o colapso — e prolongou-se até às 22:00 UTC. Portugal registou desconexões semelhantes. Outros países (Estónia, Letónia, Lituânia, Finlândia, Suíça) também ativaram fallbacks.

A ausência de fallbacks automáticos preventivos nos minutos anteriores ao colapso é tão significativa como a sua ativação massiva posterior. O sistema não escalou por níveis de emergência: o EAS classificou o sistema ibérico como "Normal" às 12:32:00 CEST e registou o estado de "Blackout" às 12:33:29 CEST, sem qualquer estado intermédio.`,
    rel_pt: `Este gráfico documenta duas falhas: a primeira, a ausência de ativação preventiva de procedimentos de contingência antes do colapso; a segunda, a propagação de perturbações operativas a múltiplos TSOs europeus após o blackout ibérico. Aponta para uma lacuna estrutural no sistema europeu de alerta precoce para capturar a dinâmica rápida de tensão em redes de baixa inércia.`,
    desc_fr: `Cette visualisation représente les périodes pendant lesquelles différents opérateurs de réseau européens ont déclaré des déconnexions partielles ou totales de leurs systèmes, activant des procédures de contingence (fallback). Pour l'Espagne, la déconnexion du processus IN a commencé à 10h34 UTC (12h34 CEST) — une minute après l'effondrement — et s'est prolongée jusqu'à 22h00 UTC. Le Portugal a enregistré des déconnexions similaires. D'autres pays (Estonie, Lettonie, Lituanie, Finlande, Suisse) ont également activé des fallbacks.

L'absence de fallbacks automatiques préventifs dans les minutes précédant l'effondrement est aussi significative que leur activation massive ultérieure. Le système n'a pas escaladé par niveaux d'urgence : le EAS a étiqueté le système ibérique comme "Normal" à 12h32:00 CEST et a enregistré l'état "Blackout" à 12h33:29 CEST, sans aucun état intermédiaire.`,
    rel_fr: `Ce graphique documente deux défaillances : la première, l'absence d'activation préventive des procédures de contingence avant l'effondrement ; la seconde, la propagation des perturbations opérationnelles à plusieurs TSOs européens une fois le blackout ibérique survenu. Il pointe une lacune structurelle dans le système européen d'alerte précoce pour capturer la dynamique rapide de tension dans les réseaux à faible inertie.`,
    desc_it: `Questa visualizzazione rappresenta i periodi in cui diversi operatori di rete europei hanno dichiarato disconnessioni parziali o totali dei loro sistemi, attivando procedure di contingenza (fallback). Per la Spagna, la disconnessione del processo IN è iniziata alle 10:34 UTC (12:34 CEST) — un minuto dopo il collasso — e si è prolungata fino alle 22:00 UTC. Il Portogallo ha registrato disconnessioni simili. Altri paesi (Estonia, Lettonia, Lituania, Finlandia, Svizzera) hanno anche attivato fallback.

L'assenza di fallback automatici preventivi nei minuti precedenti il collasso è tanto significativa quanto la loro massiccia attivazione successiva. Il sistema non ha scalato per livelli di emergenza: l'EAS ha etichettato il sistema iberico come "Normale" alle 12:32:00 CEST e ha registrato lo stato "Blackout" alle 12:33:29 CEST, senza alcuno stato intermedio.`,
    rel_it: `Questo grafico documenta due guasti: il primo, l'assenza di attivazione preventiva delle procedure di contingenza prima del collasso; il secondo, la propagazione di perturbazioni operative a molteplici TSO europei dopo il blackout iberico. Indica una lacuna strutturale nel sistema europeo di allarme rapido per catturare la dinamica rapida della tensione nelle reti a bassa inerzia.`,
    desc_de: `Diese Visualisierung stellt die Zeiträume dar, in denen verschiedene europäische Netzbetreiber teilweise oder vollständige Abschaltungen ihrer Systeme erklärten und Notfallverfahren (Fallback) aktivierten. Für Spanien begann die Abschaltung des IN-Prozesses um 10:34 UTC (12:34 CEST) — eine Minute nach dem Zusammenbruch — und dauerte bis 22:00 UTC. Portugal verzeichnete ähnliche Abschaltungen. Andere Länder (Estland, Lettland, Litauen, Finnland, Schweiz) aktivierten ebenfalls Fallbacks.

Das Fehlen präventiver automatischer Fallbacks in den Minuten vor dem Zusammenbruch ist ebenso bedeutsam wie ihre massenhafte anschließende Aktivierung. Das System eskalierte nicht durch Notfallstufen: Das EAS kennzeichnete das iberische System um 12:32:00 CEST als "Normal" und registrierte den "Blackout"-Status um 12:33:29 CEST, ohne jeden Zwischenzustand.`,
    rel_de: `Dieses Diagramm dokumentiert zwei Versagen: Erstens das Fehlen präventiver Aktivierung von Notfallverfahren vor dem Zusammenbruch; zweitens die Ausbreitung operativer Störungen auf mehrere europäische TSOs nach dem iberischen Blackout. Es weist auf eine strukturelle Lücke im europäischen Frühwarnsystem hin, die schnelle Spannungsdynamiken in Netzen mit geringer Trägheit nicht erfassen kann.`,
  },
];

// Helper: obtener gráficas de una categoría
export function getChartsByCategory(categoryId) {
  return CHARTS.filter(c => c.categoryId === categoryId).sort((a, b) => a.order - b.order);
}

// Helper: obtener categoría por id
export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}

// Helper: obtener gráfica anterior y siguiente dentro de la misma categoría
export function getAdjacentCharts(chartId) {
  const chart = CHARTS.find(c => c.id === chartId);
  if (!chart) return { prev: null, next: null };
  const siblings = getChartsByCategory(chart.categoryId);
  const idx = siblings.findIndex(c => c.id === chartId);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const nextInCat = idx < siblings.length - 1 ? siblings[idx + 1] : null;
  // Si es el último de la categoría, ofrecer la primera gráfica de la siguiente categoría
  let nextCategoryFirst = null;
  if (!nextInCat) {
    const catIdx = CATEGORIES.findIndex(c => c.id === chart.categoryId);
    if (catIdx < CATEGORIES.length - 1) {
      const nextCat = CATEGORIES[catIdx + 1];
      nextCategoryFirst = getChartsByCategory(nextCat.id)[0] || null;
    }
  }
  return { prev, next: nextInCat, nextCategoryFirst };
}
