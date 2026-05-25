export function initTimeline(timelineData, config) {
  let currentEventIndex = 0;

  function renderTimelineBar() {
    const barContainer = document.querySelector('.timeline-bar');
    barContainer.innerHTML = '';

    timelineData.forEach(event => {
      const percentage = (event.timestamp / config.totalDuration) * 100;
      const marker = document.createElement('div');
      marker.className = `timeline-event-marker ${event.id}`;
      marker.style.left = `${percentage}%`;
      marker.setAttribute('data-event-id', event.id);
      marker.setAttribute('data-index', timelineData.indexOf(event));
      marker.setAttribute('title', event.title);

      marker.addEventListener('click', () => {
        selectEvent(timelineData.indexOf(event));
      });

      barContainer.appendChild(marker);
    });

    updateActiveMarker();
  }

  function updateActiveMarker() {
    document.querySelectorAll('.timeline-event-marker').forEach((marker, idx) => {
      marker.classList.toggle('active', idx === currentEventIndex);
    });
  }

  function selectEvent(index) {
    if (index < 0 || index >= timelineData.length) return;
    currentEventIndex = index;
    updateActiveMarker();
    updateDetailPanel();
    updateNavigationButtons();
  }

  function updateDetailPanel() {
    const event = timelineData[currentEventIndex];
    const detailPanel = document.querySelector('.timeline-detail-panel');

    detailPanel.className = `timeline-detail-panel ${event.id}`;
    detailPanel.innerHTML = `
      <div class="timeline-detail-title">${event.title}</div>
      <div class="timeline-detail-time">${event.timeISO} CEST</div>
      <div class="timeline-detail-text">${event.detail}</div>
      <div class="timeline-power-box">
        <span class="timeline-power-label">Pérdida acumulada:</span>
        <div class="timeline-power-value">−${event.mwAccum.toLocaleString('es-ES')} MW</div>
      </div>
    `;
  }

  function updateNavigationButtons() {
    const prevBtn = document.querySelector('.timeline-nav-button:first-child');
    const nextBtn = document.querySelector('.timeline-nav-button:last-child');

    if (prevBtn) prevBtn.disabled = currentEventIndex === 0;
    if (nextBtn) nextBtn.disabled = currentEventIndex === timelineData.length - 1;
  }

  function handlePrevEvent() {
    selectEvent(currentEventIndex - 1);
  }

  function handleNextEvent() {
    selectEvent(currentEventIndex + 1);
  }

  // Initialize
  renderTimelineBar();
  updateDetailPanel();
  updateNavigationButtons();

  // Attach event listeners to nav buttons
  const prevBtn = document.querySelector('.timeline-nav-button:first-child');
  const nextBtn = document.querySelector('.timeline-nav-button:last-child');

  if (prevBtn) prevBtn.addEventListener('click', handlePrevEvent);
  if (nextBtn) nextBtn.addEventListener('click', handleNextEvent);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') handlePrevEvent();
    if (e.key === 'ArrowRight') handleNextEvent();
  });
}

export default { initTimeline };
