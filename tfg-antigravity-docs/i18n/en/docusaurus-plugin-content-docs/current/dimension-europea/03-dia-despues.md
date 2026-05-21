---
sidebar_position: 3
---
import GlossaryLink from '@site/src/components/GlossaryLink';

28 April 2025 did not close its effects with the restoration of electricity
supply. It opened a period of accelerated institutional revision in which
<GlossaryLink term="ENTSO-E">ENTSO-E</GlossaryLink>, ACER and national
regulators across the European Union rewrote, within eight months, a set of
methodologies that had remained unchanged for years. This section documents
the reforms not covered elsewhere in this work — those relating to reserve
capacity architecture, resource adequacy, the PICASSO platform, the new
network strength metric and national political responses — completing the
picture of the incident's continental-scale consequences.

## First Amendment to the Regional Reserve Capacity Sizing Methodology (December 2025)

Approved in December 2025 under Article 37(1)(j) of Regulation (EU) 2019/943,
the **First Amendment to the Methodology for the Regional Sizing of Reserve
Capacity** represented a tectonic shift in how Europe calculates its secondary
and tertiary reserve requirements.

Before 28 April, the probabilistic calculation of reserve margins by Scheduling
Area (SOR) was based on statistical distributions of historical imbalances,
assuming an acceptable non-coverage risk. The Amendment introduced a drastic
reconfiguration of the **X%** confidence levels (percentile for sizing
positive reserves) and **Y%** (percentile for negative reserves), mandating
the use of 15-minute granularity imbalance data instead of the previous hourly
averages.

Implementation forced a regulatory divergence grounded in each region's
technical vulnerability:

| Operating Region (SOR) | Historical parameter | New percentile (X% / Y%) | Justification |
|---|---|---|---|
| **Central Europe (CE)** | 99.00% | **99.50%** | Absorbs tail events from extreme solar ramps and cross-border N-2/N-3 failures without immobilising excessive capital in static reserves. |
| **Southeast Europe (SEE)** | 99.00% | **99.99%** | Pre-2024 historical data no longer represents future risk with current renewable proliferation. Coverage of extreme-probability events (six-sigma deviations). |
| **Nordic** | — | **99.90%–99.99%** | Disaggregated between upward/downward regulation for high-variability imbalances. |

The underlying reasoning is significant: the Amendment acknowledges that
imbalance distribution tails in high-renewable systems are substantially
fatter than historical models calibrated on thermal fleets could capture.
The 28 April event demonstrated that «tail risk» scenarios are no longer
statistically exceptional.

Jointly, Article 157 of the
<GlossaryLink term="SO GL (System Operation Guidelines)">SO GL</GlossaryLink>
mandated the obligatory formalisation and real-time instrumentation of
**Reserve Sharing Agreements**. The **PICASSO** platform for cross-border
aFRR exchange transitions from an optional economic efficiency scheme to a
mandatory structural resilience safeguard, whose mechanisms are developed in
the following section.

## Post-2025 ERAA reform: from probabilistic LOLE to multifactorial assessment

The **European Resource Adequacy Assessment** (ERAA) is the pillar on which
member states justify to the European Commission the implementation of
Capacity Mechanisms (CRM). Following 28 April, **ACER Decision 06/2026 on
ERAA 2025** dismantled fundamental ENTSO-E methodologies.

**CARA function recalibration.** ENTSO-E used a CARA (*Constant Absolute Risk
Aversion*) coefficient of 0.0075 to simulate combined-cycle investor
behaviour under price volatility. ACER ruled that this coefficient lacked
post-blackout empirical evidence: the risks of operational instabilities
generate investor risk aversion significantly greater than simple hourly price
volatility. The «target year repeated to infinity» modelling (TY2035) in the
EVA methodology was also severely criticised, as it generated artificial
profitability signals discouraging simulated decommissioning of obsolete coal
plants in countries such as Poland, falsifying systemic security assessments.

