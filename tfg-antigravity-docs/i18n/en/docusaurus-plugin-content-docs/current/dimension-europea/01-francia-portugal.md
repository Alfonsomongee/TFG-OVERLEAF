---
sidebar_position: 1
---

import GlossaryLink from '@site/src/components/GlossaryLink';

# El impacto en Francia y Portugal

The 28 April Iberian voltage collapse did not stop at the Pyrenees or the Guadiana. The violence of the electrodynamic transient radiated a shockwave through the interconnections, subjecting the French network to extreme operational stress and dragging the Portuguese system into a total blackout from which it could only emerge through seventeen hours of ground-up restoration. These two episodes — one contained, one catastrophic — precisely illustrate the conditions that determine whether a system can reject a perturbation of this magnitude or succumb to it.

## France (RTE): the system that held at the limit

### The Golfech 1 trip and negative sequence currents

The propagation mechanism towards France was dominated by a sudden, massive excess of capacitive <GlossaryLink term="Potencia reactiva">reactive power</GlossaryLink>. Seconds before separation, the <GlossaryLink term="HVDC">HVDC</GlossaryLink> Baixas–Santa Llogaia link was absorbing *870 MVAr*, acting as a dynamic reactive power sink at the border. The instantaneous loss of this sink, combined with the opening of 400 kV lines that remained energised no-load from the French side — generating reactive power through the capacitive <GlossaryLink term="Efecto Ferranti">Ferranti Effect</GlossaryLink> — induced a severe transient overvoltage profile that propagated rapidly across the entire southwest of France.

Facing this voltage escalation, RTE's secondary voltage control forced the large synchronous alternators in the region to operate deep into their underexcitation capability curves. The most critical case was **Golfech Nuclear Unit 1**, a **1,290 MW** generating block. To contain the voltage profile, its Automatic Voltage Regulators (AVR) drastically reduced rotor excitation current, driving the machine to absorb *426 MVAr* at 12:33 CEST.

This extreme operating condition severely compromises machine stability. As the air-gap magnetic flux decreases, the synchronising torque maintaining the rotor coupled to the network frequency weakens. Simultaneously, the asymmetric character of the border opening transients generated significant negative sequence currents in the 400 kV network. Symmetrical components theory establishes that negative sequence currents produce a magnetic field rotating in the opposite direction to the rotor at synchronous speed, inducing double-frequency (100 Hz) eddy currents in the solid rotor body and retaining rings, causing adiabatic heating within seconds.

At **12:33:35.759 CEST** — just **fifteen seconds** after the Iberian collapse — the combination of underexcitation instability and phase imbalance heating irremediably activated the generator's internal protection relays (loss-of-excitation relay ANSI 40 and negative sequence / current imbalance relay ANSI 46), forcing the trip and total disconnection of Golfech

1. The simultaneous loss of the HVDC link and this nuclear pillar obliged RTE to reconfigure its load flows from more northerly regions to avoid a cascading collapse of its own. The reactor was successfully resynchronised to the network on 29 April.

### Subtransmission network trip: the Dax–Arriosses 63 kV line

The impact was not limited to conventional generation. The most revealing record of the violence of the electrodynamic transient in France was the trip of the **63 kV overhead line Dax–Arriosses** at **12:33:20.551 CEST**, ordered by its loss-of-synchronism protections (ANSI 78 relay), configured to act on the first beat of the oscillation.

The actuation of a loss-of-synchronism protection at the 63 kV level is extraordinarily anomalous: power swinging is normally detected on 400 kV corridors. Its appearance at 63 kV indicates that the <GlossaryLink term="Phase-Locked Loop (PLL)">PLLs</GlossaryLink> of a massive inverter aggregation in Aquitaine lost their angular reference relative to the main network due to the asymmetric transient and overvoltage. The relay interpreted the cyclical current reversal of the uncontrolled inverters as a classic rotating machine loss of synchronism, isolating the sub-network.

