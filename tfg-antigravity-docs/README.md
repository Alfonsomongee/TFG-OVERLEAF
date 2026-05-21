# 🔌 Análisis del Apagón Ibérico de 28 Abril de 2025

**Interactive Documentation Site** | **Sitio de Documentación Interactivo**

> An academic research thesis on the Iberian blackout incident analyzed from multiple institutional perspectives: technical, regulatory, and operational.

---

## 📚 Overview

This project migrates a comprehensive LaTeX-based thesis (5,547 lines) into a modern, bilingual (ES/EN), interactive documentation site built with **Docusaurus 2.4** and deployed on **Vercel**.

### Key Features

- 🌐 **Bilingual**: Full Spanish/English support with language switcher
- 📖 **Interactive**: Technical glossary with smart linking and navigation
- 📊 **79 Figures**: All technical diagrams and charts included
- 🔍 **Full-Text Search**: Built-in documentation search
- ⚡ **Responsive**: Mobile-friendly design
- 🚀 **Optimized**: Deployed on Vercel with CI/CD

### Live Site

🔗 **https://tfg-overleaf.vercel.app** (ES by default, switch to EN in navbar)

---

## 📁 Project Structure

```
tfg-antigravity-docs/
├── docs/                              # Spanish content (ES default locale)
│   ├── intro.mdx
│   ├── 01-introduccion.mdx through 09-conclusiones.mdx
│   ├── glosario.mdx                  # Technical glossary
│   ├── referencias.mdx               # Bibliography
│   └── dimension-europea/
│       └── 01-francia-portugal.mdx
│
├── i18n/en/docusaurus-plugin-content-docs/current/
│   └── [Same structure as docs/ with English translations]
│
├── static/figuras/                    # 79 technical figures (PNGs)
│
├── src/
│   ├── components/
│   │   ├── BiblioCard.jsx            # Bibliography renderer
│   │   ├── GlossaryLink.jsx          # Smart glossary linker
│   │   └── *.module.css              # Component styles
│   ├── data/
│   │   ├── bibliography.js           # 19 bibliographic entries
│   │   └── glossary.js               # 40+ technical terms
│   └── css/
│       └── custom.css                # ETSI branding
│
├── docusaurus.config.js              # Main configuration (i18n, plugins)
├── sidebars.js                       # Navigation structure
├── package.json                      # Dependencies & scripts
├── vercel.json                       # Vercel deployment config
└── .vercelignore                     # Deployment exclusions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16.14
- npm or yarn

### Local Development

1. **Install dependencies:**
   ```bash
   npm ci
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   Site runs at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Serve production build locally:**
   ```bash
   npm run serve
   ```

### Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start local dev server |
| `npm run build` | Production build |
| `npm run serve` | Serve production build |
| `npm run clear` | Clear build cache |
| `npm run deploy` | Deploy via docusaurus CLI |

---

## 🌍 Bilingual Structure

### Adding/Modifying Content

1. **Edit Spanish (docs/)**: Changes here affect the default locale
2. **Edit English (i18n/en/)**: Parallel structure for English translations

Both must be kept in sync. The language switcher in the navbar allows users to toggle between ES/EN.

### Content Frontmatter

All `.mdx` files must have:

```yaml
---
sidebar_position: N      # Order in sidebar (1, 2, 3...)
---
```

### Technical Components

#### GlossaryLink

Links terms to technical glossary with smart navigation:

```jsx
<GlossaryLink term="IBR">Inverter-Based Resources</GlossaryLink>
```

Renders as a linked term with tooltip support. Term must exist in `src/data/glossary.js`.

#### BiblioCard

Renders all bibliography entries:

```jsx
<BiblioCard />
```

Pulls from `src/data/bibliography.js`.

---

## 🛠️ Technical Stack

### Core

- **Docusaurus 2.4.3**: Modern documentation framework
- **React 17**: Component framework
- **MDX**: Markdown + JSX support

### Math & Rendering

- **remark-math**: LaTeX math parsing
- **rehype-katex**: KaTeX math rendering (equations via `$$...$$`)

### Styling

- **Custom CSS**: ETSI institutional branding
- **Prism React Renderer**: Code syntax highlighting

### Deployment

- **Vercel**: Serverless hosting with auto-deploy
- **GitHub**: Source control and CI/CD integration

---

## 📊 Content Outline

### Main Chapters (9 + 2)

