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
