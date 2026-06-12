// Auto-generated — English glossary
// Generated: 2026-06-12T18:55:08.310Z

export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const GLOSSARY_TERMS = [
  {
    "id": "aelec",
    "letter": "A",
    "term": "AELEC",
    "definition": "Spanish Association of Electricity Companies that brings together the main operators, marketers, and transporters of the Spanish electricity sector. Its primary function is sector representation before national and European administrations and regulatory bodies. In the context of the 28-A incident, AELEC co-financed, together with the Universidad Pontificia Comillas, the technical study by IIT-ICAI that would become the most rigorous analytical reference published on the incident, thus positioning itself in the —unusual for a sector association— space of independent technical investigation of the collapse that affected its own member companies."
  },
  {
    "id": "afrr-automatic-frequency-restoration-reserve",
    "letter": "A",
    "term": "aFRR (Automatic Frequency Restoration Reserve)",
    "definition": "The Automatic Frequency Restoration Reserve (aFRR), historically called secondary regulation, is the adjustment service automatically activated by the System Operator's Automatic Generation Control (AGC) to return frequency to its nominal value (50 Hz) and restore interconnection flows to their scheduled programs, with an action time horizon between 30 seconds and 15 minutes. Unlike primary regulation (FCR), which acts in the first seconds through the immediate response of synchronous machine speed governors, aFRR operates on the integral of the frequency error to eliminate the residual deviation. The 28-A incident illustrated, with the clarity that only disasters provide, that the Iberian collapse was fundamentally a voltage instability phenomenon (Q-V), not an active frequency one: the AGC technically had the capacity to act on the active balance, but the dominant mechanism —the cascade of reactive overvoltages— operated on a time scale (30 seconds) and in a physical dimension (reactive power, not active) over which aFRR has no authority."
  },
  {
    "id": "area-de-control",
    "letter": "C",
    "term": "Control Area",
    "definition": "Geographic and electrical zone under the responsibility of a Transmission System Operator (TSO), delimited by boundary breakers whose power exchange with adjacent areas is scheduled and monitored in real time via the AGC system. The Iberian Peninsula constituted a single control area —jointly managed by REE in Spain and REN in Portugal— connected to the continental European system through the narrow trans-Pyrenean border. This \"quasi-synchronous island\" configuration implies that the loss of synchronism with France was not simply an interconnection failure but the spectral signature that the Iberian system was no longer able to sustain its own balance within the continental synchronism: on 28-A, that signature materialized at 12:33:21 CEST with the opening of the ANSI 78 relays of the trans-Pyrenean links."
  },
  {
    "id": "arranque-autonomo-black-start",
    "letter": "B",
    "term": "Black Start",
    "definition": "Adjustment service by which certain generation facilities —typically hydroelectric reservoir plants or combined cycles equipped for self-start— can energize their own auxiliaries and inject voltage into a de-energized network without needing prior external electrical supply. It is the capability without which restoration after a total blackout is technically impossible: someone has to \"turn on the first light.\" On 28-A, the restoration of the peninsular system critically depended on the geographic availability and rapid activation capacity of these units; the progression of re-energization from Black Start nodes to the most distant loads took between 7 and 18.5 hours depending on the area, evidencing both the robustness of the existing restoration design and its logistical bottlenecks in the face of a collapse of this geographic magnitude."
  },
  {
    "id": "bess-battery-energy-storage-system",
    "letter": "B",
    "term": "BESS (Battery Energy Storage System)",
    "definition": "Battery Energy Storage System: an assembly of electrochemical cells (typically lithium-ion or LFP chemistry), a battery management system (BMS), and one or more bidirectional power inverters that allow storing electrical energy in chemical form and returning it to the grid with millisecond response times. Its functional versatility —it can act as a generator or as a load and switch modes in fractions of a cycle— makes it the most flexible resource in the modern system. The 28-A incident revealed that the response speed of a BESS is a necessary but not sufficient condition for stability: the control mode of the associated inverter (GFL vs. GFM) determines whether that speed contributes to anchoring the grid or accelerating its collapse."
  },
  {
    "id": "bess-con-inversores-grid-forming-bess-gfm",
    "letter": "B",
    "term": "BESS with Grid-Forming Inverters (BESS-GFM)",
    "definition": "Battery Energy Storage Systems whose inverter operates in Grid-Forming mode, acting as an ideal voltage source capable of autonomously establishing the amplitude and frequency of the local grid without needing an external reference. The combination of high electrochemical energy density with grid-forming capability makes BESS-GFM the most versatile resource for providing Essential Reliability Services (ERS): configurable synthetic inertia, dynamic voltage support, and virtual short-circuit power. The 28-A incident demonstrated that the installed storage fleet in the peninsula —dominated by GFL inverters— lacked this capability; consequently, Royal Decree 997/2025 sets a target of 22.5 GW of GFM storage by 2030, making BESS-GFM the backbone of the new Spanish ancillary services architecture."
  },
  {
    "id": "bucle-de-retroalimentacion-feedback-loop",
    "letter": "F",
    "term": "Feedback Loop",
    "definition": "A positive feedback loop is a mechanism in which the system's response to an initial disturbance amplifies, rather than attenuates, the original deviation: the disturbance feeds back on itself in a cycle that, if not interrupted by some external stabilizing mechanism, leads to collapse. It is the dynamic opposite of the negative feedback that characterizes stable self-regulating systems. The 28-A incident provided a textbook example of this dynamic: each IBR plant that tripped due to overvoltage reduced the inductive reactive absorption that compensated for the capacitive production of unloaded lines; as absorption decreased, voltage rose; as voltage rose, new plants reached their ANSI 59 thresholds and tripped. In less than 30 seconds, a loop that in a system with sufficient electrical stiffness would have been damped became a race toward zero voltage."
  },
  {
    "id": "cambiadores-de-tomas-en-carga-oltc",
    "letter": "O",
    "term": "On-Load Tap Changers (OLTC)",
    "definition": "Electromechanical mechanism installed in large power transformers that modifies the transformation ratio —and therefore the secondary voltage— without interrupting service continuity, by stepwise movement of a tap on the winding. It regulates slow voltage variations over a typical range of ±10% with discrete steps of 1–2%. Its structural limitation lies in the mechanical inertia of the drive: the response time per step, conditioned by the motor and gears, is on the order of several seconds, making it blind to the tenths-of-second transients that characterize rapid voltage collapses. This blindness was precisely the mechanism of the Tap-Lag that amplified the 28-A incident: the OLTCs had progressively raised taps to compensate for previous voltage depressions; when the overvoltage derived from meshing and unloaded lines arrived, their mechanical inertia prevented them from lowering in time, magnifying the voltage toward the 220 kV collector networks with consequences that REE's 400 kV SCADA could not observe."
  },
  {
    "id": "ccgt-combined-cycle-gas-turbine",
    "letter": "C",
    "term": "CCGT (Combined Cycle Gas Turbine)",
    "definition": "Natural Gas Combined Cycle plant: thermoelectric generation technology that combines a gas turbine (Brayton cycle) with a steam turbine fed by exhaust gases through a heat recovery steam generator (Rankine cycle), achieving efficiencies of 55–60%. Its large synchronous alternators historically provided the largest fraction of inertia and short-circuit power in the peninsular system. The progressive renewable penetration has displaced CCGTs toward marginal backup operation, reducing their operating hours and, with them, the kinetic energy available in the synchronous fleet; the 28-A incident, with combined cycles operating at minimum load and generation dominated by IBR inverters without electromechanical coupling, illustrates the systemic price of that displacement when not accompanied by explicit replacement of the inertia services that CCGTs provided as a free byproduct of their operation."
  },
  {
    "id": "cecre-centro-de-control-de-energias-renovables",
    "letter": "C",
    "term": "CECRE (Renewable Energy Control Center)",
    "definition": "Operational center of Red Eléctrica de España responsible for real-time monitoring and dispatch of renewable plants and storage systems connected to the peninsular grid, as well as execution of the VOLTAIRE system algorithms for dynamic voltage regulation via reactive power setpoints. On 28-A, CECRE represented one of the few centralized response mechanisms with the technical capacity to adjust in real time the reactive absorption of photovoltaic plants; the question that subsequent investigation must answer precisely is whether the operating margin available was physically sufficient given the speed of the instability, or whether the hierarchical architecture of VOLTAIRE —designed for slow-varying disturbances— was structurally incapable of following a cascade that completed in 30 seconds."
  },
  {
    "id": "centros-de-coordinacion-regional-rcc",
    "letter": "R",
    "term": "Regional Coordination Centers (RCC)",
    "definition": "Supranational entities established by the EU Electricity Regulation (2019/943) to facilitate operational cooperation among Transmission System Operators (TSOs) within each European synchronous region, with functions of coordinated security analysis, regional adequacy assessment, and cross-border flow coordination. The 28-A incident exposed the operational friction between the Continental Europe region RCC and the real-time operation decisions of REE and REN: the separation of the Iberian Peninsula from the continental system, materialized in the opening of the trans-Pyrenean links at 12:33:21 CEST, required a level of cross-border coordination that, according to subsequent analyses, operated at the limit of the communication protocols and response times foreseen for scenarios of this scale."
  },
  {
    "id": "colapso-q-v",
    "letter": "Q",
    "term": "Q-V Collapse",
    "definition": "Instability phenomenon in which the system's inability to balance reactive power demand causes an autocatalytic voltage drop —or, in its symmetric variant, a rise— until collapse, corresponding in the Q-V plane to the crossing of the operating point beyond the nose point of the reactive capability curve, where no stable equilibrium is possible. The 28-A incident inverted the classical causality of Q-V collapse: the dominant mechanism was not a reactive deficit (low voltages) but an excess of capacitive reactive power generated by unloaded lines after meshing, which raised voltage until cascading IBR inverter trips. An overvoltage collapse is, in a sense, the same phenomenon seen from the other end of the curve: the network crossed the stability limit not by depression but by voltage elevation beyond the range controllable with the available reactive absorption resources."
  },
  {
    "id": "compensadores-sincronos-syncons",
    "letter": "S",
    "term": "Synchronous Compensators (SynCons)",
    "definition": "Synchronous rotating machines operated in vacuum —without coupling to any primary turbine— whose exclusive function is the dynamic exchange of reactive power with the grid through excitation control, simultaneously providing genuine rotational inertia and fault current injection capacity of 300–400% of their nominal value without needing a control algorithm: the response is a direct consequence of the machine's physical electromagnetic coupling with the grid. The absence of sufficient synchronous compensators in the southern peninsula —an area that on 28-A operated with SCR < 2— is one of the structural factors that the IIT-Comillas report identifies as a precondition of the collapse: their presence would have provided the electrical stiffness that GFL inverters, by design, cannot supply."
  },
  {
    "id": "compensador-sincrono-estatico-statcom",
    "letter": "S",
    "term": "Static Synchronous Compensator (STATCOM)",
    "definition": "Active reactive power compensation device based on VSC (Voltage Source Converter) inverters that injects or absorbs reactive power continuously, dynamically, and almost instantaneously, as opposed to the discrete and slow response of mechanical switched capacitor banks. Unlike the rotating synchronous compensator, the STATCOM lacks rotational mass and does not provide inertia or robust fault current: its fault current injection capacity is limited to 1.1–1.2 times nominal, compared to 300–400% for a SynCon. It is the optimal choice for voltage support in quasi-steady state; but the 28-A incident showed that in fast transients —the 30 ms to 1 s window that precedes and accompanies a cascade of IBR trips— the absence of physical fault current makes the STATCOM an insufficient instrument when the grid is already on the verge of collapse and needs not only reactive power but genuine electrical stiffness."
  },
  {
    "id": "control-grid-forming-frente-a-grid-following",
    "letter": "G",
    "term": "Grid-Forming vs. Grid-Following Control",
    "definition": "Control paradigm that defines the causal relationship between the inverter and the grid to which it is connected. A Grid-Following (GFL) inverter models its output as a controlled current source that passively synchronizes with the voltage and frequency imposed by the grid via a Phase-Locked Loop (PLL); it is structurally dependent on a stable external reference and cannot operate in weak grids. A Grid-Forming (GFM) inverter, on the other hand, models its output as an ideal voltage source behind a virtual impedance: it actively establishes its own voltage and frequency waveform, being able to sustain the grid autonomously. The distinction is not only technical but causal: the 28-A incident was, in its deepest mechanism, the consequence of having built a system dominated by GFL inverters that, far from anchoring the grid at the moment of greatest dynamic stress, abandoned it precisely when it needed them most."
  },
  {
    "id": "coste-nivelado-de-la-energia-lcoe",
    "letter": "L",
    "term": "Levelized Cost of Energy (LCOE)",
    "definition": "Standard economic metric that compares the unit cost of production across technologies over their useful life —expressed in €/MWh and integrating CAPEX, OPEX and capacity factor—, facilitating comparisons between technologies with very different investment and generation profiles. Its most relevant systemic limitation, and the one that the 28-A illuminated with particular harshness, is that it completely ignores the value of ancillary services that a technology provides or that its absence forces to be contracted externally. A solar plant with an LCOE of €25/MWh that requires the installation of synchronous compensators at an additional systemic cost of €15/MWh has a real cost to the grid higher than the isolated LCOE suggests; the non-internalization of this externality in the market price is the regulatory friction that RD 997/2025 aims to correct through the explicit markets for Essential Reliability Services (ERS)."
  },
  {
    "id": "crisis-communication-failure",
    "letter": "C",
    "term": "Crisis communication failure",
    "definition": "In emergency management, crisis communication failure describes the institutional failure to timely occupy the information space with verifiable messages after a serious incident, during the critical window when the audience is most receptive and most vulnerable to alternative narratives. The Chaos Communication Model establishes that if the responsible institution does not issue a coherent account within the first 1–6 hours, the discursive vacuum is inevitably filled by unauthorized sources. On 28-A, the first hour after the onset of the collapse (12:33 CEST) passed without clear institutional communication from either REE or the Ministry for Ecological Transition; the information space was colonized in that interval by theories attributing the blackout to a cyberattack or sabotage, narratives that, once installed in the media ecosystem, are extraordinarily difficult to dislodge even if the subsequent technical explanation is impeccable."
  },
  {
    "id": "criterio-n-1",
    "letter": "N",
    "term": "N-1 Criterion",
    "definition": "Fundamental safety standard in the operation and planning of electrical systems that establishes the obligation to maintain voltage and frequency within regulatory limits after the contingent loss of any single element —generator, line or transformer— without causing cascading supply interruptions or equipment damage; it is regulated by ENTSO-E's SO GL and Spain's P.O. 1.1. The 28-A opens a first-order regulatory debate: the system was formally operating in N-1 compliant condition in terms of topological contingencies, and yet it collapsed. The mechanism was accumulated dynamic fragilities —low inertia, high GFL concentration, degraded SCR— that the classic N-1 Criterion, conceived for the loss of discrete physical elements, is not designed to capture. The pending question is whether the regulatory framework needs a \"dynamic N-1 Criterion\" that evaluates the simultaneous loss of a percentage of the IBR fleet as a planning contingency."
  },
  {
    "id": "csn-consejo-de-seguridad-nacional",
    "letter": "C",
    "term": "CSN (National Security Council)",
    "definition": "Collegiate body chaired by the President of the Government of Spain that coordinates national security policy, including the protection of critical infrastructures such as the electrical system. Co-author of the official Government report on the 28-A blackout, published together with Red Eléctrica de España, which constituted the first institutional version of events; it was later complemented by the independent technical analysis of IIT-Comillas, funded by AELEC, which provided the technical depth that the government report was not in a position to provide in the available time."
  },
  {
    "id": "curva-de-capacidad-reactiva-capability-curve",
    "letter": "R",
    "term": "Reactive Capability Curve (Capability Curve)",
    "definition": "Diagram in the active-reactive power plane (P-Q) that delimits the operating space of a generator, defined by three physical boundaries: the stator winding heating limit (maximum apparent power arc), the rotor winding heating limit (excitation stability curve), and the underexcitation stability limit. The distance between the actual operating point and the curve boundaries determines the available reactive regulation margin. On 28-A, generators in the southern peninsula were operating close to their inductive reactive absorption limit in underexcitation regime; when the overvoltage exceeded that margin, the grid lost the last automatic capacitive reactive absorption mechanisms that synchronous machines could provide."
  },
  {
    "id": "curva-de-pato-duck-curve",
    "letter": "D",
    "term": "Duck Curve",
    "definition": "Daily profile of net regulation demand —total demand minus non-dispatchable renewable generation— in systems with high solar penetration, which draws a characteristic shape on the hourly graph: a deep depression during the central hours of the day (when irradiation is maximum but base consumption has not yet reached the evening peak) followed by a steep ramp up at dusk. Spring is the period of maximum depth and maximum vulnerability: solar generation reaches its seasonal peaks while demand has not yet recovered winter levels. The 28-A occurred on an April Monday at noon, at the precise moment of maximum valley depth: the solar injection ramp of the previous hours had left the system with minimum synchronous load, minimum reactive absorption capacity, and maximum IBR generation concentration, exactly the conditions that the duck curve predicts as the moment of greatest systemic fragility."
  },
  {
    "id": "curvas-de-estabilidad-de-tension-q-v",
    "letter": "Q",
    "term": "Q-V Voltage Stability Curves",
    "definition": "Analytical tool that represents, for a given network bus, the relationship between the reactive power injected or absorbed and the resulting voltage at that bus. The curve has an inverted parabola shape with a minimum (nose point) that defines the voltage stability limit: to the right of the minimum, the system can reach stable equilibrium; to the left, no equilibrium point exists. The distance on the Q axis between the operating point and the nose point defines the available reactive stability margin. Analyses from the IIT-Comillas report indicate that the southern peninsula buses were operating on 28-A with reduced Q-V margins, so that the sudden injection of capacitive reactive power caused by the meshing and open lines was sufficient to cross the limit and enter the zone of irreversible collapse."
  },
  {
    "id": "damping-ratio-ratio-de-amortiguamiento",
    "letter": "D",
    "term": "Damping ratio",
    "definition": "Dimensionless indicator that quantifies the attenuation speed of an electromechanical oscillation after a disturbance, expressed as a fraction of critical damping. A value of 5% is considered the minimum reasonable operational threshold in the European synchronous system; values close to 0% indicate sustained oscillations that can persist for minutes without attenuation; negative values imply increasing dynamic instability. On 28-A, PMU records detected an inter-area oscillation at 0.6 Hz with reduced damping in the minutes before the collapse, a signal that in retrospect was an early indicator of dynamic stress; the speed of the subsequent collapse —30 seconds— however far exceeded the response capacity of any early warning protocol based on damping ratio monitoring."
  },
  {
    "id": "efecto-ferranti",
    "letter": "F",
    "term": "Ferranti Effect",
    "definition": "Passive overvoltage phenomenon that occurs in high-voltage transmission lines operated at no load or very low load: the distributed capacitive admittance of the line generates capacitive current even without load connected at the receiving end, and in the absence of sufficient inductive consumption to compensate it, the voltage at that receiving end exceeds that of the sending end, with a magnitude proportional to line length and frequency. It is especially pronounced in 400 kV lines energized during reconfiguration maneuvers. On 28-A, the meshing maneuver executed to raise depressed voltages in the southern zone energized line sections at no load whose capacitive charge introduced an additional injection of reactive power into a grid that already accumulated an excess of capacitive generation; the correction maneuver thus became the instrumental trigger of the collapse, although the structural vulnerability pre-existed it."
  },
  {
    "id": "emergent-norm-theory",
    "letter": "E",
    "term": "Emergent norm theory",
    "definition": "Sociological theory developed by Turner and Killian that describes how, in situations of collective disruption, social groups spontaneously develop new norms of adaptive behavior that guide conduct in the absence of usual institutional structures, contrary to the classic view of mass panic and collective irrationality. The 28-A provided field data that confirm this theory: in the absence of institutional communication during the first hours, citizens developed spontaneous cooperation behaviors —manual traffic management, mutual assistance in blocked elevators, informal information networks among neighbors— that partially mitigated the effects of the information vacuum and minimized the severity of direct personal harm beyond what crisis models based on panic would have predicted."
  },
  {
    "id": "encuadre-mediatico-framing-y-agenda-shifting",
    "letter": "M",
    "term": "Media framing and agenda-shifting",
    "definition": "Framing is the cognitive and editorial process by which media select and emphasize certain elements of an event to propose a specific causal interpretation, privileging some readings over others. Agenda-shifting is the complementary phenomenon by which a high-visibility disruptive event is instrumentalized to reopen pre-existing political or structural debates. The 28-A was a textbook case of both: the same blackout was simultaneously framed as proof of the \"fragility of renewables\", as evidence of the \"insufficiency of European interconnection\", as an argument in favor of \"maintaining nuclear power\", and as a consequence of \"government regulatory negligence\", depending on the medium and audience. Each frame selected real aspects of the incident and constructed causal narratives with them that subsequent technical investigation would confirm, qualify, or discredit to varying degrees, but whose public reception had already been fixed long before any rigorous analysis was published."
  },
  {
    "id": "entso-e",
    "letter": "E",
    "term": "ENTSO-E",
    "definition": "The European Network of Transmission System Operators for Electricity (ENTSO-E) groups 40 TSOs from 36 European countries, with a mandate derived from EU legislative packages to ensure the operational security of the continental synchronous grid, facilitate renewable integration, and establish binding Network Codes for Member States. Its functions include real-time operational coordination through RCCs, publication of the Ten-Year Network Development Plans (TYNDP), and drafting of technical Network Codes. The 28-A triggered an unprecedented speed of regulatory response at ENTSO-E: the draft NC RfG 2.0 —which introduces mandatory GFM capabilities for installations ≥ 1 MW— was published in November 2025, barely seven months after the collapse, reflecting the urgency with which the European technical community processed the evidence of systemic vulnerability exposed by the Iberian incident."
  },
  {
    "id": "ers-essential-reliability-services-servicios-esenciales-de-confiabilidad",
    "letter": "E",
    "term": "ERS (Essential Reliability Services)",
    "definition": "Set of physical attributes indispensable for the safe and resilient operation of the electrical system that cannot be provided by the energy market without an explicit regulatory signal: rotational inertia (or its synthetic equivalent), short-circuit power, primary frequency regulation (FFR/FCR), and dynamic voltage and reactive power control. In the traditional synchronous generation system, these services were automatic byproducts of the normal operation of alternators —no one contracted them because no one needed to contract them—; in the IBR-dominated system, they must be designed, configured, and explicitly remunerated. The 28-A was the most costly empirical demonstration possible that the energy transition without an ERS market generates systemic externalities whose cost —estimated between €1,000 and €1,500 million for the Iberian incident— far exceeds the cost of the preventive regulation that was postponed. RD 997/2025 and ENTSO-E's NC RfG 2.0 are the direct response to that evidence."
  },
  {
    "id": "estabilidad-de-tension",
    "letter": "V",
    "term": "Voltage stability",
    "definition": "Ability of an electrical system to maintain voltage levels at all its buses within regulatory operational limits both in steady state and after disturbances, which requires the continuous balance between the reactive power demand of loads and inductive lines, and the reactive power contribution from generators, compensators, and the distributed capacitance of lines. Unlike frequency stability —which depends on the active power balance and is an essentially systemic phenomenon— voltage stability is local: it can collapse in one zone while the rest of the system operates normally. The 28-A was a voltage stability collapse, not a frequency one; the distinction is not academic, but defines which defense mechanisms are effective and which —such as UFLS, designed for active deficits— are counterproductive when applied to the wrong scenario."
  },
  {
    "id": "estabilizadores-del-sistema-de-potencia-pss",
    "letter": "P",
    "term": "Power System Stabilizers (PSS)",
    "definition": "Additional control loops installed in the excitation system of synchronous generators that add active electrical damping to low-frequency electromechanical oscillations (0.1–2 Hz) arising from the dynamic interaction between geographically distant machines. They operate by injecting a feedback signal —derived from rotor angular speed or electrical power— into the automatic voltage regulator (AVR) with the appropriate phase shift so that the generator's response opposes the oscillation instead of amplifying it. The progressive reduction of the peninsular synchronous fleet implies the cumulative loss of active PSS —each plant that closes takes with it its contribution to system damping—, degrading the damping ratio of inter-area modes; the 28-A evidenced this damping deficit through the 0.6 Hz oscillation detected in the records prior to the collapse."
  },
  {
    "id": "estrategia-brownfield",
    "letter": "B",
    "term": "Brownfield Strategy",
    "definition": "In energy infrastructure engineering, the conversion of existing industrial facilities—decommissioned thermal power plants, nuclear plants in the process of closure, large decommissioned generation substations—to provide them with new systemic functions, preserving the civil infrastructure, substation, and evacuation lines already built. In the post-28A context, the most relevant application consists of converting the alternators of these facilities into pure synchronous condensers, decoupling the rotor from the turbine and operating the machine exclusively for reactive power and inertia exchange. The advantages are quantifiable: implementation time is reduced from 4–6 years for a greenfield installation to 18–24 months, and capital cost can be between 40% and 60% lower. Since the largest post-28A deficits of inertia and short-circuit power are concentrated precisely in the areas where thermal plants were decommissioned, the Brownfield strategy has the additional advantage of providing services exactly where they are most needed. *(See also entry 106 for extended version.)*"
  },
  {
    "id": "fast-frequency-response-ffr",
    "letter": "F",
    "term": "Fast Frequency Response (FFR)",
    "definition": "Sub-cycle stabilization service that injects a block of active power in the critical time window before the activation of conventional mechanical governors (FCR), typically within the first 200–250 ms after the disturbance, when RoCoF is highest and the risk of anti-islanding protection activation is greatest. While primary regulation acts on a scale of 5–30 seconds, FFR responds on a half-cycle scale, essential in low-inertia systems where the same generation loss produces much higher RoCoF. The 28-A event showed that the Spanish ancillary services framework lacked a regulated and remunerated FFR product; the collapse itself was voltage-driven—not the target scenario for FFR—but the absence of any coordinated sub-cycle response left the system without dynamic anchors during the critical period."
  },
  {
    "id": "frecuencia-nominal",
    "letter": "N",
    "term": "Nominal Frequency",
    "definition": "Reference value of the frequency of the continental European synchronous system: 50 Hz, established by ENTSO-E regulations and P.O. 1.1 of the Spanish system. Operational limits define zones of increasing severity: normal operation in [49.0–51.0] Hz; alert in [48.5–49.0] Hz and [51.0–51.5] Hz; emergency below 47.5 Hz or above 51.5 Hz. The 28-A event illustrated a counterintuitive phenomenon for operators trained to associate collapse alarms with frequency deviation: the system frequency remained relatively close to 50 Hz during the critical seconds, because the dominant mechanism was voltage collapse, not active power imbalance; severe frequency deviation only manifested in the final moments, when generators began tripping as a consequence of the already consummated voltage collapse."
  },
  {
    "id": "gfl-grid-following",
    "letter": "G",
    "term": "GFL (Grid-Following)",
    "definition": "Inverter control strategy in which the equipment operates as a controlled current source that passively synchronizes with the grid voltage and frequency via a Phase-Locked Loop (PLL). Its advantage is simplicity of implementation and low cost; its structural limitation is the absolute dependence on a stable external grid to provide the phase reference: in weak grids (SCR < 2), the PLL becomes unstable with negative damping (ζ_PLL < 0) and the inverter loses synchronization. On 28-A, 78–82% of the peninsular IBR fleet operated in GFL mode: when voltage began to oscillate, the PLLs of thousands of inverters lost reference almost simultaneously, tripping the units and abruptly withdrawing the scarce remaining reactive support. The hegemony of GFL was not an individual design failure but the accumulated result of decades of connection requirements that did not demand—because its need had not been anticipated—grid-forming capabilities."
  },
  {
    "id": "gfm-grid-forming",
    "letter": "G",
    "term": "GFM (Grid-Forming)",
    "definition": "Inverter control strategy in which the equipment acts as an ideal voltage source behind a virtual impedance, autonomously generating the amplitude and frequency of its output without needing an external reference: it can operate in weak grids (SCR < 1.5), provide configurable synthetic inertia, autonomously support the grid, and inject controlled fault current. ENTSO-E's NC RfG 2.0 (November 2025) proposes making GFM mandatory for all generation or storage modules ≥ 1 MW; RD 997/2025 sets Spain's target at 22.5 GW of GFM storage by 2030. If 28-A posed the question—what would have happened with a GFM-dominated fleet?—the simulations from the IIT-Comillas report provide the answer: the cascade would have been contained, or at least significantly delayed, because GFM inverters would have sustained voltage instead of abandoning the grid at the moment of greatest need."
  },
  {
    "id": "headroom-reserva-de-capacidad-del-inversor",
    "letter": "H",
    "term": "Headroom (Inverter Capacity Reserve)",
    "definition": "Fraction of the maximum apparent capacity (S_max) that a GFM inverter must deliberately keep unused in steady-state active power injection, in order to have sufficient margin to respond to fast voltage or frequency transients without saturating the power electronics. This reserve is, in essence, the physical price of dynamic stability: a GFM inverter operating at 100% of its active capacity cannot inject additional reactive power during a disturbance without violating its current limits. The economic friction is evident—headroom is active power not sold in the energy market—and it is precisely this unpaid externality that justifies the creation of Essential Reliability Services (ERS) markets: without explicit remuneration, no operator has an incentive to maintain headroom, and the system is left without the margin of maneuver that 28-A proved essential. *(See also entry 110 for extended version.)*"
  },
  {
    "id": "hvdc-high-voltage-direct-current",
    "letter": "H",
    "term": "HVDC (High Voltage Direct Current)",
    "definition": "Electric transmission technology using direct current at high voltage that, unlike alternating current transmission, does not require phase synchronism between the ends of the link and allows independent and precise control of active power flow in both directions. Its main applications include interconnection of asynchronous systems, very long-distance transmission with low losses, and submarine cables. In the context of 28-A, the virtual absence of HVDC capacity between the Iberian Peninsula and the continental system is cited as one of the structural factors that amplified the scope of the collapse: an HVDC link of sufficient capacity could have imported active power and voltage support from France during the initial phases of instability, regardless of the synchronism status of the two systems, which was precisely the condition that disabled the trans-Pyrenean AC links."
  },
  {
    "id": "ibr-inverter-based-resources",
    "letter": "I",
    "term": "IBR (Inverter-Based Resources)",
    "definition": "Generation or storage resources that interconnect to the AC grid exclusively through power electronics, without direct electromechanical coupling with the synchronous system; the category includes photovoltaic, type 3 and 4 wind, BESS systems, STATCOM, SVC, and HVDC link converters. On 28-A, 82% of peninsular instantaneous generation corresponded to IBR resources (Analysis Committee report, p. 38). The concentration of IBR plants operating with GFL strategies—without the ability to provide inertia or sustain voltage in weak grids—is the central technical factor that transformed a disturbance that would have been manageable in a system with greater dynamic robustness into a total systemic collapse: it was not the amount of renewables that failed, but their control architecture."
  },
  {
    "id": "igbt-insulated-gate-bipolar-transistor",
    "letter": "I",
    "term": "IGBT (Insulated Gate Bipolar Transistor)",
    "definition": "Power semiconductor that combines the high input impedance of the field-effect transistor with the low on-resistance of the bipolar transistor, enabling efficient switching of large currents at frequencies of 1–20 kHz. It is the fundamental active component of modern inverters that make up the Iberian IBR fleet. Its microsecond switching capability allows a GFL inverter to detect a voltage disturbance and disconnect its output in less than one grid cycle (20 ms): this same speed that makes the IGBT so efficient as a converter element was what allowed thousands of inverters to trip in cascade during the 28-A overvoltage, completing the collapse in just 30 seconds. Speed is not a neutral attribute; in the wrong context, it is the speed of disaster."
  },
  {
    "id": "impedancia-de-transferencia",
    "letter": "T",
    "term": "Transfer Impedance",
    "definition": "In power systems, the impedance between two nodes quantifies the electrical opposition to power flow between them, determining how much the voltage at one node varies when injection at the other is modified. A high transfer impedance implies a weakly coupled grid: power variations produce large voltage and angle variations, degrading system firmness and making the PLL control of GFL inverters unstable. The transfer impedance between the Iberian Peninsula and the continental system is structurally high due to the bottleneck of the trans-Pyrenean interconnection—barely 3% of peninsular demand in NTC terms—meaning that the Iberian system cannot \"borrow\" electrical stiffness from the continental grid to the extent that other border systems can. The 28-A event made evident that this structural weakness has real and measurable dynamic consequences in terms of SCR."
  },
  {
    "id": "infodemia",
    "letter": "I",
    "term": "Infodemic",
    "definition": "Accelerated and massive proliferation of unverified, erroneous, or outright false content in the information space, competing with verified information and hindering both institutional and citizen decision-making; term popularized by the WHO and applicable to any crisis with high media visibility. Social networks act as structural amplifiers by optimizing the spread of high-emotional-impact content regardless of its veracity. The 28-A event generated a textbook infodemic in the first hours: hypotheses of cyberattack, images of supposed explosions at substations, claims about the solar origin of the collapse, and attributions to foreign state actors circulated with millions of interactions before any preliminary technical analysis had been published, fixing in the collective imagination interpretative frameworks that subsequent technical rigor could hardly dislodge."
  },
  {
    "id": "inercia-sintetica-virtual-inertia",
    "letter": "S",
    "term": "Synthetic Inertia (Virtual Inertia)",
    "definition": "Control algorithm implemented in GFM inverters that mathematically emulates the rotor swing equation of a synchronous machine: it measures the time derivative of frequency (df/dt, or RoCoF) and adjusts the injected power proportionally to that derivative, mimicking the damping effect of rotational mass against frequency disturbances. Its advantage over physical inertia is that the synthetic inertia constant (H_virtual) is an adjustable software parameter, not an immutable physical property of the equipment. Its limitation is the dependence on underlying storage: if the BESS operates at low state of charge, the available synthetic inertia is physically bounded by the stored energy. On 28-A, the near-total absence of inertia—synthetic or real—in southern Spain was the condition that eliminated the system's reaction time to the initial disturbance, transforming a voltage oscillation into an irreversible cascade."
  },
  {
    "id": "low-voltage-ride-through-lvrt",
    "letter": "L",
    "term": "Low Voltage Ride Through (LVRT)",
    "definition": "Capability required of IBR inverters to remain connected and inject reactive power support during a voltage dip, rather than disconnecting via protection. LVRT requirements in Spain are regulated by P.O. 12.3 and include the dynamic parameter k (proportionality factor between injected reactive current and dip depth). The LVRT design assumes a grid with sufficient electrical stiffness so that the inverter's reactive injection effectively raises the voltage at the connection point. The 28-A event highlighted the limitation in the reverse scenario: in grids with SCR < 2, massive injection of capacitive reactive power according to classic LVRT profiles can further raise an already elevated voltage, amplifying instability instead of containing it, requiring a fundamental revision of the coordination between the LVRT profile and grid weakness. *(See also HVRT, entry 112.)*"
  },
  {
    "id": "mallado",
    "letter": "M",
    "term": "Mallado (Grid Meshing)",
    "definition": "Operational maneuver of topological reconfiguration that increases grid connectivity by closing switches on 400 kV lines, connecting previously separated substations or sections, with the usual objective of improving the voltage profile by distributing reactive load among more parallel paths. On 28-A, the meshing maneuver executed by REE to raise depressed voltages in the southern zone inadvertently activated the Ferranti Effect: by energizing line sections that remained open after the closure, the distributed capacitance of those sections injected additional reactive power into a grid that already accumulated an excess of capacitive generation. The corrective maneuver thus became the instrumental trigger of the collapse, although the structural vulnerability pre-existed it; without the pre-existing conditions of degraded SCR and low inertia, the same meshing would have been a routine operational maneuver."
  },
  {
    "id": "nc-rfg-network-code-on-requirements-for-generators",
    "letter": "N",
    "term": "NC RfG (Network Code on Requirements for Generators)",
    "definition": "European ENTSO-E grid code that harmonizes the mandatory technical requirements for connecting generation installations to the transmission grid, classifying modules into three categories (A, B, C) according to their power and systemic impact. The original version (EU Regulation 2016/631) was fundamentally conceived for synchronous generation and did not explicitly contemplate grid-forming requirements for IBR. Version 2.0, proposed in November 2025—directly motivated by the conclusions of the 28-A investigation—introduces mandatory GFM capability for all modules ≥ 1 MW, along with new minimum SCR/MRSCR criteria at the connection point: it is the most profound reform of European grid codes since the entry into force of the Clean Energy Package, and 28-A was its technical justification."
  },
  {
    "id": "oscilaciones-electromecanicas",
    "letter": "E",
    "term": "Electromechanical oscillations",
    "definition": "Oscillatory modes of the electrical system arising from the dynamic interaction between the rotors of geographically distributed synchronous generators: when electrical power varies abruptly, the rotors—which cannot change their speed instantaneously due to their inertia—oscillate among themselves with characteristic frequencies. Local modes (0.7–2 Hz) involve generators within the same area; inter-area modes (0.1–0.7 Hz) involve groups of machines from different regions. On 28-A, PMUs recorded an inter-area oscillation at 0.6 Hz with reduced damping in the minutes before the collapse, a signal that in retrospect indicated the system was already under dynamic stress before the trip that initiated the cascade, and that the progressive reduction of the synchronous fleet—with its associated PSS—had degraded the system's ability to damp that oscillation."
  },
  {
    "id": "oscilaciones-forzadas-y-naturales",
    "letter": "F",
    "term": "Forced and natural oscillations",
    "definition": "Natural oscillations are the system's own electromechanical modes, whose frequency is determined by machine inertia and network constants; they are activated by any disturbance and are damped—or not—depending on the mode's damping ratio. Forced oscillations are induced by a periodic external disturbance, typically a faulty control loop in a specific piece of equipment, whose frequency does not necessarily coincide with any natural mode but can excite them if resonance exists. The distinction is operationally critical: a natural oscillation requires increasing system damping (PSS, POD); a forced oscillation requires identifying and eliminating the excitation source. On 28-A, the subsequent investigation analyzed whether the detected 0.6 Hz oscillation was a poorly damped natural mode—consequence of low synchronous density—or a forced oscillation from some equipment with anomalous behavior prior to the collapse."
  },
  {
    "id": "outrage-communication-comunicacion-de-indignacion",
    "letter": "O",
    "term": "Outrage communication",
    "definition": "Concept derived from Peter Sandman's risk model—Risk = Hazard + Outrage—which establishes that public perception of an incident depends not only on the technical magnitude of the hazard but, to a greater extent, on emotional and contextual factors: perception of voluntariness, fairness, institutional transparency, and outrage at possible negligence. On 28-A, outrage levels were extraordinarily high regardless of the underlying technical cause: a 15,000 MW blackout on a working day, unprecedented in Western Europe, triggers emotional mechanisms that no subsequent technical explanation can fully deactivate. Public perception of regulatory negligence amplified outrage beyond what the technical hazard assessment would have justified, with political consequences that far exceeded the scale of documented material damage."
  },
  {
    "id": "pniec-plan-nacional-integrado-de-energia-y-clima",
    "letter": "P",
    "term": "PNIEC (National Integrated Energy and Climate Plan)",
    "definition": "Spanish energy planning framework that sets decarbonization, renewable penetration, and energy efficiency targets for the 2030 horizon, consistent with the European Green Deal objectives. The pre-28-A version projected 74% renewable penetration in the electricity mix by 2030, with a progressive reduction of synchronous thermal generation. On 28-A did not question the PNIEC penetration targets—the cause of the collapse was not excess renewables but a deficit of dynamic robustness—but it did show that the implementation roadmap lacked a sufficiently detailed parallel plan to ensure that Essential Reliability Services were provided as synchronous generation was retired, making the PNIEC update an urgent regulatory necessity."
  },
  {
    "id": "potencia-de-cortocircuito-ssc",
    "letter": "S",
    "term": "Short-circuit power (Ssc)",
    "definition": "Magnitude that measures the electrical stiffness of a network node: it represents the apparent current that would flow into that node in the event of a solid three-phase short circuit, and is directly proportional to the number and power of synchronous generators and compensators electrically nearby. A high Ssc implies that small variations in injected power produce minimal voltage variations (\"strong\" node); a low Ssc implies that power variations translate into large voltage variations (\"weak\" node), making the PLL control of GFL inverters unstable. On 28-A, the nodes of the southern peninsula—an area with high concentration of IBR plants and low synchronous generation density—operated with insufficient short-circuit power to sustain the dynamics of connected inverters, a condition reflected in the IIT-Comillas report as SCR < 2 documented for that area at the time of collapse. *(See also entry 105.)*"
  },
  {
    "id": "power-system-stabilizers-y-power-oscillation-damping-pss-pod",
    "letter": "P",
    "term": "Power System Stabilizers and Power Oscillation Damping (PSS/POD)",
    "definition": "Additional control modules installed in the excitation systems of synchronous generators (PSS) or in the control loops of GFM inverters (POD) that add active damping to the system's electromechanical oscillations, injecting counter-phase signals calculated to oppose detected oscillations. PSS derive their signal from rotor angular speed or electrical power; POD in GFM inverters do the equivalent through reactive power modulation. The progressive reduction of the peninsular synchronous fleet implies the cumulative loss of active PSS, degrading the damping ratio of inter-area modes; on 28-A urgently raised the question of whether POD systems in GFM inverters can quantitatively compensate for that loss or whether system damping requires a minimum density of synchronous machines that inverters, by their nature, cannot fully replicate."
  },
  {
    "id": "procedimiento-de-operacion-1-6-p-o-1-6",
    "letter": "O",
    "term": "Operating Procedure 1.6 (P.O. 1.6)",
    "definition": "Emergency protocol of the Spanish electrical system that establishes safeguard plans for critical incidents and procedures for restoring supply after a partial or total voltage collapse. It defines strategies for fragmenting the network into independent electrical islands, preferred energization routes from Black Start nodes, and the protocol for prioritizing the start-up of generation facilities for sequential system restoration. On 28-A, P.O. 1.6 was activated under unprecedented conditions in the operation of the peninsular system: the geographical extent of the collapse (the entire 400 kV network) and its speed (30 seconds to voltage collapse) pushed the protocol to the limits of its design assumptions, generating one of the most complex restoration operations executed in Western Europe in recent decades."
  },
  {
    "id": "procedimiento-de-operacion-7-4-p-o-7-4",
    "letter": "O",
    "term": "Operating Procedure 7.4 (P.O. 7.4)",
    "definition": "Technical regulation of the Spanish electrical system that governs the voltage control adjustment service in the transmission network, defining the obligations of generators to absorb or inject reactive power (Q) according to the System Operator's setpoints, along with target voltage bands, response times, and penalty mechanisms for non-compliance. On 28-A opened the regulatory debate on whether P.O. 7.4—designed in an environment of predominantly synchronous generation, with Q response dynamics of seconds to minutes—is adapted to the reality of a renewable fleet capable of modifying its reactive contribution in milliseconds, or whether it requires a revision incorporating dynamic Q requirements compatible with the speed of voltage collapses that high IBR penetration makes possible."
  },
  {
    "id": "programa-ds3-de-eirgrid-delivering-a-secure-sustainable-electricity-system",
    "letter": "E",
    "term": "EirGrid's DS3 Programme (Delivering a Secure, Sustainable Electricity System)",
    "definition": "Pioneering ancillary services framework developed by EirGrid to operate the Irish island network with asynchronous renewable generation penetrations of up to 75% in real time, introducing six categories of stability products—synthetic inertia, fast frequency response, dynamic voltage control, virtual short-circuit power, among others—explicitly remunerated in specific markets independent of the energy market. DS3 is the most cited international reference in the post-28A regulatory discussion, not because the Iberian system is comparable to the Irish one in scale, but because it provides proof of concept that ERS markets are implementable, financially sustainable, and technically effective. Spain and Portugal observed DS3 for years as an experiment on a peripheral island; on 28-A turned it into a model for urgent application."
  },
  {
    "id": "protecciones-de-perdida-de-sincronismo-ost",
    "letter": "L",
    "term": "Loss-of-synchronism protections (OST)",
    "definition": "System protection relays (ANSI function 78) designed to detect severe angular divergence between two interconnected electrical areas—the so-called pole slip—and automatically open the interconnection lines to contain equipment damage and prevent the asynchronous oscillation from propagating to the rest of the system. They operate by tracking the apparent impedance phasor in the R-X plane: when the phasor trajectory crosses the mho characteristic with the speed and direction typical of a pole slip, opening is ordered. On 28-A, the ANSI 78 protections of the trans-Pyrenean links operated at 12:33:21 CEST upon detecting loss of synchronism between the Iberian Peninsula and the continental European system. The action was technically correct—prevented structural damage to equipment—and was also, in the incident record, the formal signature of the Iberian systemic collapse."
  },
  {
    "id": "ree-red-electrica-de-espana",
    "letter": "R",
    "term": "REE (Red Eléctrica de España)",
    "definition": "Spanish Transmission System Operator (TSO), a public company responsible for real-time management of the high-voltage electricity transmission network in the Iberian Peninsula and the archipelagos, with obligations to guarantee non-discriminatory network access and security of supply. On 28-A, REE was simultaneously the central operational actor of the incident—responsible for the maneuvers preceding the collapse and the restoration operation that followed—and the main object of the subsequent investigation: the questions about what information the operator had in real time, what decisions it made, in what time window it made them, and what alternatives it had, constitute the technical and regulatory core of the controversy that the incident opened."
  },
  {
    "id": "regimen-de-renovables-cogeneracion-y-residuos-rcr",
    "letter": "R",
    "term": "Renewables, Cogeneration and Waste Regime (RCR)",
    "definition": "Regulatory framework of the Spanish electrical system that groups electricity production installations from decarbonized sources—solar photovoltaic, wind, run-of-river hydro, biomass, high-efficiency cogeneration, and municipal solid waste—establishing specific remuneration mechanisms that guarantee the profitability of these installations beyond wholesale market revenues. The RCR is the instrument that drove the massive expansion of the peninsular renewable fleet to the penetration levels characterizing the context of 28-A; the post-incident regulatory criticism points out that the RCR remunerates the energy produced but not the systemic services that installations should simultaneously provide, generating the externality that the incident made visible."
  },
  {
    "id": "reles-de-comprobacion-de-sincronismo-synchro-check",
    "letter": "S",
    "term": "Synchro-check relays",
    "definition": "Protection devices (ANSI function 25) used in coupling maneuvers between electrical systems that have been separated—during island operation or after restoration from Black Start—whose function is to monitor that voltage, frequency, and phase angle on both sides of the coupling breaker are within predefined tolerances before authorizing closure, avoiding the inrush current transient and mechanical impact that would occur when joining systems with significant angular phase shift. On 28-A, synchro-check relays played a critical role during restoration: the sequential coupling of recovered electrical islands with the continental system—and among the restored Iberian blocks themselves—required millimeter coordination of synchronism conditions to avoid secondary disturbances that would have further delayed an already extraordinarily complex restoration."
  },
  {
    "id": "rocof-rate-of-change-of-frequency",
    "letter": "R",
    "term": "RoCoF (Rate of Change of Frequency)",
    "definition": "Time derivative of frequency (df/dt, expressed in Hz/s) that measures the speed of frequency variation of the system in response to a generation-demand imbalance. It is calculated as RoCoF = −f₀ · ΔP / (2H · S_base), which highlights the inverse dependence on inertia H: the lower the inertia, the same power imbalance produces a higher RoCoF and a system that degrades more quickly. It is the reference parameter for sizing sub-cycle response (FFR) and for calibrating anti-islanding relays (ANSI 81R), which trip when RoCoF exceeds thresholds configured around 0.5 Hz/s. On 28-A, the average RoCoF remained below ±1 Hz/s until 12:33:20 CEST—confirming that the collapse was not a conventional frequency instability—with estimated secondary peaks of ~1.5 Hz/s in 100 ms windows, coinciding with the cascading trips of IBR plants during the final phase of the voltage collapse."
  },
  {
    "id": "scr-short-circuit-ratio",
    "letter": "S",
    "term": "SCR (Short-Circuit Ratio)",
    "definition": "Dimensionless ratio between the available short-circuit power at a node (S_ac [MVA]) and the nominal power of the IBR resource connected at that point (P_i [MW]): SCR = S_ac / P_i. It quantifies the network strength at the inverter connection point: SCR > 3 implies strong network; 2 < SCR < 3, weak network; SCR < 2, very weak network, where PLL instability under voltage variations greater than 5–10% is practically inevitable for GFL inverters. On 28-A, the nodes of the southern peninsula operated with SCR < 2 during critical hours, a condition known to REE and documented in renewable integration studies prior to the incident: this condition turned each IBR plant in the area into a potentially unstable device waiting for a voltage disturbance large enough to trigger the cascade that finally arrived."
  },
  {
    "id": "sincronismo",
    "letter": "S",
    "term": "Synchronism",
    "definition": "Operating condition in which all synchronous generators connected to the grid rotate at the same electrical angular speed (2πf₀ = 314.16 rad/s in the 50 Hz European system), with stable rotor angle differences. Synchronism is not a binary state but a dynamic equilibrium: angular differences between machines fluctuate continuously, but the synchronizing torque acts as a spring that returns the system to its equilibrium point. Loss of synchronism implies that this spring has been overcome: the rotors diverge angularly with no possibility of return, forcing automatic breaker opening to contain damage. On 28-A, the loss of synchronism between the Iberian Peninsula and the continental system —formalized by the opening of ANSI 78 relays at 12:33:21 CEST— was the boundary between a serious incident and a total blackout."
  },
  {
    "id": "sistema-voltaire",
    "letter": "V",
    "term": "VOLTAIRE System",
    "definition": "Voltage control architecture implemented by REE and integrated into CECRE for dynamic voltage regulation in the peninsular system. It operates in two hierarchical layers: Secondary Voltage Regulation (RST), which calculates and issues real-time reactive power setpoints to participating generators to maintain pilot voltages at target values; and Tertiary Voltage Regulation (RTT), which optimizes reactive power plans on an hourly horizon. Its algorithms were designed to manage voltage variations on minute scales; the Iberian cascade completed in 30 seconds. The question of whether VOLTAIRE has the necessary control bandwidth to act as a defense mechanism against rapid collapses —or whether it must be complemented by faster-acting system protection schemes— remained open after 28-A."
  },
  {
    "id": "so-gl-system-operation-guidelines",
    "letter": "S",
    "term": "SO GL (System Operation Guidelines)",
    "definition": "System Operation Guidelines published by ENTSO-E that define the regulatory framework for the safe operation of the European synchronous grid, establishing minimum operational safety parameters and the five severity levels of system state: Normal, Alert, Emergency, Blackout, and Restoration, with quantitative voltage and frequency criteria for state transitions. 28-A is, due to its scale and speed, the most relevant activation of the Blackout → Restoration sequence in the continental synchronous grid since the 2003 Italian blackout, and its analysis within the SO GL framework has driven the revision of quantitative threshold criteria between Alert and Emergency states."
  },
  {
    "id": "tso-transmission-system-operator",
    "letter": "T",
    "term": "TSO (Transmission System Operator)",
    "definition": "Transmission System Operator: entity responsible for the operation, maintenance, and development of the high-voltage electricity transmission network in a given territory, with the obligation to guarantee non-discriminatory network access and security of supply. In Spain, REE acts as the sole TSO for the Iberian Peninsula; in Portugal, REN is the national TSO; in France, RTE. Coordination among the three TSOs —and their relationship with the RCC of the Continental Europe region— was one of the most studied aspects in the post-28A analysis, given that the propagation of the collapse across control boundaries tested coordination protocols not designed for a scenario of this magnitude and speed."
  },
  {
    "id": "ufls-under-frequency-load-shedding",
    "letter": "U",
    "term": "UFLS (Under-Frequency Load Shedding)",
    "definition": "Automatic system defense scheme that disconnects demand blocks in stages when frequency falls below predefined thresholds —in the Spanish P.O. 1.6: pumping at 49.5 Hz, industrial demand from 49.0 Hz—, with the aim of restoring generation-demand balance before frequency collapse becomes irreversible. Its design logic assumes the classic scenario: a large generator trips, frequency drops, UFLS removes equivalent load, balance is restored. 28-A demonstrated the structural limitation of this design under the wrong scenario: the collapse was voltage, not active power; by shedding inductive loads —precisely those absorbing the capacitive reactive power that was overvolting the system—, UFLS removed the last available reactive sinks, accelerating the collapse instead of stopping it. A correct defense mechanism for the conventional scenario can be as harmful as the absence of any mechanism when the failure occurs on the wrong side of stability."
  },
  {
    "id": "vacuum-filling-relleno-del-vacio-informativo",
    "letter": "V",
    "term": "Vacuum filling (Information vacuum filling)",
    "definition": "Structural and inevitable process by which collective uncertainty in the face of a disaster generates a demand for explanations that, if not satisfied by institutions in a timely manner, is spontaneously covered by unauthorized sources whose accounts, although unverified, fill the void with emotionally coherent narratives, though not necessarily truthful. Vacuum filling is the structural counterpart of crisis communication failure: both describe the same phenomenon from complementary perspectives, the first from the side of non-institutional information supply, the second from the failure of institutional supply. On 28-A, the absence of official technical communication during the first four hours turned social media into the primary information medium, with the epistemological and political consequences that subsequent analysis exhaustively documents."
  },
  {
    "id": "vehicle-to-grid-v2g",
    "letter": "V",
    "term": "Vehicle-to-Grid (V2G)",
    "definition": "Technology that enables bidirectional power flow between electric vehicles and the grid, allowing EV batteries to inject active and reactive power into the grid when the system requires it, instead of acting exclusively as consumption loads. Its systemic value lies not only in stored energy but in distributed controllability: millions of coordinated bidirectional inverters can provide synthetic inertia, local voltage support, and frequency response at very low marginal cost, since the battery already exists in the vehicle. 28-A demonstrated that centralized storage —large BESS at transmission network nodes— has limits in the face of collapses that propagate faster than centralized communication times; distributed V2G could have provided the local damping that centralized control could not, although the current barrier is not technological but regulatory: bidirectional meters, V2G protocols, and tariff incentives for participation in ancillary services are the conditions that the post-28A framework must create."
  },
  {
    "id": "inercia-h",
    "letter": "I",
    "term": "Inertia (H)",
    "definition": "The inertia constant H is a dimensionless parameter that expresses the kinetic energy stored in the rotating masses of a synchronous generator normalized by its rated power: H = E_kinetic [MWs] / S_n [MVA]. In practice, it represents the time in seconds during which the generator could supply its rated load solely with the kinetic energy of its rotor before stopping. The greater the total system inertia, the slower the RoCoF in response to a power imbalance, and the longer the time available for regulators to act. On 28-A, the peninsular system operated with H ≈ 2.3 s at the aggregate level, but with zonal values of 1.3–1.8 s in the south —the area with the highest concentration of IBR and lowest density of synchronous generation—, meaning that in that area the time available for regulation mechanisms to respond to a disturbance was less than half of that available under normal operating conditions: there was no margin to react."
  },
  {
    "id": "potencia-reactiva-q",
    "letter": "R",
    "term": "Reactive power (Q)",
    "definition": "Component of electrical power in alternating current associated with the cycle of energy storage and release in magnetic fields (inductances) and electric fields (capacitors), without being dissipated as useful work; measured in volt-amperes reactive (VAr). Unlike active power, reactive power has an essentially local range and must be generated close to where it is consumed. The reactive power balance determines the voltage profile of the grid: an excess of capacitive reactive power —unloaded lines, uncompensated capacitors— raises voltage; a deficit depresses it. 28-A was, in its deep mechanism, a reactive power management problem: the meshing maneuver in the southern grid introduced an excess of capacitive reactive power that the system —with reduced synchronous fleet and IBR fleet lacking robust absorption capability under overvoltage conditions— could not compensate within the limited time margin available."
  },
  {
    "id": "potencia-activa-p",
    "letter": "A",
    "term": "Active power (P)",
    "definition": "Component of electrical power that performs useful work —heat, motion, light—, measured in watts (W). Its balance between generation and demand determines system frequency: excess active generation implies frequency rise; deficit, frequency drop. Unlike reactive power, it can be efficiently transmitted over long distances. 28-A was notable, among other reasons, for what it was not: it was not an active power collapse. At the time of the collapse, active generation comfortably covered peninsular demand. The incident mechanism operated entirely in the reactive dimension; the active imbalance was a consequence of the voltage collapse, not its cause. This inversion of the usual causality —defense systems were designed for active deficits, not reactive excesses— is what made the event so difficult to anticipate and so rapid in its development."
  },
  {
    "id": "tap-lag",
    "letter": "T",
    "term": "Tap-Lag",
    "definition": "Phenomenon by which the mechanical inertia of On-Load Tap Changers (OLTC) introduces a delay of tens of seconds in adjusting the transformation ratio in response to a sudden voltage variation, creating a temporary decoupling between the primary voltage —visible in SCADA— and the actual secondary voltage. On 28-A, OLTCs had progressively raised taps to compensate for previous voltage depressions; when the overvoltage from the meshing arrived, the mechanical delay prevented those same OLTCs from lowering taps in time. The result was an actual overvoltage of ~244 kV in the 220 kV collector networks while REE's SCADA showed 418 kV on the 400 kV primary —within the operating range—, creating an observability blind spot that delayed the operator's situational awareness of the imminent collapse: the ANSI 59 protections of the inverters acted on an overvoltage that was physically real but instrumentally invisible."
  },
  {
    "id": "phase-locked-loop-pll",
    "letter": "P",
    "term": "Phase-Locked Loop (PLL)",
    "definition": "Electronic control algorithm that continuously estimates the frequency and phase angle of the voltage at the inverter's point of connection and synchronizes the equipment's output to that reference, allowing the GFL inverter to inject current in phase with the grid voltage. It is the fundamental synchronization mechanism of all GFL inverters and determines their behavior under voltage disturbances: in grids with SCR < 2, the PLL experiences its own instability with negative damping (ζ_PLL < 0), which can cause the inverter to lose synchronization and trip. On 28-A, the near-simultaneous loss of reference of thousands of PLLs in the face of voltage oscillation was the transmission mechanism between the initial disturbance and the cascade of disconnections: each PLL that failed turned its inverter from a potential stabilizing resource into a disconnected unit, worsening the disturbance that the next PLL would have to manage."
  },
  {
    "id": "scada-supervisory-control-and-data-acquisition",
    "letter": "S",
    "term": "SCADA (Supervisory Control and Data Acquisition)",
    "definition": "Real-time supervision and control system that integrates measurements from distributed sensors in the transmission network —voltages, currents, breaker positions, line and transformer powers— into a unified representation of the system state, allowing the operator to supervise and act on the grid from control centers. The temporal resolution of conventional SCADA —updates every 2–10 seconds— is sufficient for normal operation but inadequate for tracking transients that develop on tenths-of-second scales. On 28-A, REE's SCADA showed voltages on the 400 kV grid within operational limits (418 kV at the Granada node) while Tap-Lag generated actual overvoltages of ~244 kV on the 220 kV secondary that cascaded ANSI 59 functions of the inverters: the cascade was completely invisible to the operator through the only observability system available in real time."
  },
  {
    "id": "wams-wide-area-monitoring-systems",
    "letter": "W",
    "term": "WAMS (Wide Area Monitoring Systems)",
    "definition": "Wide area monitoring system that integrates data from multiple GPS-synchronized Phasor Measurement Units (PMUs) to provide a dynamic picture of the grid state on continental geographic scales, with temporal resolution of 10–50 milliseconds compared to 2–10 seconds for conventional SCADA. This resolution allows observing the evolution of inter-area oscillatory modes, detecting early signs of dynamic instability, and identifying the origin and propagation of disturbances before they reach critical magnitudes. On 28-A, ENTSO-E's WAMS data —along with oscillograph records from protection relays— constituted the main high-temporal-resolution source for forensic reconstruction of the event, allowing the sequence of trips that composed the cascade to be dated with hundredths-of-second precision."
  },
  {
    "id": "pmu-phasor-measurement-unit",
    "letter": "P",
    "term": "PMU (Phasor Measurement Unit)",
    "definition": "Phasor Measurement Unit: device that synchronously measures the amplitude and phase angle of voltages and currents at multiple grid points with a temporal resolution of 20–100 samples per second, using GPS signals to guarantee synchronization between geographically distant units. Simultaneous measurement of the phase angle at different nodes allows real-time calculation of inter-area angular differences, making PMUs the fundamental tool for early detection of dynamic instabilities. On 28-A, the density of PMUs installed in the peninsular grid —insufficient particularly in the 220 kV distribution network where Tap-Lag was decisive— was identified as one of the observability limitations that hindered early detection of the collapse and conditioned the subsequent forensic reconstruction capability."
  },
  {
    "id": "capacidad-neta-de-transferencia-ntc",
    "letter": "N",
    "term": "Net Transfer Capacity (NTC)",
    "definition": "Maximum power exchange capacity between two control areas, agreed ex ante between neighboring TSOs in the day-ahead operational planning process, taking into account operational safety margins and network constraints at border points. NTC is the commercial and operational materialization of the physical interconnection: if the interconnection exists but the NTC is low, the system cannot leverage the strength of the neighboring system in emergency situations. On April 28, the NTC of the Spain-France interconnection was around 3% of the peninsular demand —far below the European target of 15% set in Electricity Regulation 2019/943— meaning that the entire continental synchronous grid could not provide sufficient support to the peninsula in the critical seconds of the collapse, amplifying the quasi-electrical isolation vulnerability that the Iberian system structurally suffers."
  },
  {
    "id": "potencia-de-cortocircuito",
    "letter": "S",
    "term": "Short-Circuit Power",
    "definition": "Complementing entry 58: the short-circuit power (S_sc) at a bus is a direct measure of its electromagnetic robustness. It represents the apparent current that would flow into that bus in the event of a solid three-phase short-circuit, being directly proportional to the density of synchronous generation and compensators in the area. A high S_sc implies that the voltage at that bus is robust and undergoes minimal variations during disturbances and sudden load connections; a low S_sc implies that any injection variation translates into an amplified voltage variation. In the context of inverter analysis, expressing fault currents in p.u. highlights the fundamental asymmetry that April 28 turned into a systemic problem: IBR inverters inject 1.1–1.2 p.u. during faults, while synchronous generators inject 5–7 p.u., regardless of the nominal power of each technology."
  },
  {
    "id": "estrategia-brownfield",
    "letter": "B",
    "term": "Brownfield Strategy",
    "definition": "In energy infrastructure engineering, the repurposing of existing industrial facilities —decommissioned coal-fired power plants, nuclear plants in the process of closure, large out-of-service generation substations— to provide new systemic functions without building new infrastructure from scratch. In the post-April 28 context, the most relevant application consists of preserving the large alternators of these facilities —disconnecting the rotor from the primary turbine— and operating them as pure synchronous condensers, leveraging the existing substation, transformers, and evacuation lines. The advantages are quantifiable: implementation time is reduced from 4–6 years for a conventional installation to 18–24 months, and capital cost can be 40% to 60% lower. Given that the largest deficits of inertia and short-circuit power identified by April 28 are precisely concentrated in the areas where thermal plants were decommissioned, the Brownfield strategy has the additional advantage of providing essential services exactly where the forensic analysis of the collapse showed they are most needed."
  },
  {
    "id": "sistema-por-unidad-p-u",
    "letter": "P",
    "term": "Per Unit System (p.u.)",
    "definition": "Normalization convention used in electrical power engineering that expresses system quantities —voltage, current, power, impedance— as dimensionless ratios relative to reference base values: the voltage base is taken as the nominal value of the network at the analysis bus; the power base, as the nominal apparent power of the equipment or system. Its fundamental advantage is the elimination of scale transformations when analyzing networks with multiple voltage levels interconnected by transformers, making a 1 p.u. impedance in a 400 kV network and a 20 kV network have the same relative physical meaning. In the context of inverter analysis, expressing fault currents in p.u. allows direct comparison of the injection capability of IBR inverters (1.1–1.2 p.u.) with that of synchronous generators (5–7 p.u.) regardless of the nominal power of each technology, highlighting in a single number the fundamental asymmetry that April 28 turned into a systemic problem."
  },
  {
    "id": "gfl-vs-gfm-grid-following-vs-grid-forming",
    "letter": "G",
    "term": "GFL vs GFM (Grid-Following vs Grid-Forming)",
    "definition": "The GFL and GFM modes define opposite electrical models of the inverter. GFL (controlled current source with PLL) is grid-dependent: it needs another source to establish voltage and frequency to operate; if that reference becomes unstable, the PLL fails and the inverter trips. GFM (ideal voltage source behind a virtual reactance) is autonomous: it establishes the voltage and frequency reference instead of following it, can operate in island mode, and provides synthetic inertia and virtual short-circuit power. The transition from GFL to GFM is not just a firmware change but a paradigm shift in system architecture: with GFL dominance, each inverter needs the grid to be healthy to operate; with GFM dominance, each inverter actively contributes to keeping the grid healthy. April 28 was the empirical demonstration that a GFL-dominated system is inherently fragile to voltage disturbances; ENTSO-E's NC RfG 2.0 is the regulatory response to that demonstration."
  },
  {
    "id": "headroom",
    "letter": "H",
    "term": "Headroom",
    "definition": "Fraction of the maximum apparent capacity that a GFM inverter must deliberately keep unused in steady-state active power injection, necessary to ensure the inverter has sufficient margin to act during rapid voltage or frequency disturbances without saturating the power electronics. This reserve represents the physical price of dynamic stability: an inverter operating at 100% of its active capacity cannot inject additional reactive power during a disturbance without violating its current limits. The economic friction is structural —headroom is active power not sold in the market— and justifies the creation of ERS markets to explicitly remunerate it: without that price signal, no operator has an incentive to maintain the reserve that April 28 showed the system needs."
  },
  {
    "id": "hvrt-high-voltage-ride-through",
    "letter": "H",
    "term": "HVRT (High Voltage Ride Through)",
    "definition": "Required capability for IBR inverters to remain connected and absorb inductive reactive power when the grid voltage exceeds the nominal value (≥ 1.10 p.u.), the symmetric complement of LVRT. While LVRT protects the grid during voltage dips, HVRT protects it during overvoltages, requiring the inverter not to disconnect but to absorb excess capacitive reactive power. April 28 demonstrated its critical importance with forensic precision: the photovoltaic inverters that tripped in the window 12:32:57–12:33:18 CEST did so because the overvoltage in their 220 kV collector networks —magnified by the Tap-Lag and invisible in REE's 400 kV SCADA— exceeded their ANSI 59 thresholds, in the absence of a robust HVRT requirement coordinated with the transmission level. The result was a positive feedback loop: each inverter that tripped due to insufficient HVRT further reduced reactive absorption, raised the voltage further, and triggered the ANSI 59 threshold of the next inverter."
  },
  {
    "id": "mrscr-multiple-renewable-short-circuit-ratio",
    "letter": "M",
    "term": "MRSCR (Multiple Renewable Short-Circuit Ratio)",
    "definition": "Extension of the classic SCR that captures electrical interactions between multiple nearby IBR plants: when two inverters are connected to the same electrical area, the operation of one degrades the effective SCR of the other —they share the same local short-circuit power— so that the individual SCR of each plant overestimates the actual available grid strength. It is calculated as MRSCR_i = S_ac,i / (P_i + Σ MIIF_ji · P_j), where MIIF_ji is the interaction factor between plants. The critical value in new grid codes is 1.5; an MRSCR < 1.5 empowers the TSO to block new connections until synchronous condensers are installed in the area. On April 28, the high concentration of IBR plants in southern Spain implies that individual SCRs —apparently acceptable— concealed actual MRSCRs below the critical threshold, a condition that connection studies in the 2020–2025 period did not capture because MRSCR was not part of the regulatory requirements in force."
  },
  {
    "id": "miif-multi-infeed-interaction-factor",
    "letter": "M",
    "term": "MIIF (Multi-Infeed Interaction Factor)",
    "definition": "Dimensionless factor that quantifies the influence of the power injected by an IBR plant j on the effective grid strength at the bus of another IBR plant i, capturing the degree of electrical coupling between them. An MIIF close to 1 indicates strong coupling —the two plants share almost all the same local short-circuit power—; close to 0, substantial electrical independence. It is used in the calculation of MRSCR to quantify the degradation of effective SCR when multiple inverters are concentrated in the same area. NC RfG 2.0 requires developers of new IBR parks to calculate the MIIF with all plants within a 200 km radius before obtaining connection permission, a requirement directly motivated by April 28: post-incident analysis showed that the solar concentration in southern Spain generated MIIFs close to 1 between plants tens of kilometers apart, degrading the effective SCR of the entire area in a way that no individual connection study could capture."
  },
  {
    "id": "ansi-59-proteccion-de-sobretension",
    "letter": "A",
    "term": "ANSI 59 (Overvoltage Protection)",
    "definition": "Standard protection function (IEEE/ANSI 59) that detects when the voltage at the terminals of equipment exceeds a predefined threshold and orders its disconnection, to prevent insulation deterioration and damage to power electronics. In IBR inverters, it is typically calibrated to trip when the voltage on the secondary side of the step-up transformer exceeds ~1.10–1.15 p.u. On April 28, the Tap-Lag created a critical discrepancy between the voltage visible in REE's SCADA (400 kV primary, within limits) and the actual voltage in the 220 kV collector networks (secondary, with overvoltage ≥ 1.10 p.u. due to taps not lowered in time). The ANSI 59 function of thousands of inverters acted on an overvoltage that was physically real but instrumentally invisible to the system operator, initiating the cascade of disconnections that in 30 seconds culminated in the total blackout."
  },
  {
    "id": "ansi-78-proteccion-de-perdida-de-sincronismo",
    "letter": "A",
    "term": "ANSI 78 (Loss of Synchronism Protection)",
    "definition": "Protection function (IEEE/ANSI 78) that detects loss of synchronism between two electrical systems by tracking the apparent impedance phasor in the R-X plane: when the phasor crosses the mho characteristic with the speed and direction typical of pole slipping, the function orders the opening of the circuit breaker to isolate the two systems before angular divergence causes mechanical damage to generators or severe disturbances in the grid. At 12:33:21 CEST on April 28, 2025, the ANSI 78 protections of the two 400 kV trans-Pyrenean links —Hernani and Vic-Baixas— operated upon detecting loss of synchronism between the Iberian Peninsula and the continental European system, confirming that the Iberian system was in irreversible angular divergence. It was the precise moment when a severe incident formally became a blackout."
  },
  {
    "id": "magnetizing-inrush",
    "letter": "M",
    "term": "Magnetizing Inrush",
    "definition": "High-amplitude transient current —between 6 and 10 times the rated current— demanded by the ferromagnetic core of a transformer at the instant of its energization, while the magnetic flux establishes from zero to the steady-state value. It has a strong second harmonic component, a characteristic that differential protection relays use to distinguish it from an actual internal fault. In networks with low short-circuit power, the reference generator may be unable to supply the required reactive power burst without local voltage collapse. On April 28, the phenomenon was documented during restoration operations at the T4 transformer of the Zêzere substation (Portugal), constituting one of the episodes that delayed the progressive recovery of the system and showing that restoration maneuvers in low-inertia, low-SCR networks require a specifically designed protocol to manage energization transients."
  },
  {
    "id": "sympathetic-inrush",
    "letter": "S",
    "term": "Sympathetic Inrush",
    "definition": "Phenomenon that occurs when the energization of a transformer causes, through magnetic interaction via the common bus, the re-excitation of an adjacent transformer already in service: the DC component of the flux of the newly connected transformer induces partial saturation in the core of the neighboring transformer, generating a secondary inrush current in a unit that has not been switched. It shares with magnetizing inrush the dominant second harmonic component, which can activate the differential protection relays of the in-service transformer and cause its inadvertent tripping during restoration maneuvers. The diagnostic distinction between the two phenomena is operationally critical during post-blackout restoration: a differential relay that operates due to sympathetic inrush can be erroneously interpreted as an actual fault, delaying reconnection and complicating a restoration sequence that already operates at the limit of its design assumptions."
  },
  {
    "id": "voll-value-of-lost-load",
    "letter": "V",
    "term": "VoLL (Value of Lost Load)",
    "definition": "Marginal economic cost that consumers are willing to pay to avoid an additional unit of unscheduled supply interruption, expressed in €/MWh; it is not a tariff but an estimate of revealed preferences using contingent valuation methods. For Spain, regulatory studies place it between 8,000 and 12,000 €/MWh for residential and between 15,000 and 50,000 €/MWh for industrial with continuous processes. Applied to April 28 —~25.2 GW of interrupted power for an average of 8 hours, with notable differences by area and sector— the aggregate VoLL justifies the range of 1,000–1,500 M€ of direct economic damage estimated by CEOE and ATA, not counting indirect losses from supply chain interruption, equipment damage, or restoration operation costs. VoLL is, ultimately, the metric that turns the technical debate on ERS markets into an unambiguous economic argument: if preventing the next April 28 has a regulatory cost of X M€/year, and the VoLL of the incident was 1,000–1,500 M€, the cost-benefit logic of preventive expenditure becomes difficult to refute from any perspective."
  }
];
