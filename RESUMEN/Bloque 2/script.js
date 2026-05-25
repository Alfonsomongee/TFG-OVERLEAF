export function initGenerationChart(canvasId, generationData) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  const labels = generationData.map(item => item.name);
  const values = generationData.map(item => item.mw);
  const colors = generationData.map(item => item.color);

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: 'transparent',
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#1a1a1a',
          titleColor: '#ffffff',
          bodyColor: '#b0b0b0',
          borderColor: '#404040',
          borderWidth: 0.5,
          padding: 8,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + ' MW';
            }
          }
        }
      }
    },
    plugins: [{
      id: 'textCenter',
      beforeDatasetsDraw(chart) {
        const { width, height } = chart;
        const centerX = width / 2;
        const centerY = height / 2;

        chart.ctx.save();
        chart.ctx.font = 'bold 18px monospace';
        chart.ctx.fillStyle = '#ffffff';
        chart.ctx.textAlign = 'center';
        chart.ctx.textBaseline = 'middle';
        chart.ctx.fillText('~29,6 GW', centerX, centerY - 12);

        chart.ctx.font = 'normal 11px monospace';
        chart.ctx.fillStyle = '#b0b0b0';
        chart.ctx.fillText('generación', centerX, centerY + 12);

        chart.ctx.restore();
      }
    }]
  });
}

export function initTableRows(container, generationData) {
  const total = generationData.reduce((sum, item) => sum + item.mw, 0);

  generationData.forEach(item => {
    const row = document.createElement('div');
    row.className = 'table-row';

    const techName = document.createElement('div');
    techName.className = 'table-row-tech';
    techName.textContent = item.name;

    const barContainer = document.createElement('div');
    barContainer.className = 'table-row-bar-container';

    const bar = document.createElement('div');
    bar.className = `table-row-bar ${item.id}`;
    bar.style.width = `${(item.mw / total) * 100}%`;

    barContainer.appendChild(bar);

    const percentage = document.createElement('div');
    percentage.className = 'table-row-percentage';
    percentage.textContent = item.percentage + '%';

    const value = document.createElement('div');
    value.className = 'table-row-value';
    value.textContent = item.mw + ' MW';

    row.appendChild(techName);
    row.appendChild(barContainer);
    row.appendChild(value);

    container.appendChild(row);
  });
}

export default { initGenerationChart, initTableRows };
