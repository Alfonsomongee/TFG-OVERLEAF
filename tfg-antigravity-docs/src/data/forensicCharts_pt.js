// src/data/forensicCharts.js
// Mapa maestro de las 23 gráficas forenses organizadas en 5 categorías temáticas.

export const CATEGORIES = [
  {
    id: 'cat1',
    name: 'Procura e Sistema',
    question: 'O que se esperava que o sistema consumisse e o que aconteceu realmente?',
    color: '#C0392B',
    colorLight: 'rgba(192,57,43,0.12)',
    icon: '⚡',
  },
  {
    id: 'cat2',
    name: 'Geração e Capacidade',
    question: 'O que podia o sistema gerar, o que estava a gerar e por qual tecnologia?',
    color: '#E67E22',
    colorLight: 'rgba(230,126,34,0.12)',
    icon: '🏭',
  },
  {
    id: 'cat3',
    name: 'Mercados e Preços',
    question: 'Que sinais económicos emitiu o sistema antes, durante e depois do colapso?',
    color: '#D4AC0D',
    colorLight: 'rgba(212,172,13,0.12)',
    icon: '📈',
  },
  {
    id: 'cat4',
    name: 'Interconexões e Fluxos',
    question: 'Como se comportaram as fronteiras elétricas antes, durante e depois do apagão?',
    color: '#27AE60',
    colorLight: 'rgba(39,174,96,0.12)',
    icon: '🔗',
  },
  {
    id: 'cat5',
    name: 'Balanço, Estabilidade e Resposta',
    question: 'Como o operador perdeu o controlo do sistema e como tentou recuperá-lo?',
    color: '#2471A3',
    colorLight: 'rgba(36,113,163,0.12)',
    icon: '⚖️',
  },
];

// Marcadores de la línea de tiempo (en minutos desde medianoche CEST = UTC+2)
export const TIMELINE_MARKERS = [
  { id: 'osc1', timeUTC: '10:03', timeCEST: '12:03', label: 'Primeira oscilação', severity: 'critical', relatedCharts: ['chart-1', 'chart-3', 'chart-14'] },
  { id: 'osc2', timeUTC: '10:19', timeCEST: '12:19', label: 'Segunda oscilação', severity: 'critical', relatedCharts: ['chart-1', 'chart-14', 'chart-18'] },
  { id: 'sync', timeUTC: '10:33', timeCEST: '12:33', label: 'Perda de sincronismo', severity: 'critical', relatedCharts: ['chart-1', 'chart-2', 'chart-14', 'chart-15', 'chart-18', 'chart-19'] },
  { id: 'island', timeUTC: '10:35', timeCEST: '12:35', label: 'Isolamento ibérico', severity: 'critical', relatedCharts: ['chart-13', 'chart-14', 'chart-15', 'chart-16', 'chart-17'] },
  { id: 'peak', timeUTC: '11:45', timeCEST: '13:45', label: 'Pico de défice', severity: 'warning', relatedCharts: ['chart-18', 'chart-19', 'chart-20'] },
  { id: 'recovery', timeUTC: '16:15', timeCEST: '18:15', label: 'Início da recuperação', severity: 'recovery', relatedCharts: ['chart-1', 'chart-2', 'chart-18', 'chart-23'] },
  { id: 'restored', timeUTC: '05:00+1', timeCEST: '~07:00 (29A)', label: 'Restauração completa', severity: 'recovery', relatedCharts: ['chart-1', 'chart-2'] },
];

