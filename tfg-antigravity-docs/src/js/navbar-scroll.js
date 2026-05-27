if (typeof document !== 'undefined') {
  let lastScrollY = 0;
  let ticking = false;

  const handleScroll = () => {
    // Skip on intro page
    if (window.location.pathname === '/' || document.body.classList.contains('intro-page')) return;

    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      // Scrolling down — hide navbar
      navbar.classList.add('navbar--hidden');
    } else {
      // Scrolling up — show navbar
      navbar.classList.remove('navbar--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });
}
