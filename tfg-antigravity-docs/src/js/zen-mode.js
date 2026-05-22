if (typeof document !== 'undefined') {
  const applyZen = () => {
    if (localStorage.getItem('zen-mode') === 'true') {
      document.documentElement.classList.add('zen-mode');
    }
  };
  
  // Apply initially
  applyZen();

  // Docusaurus (React Helmet) might remove our class on route changes.
  // Use a MutationObserver to force it back if it's supposed to be active.
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        if (localStorage.getItem('zen-mode') === 'true' && !document.documentElement.classList.contains('zen-mode')) {
          document.documentElement.classList.add('zen-mode');
        }
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });

  const translateZenMode = () => {
    const defaultSpan = document.querySelector('.zen-mode-text-default');
    const activeSpan = document.querySelector('.zen-mode-text-active');
    if (!defaultSpan || !activeSpan) return;
    
    const lang = document.documentElement.lang || 'es';
    const dict = {
      'en': { default: 'Full Screen', active: 'Exit Full Screen' },
      'pt': { default: 'Tela Cheia', active: 'Sair da Tela Cheia' },
      'fr': { default: 'Plein Écran', active: 'Quitter Plein Écran' },
      'it': { default: 'Schermo Intero', active: 'Esci Schermo Intero' },
      'de': { default: 'Vollbild', active: 'Vollbild beenden' },
      'es': { default: 'Pantalla Completa', active: 'Volver a modo menú' }
    };
    
    const langKey = lang.split('-')[0];
    const trans = dict[langKey] || dict['es'];
    
    defaultSpan.textContent = trans.default;
    activeSpan.textContent = trans.active;
  };
  
  // Try to translate on load and when DOM changes
  document.addEventListener('DOMContentLoaded', translateZenMode);
  const observerLang = new MutationObserver(translateZenMode);
  observerLang.observe(document.documentElement, { childList: true, subtree: true });

  // Handle toggling
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#zen-mode-toggle');
    if (btn) {
      e.preventDefault(); // Prevent any default action
      const isZen = document.documentElement.classList.contains('zen-mode');
      if (isZen) {
        localStorage.setItem('zen-mode', 'false');
        document.documentElement.classList.remove('zen-mode');
      } else {
        localStorage.setItem('zen-mode', 'true');
        document.documentElement.classList.add('zen-mode');
      }
    }
  });
}
