import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  // Escuchar clics en el enlace de correo de Alfonso
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href="mailto:alfonsomongediazangel@gmail.com"]');
    if (target) {
      e.preventDefault();
      
      const email = 'alfonsomongediazangel@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        // Guardamos el texto original
        const originalText = target.innerText;
        
        // Efecto visual de copiado exitoso
        target.innerText = '¡Correo Copiado! ✔️';
        target.style.color = 'var(--ifm-color-primary)';
        target.style.fontWeight = 'bold';
        target.style.transition = 'all 0.3s ease';
        
        // Restaurar después de 2 segundos
        setTimeout(() => {
          target.innerText = originalText;
          target.style.color = '';
          target.style.fontWeight = '';
        }, 2000);
      }).catch(err => {
        console.error('Error al copiar el correo: ', err);
      });
    }
  });

  // Añadir un tooltip nativo al pasar el ratón por primera vez
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a[href="mailto:alfonsomongediazangel@gmail.com"]');
    if (target && !target.hasAttribute('title')) {
      target.setAttribute('title', 'Haz clic para copiar el correo al portapapeles');
      // Cursor personalizado para dar a entender que es una acción de copiar
      target.style.cursor = 'copy';
    }
  });
}
