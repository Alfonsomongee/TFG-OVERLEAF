/**
 * AnnexEvidenceViewer.jsx  — FASE 2R-4F (corrección UX)
 *
 * Patrón: tarjeta compacta en la grid del anexo → botón → overlay fullscreen
 * via createPortal(content, document.body).
 *
 * createPortal garantiza que el overlay escape cualquier contenedor con
 * overflow:hidden, transform o grid, sin depender de position:fixed.
 *
 * Props:
 *   type   'figure' | 'table' | 'interactive' | 'chart'
 *   item   objeto de evidencia (imageGalleryData / forensicCategories / graphicsData / CHARTS)
 *   lang   locale string ('es' | 'en' | 'de' | 'zh-Hans')
 *
 * No navega a /anexo-figuras, /anexo-tablas, /anexo-interactivos ni /anexo-entsoe.
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './AnnexEvidenceViewer.module.css';

// ChartViewer se carga sólo cuando el usuario abre una gráfica
const ChartViewerLazy = lazy(() =>
  import(/* webpackChunkName: "annex-chart-viewer" */ '../ForensicGallery2/ChartViewer')
);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de columna — las tablas de forensic_categories usan {key, label}
// ─────────────────────────────────────────────────────────────────────────────

const getColKey   = (col) => (typeof col === 'string' ? col : col.key);
const getColLabel = (col) => (typeof col === 'string' ? col : (col.label || col.key));

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de figura
// ─────────────────────────────────────────────────────────────────────────────

function getFigureTitle(item, lang) {
  const t = item[`title_${lang}`] || item.title_es || item.title || '';
  if (t) return t;
  const cap = item[`caption_${lang}`] || item.caption_es || item.caption_en || '';
  if (cap) {
    const first = cap.split(/[.!?]/)[0].trim();
    if (first) return first;
  }
  return item.src
    ? item.src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ')
    : 'Figura';
}

function getFigureCaption(item, lang) {
  return item[`caption_${lang}`] || item.caption_es || item.caption_en || '';
}

// ─────────────────────────────────────────────────────────────────────────────
// FULLSCREEN MODAL — createPortal a document.body
//
// Escapa cualquier contenedor con overflow/transform/grid/will-change.
// Usado por los cuatro tipos de evidencia.
//
// Props:
//   open     boolean
//   title    string  — mostrado en cabecera
//   type     'figure' | 'table' | 'interactive' | 'chart'
//   onClose  () => void
//   wide     boolean — si true, usa fsBodyWide (sin padding, min-height mayor)
//   children ReactNode — contenido del cuerpo del modal
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_LABELS = {
  figure:      'Figura',
  table:       'Tabla',
  interactive: 'Interactivo',
  chart:       'Serie',
};

