const fs = require('fs');
let code = fs.readFileSync('src/css/custom.css', 'utf8');

code = code.replace(/html\[data-theme='light'\]\s*\{[\s\S]*?\}/, 
`html[data-theme='light'] {
  --ifm-color-primary:          hsl(190 100% 28%);
  --ifm-color-primary-dark:     hsl(190 100% 24%);
  --ifm-color-primary-darker:   hsl(190 100% 20%);
  --ifm-color-primary-darkest:  hsl(190 100% 16%);
  --ifm-color-primary-light:    hsl(190 100% 35%);
  --ifm-color-primary-lighter:  hsl(190 100% 42%);
  --ifm-color-primary-lightest: hsl(190 100% 52%);
  --ifm-background-color:       hsl(220 20% 97%);
  --ifm-background-surface-color: hsl(220 15% 93%);
  --ifm-font-color-base:        hsl(220 30% 15%);
}`);

code = code.replace(/:root\s*\{/, 
`:root {
  --chart-grid-stroke: color-mix(in srgb, white 8%, transparent);
  --chart-axis-color:  var(--text-2);
  --chart-tooltip-bg:  var(--bg-1);
  --chart-tooltip-border: var(--border-data);
`);

code += `\n
.markdown > p,
article > p,
.theme-doc-markdown p {
  max-width: 72ch;
}

.markdown > table,
.markdown > figure,
.markdown .chart-card,
.markdown [class*="ForensicTable"] {
  max-width: 100%;
}

.theme-doc-markdown h1,
article[class*="docPage"] h1 {
  font-size: var(--fs-h2);
  margin-bottom: 0.4em;
  letter-spacing: var(--tr-tight, -0.03em);
}
`;

fs.writeFileSync('src/css/custom.css', code);
console.log('custom.css patched.');