| Critical element in France | Time (CEST) | Technical cause | Systemic impact |
| --- | --- | --- | --- |
| HVDC Baixas–Santa Llogaia | 12:33:20 | Loss of Iberian receiving network | Sudden loss of 870 MVAr sink |
| 63 kV line Dax–Arriosses | 12:33:20.551 | Loss-of-synchronism relay (1st beat) | Sub-network isolation and local IBR disconnection |
| Nuclear Unit Golfech 1 (1,290 MW) | 12:33:35.759 | Underexcitation limit / ANSI 40 and 46 relays | Loss of 426 MVAr absorption; structural thermal stress |

### RTE as «infinite bus» during Top-Down restoration

At **12:40 CEST**, the voltage profile in southwest France stabilised. From that moment, the RTE network assumed an irreplaceable structural role: providing a firm electromagnetic anchor for the Spanish system's restoration via a Top-Down strategy.

In power systems theory, an **«infinite bus»** is an idealised voltage source with infinite inertia and zero Thévenin equivalent impedance. In practice, with France solidly connected to the immense inertial mass of Continental Europe, its 400 kV network behaved operationally as an infinite bus for the collapsed Iberian network.

At **12:39 CEST**, REE formally requested RTE to restore voltage at Hernani substation from the French Argia substation. At **12:41 CEST**, RTE agreed to channel up to **400 MW initially** to stabilise the first reconnections in northern Spain. By closing the border circuit breaker, France imposed its nominal frequency (50.00 Hz) and rigid voltage control on the first Spanish node. This imported short-circuit power absorbed the brutal reactive imbalances and active load steps inevitably produced when energising no-load 400 kV lines. Without the inertial anchor of this French infinite bus, REE's restoration attempts would have been subject to unbearable oscillations that would have retripped their protections. Throughout the afternoon, this stabilising French flow increased to **1,400 MW**, constituting the backbone of Spanish system normalisation.

## Portugal (REN): the dragged collapse and Bottom-Up restoration

### Why Portugal could not isolate

While France had a rigid network capable of rejecting the perturbation by cutting its links, REN operated with such dense electrical and geographical coupling with Spain that configuring an isolated island operation in time was physically impossible. Portugal succumbed to a dragged collapse dominated by reactive-voltage (Q-V) coupling: trips in southern Spain withdrew critical reactive absorption nodes, the overvoltage propagated without resistance to Portuguese substations, and the frequency decline activated the combined <GlossaryLink term="UFLS (Underfrequency Load Shedding)">UFLS</GlossaryLink> schemes of REE and REN. Despite massive load shedding, the <GlossaryLink term="RoCoF (Rate of Change of Frequency)">RoCoF</GlossaryLink> was so extreme that circuit breaker mechanical delays (50–100 ms) made it impossible to balance the system before minimum-frequency protections tripped the last thermal turbines.

| Frequency threshold (Hz) | Load shed — Portugal (MW) | Load shed — Spain (MW) | Total (MW) |
| :-: | :-: | :-: | :-: |
| 49.0 | 381 | 1,669 | 2,050 |
| 48.8 | 450 | 1,575 | 2,025 |
| 48.6 | 438 | 1,524 | 1,962 |
| 48.4 | 218 | 1,294 | 1,512 |
| 48.2 | 470 | 2,168 | 2,638 |
| 48.0 | 359 | 588 | 947 |

_Combined REE and REN UFLS actuation by frequency threshold. Source: REN and REE PMU records._

### Restoration: a chronicle of failures and solutions

With no external links available, REN executed a pure <GlossaryLink term="Black Start">Bottom-Up</GlossaryLink> restoration based entirely on its own autonomous start-up resources. The sequence exposes the severe limitations that the laws of electromagnetism impose on this process.

**12:35–12:45 CEST — First island at Zêzere.** REN ordered the autonomous black start of HPP 1-Centro. By 12:45, the plant was operating in isochronous mode, successfully energising the 220 kV busbar at Zêzere substation.