**LOLE reformulation.** ENTSO-E had presented probabilistic sufficiency results
using ranges (e.g., for Portugal in 2028: between 1 and 6 h/year, against a
1.46 h reliability standard). ACER ruled that using statistical ranges
undermines the legal robustness needed to apply capacity mechanisms. The new
directive mandates delivery of a **single deterministic value** integrating
**multifactorial instability scenarios**: ERAA Monte Carlo simulations can no
longer be limited to modelling wind deficits and high demand, but must
calculate the **joint probability** of renewable unavailability crossed with
network topological failures, 400 kV overvoltage profiles and rolling reserve
insufficiency — exactly what occurred on 28 April.

## PICASSO metamorphosis: from economic efficiency to structural resilience

The **PICASSO** platform (*Platform for the International Coordination of
Automated Frequency Restoration and Stable System Operation*) was originally
conceived as a market optimisation tool: its algorithm sought the cheapest
cross-border matching of
<GlossaryLink term="Fast Frequency Response (FFR)">aFRR</GlossaryLink>
bids with 15-minute granularity, minimising consumer costs under normal
conditions.

During crisis management, at **15:50 CEST** on 28 April, Amprion alerted RTE
to massive computational requests of up to **2,500 MW** placed in PICASSO
associated with **strongly negative prices**. These financial distortions
revealed that, in the midst of islanding and massive load shedding, a purely
economic algorithm collapses conceptually.

The subsequent institutional reform mandated the formalisation of PICASSO as
a **mandatory structural resilience tool**. Operational amendments grant TSO
control centres the authority to execute immediate **manual overrides** of the
platform's LFC algorithms during an EAS alert state. The interconnected
capacity managed by PICASSO is no longer subject exclusively to marginal
price: it is preventively locked to inject macroscopic directional
stabilisation flows, shielding vulnerable borders against inertia collapses
or rapid asynchronous imbalances.

## The new MRSCR metric: the death certificate of traditional SCR

From a fundamental electrical engineering perspective, the most profound
contribution of the post-28 April analysis was the death certificate of the
traditional **Short Circuit Ratio** (SCR) as a valid metric for assessing
high-renewable penetration networks.

The simultaneous collapse of photovoltaic inverters in Spain and the
Dax–Arriosses sub-network in France demonstrated that the SCR, by evaluating
a single isolated node, blindly ignores the resonant oscillations and
destructive interactions occurring between multiple nearby power electronic
converters. European network codes forcibly adopted the **MRSCR** (*Multiple
Renewable Energy Stations Short-Circuit Ratio*) metric:

$$\mathrm{MRSCR}_i = \frac{S_{ac,i}}{P_i + \sum_{j \neq i} \mathrm{MIIF}_{ji} \cdot P_j}$$

where <i>S<sub>ac,i</sub></i> is the AC short-circuit capacity at connection node $i$,
$P_i$ the local plant rated capacity, and MIIF<sub>ji</sub> the Multiple
Infeed Interaction Factor between plants $j$ and $i$. This factor quantifies
how injection fluctuations from plant $j$ «drag» the voltage profile of plant
$i$ through the mutual impedances of the transmission network.

Institutionally, the new network codes establish the **Critical Value**
(CMRSCR): by binding legal obligation, the MRSCR calculated on the low-voltage
side of the step-up transformer of any new IBR plant must not be below
**1.5**. An MRSCR below 1.5 indicates unbearable systemic weakness: under a
network voltage dip, inverter control loops will become unstable and
disconnect. TSOs are legally empowered to **block the connection** of any
wind or solar park failing to meet this ratio, obliging developers to install
distributed
<GlossaryLink term="Compensadores Síncronos (SynCons)">synchronous condensers</GlossaryLink>
at the connection point (*mandatory hybridisation*) to raise <i>S<sub>ac</sub></i> to
the threshold.

## Political and institutional reactions across Europe

### Germany: from N-1 criterion to dynamic N-k assessments

