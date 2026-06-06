const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/ChatFullscreen.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Fondos y contenedor principal
  [/var\(--chat-bg,\s*rgba\(10,15,30,0\.97\)\)/g, 'var(--cfs-bg)'],
  [/var\(--ifm-background-surface-color\)/g, 'var(--cfs-surface-bg)'],
  [/var\(--ifm-background-color\)/g, 'var(--cfs-accent-text)'], // Most cases are for text over primary
  
  // Bordes
  [/var\(--chart-border,\s*rgba\(255,255,255,0\.08\)\)/g, 'var(--cfs-border-soft)'],
  [/var\(--chart-border,\s*rgba\(255,255,255,0\.12\)\)/g, 'var(--cfs-border)'],
  [/var\(--chart-border,\s*rgba\(255,255,255,0\.06\)\)/g, 'var(--cfs-border-soft)'],
  [/var\(--chat-border\)/g, 'var(--cfs-border)'],

  // Textos
  [/var\(--chart-text-1,\s*#e2e8f0\)/g, 'var(--cfs-text-1)'],
  [/var\(--chart-text-1\)/g, 'var(--cfs-text-1)'],
  [/var\(--chart-text-2,\s*#94a3b8\)/g, 'var(--cfs-text-2)'],
  [/var\(--chart-text-2\)/g, 'var(--cfs-text-2)'],
  [/var\(--chart-text-3,\s*#64748b\)/g, 'var(--cfs-text-3)'],
  [/var\(--chart-text-3\)/g, 'var(--cfs-text-3)'],

  // Acentos y estados
  [/var\(--ifm-color-primary,\s*#64748b\)/g, 'var(--cfs-text-3)'], // For unselected pills
  [/var\(--ifm-color-primary\)/g, 'var(--cfs-accent)'],
  [/var\(--chart-amber,\s*hsl\(38 100% 56%\)\)/g, 'var(--cfs-amber)'],
  
  // Chat específico
  [/var\(--chat-input-bg\)/g, 'var(--cfs-surface-bg)'],
  [/var\(--chat-input-text\)/g, 'var(--cfs-text-1)'],
  [/var\(--chat-user-msg-bg\)/g, 'var(--cfs-user-msg-bg)'],
  [/var\(--chat-assistant-msg-bg\)/g, 'var(--cfs-bot-msg-bg)'],
  [/var\(--chat-user-msg-text\)/g, 'var(--cfs-user-msg-text)'],
  [/var\(--chat-assistant-msg-text\)/g, 'var(--cfs-bot-msg-text)'],
  [/var\(--chat-btn-bg\)/g, 'var(--cfs-accent)'],
  [/var\(--chat-btn-bg-disabled\)/g, 'var(--cfs-border)'],
  [/var\(--chat-btn-text\)/g, 'var(--cfs-accent-text)'],

  // Hardcoded fallback colors (e.g., #94a3b8, #64748b inside Loading)
  [/color:\s*'#94a3b8'/g, "color: 'var(--cfs-text-3)'"],
  [/color:\s*'#64748b'/g, "color: 'var(--cfs-text-3)'"],
];

for (const [regex, replacement] of replacements) {
  content = content.replace(regex, replacement);
}

// Special case fix for line 1172 where ifm-background-color was used for the overlay
content = content.replace(
  /backgroundColor:\s*'var\(--cfs-accent-text\)',\n\s*display:\s*'flex',\s*flexDirection:\s*'column',/g,
  "backgroundColor: 'var(--cfs-bg)',\n      display: 'flex', flexDirection: 'column',"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Reemplazos completados.');
