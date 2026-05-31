/**
 * useChartExport.js
 * Hook reutilizable para exportar datos de gráficas como CSV o PNG.
 *
 * COMPATIBILIDAD:
 *   - CSV: cualquier array de objetos (Recharts data prop)
 *   - PNG: cualquier elemento DOM que contenga un SVG de Recharts
 *
 * USO:
 *   const { exportCSV, exportPNG, containerRef } = useChartExport({
 *     data,
 *     filename: 'radar-vulnerabilidad',
 *     headers: { axis: 'Dimensión', blackout28A: '28-A', optimal: 'PNIEC2030' }
 *   });
 *
 *   return (
 *     <div ref={containerRef}>
 *       <ResponsiveContainer>...</ResponsiveContainer>
 *       <button onClick={exportCSV}>↓ CSV</button>
 *       <button onClick={exportPNG}>↓ PNG</button>
 *     </div>
 *   );
 */
import { useRef, useCallback } from 'react';

export function useChartExport({ data, filename = 'chart', headers = null }) {
  const containerRef = useRef(null);

  // ── Exportar CSV ────────────────────────────────────────────────────────────
  const exportCSV = useCallback(() => {
    if (!data?.length) return;

    const keys = Object.keys(data[0]);
    const headerRow = headers
      ? keys.map(k => headers[k] || k)
      : keys;

    const rows = data.map(row =>
      keys.map(k => {
        const v = row[k];
        // Comillas para strings con comas
        return typeof v === 'string' && v.includes(',') ? `"${v}"` : v;
      }).join(',')
    );

    const csv  = [headerRow.join(','), ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data, filename, headers]);

  // ── Exportar PNG desde SVG de Recharts ─────────────────────────────────────
  const exportPNG = useCallback(async () => {
    if (!containerRef.current) return;

    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) {
      console.warn('useChartExport: no SVG found in containerRef');
      return;
    }

    // Serializar SVG con estilos inline para portabilidad
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url     = URL.createObjectURL(svgBlob);

    const img    = new Image();
    const canvas = document.createElement('canvas');
    const scale  = 2; // Retina / HiDPI

    await new Promise((resolve, reject) => {
      img.onload  = resolve;
      img.onerror = reject;
      img.src     = url;
    });

    canvas.width  = img.width  * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext('2d');
    // Fondo oscuro coherente con la estética del sitio
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    URL.revokeObjectURL(url);

    const pngUrl = canvas.toDataURL('image/png');
    const a      = document.createElement('a');
    a.href       = pngUrl;
    a.download   = `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [filename]);

  return { exportCSV, exportPNG, containerRef };
}

// ── Botones de exportación estandarizados ─────────────────────────────────────
export function ExportButtons({ onCSV, onPNG, lang = 'es' }) {
  const isEs = lang === 'es';
  const btnStyle = {
    padding: '0.3rem 0.75rem',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 6,
    color: '#64748b',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: 11,
    transition: 'all 0.15s ease',
  };

  return (
    <div style={{ display: 'flex', gap: '0.4rem' }}>
      {onCSV && (
        <button
          onClick={onCSV}
          style={btnStyle}
          aria-label={isEs ? 'Descargar datos como CSV' : 'Download data as CSV'}
          title="CSV"
        >
          ↓ CSV
        </button>
      )}
      {onPNG && (
        <button
          onClick={onPNG}
          style={btnStyle}
          aria-label={isEs ? 'Descargar gráfica como PNG' : 'Download chart as PNG'}
          title="PNG"
        >
          ↓ PNG
        </button>
      )}
    </div>
  );
}