| Chapter | Status | Content |
|---------|--------|---------|
| Introducción | ✅ Complete | Scope, objectives, three institutional narratives |
| Contexto | ✅ Complete | System background (PNIEC, energy transition, regulatory framework) |
| Análisis del Incidente | ✅ Complete | Technical incident timeline, oscillography, cascade failures |
| Reacción y Reposición | ✅ Complete | Emergency response, restoration strategies, cross-border support |
| Análisis de Informes | ✅ Complete | Comparative analysis of 4 technical reports (REE, ENTSO-E, ICAI, CSN) |
| Impacto Comunicativo | ✅ Complete | Media coverage, social media response, misinformation dynamics |
| Resiliencia y Futuro | ✅ Complete | Grid modernization needs, solutions (synchronous condensers, GFM inverters) |
| Uso de IA | ✅ Complete | Methodological reflections on AI use in thesis research |
| Conclusiones | ✅ Complete | Synthesis of three narratives, key lessons, recommendations |
| Dimensión Europea | ✅ Complete | France-Portugal coordination, European context |

### Reference Materials

| Section | Status |
|---------|--------|
| Glosario Técnico | ✅ Complete (40+ terms) |
| Referencias Bibliográficas | ✅ Complete (19 sources) |

---

## 🔗 Deployment

### Vercel Configuration

The site is configured for auto-deployment via Vercel:

- **Repository**: https://github.com/Alfonsomongee/TFG-OVERLEAF
- **Branch**: `main`
- **Build Command**: `npm ci && npm run build`
- **Output Directory**: `build/`
- **Install Command**: `npm ci`

#### How It Works

1. Push to GitHub `main` branch
2. Vercel automatically triggers build
3. Production site updates at https://tfg-overleaf.vercel.app
4. PR previews auto-generated for feature branches

### Manual Deployment

If needed, deploy manually:

```bash
npm run build
npm run deploy
```

Or using Vercel CLI:

```bash
vercel --prod
```

---

## ✨ Features & Customization

### Math Equations

Inline: `$E = mc^2$`

Block:
```markdown
$$
\frac{dV}{dt} = \frac{P_m - P_e}{2H \cdot \omega_0}
$$
```

Rendered via KaTeX.

### Glossary Terms

Terms are defined in `src/data/glossary.js`. Use `<GlossaryLink>` to create clickable definitions with smooth scrolling.

### Bibliography

Entries in `src/data/bibliography.js` are rendered via the `<BiblioCard>` component. IDs should follow citation format: `[1]`, `[2]`, etc.

---

## 🧪 Quality Checks

### Pre-Deployment Verification

```bash
# Check for broken links
npm run build

# Verify production build locally
npm run serve

# Test responsive design (check mobile viewport in browser DevTools)
```

### Known Limitations

- **TikZ Diagrams**: Complex diagrams exported as PNG (not interactive)
- **Search**: Built-in Algolia search (requires configuration for production)
- **Math Rendering**: Very complex LaTeX may not render perfectly via KaTeX

---

## 📝 Contributing

### Content Updates

1. Edit files in `docs/` (Spanish) or `i18n/en/...` (English)
2. Commit with descriptive message
3. Push to `main` → Vercel auto-deploys

### Adding New Pages

1. Create `docs/xx-title.mdx` with proper frontmatter
2. Add entry to `sidebars.js`
3. Create English version in `i18n/en/...`
4. Test locally with `npm start`

### Glossary & Bibliography Updates

1. Edit `src/data/glossary.js` or `src/data/bibliography.js`
2. Use `<GlossaryLink>` or `<BiblioCard>` in content
3. Test links locally

---

## 🤝 Credits

- **Author**: Alfonso Monge (afonso monge at gmail.com)
- **University**: Universidad de Sevilla, E.T.S.I.
- **Framework**: Docusaurus by Meta
- **Deployment**: Vercel
- **Built with**: React, MDX, Docusaurus

---

## 📄 License

This thesis and all content are subject to institutional policies. For reproduction or reuse, contact the author.

---

## ❓ FAQ

**Q: How do I change the default language?**
A: Edit `docusaurus.config.js`, line 33: change `defaultLocale: 'es'` to `'en'`

**Q: Can I modify the sidebar structure?**
A: Yes, edit `sidebars.js` to reorder chapters or change labels.

**Q: How do I add new figures?**
A: Place PNG files in `static/figuras/`, then reference via `![alt](/figuras/filename.png)`

**Q: Is the search working?**
A: Local search is built-in. For production, configure Algolia in `docusaurus.config.js`

---

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/Alfonsomongee/TFG-OVERLEAF/issues
- Email: aphmonge@gmail.com

---

**Last Updated**: May 2026  
**Status**: Production Ready ✅
