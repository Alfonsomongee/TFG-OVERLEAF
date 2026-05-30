const fs = require('fs');
const path = 'c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/i18n/en/docusaurus-plugin-content-docs/current/03-analisis-incidente.mdx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /estimated at that moment at barely \*\*3\.3 GVAr\*\* against the usual 5\.8 GVAr\./,
  \estimated at that moment at barely **3.3 GVAr** against the usual 5.8 GVAr.

> <InteractiveCTA 
    title="INTERACTIVE LABORATORY: TOPOLOGICAL MAP AND FERRANTI EFFECT" 
    description="Activate the Ferranti Effect simulator to see how the voltage rises above 1.12 p.u. in Andalusia while Madrid remains stable."
    icon="🗺️"
  >
    <IberianGridTopologyBase />
  </InteractiveCTA>\
);

content = content.replace(
  /the physical trigger of the chain reaction\./,
  \	he physical trigger of the chain reaction.

> <InteractiveCTA 
    title="ADVANCED TELEMETRY: ANGULAR DIVERGENCE" 
    description="Observe the angular divergence at the PMU nodes in Granada, Badajoz, and Vic second by second. Classic SCADA did not see this; you can."
    icon="📈"
  >
    <SynchrophasorPlot />
  </InteractiveCTA>\
);

content = content.replace(
  /primarily by voltage instability\./,
  \primarily by voltage instability.

> <InteractiveCTA 
    title="PHASE PORTRAIT: THE UFLS PARADOX" 
    description="Trace the trajectory of the system's dynamic state in the phase space during the cascade: observe how the basin of attraction collapses at the instant of massive load shedding."
    icon="🌀"
  >
    <PhasePlanePlot />
  </InteractiveCTA>\
);

fs.writeFileSync(path, content, 'utf8');
console.log("03 replaced v2!");