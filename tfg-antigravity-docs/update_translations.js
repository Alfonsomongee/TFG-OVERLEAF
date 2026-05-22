const fs = require('fs');

const langs = {
  en: {
    '📖 Introducción y Contexto': '📖 Introduction and Context',
    '⚡ Desarrollo del Incidente': '⚡ Incident Development',
    '📊 Impacto y Lecciones': '📊 Impact and Lessons',
    '🇪🇺 Dimensión Europea': '🇪🇺 European Dimension',
    '🛠️ Recursos Interactivos': '🛠️ Interactive Resources',
    '📚 Documentos y Referencias': '📚 Documents and References',
    'ℹ️ Sobre el Proyecto': 'ℹ️ About the Project',
    '📖 Glosario Técnico': '📖 Technical Glossary',
    '📚 Referencias Bibliográficas': '📚 Bibliographical References'
  },
  pt: {
    '📖 Introducción y Contexto': '📖 Introdução e Contexto',
    '⚡ Desarrollo del Incidente': '⚡ Desenvolvimento do Incidente',
    '📊 Impacto y Lecciones': '📊 Impacto e Lições',
    '🇪🇺 Dimensión Europea': '🇪🇺 Dimensão Europeia',
    '🛠️ Recursos Interactivos': '🛠️ Recursos Interativos',
    '📚 Documentos y Referencias': '📚 Documentos e Referências',
    'ℹ️ Sobre el Proyecto': 'ℹ️ Sobre o Projeto',
    '📖 Glosario Técnico': '📖 Glossário Técnico',
    '📚 Referencias Bibliográficas': '📚 Referências Bibliográficas'
  },
  fr: {
    '📖 Introducción y Contexto': '📖 Introduction et Contexte',
    '⚡ Desarrollo del Incidente': '⚡ Déroulement de l\\'Incident',
    '📊 Impacto y Lecciones': '📊 Impact et Leçons',
    '🇪🇺 Dimensión Europea': '🇪🇺 Dimension Européenne',
    '🛠️ Recursos Interactivos': '🛠️ Ressources Interactives',
    '📚 Documentos y Referencias': '📚 Documents et Références',
    'ℹ️ Sobre el Proyecto': 'ℹ️ À propos du Projet',
    '📖 Glosario Técnico': '📖 Glossaire Technique',
    '📚 Referencias Bibliográficas': '📚 Références Bibliographiques'
  },
  it: {
    '📖 Introducción y Contexto': '📖 Introduzione e Contesto',
    '⚡ Desarrollo del Incidente': '⚡ Sviluppo dell\\'Incidente',
    '📊 Impacto y Lecciones': '📊 Impatto e Lezioni',
    '🇪🇺 Dimensión Europea': '🇪🇺 Dimensione Europea',
    '🛠️ Recursos Interactivos': '🛠️ Risorse Interattive',
    '📚 Documentos y Referencias': '📚 Documenti e Riferimenti',
    'ℹ️ Sobre el Proyecto': 'ℹ️ Informazioni sul Progetto',
    '📖 Glosario Técnico': '📖 Glossario Tecnico',
    '📚 Referencias Bibliográficas': '📚 Riferimenti Bibliografici'
  },
  de: {
    '📖 Introducción y Contexto': '📖 Einführung und Kontext',
    '⚡ Desarrollo del Incidente': '⚡ Verlauf des Vorfalls',
    '📊 Impacto y Lecciones': '📊 Auswirkungen und Lehren',
    '🇪🇺 Dimensión Europea': '🇪🇺 Europäische Dimension',
    '🛠️ Recursos Interactivos': '🛠️ Interaktive Ressourcen',
    '📚 Documentos y Referencias': '📚 Dokumente und Referenzen',
    'ℹ️ Sobre el Proyecto': 'ℹ️ Über das Projekt',
    '📖 Glosario Técnico': '📖 Technisches Glossar',
    '📚 Referencias Bibliográficas': '📚 Literaturverzeichnis'
  }
};

const nav = {
  en: { 'Contenido': 'Content', 'Descargar PDF': 'Download PDF' },
  pt: { 'Contenido': 'Conteúdo', 'Descargar PDF': 'Baixar PDF' },
  fr: { 'Contenido': 'Contenu', 'Descargar PDF': 'Télécharger PDF' },
  it: { 'Contenido': 'Contenuto', 'Descargar PDF': 'Scarica PDF' },
  de: { 'Contenido': 'Inhalt', 'Descargar PDF': 'PDF herunterladen' }
};

Object.keys(langs).forEach(lang => {
  const path = \i18n/\/docusaurus-plugin-content-docs/current.json\;
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    Object.keys(data).forEach(key => {
      const original = data[key].message;
      if (langs[lang][original]) {
        data[key].message = langs[lang][original];
      }
    });
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  }

  const navPath = \i18n/\/docusaurus-theme-classic/navbar.json\;
  if (fs.existsSync(navPath)) {
    const data = JSON.parse(fs.readFileSync(navPath, 'utf8'));
    Object.keys(data).forEach(key => {
      const original = data[key].message;
      if (nav[lang][original]) {
        data[key].message = nav[lang][original];
      }
    });
    fs.writeFileSync(navPath, JSON.stringify(data, null, 2), 'utf8');
  }
});
console.log('Translations updated.');
