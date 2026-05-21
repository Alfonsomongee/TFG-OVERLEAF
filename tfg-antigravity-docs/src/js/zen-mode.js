if (typeof document !== 'undefined') {
  // Restore saved state
  if (localStorage.getItem('zen-mode') === 'true') {
    document.documentElement.classList.add('zen-mode');
  }

  // Handle click and persist state
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#zen-mode-toggle');
    if (btn) {
      document.documentElement.classList.toggle('zen-mode');
      localStorage.setItem('zen-mode', document.documentElement.classList.contains('zen-mode'));
    }
  });
}