function FullscreenEvidenceModal({ open, title, type, onClose, wide = false, children }) {
  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // No renderizar en SSR ni cuando está cerrado
  if (!open) return null;
  if (typeof document === 'undefined') return null;

  const label = TYPE_LABELS[type] || '';
  const shellClass = [
    styles.fsShell,
    type === 'figure' ? styles.fsShellFigure : '',
  ].filter(Boolean).join(' ');

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="aev-fs-title"
      className={styles.fsBackdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={shellClass}>
        {/* ── CABECERA ────────────────────────────────────────────────────── */}
        <div className={styles.fsHeader}>
          <div className={styles.fsTitleGroup}>
            <span className={`${styles.fsBadge} ${styles[type]}`}>{label}</span>
            <span id="aev-fs-title" className={styles.fsModalTitle}>{title}</span>
          </div>
          <button
            type="button"
            className={styles.fsClose}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* ── CUERPO ──────────────────────────────────────────────────────── */}
        <div className={wide ? styles.fsBodyWide : styles.fsBody}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIGURA — tarjeta compacta + modal fullscreen con imagen
// ─────────────────────────────────────────────────────────────────────────────

function FigureViewer({ item, lang }) {
  const [open, setOpen] = useState(false);
  const title   = getFigureTitle(item, lang);
  const caption = getFigureCaption(item, lang);
  
  let desc = caption;
  if (desc.startsWith(title)) {
    desc = desc.substring(title.length).trim().replace(/^[. -:]+/, '').trim();
  }
  const shortCap = desc.length > 150
    ? desc.slice(0, 147) + '…'
    : desc;

  return (
    <div className={styles.card}>
      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${styles.figura}`}>Figura</span>
      </div>

      {item.src && (
        <button
          type="button"
          className={styles.thumbnailBtn}
          onClick={() => setOpen(true)}
          aria-label={`Ampliar: ${title}`}
        >
          <img
            src={item.src}
            alt={title}
            className={styles.thumbnail}
            loading="lazy"
          />
        </button>
      )}

      <h4 className={styles.cardTitle}>{title}</h4>
      {shortCap && <p className={styles.cardCaption}>{shortCap}</p>}

      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => setOpen(true)}
        >
          Ampliar figura
        </button>
      </div>

      <FullscreenEvidenceModal
        open={open}
        title={title}
        type="figure"
        onClose={() => setOpen(false)}
      >
        <div className={styles.figureContent}>
          <img src={item.src} alt={title} className={styles.figureImg} />
          {caption && (
            <p className={styles.figureCaption}>{caption}</p>
          )}
        </div>
      </FullscreenEvidenceModal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLA — tarjeta compacta + modal fullscreen con tabla completa
// ─────────────────────────────────────────────────────────────────────────────

function TableViewer({ item }) {
  const [open, setOpen] = useState(false);
  const title     = item.name || 'Tabla';
  const note      = item.note || '';
  const shortNote = note.length > 130 ? note.slice(0, 127) + '…' : note;
  const rowCount  = Array.isArray(item.data)    ? item.data.length    : 0;
  const colCount  = Array.isArray(item.columns) ? item.columns.length : 0;

  return (
    <div className={styles.card}>
      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${styles.tabla}`}>Tabla</span>
      </div>

      <h4 className={styles.cardTitle}>{title}</h4>
      {shortNote && <p className={styles.cardCaption}>{shortNote}</p>}

      <div className={styles.cardMeta}>
        {rowCount > 0 && colCount > 0 && (
          <span className={styles.metaPill}>
            {rowCount} filas · {colCount} col.
          </span>
        )}
      </div>

      {item.source && (
        <p className={styles.cardSource}>Fuente: {item.source}</p>
      )}

      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => setOpen(true)}
        >
          Ver tabla completa
        </button>
      </div>

      <FullscreenEvidenceModal
        open={open}
        title={title}
        type="table"
        onClose={() => setOpen(false)}
      >
        <div className={styles.tableContent}>
          {item.columns && item.data ? (
            <div className={styles.tableScrollWrap}>
              <table className={styles.tableEl}>
                <thead>
                  <tr>
                    {item.columns.map((col, i) => (
                      <th key={i} className={styles.th}>
                        {getColLabel(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.data.map((row, ri) => (
                    <tr
                      key={ri}
                      className={ri % 2 === 0 ? styles.trEven : styles.trOdd}
                    >
                      {item.columns.map((col, ci) => {
                        const key   = getColKey(col);
                        const label = getColLabel(col);
                        const val =
                          row[key] ??
                          row[label] ??
                          row[Object.keys(row)[ci]] ??
                          '—';
                        return (
                          <td key={ci} className={styles.td}>
                            {String(val)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.fsEmptyMsg}>Datos de tabla no disponibles.</p>
          )}

          {(note || item.source) && (
            <div className={styles.tableFooterMeta}>
              {note && (
                <p className={styles.tableFootnote}>
                  <em>Nota:</em> {note}
                </p>
              )}
              {item.source && (
                <p className={styles.tableFootnote}>
                  <em>Fuente:</em> {item.source}
                </p>
              )}
            </div>
          )}
        </div>
      </FullscreenEvidenceModal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERACTIVO — tarjeta compacta + modal fullscreen ancho
// item viene de graphicsData enriquecido con { title, description }
// item.component es React.lazy(() => import(...))
// ─────────────────────────────────────────────────────────────────────────────

function InteractiveViewer({ item, lang }) {
  const [open, setOpen] = useState(false);
  const DynComponent = item.component;

  return (
    <div className={styles.card}>
      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${styles.interactivo}`}>
          Interactivo
        </span>
      </div>

      <h4 className={styles.cardTitle}>{item.title || item.id}</h4>
      {item.description && (
        <p className={styles.cardCaption}>{item.description}</p>
      )}

      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => setOpen(true)}
        >
          Abrir interactivo
        </button>
      </div>

      <FullscreenEvidenceModal
        open={open}
        title={item.title || item.id}
        type="interactive"
        wide={true}
        onClose={() => setOpen(false)}
      >
        <BrowserOnly
          fallback={<div className={styles.fsLoadingMsg}>Cargando…</div>}
        >
          {() => (
            <Suspense
              fallback={
                <div className={styles.fsLoadingMsg}>
                  Iniciando {item.title}…
                </div>
              }
            >
              <DynComponent lang={lang} isGallery={false} />
            </Suspense>
          )}
        </BrowserOnly>
      </FullscreenEvidenceModal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIE (CHART) — tarjeta compacta + modal fullscreen con ChartViewer
// onSelectChart permite navegar prev/next dentro del modal
// ─────────────────────────────────────────────────────────────────────────────

function ChartSeriesViewer({ item, lang }) {
  const [open, setOpen]         = useState(false);
  const [currentId, setCurrentId] = useState(item.id);

  const handleOpen = () => {
    setCurrentId(item.id); // reiniciar al chart original al abrir
    setOpen(true);
  };

  return (
    <div className={styles.card}>
      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${styles.serie}`}>Serie</span>
      </div>

      <h4 className={styles.cardTitle}>{item.title || `Serie ${item.id}`}</h4>
      {item.subtitle && (
        <p className={styles.cardCaption}>{item.subtitle}</p>
      )}
      {(item.sourceBadge || item.source) && (
        <p className={styles.cardSource}>
          Fuente: {item.sourceBadge || item.source}
        </p>
      )}

      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={handleOpen}
        >
          Ver gráfica
        </button>
      </div>

      <FullscreenEvidenceModal
        open={open}
        title={item.title || `Serie ${item.id}`}
        type="chart"
        wide={true}
        onClose={() => setOpen(false)}
      >
        <BrowserOnly
          fallback={<div className={styles.fsLoadingMsg}>Cargando gráfica…</div>}
        >
          {() => (
            <Suspense
              fallback={
                <div className={styles.fsLoadingMsg}>
                  Iniciando {item.title}…
                </div>
              }
            >
              <ChartViewerLazy
                chartId={currentId}
                locale={lang}
                onSelectChart={setCurrentId}
              />
            </Suspense>
          )}
        </BrowserOnly>
      </FullscreenEvidenceModal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function AnnexEvidenceViewer({ type, item, lang = 'es' }) {
  if (!item) return null;

  switch (type) {
    case 'figure':
      return <FigureViewer item={item} lang={lang} />;
    case 'table':
      return <TableViewer item={item} />;
    case 'interactive':
      return <InteractiveViewer item={item} lang={lang} />;
    case 'chart':
      return <ChartSeriesViewer item={item} lang={lang} />;
    default:
      return null;
  }
}
