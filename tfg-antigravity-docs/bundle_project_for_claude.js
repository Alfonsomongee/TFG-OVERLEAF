const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = 'C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF';
const DOCUSAURUS_DIR = path.join(WORKSPACE_DIR, 'tfg-antigravity-docs');
const OUTPUT_FILE = path.join(WORKSPACE_DIR, 'tfg_complete_project_context.md');

// Files and folders to scan
const SCAN_CONFIGS = [
  path.join(DOCUSAURUS_DIR, 'docusaurus.config.js'),
  path.join(DOCUSAURUS_DIR, 'sidebars.js'),
  path.join(DOCUSAURUS_DIR, 'package.json'),
];

const SCAN_DIRS = [
  { dir: path.join(DOCUSAURUS_DIR, 'src'), label: 'React Codebase & Styles' },
  { dir: path.join(DOCUSAURUS_DIR, 'docs'), label: 'Chapters & Content (MDX)' }
];

const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.css', '.mdx', '.md', '.json'];
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.docusaurus',
  'build',
  '.next',
  '.git',
  'package-lock.json',
  'items.json',
  'to_translate.json',
  'temp.js',
  'raw_terms_defs.txt',
];

function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => filePath.includes(pattern));
}

function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (shouldExclude(filePath)) continue;

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else {
      const ext = path.extname(filePath).toLowerCase();
      if (ALLOWED_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

function generateBundle() {
  console.log('Generating full project context for Claude...');
  let content = '';

  content += `# TFG INTERACTIVO - ARCHIVO DE CONTEXTO COMPLETO PARA CLAUDE\n\n`;
  content += `> Este archivo consolida la estructura, contenido y componentes de diseño interactivo del Trabajo Fin de Grado (TFG) sobre el Apagón Ibérico del 28 de Abril de 2025.\n`;
  content += `> Proporciona a Claude este archivo para recibir una auditoría completa de forma, contenido, transiciones, estilos y experiencia de usuario (UX).\n\n`;

  content += `## 📋 ESTRUCTURA GENERAL DEL PROYECTO\n\n`;
  content += `El proyecto es un sitio de documentación interactivo construido con **Docusaurus**, **React**, **Framer Motion**, y **Recharts**, diseñado con una estética forense/cibernética premium (Dark Mode, acentos cian y ámbar, microanimaciones de terminal).\n\n`;

  // 1. Configs
  content += `## ⚙️ ARCHIVOS DE CONFIGURACIÓN Y ARQUITECTURA\n\n`;
  for (const configPath of SCAN_CONFIGS) {
    if (fs.existsSync(configPath)) {
      const relPath = path.relative(DOCUSAURUS_DIR, configPath);
      const fileContent = fs.readFileSync(configPath, 'utf8');
      content += `### 📄 Archivo: \`${relPath}\`\n`;
      content += `\`\`\`${path.extname(configPath).substring(1)}\n${fileContent}\n\`\`\`\n\n`;
    }
  }

  // 2. Scan directories
  for (const scanDir of SCAN_DIRS) {
    if (!fs.existsSync(scanDir.dir)) continue;
    content += `## 📂 COMPONENTE: ${scanDir.label.toUpperCase()}\n\n`;
    const files = getFilesRecursively(scanDir.dir);

    for (const filePath of files) {
      const relPath = path.relative(DOCUSAURUS_DIR, filePath);
      const ext = path.extname(filePath).substring(1);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Let's cap file content in case there are massive JSON or JS data files
      if (fileContent.length > 50000) {
        content += `### 📄 Archivo: \`${relPath}\` (Truncado por tamaño)\n`;
        content += `\`\`\`${ext}\n${fileContent.substring(0, 50000)}\n... [CONTENIDO TRUNCADO POR TAMAÑO] ...\n\`\`\`\n\n`;
      } else {
        content += `### 📄 Archivo: \`${relPath}\`\n`;
        content += `\`\`\`${ext}\n${fileContent}\n\`\`\`\n\n`;
      }
    }
  }

  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  console.log(`Successfully generated context bundle at: ${OUTPUT_FILE}`);
  console.log(`Total file size: ${(fs.statSync(OUTPUT_FILE).size / (1024 * 1024)).toFixed(2)} MB`);
}

generateBundle();
