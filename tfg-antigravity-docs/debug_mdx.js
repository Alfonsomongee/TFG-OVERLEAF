// Test what happens with inline math stripping
const line129 = "donde $S_{ac,i}$ es la capacidad de cortocircuito en corriente alterna del";
const line147 = "$S_{ac}$ hasta el umbral.";

console.log("Line 129 original:", line129);
console.log("Line 129 stripped:", line129.replace(/\$[^$\n]+\$/g, "INLINEMATH"));

console.log("Line 147 original:", line147);
console.log("Line 147 stripped:", line147.replace(/\$[^$\n]+\$/g, "INLINEMATH"));

// Test if the regex actually matches
const m129 = line129.match(/\$[^$\n]+\$/);
const m147 = line147.match(/\$[^$\n]+\$/);
console.log("Match 129:", m129);
console.log("Match 147:", m147);