**12:49 CEST — Collapse from sympathetic inrush.** The restoration protocol required energising Transformer 4 at Zêzere (170 MVA, 220/60 kV). On closing the 220 kV circuit breaker, HPP 1-Centro tripped instantly. The cause was the **sympathetic inrush current phenomenon**: a 170 MVA transformer, when energised from a weak network — a single hydroelectric unit with low short-circuit power and high subtransient impedance — demands a magnetising current that can exceed nominal current by an order of magnitude, characterised by high second-harmonic content and extremely low power factor. The isolated generator could not supply this reactive power surge; the transient voltage collapse activated the protection relays. Subsequent attempts to start auxiliary generators within the plant failed repeatedly over the next three hours.

**12:43–16:38 CEST — Combined-cycle control system failures.** At 12:43, REN dispatched the black start order for CCGT 1-Norte. Despite the gas turbine responding mechanically, the plant was unable to close the generator circuit breaker for hours: the substation's DC battery banks had discharged during the prolonged blackout, leaving the high-voltage circuit breaker closing coils without power. The blockage was resolved at **16:38 CEST**.

**15:40–15:55 CEST — Second attempt and renewed collapse.** After reconfiguration work, HPP 1-Centro restarted at 15:40 and energised the Zêzere 220 kV busbar. At 15:51, a local demand block of *5 MW* was connected, but the island's inertial fragility was such that load fluctuations triggered another trip at 15:55.

### The decisive manoeuvre: Torrão as a pure synchronous condenser

It was evident that the island lacked the necessary stiffness (short-circuit power) to absorb load steps. After restarting HPP 1-Centro at **16:13 CEST**, REN executed at **17:23 CEST** a technically sophisticated manoeuvre: it started **HPP Torrão Unit 2**, not to inject active power, but in **pure <GlossaryLink term="Compensadores Síncronos (SynCons)">synchronous condenser</GlossaryLink> mode**.

Operating a hydroelectric plant as a synchronous condenser involves emptying the turbine chamber by injecting pressurised air (runner dewatering), allowing the runner to spin freely in air while coupled to the network. The generator consumes a marginal amount of active power to overcome mechanical bearing friction, but through excitation control instantaneously injects or absorbs massive quantities of <GlossaryLink term="Potencia reactiva">reactive power</GlossaryLink>. Critically, Torrão's enormous rotating mass contributed pure kinetic <GlossaryLink term="Inercia (H)">inertia</GlossaryLink> and multiplied the short-circuit power of the Zêzere island.

This manoeuvre acted as an electrodynamic damper. Island voltage stabilised, enabling from **16:26 CEST** progressive load restoration on the 60 kV and 150 kV networks and voltage extension to HPP 2 and HPP 3 Centro. At **16:38 CEST**, the second secure restoration zone was established from CCGT 1-Norte.

### 0 MW synchronisation and full normalisation

By 20:00 CEST, the two Portuguese islands had been internally meshed but were still operating asynchronously relative to Spain and the rest of Europe. The most delicate step was coupling with the REE network, already synchronised with the French infinite bus.

At **20:25 CEST**, the interconnection was closed under one non-negotiable technical requirement: a **0 MW exchange programme**. The underlying physics is governed by the inter-area active power transfer equation:

$$P = \frac{V1 V2}{X} \sin\delta$$

To close the interconnection breaker without generating a destructive synchronising power surge, the phase angle difference ($\delta$) between the Portuguese and Spanish nodes had to be exactly zero, with equal voltage magnitudes. By setting a 0 MW setpoint in the Automatic Generation Control (AGC) systems, operators ensured neither network would attempt to export inertia to the other at the coupling instant. An error would have forced a violent power flow, tripping the directional protections and plunging Portugal into a second blackout.

With the manoeuvre successful, Portugal recovered its continental synchronous reference. The robustness provided by the interconnection allowed acceleration of remaining demand restoration, achieving full normalisation at **00:22 on 29 April** — **seventeen hours** after the voltage zero.