In Germany, the blackout forced **emergency interpellations in the Bundestag**
regarding the vulnerability of the large HVDC corridors connecting North Sea
wind farms with Bavarian industrial centres. Ministerial debate openly
acknowledged that the
<GlossaryLink term="Criterio N-1">*N*−1 Criterion</GlossaryLink>
— the sacrosanct dogma of European electrical security — has become obsolete
in the face of 21st-century **non-linear cascade effects**, where the loss of
a single line can simultaneously disconnect multiple inverters within
milliseconds. As a result, the Federal Ministry for Economic Affairs and
Climate Action ordered German TSOs (Amprion, TenneT, 50Hertz, TransnetBW) an
immediate review of their National Resilience Plans, requiring transition to
**dynamic N-k risk assessments** that incorporate the joint probability of
synchronous collapses and combined failures into topological planning.

### Italy: interconnection fast-track as critical national infrastructure

In Italy, the 28 April analysis focused on the **interconnection ratio** as
the determinant factor of the Iberian outcome. Spain and Portugal had a
meagre 3–5% exchange capacity with France, which confined the perturbation
and prevented its dilution in the continental bloc — exactly the mechanism
that had sealed the fate of the Italian power system in the **2003 blackout**.

This analysis served as a political battering ram for the Italian TSO (Terna)
and the Ministry of Environment and Energy Security. Italian Parliamentary
debates culminated in the approval of **administrative fast-track laws**
for HVDC submarine interconnection projects historically paralysed by
environmental bureaucracy:

- **Italy–Tunisia link** (2 GW): reclassified as «Critical National Survival
  Infrastructure».
- **Italy–Montenegro submarine cable** (1 GW) under the Adriatic Sea: idem.

The investment justification no longer rests on market efficiency or price
arbitrage, but purely on its function as a **cross-border short-circuit
support lifeline**.

### Netherlands and Denmark: meshed HVDC grids in the North Sea

TenneT (Netherlands) and Energinet (Denmark) were drafting their Offshore
Network Development Plans when 28 April demonstrated the cross-border chaos
caused by isolated inverters in France and Spain. 2026 and beyond budgets
**partially cancelled simple radial line development** and were redirected
towards building **Multi-terminal HVDC Meshed Grids** in the North Sea,
designed with intrinsic overcapacity to compensate instantaneous frequency
oscillations and support imbalances without depending on continental
bottlenecks.

### The ACER–ENTSO-E institutional battle and the principle of technical subsidiarity

At the macro-institutional level, 28 April reignited a power dispute between
ACER and ENTSO-E linked to the **Clean Energy Package**. ENTSO-E had
strongly criticised European Commission guidelines seeking to grant binding
powers to Regional Operational Centres (ROCs) over reserve sizing in member
states, arguing that ceding this power would collide with TSOs' civil and
criminal responsibility for their own supply security.

The Iberian blackout **retroactively vindicated the TSOs' position**: at the
critical moment of frequency collapse, responses must be locally commanded
under hard technical directives. Geopolitical reserve allocations — such as
the strict 99.99% quota in the Balkans — must belong to the technical domain
of entities that physically operate circuit breakers at the edge of
instability, not to market algorithms optimised from Brussels.

## The continental lesson

The emerging paradigm consolidated by post-28 April reforms assumes that
energy (MWh) will become an abundant commodity in European auctions, ceding
its critical scarcity position to
<GlossaryLink term="Servicios Esenciales de Confiabilidad (ERS)">Essential
Reliability Services (ERS)</GlossaryLink>: dynamically stabilised voltage
via
<GlossaryLink term="Compensadores Síncronos (SynCons)">synchronous
condensers</GlossaryLink>
and
<GlossaryLink term="Compensador Síncrono Estático (STATCOM)">STATCOMs</GlossaryLink>,
inertia and short-circuit power. As the Stockholm Environment Institute
has observed: the frantic pace of renewable integration has rendered obsolete
the speed at which governments are investing in structural resilience of
transmission infrastructure.

The Iberian blackout delivered an inexorable lesson: progress towards
continental decarbonisation cannot be decoupled from the fundamental laws of
electromagnetism, nor from the urgent need to **hyper-interconnect and
reinforce cross-border transmission infrastructure**. 28 April 2025 was not
only the first systemic European blackout in two decades — it was the

