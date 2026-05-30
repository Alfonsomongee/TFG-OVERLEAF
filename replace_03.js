const fs = require('fs');
const path = 'c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/i18n/en/docusaurus-plugin-content-docs/current/03-analisis-incidente.mdx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add imports
content = content.replace(
  "import BrowserOnly from '@docusaurus/BrowserOnly';",
  "import BrowserOnly from '@docusaurus/BrowserOnly';\nimport InteractiveCTA from \"@site/src/components/InteractiveCTA\";\nimport IberianGridTopologyBase from \"@site/src/components/IberianGridTopologyBase\";\nimport SynchrophasorPlot from \"@site/src/components/SynchrophasorPlot\";\nimport PhasePlanePlot from \"@site/src/components/PhasePlanePlot\";"
);

// 2. Insert CTA 1
content = content.replace(
  "estimated at that moment at barely **3.3 GVAr** against the usual 5.8 GVAr.\n\n  IIT-ICAI's expert",
  "estimated at that moment at barely **3.3 GVAr** against the usual 5.8 GVAr.\n\n> <InteractiveCTA \n    title=\"INTERACTIVE LABORATORY: TOPOLOGICAL MAP AND FERRANTI EFFECT\" \n    description=\"Activate the Ferranti Effect simulator to see how the voltage rises above 1.12 p.u. in Andalusia while Madrid remains stable.\"\n    icon=\"🗺️\"\n  >\n    <IberianGridTopologyBase />\n  </InteractiveCTA>\n\n  IIT-ICAI's expert"
);

// 3. Insert CTA 2
content = content.replace(
  "the physical trigger of the chain reaction.\n\n  ## Phase 2",
  "the physical trigger of the chain reaction.\n\n> <InteractiveCTA \n    title=\"ADVANCED TELEMETRY: ANGULAR DIVERGENCE\" \n    description=\"Observe the angular divergence at the PMU nodes in Granada, Badajoz, and Vic second by second. Classic SCADA did not see this; you can.\"\n    icon=\"📈\"\n  >\n    <SynchrophasorPlot />\n  </InteractiveCTA>\n\n  ## Phase 2"
);

// 4. Insert CTA 3
content = content.replace(
  "primarily by voltage instability.\n\n  <span id=\"t2\">",
  "primarily by voltage instability.\n\n> <InteractiveCTA \n    title=\"PHASE PORTRAIT: THE UFLS PARADOX\" \n    description=\"Trace the trajectory of the system's dynamic state in the phase space during the cascade: observe how the basin of attraction collapses at the instant of massive load shedding.\"\n    icon=\"🌀\"\n  >\n    <PhasePlanePlot />\n  </InteractiveCTA>\n\n  <span id=\"t2\">"
);

fs.writeFileSync(path, content, 'utf8');
console.log("03 replaced!");