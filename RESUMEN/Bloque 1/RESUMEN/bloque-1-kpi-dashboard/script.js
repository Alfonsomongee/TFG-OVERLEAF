export function initKPIDashboard(container, kpiData) {
  const isTouch = () => matchMedia('(hover: none)').matches;

  kpiData.forEach(kpi => {
    const card = document.createElement('div');
    card.className = `kpi-card ${kpi.color}`;
    card.id = `kpi-${kpi.id}`;
    card.setAttribute('aria-label', `${kpi.label}: ${kpi.value}`);
    card.setAttribute('data-source', kpi.source);
    card.setAttribute('data-color', kpi.color);

    const label = document.createElement('div');
    label.className = 'kpi-label';
    label.textContent = kpi.label;

    const value = document.createElement('div');
    value.className = 'kpi-value';
    value.textContent = kpi.value;

    const context = document.createElement('div');
    context.className = 'kpi-context';
    context.textContent = kpi.context;

    const tooltip = document.createElement('div');
    tooltip.className = 'kpi-tooltip';
    tooltip.textContent = kpi.source;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('title', kpi.source);

    card.appendChild(label);
    card.appendChild(value);
    card.appendChild(context);
    card.appendChild(tooltip);

    if (!isTouch()) {
      card.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
      });

      card.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
      });
    } else {
      card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const isVisible = tooltip.style.visibility === 'visible';
        tooltip.style.opacity = isVisible ? '0' : '1';
        tooltip.style.visibility = isVisible ? 'hidden' : 'visible';
      });
    }

    container.appendChild(card);
  });
}

export default { initKPIDashboard };
