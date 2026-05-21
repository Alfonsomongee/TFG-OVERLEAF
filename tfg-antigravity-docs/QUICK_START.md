# ⚡ Quick Start Guide

**Get up and running in 5 minutes**

---

## 1️⃣ Install & Start

```bash
# Install dependencies
npm ci

# Start dev server
npm start
```

✅ Site runs at `http://localhost:3000`

---

## 2️⃣ Edit Content

### Add/Edit a Chapter (Spanish)

1. Create/edit file: `docs/XX-titulo.mdx`
2. Add frontmatter:
   ```yaml
   ---
   sidebar_position: 3
   ---
   ```
3. Write content (Markdown + MDX)
4. Save → Hot reload on `http://localhost:3000`

### Add/Edit a Chapter (English)

1. Same file in: `i18n/en/docusaurus-plugin-content-docs/current/XX-titulo.mdx`
2. Keep structure identical to Spanish version

### Update Navigation

Edit `sidebars.js` to reorder or add entries:

```javascript
items: [
  '01-introduccion',
  '02-contexto',
  // ... etc
]
```

---

## 3️⃣ Use Components

### Link to Glossary

```jsx
<GlossaryLink term="IBR">Inverter-Based Resources</GlossaryLink>
```

Term must exist in `src/data/glossary.js`

### Show Bibliography

```jsx
<BiblioCard />
```

Renders all entries from `src/data/bibliography.js`

### Add Equations

**Inline**: `$E = mc^2$`

**Block**:
```markdown
$$
\frac{dV}{dt} = \text{some equation}
$$
```

Rendered via KaTeX automatically.

---

## 4️⃣ Add Figures

1. Place PNG in: `static/figuras/filename.png`
2. Reference in content:
   ```markdown
   ![Description](/figuras/filename.png)
   ```

---

## 5️⃣ Build & Deploy

### Build for Production
```bash
npm run build
```

### Serve Locally (Production Mode)
```bash
npm run serve
```

### Deploy to Vercel
```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys!
```

---

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `docs/` | Spanish content |
| `i18n/en/...` | English content |
| `sidebars.js` | Navigation structure |
| `docusaurus.config.js` | Site config |
| `src/components/` | React components |
| `src/data/` | Glossary & bibliography |
| `static/figuras/` | Figures (79 images) |

---

## 🚨 Common Issues

### Content Not Showing?
- Check `sidebars.js` includes the file
- Ensure frontmatter has `sidebar_position`
- Try: `npm run clear && npm start`

### English Content Not Syncing?
- Keep filenames identical between `docs/` and `i18n/en/...`
- Check both exist before pushing

### Glossary Link Not Working?
- Verify term exists in `src/data/glossary.js`
- Term must match exactly (case-sensitive)

### Math Not Rendering?
- Check syntax is valid LaTeX
- Use `$$...$$` for block math (not `\[...\]`)
- Restart dev server after editing math

---

## 📚 Learn More

- Full README: `README.md`
- Deployment Guide: `DEPLOYMENT_CHECKLIST.md`
- Docusaurus Docs: https://docusaurus.io
- MDX Guide: https://mdxjs.com

---

## 💡 Tips

- Hot reload enabled: changes appear instantly
- Search indexes automatically
- No database needed
- All CSS in `src/css/custom.css`
- Keep ES ↔ EN versions in sync!

---

**Ready to go!** 🚀