// Las 23 gráficas
export const CHARTS = [
  // ── CAT 1: DEMANDA Y SISTEMA ──────────────────────────────────────────
  {
    id: 'chart-1',
    categoryId: 'cat1',
    order: 1,
    title: 'Procura Peninsular',
    fullTitle: 'Evolução da procura de eletricidade em Espanha — 28 e 29 de abril de 2025',
    subtitle: 'Procura Real vs. Programada vs. Prevista · resolução de 5 minutos',
    sourceBadge: 'ESIOS',
    techCode: 'Indicadores 1293, 1775, 460',
    stars: 5,
    component: 'DemandaChart',
    componentPath: '@site/src/components/EsiosCharts/DemandaChart',
    desc: `Durante a manhã de 28 de abril, a procura real peninsular situava-se entre 19.000 e 27.000 MW — muito abaixo do pico histórico (>45.000 MW) e coerente com uma segunda-feira de primavera com alta geração solar. As curvas de programação e previsão sobrepunham-se à procura real com um desvio inferior a 2%, demonstrando que o cenário de baixa carga era perfeitamente antecipado pelo operador. Esta aparente normalidade torna ainda mais notório o que acontece a seguir: entre as 12:30 e as 12:35 CEST, a procura real caiu de 25.184 MW para 0 MW num degrau vertical. A programação e a previsão anularam-se simultaneamente. Os próprios equipamentos de telemedição SCADA deixaram de transmitir por perderem a alimentação elétrica. Não foi uma queda gradual; foi um zero de tensão certificado.

A recuperação foi escalonada e extremamente lenta. A partir das 13:05 CEST surgiram valores residuais — 37 MW, depois 204 MW — que cresceram ao longo da tarde e da noite seguintes. Só na madrugada de 29 de abril é que a procura voltou a superar os 20.000 MW, e o dia completo de 29 decorreu em processo de normalização progressiva. O sistema necessitou de quase 19 horas para restabelecer o fornecimento em toda a península.`,
    rel: `Este é o gráfico mais importante da análise. É o electrocardiograma plano do sistema ibérico. Com resolução de 5 minutos, documenta o instante exato do colapso total, a ausência de sinais de deterioração gradual prévia na procura (o que confirma que a falha foi dinâmica e ultra-rápida), e a lentidão da restauração mediante estratégias Top-Down (apoio de França) e Bottom-Up (arranque autónomo de centrais hidroelétricas). É o ponto de entrada obrigatório de qualquer análise forense do 28-A.`,
                                          },
  {
    id: 'chart-2',
    categoryId: 'cat1',
    order: 2,
    title: 'Carga Total — ES + PT',
    fullTitle: 'Procura real face à previsão day-ahead — Espanha e Portugal',
    subtitle: 'CTA|ES e CTA|PT · 28–29 de abril de 2025 · MTU horário',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 6.1.A&B',
    stars: 5,
    component: 'TotalLoadChart',
    componentPath: '@site/src/components/EntsoeCharts/TotalLoadChart',
    desc: `Este gráfico compara a procura real horária com a previsão day-ahead para Espanha e Portugal durante os dois dias do evento. Antes do colapso, a procura real espanhola situava-se entre 25.000 e 27.000 MW, com uma precisão de previsão superior a 98%. A partir das 10:00–11:00 UTC os valores de procura real para Espanha desaparecem: os equipamentos de telemedição SCADA perdem alimentação. Em Portugal, pelo contrário, a queda é registada: a procura real despenca para 90–92 MW — apenas 2% do previsto — permanecendo em valores residuais durante horas antes de começar a recuperar lentamente a partir das 20:00–21:00 UTC.

A recuperação espanhola não produz valores significativos de procura real até às 22:00–23:00 de 29 de abril (22.801 MW), confirmando que o processo de restauro completo exigiu quase 19 horas desde o colapso. A procura portuguesa funciona como "termómetro" do processo de re-energização.`,
    rel: `Este é o único indicador que permite responder com precisão horária à questão forense central: o apagão foi um evento exclusivamente espanhol ou um colapso sistémico ibérico? A simultaneidade ou o desfasamento entre a queda de Espanha e a de Portugal nos intervalos MTU determina se houve cascata transfronteiriça (ES → PT) ou desacoplamento simultâneo do sistema MIBEL. A precisão das previsões day-ahead demonstra que o cenário operativo era perfeitamente conhecido: a falha do 28-A não foi um "cisne negro", mas uma gestão de risco inadequada face a condições previstas.`,
                                          },
  {
    id: 'chart-3',
    categoryId: 'cat1',
    order: 3,
    title: 'Programa de Produção',
    fullTitle: 'Repartição da energia programada nos mercados de produção',
    subtitle: 'Espanha, 28 de abril de 2025 (MWh)',
    sourceBadge: 'ESIOS',
    techCode: 'Mercado de Producción',
    stars: 4,
    component: 'ProgramacionChart',
    componentPath: '@site/src/components/EsiosCharts/ProgramacionChart',
    desc: `Este gráfico mostra a repartição da energia total programada para 28 de abril nos diferentes segmentos do mercado de produção espanhol: mercado diário SPOT (18.592,3 MWh), restrições técnicas Fase I (4.383,6 MWh), mercado intradiário (2.420,3 MWh), restrições em tempo real (305,2 MWh), intradiário contínuo (66,7 MWh), reserva de substituição RR (900 MWh), regulação terciária mFRR (639,8 MWh) e regulação secundária aFRR (222,3 MWh). O volume total programado ascendeu a 27.811,76 MWh.

O colapso das 12:33 CEST anulou fisicamente toda esta programação de forma instantânea. A energia não fornecida estimada para o conjunto do evento situa-se entre 150.000 e 180.000 MWh, várias vezes superior ao volume diário aqui programado.`,
    rel: `A anulação simultânea de todos os segmentos de mercado — SPOT, intradiário, restrições, reservas — confirma o caráter total do zero de tensão: não foi uma interrupção parcial nem um problema circunscrito a uma zona geográfica. Este gráfico é a prova documental mais direta do blackout sistémico na perspetiva dos mercados.`,
                                          },

  // ── CAT 2: GENERACIÓN Y CAPACIDAD ─────────────────────────────────────
  {
    id: 'chart-4',
    categoryId: 'cat2',
    order: 1,
    title: 'Potência Disponível por Tecnologia',
    fullTitle: 'Comparação de potência disponível por tecnologia',
    subtitle: 'Madrugada de 28 e 29 de abril de 2025 (MW)',
    sourceBadge: 'ESIOS',
    techCode: 'ESIOS Potencia',
    stars: 4,
    component: 'PotenciaChart',
    componentPath: '@site/src/components/EsiosCharts/PotenciaChart',
    desc: `Este gráfico compara, para as 00:00 de cada jornada, a potência instalada total, a disponível operacionalmente e a indisponível. Na madrugada de 28 de abril, a potência disponível total era de 39.077,5 MW face a uma potência instalada de 51.709,5 MW — com 19.238,2 MW indisponíveis. Por tecnologia, destacam-se as centrais de ciclo combinado a gás (16.660,7 MW disponíveis), a hidroelétrica de albufeira (13.518,7 MW), a nuclear (5.820,1 MW) e o bombagem (2.153,9 MW).

No entanto, a potência disponível na madrugada contrasta radicalmente com a geração real durante o colapso. Ao meio-dia do dia 28, as centrais de ciclo combinado geravam apenas 2.775 MW dos 16.660 MW disponíveis. A diferença entre potência disponível e potência efetivamente despachada é a marca do mecanismo de ordem de mérito económico.`,
    rel: `Este gráfico refuta com dados a hipótese mais difundida no debate público: o sistema tinha potência mais do que suficiente para cobrir a procura. Com 39 GW disponíveis face a uma procura de 25 GW, não existia qualquer défice de recursos físicos. O colapso não foi uma falha de geração, mas uma falha de rede precipitada pela decisão de mercado de não despachar a geração síncrona disponível.`,
                                          },
  {
    id: 'chart-5',
    categoryId: 'cat2',
    order: 2,
    title: 'Capacidade Instalada por Tipo',
    fullTitle: 'Capacidade instalada do sistema elétrico peninsular por tipo de tecnologia',
    subtitle: '2025 (MW) — Península Ibérica',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 14.1.A',
    stars: 4,
    component: 'InstalledCapacityChart',
    componentPath: '@site/src/components/EntsoeCharts/InstalledCapacityChart',
    desc: `Este gráfico mostra a capacidade de geração elétrica instalada na Península Ibérica discriminada por tecnologia. A capacidade total ascende a 121.873 MW: eólica onshore (30.932 MW), solar fotovoltaica (29.047 MW), gás fóssil (29.943 MW), hidroelétrica de albufeira (15.765 MW), nuclear (7.117 MW), bombagem hidroelétrica (3.418 MW) e carvão (1.820 MW). A capacidade síncrona convencional soma aproximadamente 61 GW.

A armadilha está na diferença entre capacidade instalada e capacidade efetivamente despachada. No dia 28 de abril, por ordem de mérito económico, praticamente a totalidade dos 29 GW de ciclos combinados estava desligada. O mix instantâneo era dominado em 82% por IBR — fundamentalmente solar fotovoltaica — com apenas 7 GW de geração síncrona ativa.`,
    rel: `A capacidade síncrona instalada não serve de nada se estiver desligada por razões de mercado. Este gráfico deve ser lido em conjunto com o de geração real: o primeiro mostra os recursos disponíveis em papel; o segundo os que estavam operacionais no momento crítico. A diferença — mais de 25 GW de geração síncrona instalada mas não despachada — é a vulnerabilidade estrutural que tornou possível o apagão.`,
                                          },
  {
    id: 'chart-6',
    categoryId: 'cat2',
    order: 3,
    title: 'Geração Real por Unidade',
    fullTitle: 'Geração real por unidade de produção — Estado do mix durante o colapso',
    subtitle: '28 de abril de 2025 (MW)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 16.1.A',
    stars: 5,
    component: 'ActualGenerationChart',
    componentPath: '@site/src/components/EntsoeCharts/ActualGenerationChart',
    desc: `Estes gráficos mostram a potência ativa gerada por cada unidade de produção no período imediatamente posterior ao colapso. Os dados agregados por tecnologia apresentam o seguinte estado do mix durante a crise: geração solar a 0 MW (queda total), eólica onshore a apenas 152 MW (menos de 5% da previsão), ciclos combinados a gás a 2.775 MW, nuclear a 3.369 MW, hidroelétrica de albufeira a 1.012 MW e bombagem hidroelétrica a 1.416 MW.

O ranking das 20 unidades individuais com maior geração é liderado pelas centrais nucleares: Vandellós (1.044 MW), Ascó 2 (1.004 MW), Ascó 1 (681 MW) e Almaraz 2 (643 MW). Nenhuma instalação solar ou eólica aparece neste ranking.`,
    rel: `Este gráfico é o mais direto na análise de causalidade técnica. Demonstra que o colapso não foi causado por falta de recurso primário, mas pela desconexão massiva dos inversores IBR em consequência das sobretensões. A geração síncrona remanescente — nuclear (~3,4 GW), ciclos combinados (~2,8 GW) e hidráulica (~2,4 GW) — constituiu o único suporte eletromagnético do sistema nos segundos do colapso. Sem essas máquinas rotativas, não teria havido possibilidade de Black Start.`,
                                          },
  {
    id: 'chart-7',
    categoryId: 'cat2',
    order: 4,
    title: 'Reservatórios de Água e Hidroelétrica',
    fullTitle: 'Armazenamento em albufeiras e centrais hidroelétricas — Espanha, 2025',
    subtitle: 'MWh por semana',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 16.1.D',
    stars: 3,
    component: 'HydroReservoirChart',
    componentPath: '@site/src/components/EntsoeCharts/HydroReservoirChart',
    desc: `Este gráfico mostra a evolução semanal da água armazenada nas albufeiras e centrais hidroelétricas espanholas ao longo de 2025. O apagão de 28 de abril de 2025 ocorreu na semana 18, com um armazenamento de 15,0 TWh — fase de enchimento acelerado, nível intermédio-alto, praticamente no máximo histórico da série.

Este volume disponível foi determinante para o processo de restauração. As centrais hidroelétricas de albufeira, com capacidade de arranque autónomo (Black Start) sem necessidade de energia externa, foram as primeiras unidades a re-energizar troços isolados da rede.`,
    rel: `A hidraulicidade não foi um fator limitante no colapso do 28-A. Com 15 TWh armazenados, as albufeiras tinham capacidade suficiente para sustentar o processo de restauração durante dias. A fortuna hidrológica desse abril — ano excecionalmente húmido — foi um fator positivo crítico na velocidade de recuperação. Sem esse "pulmão hidráulico", o processo de Black Start teria exigido dias em vez das ~19 horas registadas.`,
                                          },
  {
    id: 'chart-8',
    categoryId: 'cat2',
    order: 5,
    title: 'Outros Indicadores — CO₂ + Renováveis',
    fullTitle: 'Percentagem de geração livre de CO₂ e previsões renováveis',
    subtitle: '27–29 de abril de 2025',
    sourceBadge: 'ESIOS',
    techCode: 'Indicadores 151, 541, 1395',
    stars: 4,
    component: 'GenericEsiosChartCO2',
    componentPath: null, // se renderiza con GenericEsiosChart
    componentProps: { dataUrl: '/data/esios/otros-indicadores.json', title: 'Geração livre de CO₂ (%)', unit: '%', includeKeys: ['Porcentaje de generación libre de CO2'] },
    desc: `Este indicador composto mede em tempo real a fração da geração elétrica peninsular proveniente de fontes livres de emissões diretas. Durante a manhã de 28 de abril, o índice superou os 90%, atingindo 91,2% às 11:30 CEST — o nível mais elevado registado num dia útil até essa data.

A queda é instantânea e total: de 91% para 0% nos segundos do zero de tensão, refletindo a desconexão massiva e simultânea de solar, eólica e nuclear. A recuperação gradual durante o dia 29 de abril documenta o ritmo da restauração: primeiro o nuclear e a hidráulica síncrona, depois o ciclo combinado a gás, e finalmente a reintegração progressiva dos inversores renováveis.`,
    rel: `O sistema colapsou no seu ponto de máxima "limpeza" ambiental, com 91% de geração livre de emissões. Este paradoxo é a refutação mais direta da narrativa que atribuiu o apagão a um excesso de renováveis: o problema não foi a quantidade de energia renovável, mas a ausência da inércia e da potência reativa indutiva que apenas as máquinas rotativas síncronas fornecem.`,
                                          },

  // ── CAT 3: MERCADOS Y PRECIOS ──────────────────────────────────────────
  {
    id: 'chart-9',
    categoryId: 'cat3',
    order: 1,
    title: 'Mercados e Preços — SPOT vs PVPC',
    fullTitle: 'Comparação de preços de eletricidade — Mercado grossista SPOT vs. PVPC 2.0TD',
    subtitle: '28–29 de abril de 2025, €/MWh',
    sourceBadge: 'ESIOS',
    techCode: 'Indicadores 600 y 1001',
    stars: 5,
    component: 'PreciosChart',
    componentPath: '@site/src/components/EsiosCharts/PreciosChart',
    desc: `Durante a manhã de 28 de abril, o preço SPOT caiu para valores negativos — mínimo de –3,00 €/MWh na hora 12:00–13:00 CEST — em consequência do excedente de geração solar fotovoltaica que deslocou, por ordem de mérito, os ciclos combinados a gás. Simultaneamente, o preço PVPC mantinha-se acima de 130 €/MWh na mesma franja horária. A diferença entre as duas curvas — preço grossista negativo face à tarifa retalhista elevada — é o sinal económico mais claro do desequilíbrio estrutural.

O apagão não alterou diretamente os preços horários já fixados no dia anterior, mas as suas consequências refletem-se nos dias seguintes: durante a noite do dia 28 e o dia 29, o preço SPOT recuperou até 35 €/MWh pelo maior uso de geração a gás na Operação Reforçada da REE.`,
    rel: `O preço SPOT negativo na hora do colapso não é uma consequência do apagão — foi fixado 24 horas antes — mas um sinal de alarme que o sistema não soube interpretar. Um preço grossista negativo indica que o mercado estava a expulsar a geração síncrona (gás) precisamente quando mais se necessitava da sua inércia e capacidade de absorção de reativa. O apagão foi, em parte, o custo de um design de mercado que não internaliza os serviços essenciais de fiabilidade.`,
                                          },
  {
    id: 'chart-10',
    categoryId: 'cat3',
    order: 2,
    title: 'Preço Final Detalhado',
    fullTitle: 'Componentes do preço final da eletricidade',
    subtitle: 'Espanha, 28 de abril de 2025, hora 00:00 CEST (€/MWh)',
    sourceBadge: 'ESIOS',
    techCode: 'ESIOS Precio Final',
    stars: 3,
    component: 'PrecioEnergiaChart',
    componentPath: '@site/src/components/EsiosCharts/PrecioEnergiaChart',
    desc: `Este gráfico decompõe o preço final da eletricidade em Espanha (51,52 €/MWh) para a primeira hora de 28 de abril. Os componentes principais são: mercado diário (24,63 €/MWh), restrições técnicas Fase I (27,93 €/MWh), mercado intradiário (–0,17 €/MWh) e processos do operador do sistema (–0,88 €/MWh).

O dado mais revelador não é o preço final, mas a proporção dos seus componentes: as restrições técnicas (27,93 €/MWh) superam o preço do mercado diário (24,63 €/MWh) nessa primeira hora. O custo de manter o sistema fisicamente estável já era superior ao custo da própria energia na madrugada do dia do apagão.`,
    rel: `Este gráfico demonstra que o custo da estabilidade do sistema — restrições técnicas, serviços de ajuste, reservas — estava oculto nos componentes regulados do preço final muito antes do colapso. O apagão não o criou: tornou-o visível de forma extrema. Serve para quantificar que o sistema já operava com custos de equilíbrio anómalos antes das 12:33 CEST.`,
                                          },
  {
    id: 'chart-11',
    categoryId: 'cat3',
    order: 3,
    title: 'Preços de Energia — Europa',
    fullTitle: 'Preços day-ahead do mercado grossista ibérico (OMIE)',
    subtitle: 'Espanha e Portugal, 28–29 de abril de 2025 (€/MWh)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 12.1.C / TR 12.1.D',
    stars: 4,
    component: 'EnergyPricesChart',
    componentPath: '@site/src/components/EntsoeCharts/EnergyPricesChart',
    desc: `Este gráfico mostra a evolução horária dos preços do mercado diário (day-ahead) para Espanha e Portugal — que partilham o mercado grossista MIBEL — durante os dias do evento. Entre as 08:00 e as 16:00 CEST caem para valores negativos, atingindo um mínimo de –3,00 €/MWh na hora 12:00–13:00, coincidindo com o pico de produção solar.

O preço negativo das 12:00–13:00 foi fixado 24 horas antes do apagão, não como consequência dele. No dia seguinte, 29 de abril, a recuperação vespertina (35 €/MWh às 22:00) reflete o maior uso de gás para assegurar a estabilidade na Operação Reforçada.`,
    rel: `O preço SPOT negativo na hora do colapso é um sinal de alarme que o sistema não interpretou corretamente. Indica que o mercado grossista estava a expulsar ativamente a geração síncrona (gás) quando mais se necessitava da sua inércia e capacidade de absorção de reativa. Este gráfico evidencia que o design de mercado baseado exclusivamente no custo marginal não internaliza os serviços essenciais de fiabilidade.`,
                                          },
  {
    id: 'chart-12',
    categoryId: 'cat3',
    order: 4,
    title: 'Preços de Desvios em Tempo Real',
    fullTitle: 'Preços de desvios e restrições técnicas em tempo real',
    subtitle: '28–29 de abril de 2025 (€/MWh)',
    sourceBadge: 'ESIOS',
    techCode: 'Indicador 151, 541, 1395',
    stars: 4,
    component: 'GenericEsiosChartDesvios',
    componentPath: null,
    componentProps: { dataUrl: '/data/esios/precios-desvios-tiempo-real.json', title: 'Preços de Desvios em Tempo Real (28-29 Abril)', unit: '€/MWh' },
    desc: `Este gráfico de duplo eixo sobrepõe três camadas de informação: a percentagem de geração livre de CO₂, as previsões de produção eólica e solar, e os preços de pagamento por desvios e de restrições técnicas (€/MWh). Os preços das restrições técnicas mantinham-se em torno de 145–150 €/MWh e os preços de desvios oscilavam entre 50 e 276 €/MWh: valores elevados mas não excecionais para um sistema com alta penetração renovável.

O colapso das 12:33 CEST provoca a queda instantânea da percentagem de geração limpa de 91% para 0%. A recuperação é lenta: o índice supera os 50% por volta das 18:00 CEST do dia 28 de abril.`,
    rel: `O sistema colapsou no seu ponto de máxima "limpeza" ambiental, com 91% de geração livre de emissões. Este paradoxo é a refutação mais direta da narrativa que atribuiu o apagão a um excesso de renováveis. O gráfico também documenta o elevado custo dos preços de desvios e restrições nos minutos anteriores ao colapso: o termómetro do stress operativo antes da queda definitiva.`,
                                          },

  // ── CAT 4: INTERCONEXIONES Y FLUJOS ───────────────────────────────────
  {
    id: 'chart-13',
    categoryId: 'cat4',
    order: 1,
    title: 'Saldos por Fronteira (P48)',
    fullTitle: 'Saldos líquidos de intercâmbio programados (P48)',
    subtitle: 'Espanha com França, Portugal, Marrocos e Andorra · 28–29 de abril de 2025 (MW/h)',
    sourceBadge: 'ESIOS',
    techCode: 'Indicadores 10209 y 10210',
    stars: 4,
    component: 'GenericEsiosChartSaldos',
    componentPath: null,
    componentProps: { dataUrl: '/data/esios/saldos-horarios-por-frontera.json', title: 'Saldos Horários por Fronteira (28-29 Abril)', unit: 'MW' },
    desc: `Este gráfico mostra a evolução horária do saldo líquido de intercâmbios de eletricidade programados (P48) entre Espanha e as suas fronteiras. Na madrugada de 28 de abril, Espanha importava de França (–2.590 MW) e exportava para Portugal. A situação muda a partir das 09:00–10:00 CEST: Espanha passa a importar simultaneamente de França (–1.757 MW às 11:00) e de Portugal (–2.228 MW às 11:00), com um saldo total de importação de –4.755 MW às 11:00 CEST — apenas noventa minutos antes do colapso.

O colapso anulou todos os saldos programados (valores zero desde as 13:00 do dia 28 até às 06:00 de 29 de abril). A recuperação de intercâmbios durante o dia 29 foi intermitente e a baixa escala.`,
    rel: `O máximo de importação de –4.755 MW às 11:00 CEST (apenas 90 minutos antes do colapso) demonstra que o sistema ibérico já era deficitário em geração própria e dependia de contribuições externas recorde para se manter estável. Os dados comerciais P48 mostravam aparente normalidade operativa enquanto a rede já estava em espiral de instabilidade.`,
                                          },
  {
    id: 'chart-14',
    categoryId: 'cat4',
    order: 2,
    title: 'Fluxos Físicos Transfronteiriços',
    fullTitle: 'Fluxos físicos reais nas interconexões de Espanha',
    subtitle: 'Espanha–França e Espanha–Portugal · 28–29 de abril de 2025 (MW)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 12.1.G',
    stars: 5,
    component: 'CrossBorderFlowsChart',
    componentPath: '@site/src/components/EntsoeCharts/CrossBorderFlowsChart',
    desc: `Este gráfico mostra a evolução horária dos fluxos de potência ativa física (MW) nas fronteiras de Espanha com França e Portugal. A partir das 07:00 UTC, o fluxo com Portugal inverteu-se: Espanha começou a exportar para Portugal (mais de 2.300 MW), consequência do excedente solar que baixava os preços a valores negativos.

O colapso manifestou-se primeiro na fronteira francesa. No intervalo 10:00–11:00 UTC, as exportações para França foram completamente anuladas: as proteções OST (Out of Step) abriram as linhas AC transpirenaicas isolando Espanha do continente. Só às 22:00–23:00 UTC de 29 de abril é que reapareceram fluxos significativos — quase 36 horas após o início do apagão.`,
    rel: `A cronologia dos fechos de fronteira — Espanha primeiro, Portugal depois — permite reconstruir a sequência exata do isolamento ibérico. A abertura das linhas transpirenaicas às 10:33 UTC (12:33 CEST) não foi consequência do apagão: foi o seu detonador imediato. A tentativa do sistema de importar mais de 4.600 MW de emergência de França — muito acima da capacidade prevista de 550 MW — provocou a perda de sincronismo e a abertura automática dos circuitos.`,
                                          },
  {
    id: 'chart-15',
    categoryId: 'cat4',
    order: 3,
    title: 'Intercâmbios Comerciais Programados',
    fullTitle: 'Saldo líquido de intercâmbios comerciais programados',
    subtitle: 'Espanha com França e Portugal · 28 de abril de 2025 (MW, resolução 15 min)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 12.1.F',
    stars: 4,
    component: 'ScheduledCommercialExchangesChart',
    componentPath: '@site/src/components/EntsoeCharts/ScheduledCommercialExchangesChart',
    desc: `Este gráfico mostra o saldo líquido dos intercâmbios comerciais de eletricidade programados (day-ahead) entre Espanha e as suas fronteiras. A partir das 09:00 UTC, o saldo total tornou-se fortemente exportador, com picos de quase 5.000 MW por volta das 10:00–11:00 UTC, coincidindo com as horas de máxima produção solar e preços negativos no mercado grossista.

Minutos antes do colapso (10:33 UTC), o saldo comercial programado continuava a ser exportador (~2.500 MW líquidos). No entanto, os fluxos físicos reais nesse instante tinham-se invertido violentamente: Espanha tentava importar mais de 4.600 MW de emergência de França.`,
    rel: `A diferença entre a programação comercial (exportador a 2.500 MW) e a realidade física (importação de emergência a 4.600 MW) no mesmo instante é a demonstração mais gráfica do desacoplamento entre os modelos de segurança baseados em dados de mercado estáticos e a dinâmica real da rede. O sistema europeu de alerta (EAS) classificou o bloco ibérico como "Normal" até ao instante do blackout.`,
                                          },
  {
    id: 'chart-16',
    categoryId: 'cat4',
    order: 4,
    title: 'Leilões Explícitos de Capacidade',
    fullTitle: 'Leilões explícitos de capacidade de interconexão',
    subtitle: 'Espanha–França e Espanha–Portugal, abril de 2025 (MW e €/MWh)',
    sourceBadge: 'ESIOS',
    techCode: 'JAO (Joint Allocation Office)',
    stars: 3,
    component: 'SubastasChart',
    componentPath: '@site/src/components/EsiosCharts/SubastasChart',
    desc: `Este gráfico mostra a capacidade alocada nos leilões mensais e anuais explícitos de interconexão transfronteiriça para Espanha–França e Espanha–Portugal. Os leilões explícitos são o mecanismo pelo qual os agentes de mercado reservam capacidade de transporte nas interconexões internacionais com antecedência.

O colapso de 28 de abril anulou fisicamente toda a capacidade contratada. Os agentes que tinham adquirido direitos de transmissão nestes leilões não conseguiram materializar os seus direitos porque a infraestrutura que os suporta tinha deixado de funcionar. Isso gera incumprimentos contratuais, mecanismos de compensação obrigatórios e reclamações regulatórias.`,
    rel: `Este gráfico quantifica o volume de comércio transfronteiriço europeu bloqueado pelo apagão e vincula o evento técnico às suas consequências jurídico-comerciais no mercado europeu de eletricidade. O impacto não se limitou ao sistema elétrico espanhol: afetou agentes de mercado de França, Portugal e outros países. É a prova documental do alcance transnacional do dano económico do 28-A.`,
                                          },
  {
    id: 'chart-17',
    categoryId: 'cat4',
    order: 5,
    title: 'Capacidades de Transferência Previstas',
    fullTitle: 'Capacidades de transferência previstas nas interconexões',
    subtitle: 'Espanha–França e Espanha–Portugal · 28–29 de abril de 2025 (MW)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 11.1',
    stars: 4,
    component: 'ForecastTransferChart',
    componentPath: '@site/src/components/EntsoeCharts/ForecastTransferChart',
    desc: `Este gráfico mostra os limites de intercâmbio de eletricidade declarados para o mercado diário (day-ahead) nas interconexões de Espanha. Para a manhã de 28 de abril, a capacidade de exportação Espanha → França mostrava uma redução progressiva: de cerca de 3.000 MW entre as 00:00 e as 08:00, baixava para 2.300 MW entre as 09:00 e as 15:00, e nas horas anteriores ao colapso (10:00–12:00 CEST) descia para 550 MW.

O dia 29 de abril mostra uma configuração diferente: a capacidade Espanha → França mantém-se em 2.960 MW durante a madrugada mas reduz-se para 550 MW entre as 09:00 e as 12:00, refletindo o processo de ressincronização assimétrica.`,
    rel: `A redução da capacidade declarada Espanha → França para 550 MW nas horas do colapso (quando o sistema precisava de importar mais de 4.600 MW de emergência) evidencia um desacoplamento crítico entre os modelos de segurança estáticos e a realidade dinâmica do sistema. Os fluxos físicos reais durante a cascata tentaram superar em mais de oito vezes a capacidade prevista, provocando a abertura das linhas por proteções de perda de sincronismo.`,
                                          },

  // ── CAT 5: BALANCE, ESTABILIDAD Y RESPUESTA ───────────────────────────
  {
    id: 'chart-18',
    categoryId: 'cat5',
    order: 1,
    title: 'Estado Atual de Balanceamento',
    fullTitle: 'Evolução do desequilíbrio elétrico (imbalance) — Espanha',
    subtitle: '28–29 de abril de 2025 (MWh a cada 15 minutos)',
    sourceBadge: 'ENTSO-E',
    techCode: 'GL EB 12.3.A + TR 17.1.G&H',
    stars: 5,
    component: 'CurrentBalancingStateChart',
    componentPath: '@site/src/components/EntsoeCharts/CurrentBalancingStateChart',
    desc: `Este gráfico mostra o volume de desequilíbrio entre geração e procura no sistema espanhol, em intervalos de 15 minutos. Durante a madrugada e a manhã de 28 de abril, o desequilíbrio manteve-se em valores moderados (geralmente abaixo de 200 MWh). A deterioração começou às 10:00–10:15 UTC (12:00–12:15 CEST), com valores progressivos de 123,8 MWh, 346,7 MWh, 616,2 MWh até atingir um pico de 1.690,4 MWh entre as 13:45 e as 14:00 UTC.

A transição de défice para superávit ocorreu às 18:15–18:30 UTC, graças à Operação Reforçada da REE: a manutenção forçada de grupos síncronos mesmo acima da procura real.`,
    rel: `O pico de défice de 1.690 MWh atingido mais de três horas após o colapso é a prova quantitativa mais direta de que o blackout não foi um evento instantâneo e concluído, mas o início de uma crise operativa prolongada. A rede não conseguiu recuperar o equilíbrio geração–procura até bem entrar a tarde, e a estratégia de correção implicou um sobrecusto económico significativo.`,
                                          },
  {
    id: 'chart-19',
    categoryId: 'cat5',
    order: 2,
    title: 'Desequilíbrio — Volume MW',
    fullTitle: 'Volume de desequilíbrio entre geração e procura — Espanha',
    subtitle: '28–29 de abril de 2025 (MWh a cada 15 min)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 17.1.G&H',
    stars: 5,
    component: 'ImbalanceChart',
    componentPath: '@site/src/components/EntsoeCharts/ImbalanceChart',
    desc: `Este gráfico mostra o desequilíbrio entre geração e procura no sistema espanhol com resolução de 15 minutos, expresso em MWh. Valores positivos indicam défice de geração; negativos, superávit. Durante a manhã de 28 de abril, o desequilíbrio manteve-se moderado (0–200 MWh). A deterioração começou às 10:00–10:15 UTC: 123,8 MWh, 346,7 MWh, 616,2 MWh, até atingir o pico de 1.690,4 MWh entre as 13:45 e 14:00 UTC.

A transição para superávit (18:15–18:30 UTC) marcou a ativação plena da Operação Reforçada: a manutenção forçada de grupos síncronos mesmo acima da procura real.`,
    rel: `O pico de défice de 1.690 MWh atingido mais de três horas após o colapso é prova quantitativa de que o blackout não foi um evento instantâneo e concluído. Este gráfico fecha a lacuna entre o evento físico do colapso e as suas consequências operativas durante as 19 horas de restauração.`,
                                          },
  {
    id: 'chart-20',
    categoryId: 'cat5',
    order: 3,
    title: 'Preços de Desequilíbrio',
    fullTitle: 'Preços dos desvios de balanceamento — Espanha',
    subtitle: '28–29 de abril de 2025 (€/MWh)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 17.1.G&H',
    stars: 4,
    component: 'ImbalancePricesChart',
    componentPath: '@site/src/components/EntsoeCharts/ImbalancePricesChart',
    desc: `Este gráfico mostra a evolução dos preços dos desvios de balanço em Espanha durante o evento. Os preços dos desvios refletem o custo marginal de ativar reservas de frequência (aFRR, mFRR) para corrigir os desequilíbrios entre geração e procura. Nos intervalos anteriores ao colapso, os preços dos desvios mostravam valores elevados, indicando um sistema sob stress operativo.

Durante a crise, os preços dos desvios colapsaram tecnicamente para zero ou para valores não representativos, porque o mecanismo de mercado de desvios deixou de funcionar quando a rede colapsou. A recuperação de preços significativos durante a Operação Reforçada documenta o custo extraordinário de reativar o sistema.`,
    rel: `Os preços dos desvios são o termómetro mais sensível do stress operativo em tempo real. A sua evolução nas horas anteriores ao colapso mostra sinais de tensão que os modelos de segurança estáticos não captaram. O seu desaparecimento durante o blackout e o seu reaparecimento durante a Operação Reforçada documentam o ciclo completo de colapso e recuperação na perspetiva dos mercados de balanço.`,
                                          },
  {
    id: 'chart-21',
    categoryId: 'cat5',
    order: 4,
    title: 'Capacidade FRR — Reservas',
    fullTitle: 'Capacidade real e prevista de Reserva de Restauração de Frequência',
    subtitle: 'Espanha — 2025 (MW por trimestre)',
    sourceBadge: 'ENTSO-E',
    techCode: 'SO GL 188–189',
    stars: 4,
    component: 'FrrCapacityChart',
    componentPath: '@site/src/components/EntsoeCharts/FrrCapacityChart',
    desc: `Este gráfico mostra a capacidade de Reserva de Restauração de Frequência (FRR) — tanto para subida como para descida de geração — que o operador espanhol (REE) tinha disponível durante 2025. A capacidade prevista (outlook) era de 1.600 MW tanto em subida como em descida. A capacidade real disponível foi, em média, de ~1.190 MW no Q2, com um mínimo de 889 MW (subida) e um máximo pontual de 1.624 MW (descida).

O segundo trimestre (Q2) inclui o fatídico 28 de abril. O desencadeador foi a súbita perda de importação de França (~1.200 MW). Para compensar esse défice, a FRR automática deveria ter atuado em segundos. No entanto, parte da reserva estava a ser utilizada para outros fins ou não era suficientemente rápida.`,
    rel: `A capacidade FRR disponível no momento do colapso (~889 MW no pior caso do Q2) era inferior ao défice que devia compensar (~1.200 MW perdidos de França instantaneamente). Este gráfico quantifica a insuficiência de reservas ativas no instante crítico e explica por que o mecanismo automático de resposta de frequência não foi capaz de conter a cascata de desconexões.`,
                                          },
  {
    id: 'chart-22',
    categoryId: 'cat5',
    order: 5,
    title: 'Custo de Gestão de Congestionamento',
    fullTitle: 'Custos mensais de gestão de congestionamento (countertrading)',
    subtitle: 'Espanha, janeiro–dezembro de 2025 (€)',
    sourceBadge: 'ENTSO-E',
    techCode: 'TR 13.1.C',
    stars: 3,
    component: 'CostCongestionChart',
    componentPath: '@site/src/components/EntsoeCharts/CostCongestionChart',
    desc: `Este gráfico mostra os custos mensais associados à gestão de congestionamentos na rede de transporte espanhola. Os dados revelam uma tendência decrescente durante o primeiro trimestre: 8.811.122 € em janeiro, 6.900.011 € em fevereiro, 4.144.098 € em março. A partir de abril, o custo anula-se completamente (0 €) até outubro.

O custo zero de abril é o dado mais revelador. Não indica ausência de problemas de congestionamento, mas exatamente o contrário: quando o sistema colapsou a 28 de abril, as operações de countertrading e redespacho deixaram de fazer sentido porque já não existia um fluxo de potência coordenado para gerir. Os elevados custos dos três meses anteriores evidenciam que o sistema já operava com margens ajustadas.`,
    rel: `Os custos de gestão de congestionamento de janeiro–março (vários milhões de euros mensais) são o sinal financeiro de um sistema que operava sistematicamente no limite das suas capacidades de transporte. O apagão de abril não foi um evento imprevisto em termos estruturais: a rede vinha acumulando pressão durante meses. A transição abrupta para custo zero em abril reflete o desaparecimento do sistema como entidade operativa, não a sua melhoria.`,
                                          },
  {
    id: 'chart-23',
    categoryId: 'cat5',
    order: 6,
    title: 'Fall-backs e Protocolos de Emergência',
    fullTitle: 'Desconexões de TSOs e ativação de procedimentos de contingência',
    subtitle: 'Europa, 28–29 de abril de 2025',
    sourceBadge: 'ENTSO-E',
    techCode: 'IFs IN 7.2 / mFRR 3.11 / aFRR 3.10',
    stars: 5,
    component: 'FallbacksChart',
    componentPath: '@site/src/components/EntsoeCharts/FallbacksChart',
    desc: `Esta visualização representa os períodos em que diferentes operadores de rede europeus declararam desconexões parciais ou totais dos seus sistemas, ativando procedimentos de contingência (fallback). Para Espanha, a desconexão do processo IN começou às 10:34 UTC (12:34 CEST) — um minuto após o colapso — e prolongou-se até às 22:00 UTC. Portugal registou desconexões semelhantes. Outros países (Estónia, Letónia, Lituânia, Finlândia, Suíça) também ativaram fallbacks.

A ausência de fallbacks automáticos preventivos nos minutos anteriores ao colapso é tão significativa como a sua ativação massiva posterior. O sistema não escalou por níveis de emergência: o EAS classificou o sistema ibérico como "Normal" às 12:32:00 CEST e registou o estado de "Blackout" às 12:33:29 CEST, sem qualquer estado intermédio.`,
    rel: `Este gráfico documenta duas falhas: a primeira, a ausência de ativação preventiva de procedimentos de contingência antes do colapso; a segunda, a propagação de perturbações operativas a múltiplos TSOs europeus após o blackout ibérico. Aponta para uma lacuna estrutural no sistema europeu de alerta precoce para capturar a dinâmica rápida de tensão em redes de baixa inércia.`,
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
