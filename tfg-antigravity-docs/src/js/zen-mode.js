if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#zen-mode-toggle');
    if (btn) {
      document.body.classList.toggle('zen-mode');
    }
  });
}
