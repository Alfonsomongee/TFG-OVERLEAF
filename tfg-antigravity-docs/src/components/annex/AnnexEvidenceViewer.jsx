/**
 * AnnexEvidenceViewer.jsx
 *
 * Patrón: tarjeta compacta en la grid del anexo → botón → overlay fullscreen
 * via createPortal(content, document.body).
 *
 * Props:
 *   type   'figure' | 'table' | 'interactive' | 'chart'
 *   item   objeto de evidencia (imageGalleryData / forensicCategories / graphicsData / CHARTS)
 *   lang   locale string ('es' | 'en' | 'de' | 'zh-Hans')
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './AnnexEvidenceViewer.module.css';

// ChartViewer eliminado junto con ForensicGallery2 — funcionalidad retirada
const ChartViewerLazy = null;

// ─────────────────────────────────────────────────────────────────────────────
// Diccionario de traducciones
// ─────────────────────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  es: {
    figure: 'Figura',
    table: 'Tabla',
    interactive: 'Interactivo',
    chart: 'Serie',
    close: 'Cerrar',
    enlarge: 'Ampliar',
    enlargeFig: 'Ampliar figura',
    viewFullTable: 'Ver tabla completa',
    viewChart: 'Ver gráfica',
    openInteractive: 'Abrir interactivo',
    rows: 'filas',
    cols: 'col.',
    source: 'Fuente',
    note: 'Nota',
    loading: 'Cargando…',
    loadingChart: 'Cargando gráfica…',
    starting: 'Iniciando',
    noTableData: 'Datos de tabla no disponibles.',
  },
  en: {
    figure: 'Figure',
    table: 'Table',
    interactive: 'Interactive',
    chart: 'Series',
    close: 'Close',
    enlarge: 'Enlarge',
    enlargeFig: 'Enlarge figure',
    viewFullTable: 'View full table',
    viewChart: 'View chart',
    openInteractive: 'Open interactive',
    rows: 'rows',
    cols: 'col.',
    source: 'Source',
    note: 'Note',
    loading: 'Loading…',
    loadingChart: 'Loading chart…',
    starting: 'Starting',
    noTableData: 'Table data not available.',
  },
  de: {
    figure: 'Abbildung',
    table: 'Tabelle',
    interactive: 'Interaktiver Inhalt',
    chart: 'Zeitreihe',
    close: 'Schließen',
    enlarge: 'Vergrößern',
    enlargeFig: 'Abbildung vergrößern',
    viewFullTable: 'Ganze Tabelle anzeigen',
    viewChart: 'Grafik anzeigen',
    openInteractive: 'Interaktiven Inhalt öffnen',
    rows: 'Zeilen',
    cols: 'Sp.',
    source: 'Quelle',
    note: 'Hinweis',
    loading: 'Wird geladen…',
    loadingChart: 'Grafik wird geladen…',
    starting: 'Wird gestartet',
    noTableData: 'Tabellendaten nicht verfügbar.',
  },
  'zh-Hans': {
    figure: '图',
    table: '表',
    interactive: '互动模块',
    chart: '时间序列',
    close: '关闭',
    enlarge: '放大',
    enlargeFig: '放大图片',
    viewFullTable: '查看完整表格',
    viewChart: '查看图表',
    openInteractive: '打开互动模块',
    rows: '行',
    cols: '列',
    source: '来源',
    note: '备注',
    loading: '加载中…',
    loadingChart: '图表加载中…',
    starting: '正在启动',
    noTableData: '表格数据不可用。',
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de columna — las tablas de forensic_categories usan {key, label}
// ─────────────────────────────────────────────────────────────────────────────

const getColKey   = (col) => (typeof col === 'string' ? col : col.key);
const getColLabel = (col) => (typeof col === 'string' ? col : (col.label || col.key));

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de figura
// ─────────────────────────────────────────────────────────────────────────────

function getFigureTitle(item, lang) {
  const lookupLang = lang === 'zh-Hans' ? 'zh' : lang;
  const t = item[`title_${lookupLang}`] || item[`title_${lang}`] || item.title_es || item.title || '';
  if (t) return t;
  const cap = item[`caption_${lookupLang}`] || item[`caption_${lang}`] || item.caption_es || item.caption_en || '';
  if (cap) {
    const first = cap.split(/[.!?]/)[0].trim();
    if (first) return first;
  }
  const defaultLabel = TRANSLATIONS[lang]?.figure || TRANSLATIONS.es.figure;
  return item.src
    ? item.src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ')
    : defaultLabel;
}

function getFigureCaption(item, lang) {
  const lookupLang = lang === 'zh-Hans' ? 'zh' : lang;
  return item[`caption_${lookupLang}`] || item[`caption_${lang}`] || item.caption_es || item.caption_en || '';
}

// ─────────────────────────────────────────────────────────────────────────────
// FULLSCREEN MODAL — createPortal a document.body
// ─────────────────────────────────────────────────────────────────────────────

function FullscreenEvidenceModal({ open, title, type, onClose, wide = false, lang, children }) {
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

  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;
  const label = t[type] || '';
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
            aria-label={t.close}
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
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;
  
  let desc = caption;
  if (desc.startsWith(title)) {
    desc = desc.substring(title.length).trim().replace(/^[. -:]+/, '').trim();
  }
  const shortCap = desc.length > 150
    ? desc.slice(0, 147) + '…'
    : desc;

  const id = `fig-${item.src.split('/').pop().replace(/\.[^/.]+$/, "")}`;
  return (
    <div id={id} className={styles.card}>
      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${styles.figura}`}>{t.figure}</span>
      </div>

      {item.src && (
        <button
          type="button"
          className={styles.thumbnailBtn}
          onClick={() => setOpen(true)}
          aria-label={`${t.enlarge}: ${title}`}
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
          {t.enlargeFig}
        </button>
      </div>

      <FullscreenEvidenceModal
        open={open}
        title={title}
        type="figure"
        lang={lang}
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

function TableViewer({ item, lang }) {
  const [open, setOpen] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;
  const title     = item.name || t.table;
  const note      = item.note || '';
  const shortNote = note.length > 130 ? note.slice(0, 127) + '…' : note;
  const rowCount  = Array.isArray(item.data)    ? item.data.length    : 0;
  const colCount  = Array.isArray(item.columns) ? item.columns.length : 0;

  const id = `tabla-${item.id}`;
  return (
    <div id={id} className={styles.card}>
      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${styles.tabla}`}>{t.table}</span>
      </div>

      <h4 className={styles.cardTitle}>{title}</h4>
      {shortNote && <p className={styles.cardCaption}>{shortNote}</p>}

      <div className={styles.cardMeta}>
        {rowCount > 0 && colCount > 0 && (
          <span className={styles.metaPill}>
            {rowCount} {t.rows} · {colCount} {t.cols}
          </span>
        )}
      </div>

      {item.source && (
        <p className={styles.cardSource}>{t.source}: {item.source}</p>
      )}

      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => setOpen(true)}
        >
          {t.viewFullTable}
        </button>
      </div>

      <FullscreenEvidenceModal
        open={open}
        title={title}
        type="table"
        lang={lang}
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
            <p className={styles.fsEmptyMsg}>{t.noTableData}</p>
          )}

          {(note || item.source) && (
            <div className={styles.tableFooterMeta}>
              {note && (
                <p className={styles.tableFootnote}>
                  <em>{t.note}:</em> {note}
                </p>
              )}
              {item.source && (
                <p className={styles.tableFootnote}>
                  <em>{t.source}:</em> {item.source}
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
// ─────────────────────────────────────────────────────────────────────────────

function InteractiveViewer({ item, lang }) {
  const [open, setOpen] = useState(false);
  const DynComponent = item.component;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const id = `grafico-${item.id}`;
  return (
    <div id={id} className={styles.card}>
      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${styles.interactivo}`}>
          {t.interactive}
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
          {t.openInteractive}
        </button>
      </div>

      <FullscreenEvidenceModal
        open={open}
        title={item.title || item.id}
        type="interactive"
        wide={true}
        lang={lang}
        onClose={() => setOpen(false)}
      >
        <BrowserOnly
          fallback={<div className={styles.fsLoadingMsg}>{t.loading}</div>}
        >
          {() => (
            <Suspense
              fallback={
                <div className={styles.fsLoadingMsg}>
                  {t.starting} {item.title}…
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
// ─────────────────────────────────────────────────────────────────────────────

function ChartSeriesViewer({ item, lang }) {
  const [open, setOpen]         = useState(false);
  const [currentId, setCurrentId] = useState(item.id);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const handleOpen = () => {
    setCurrentId(item.id); // reiniciar al chart original al abrir
    setOpen(true);
  };

  const id = item.id;
  return (
    <div id={id} className={styles.card}>
      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${styles.serie}`}>{t.chart}</span>
      </div>

      <h4 className={styles.cardTitle}>{item.title || `${t.chart} ${item.id}`}</h4>
      {item.subtitle && (
        <p className={styles.cardCaption}>{item.subtitle}</p>
      )}
      {(item.sourceBadge || item.source) && (
        <p className={styles.cardSource}>
          {t.source}: {item.sourceBadge || item.source}
        </p>
      )}

      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={handleOpen}
        >
          {t.viewChart}
        </button>
      </div>

      <FullscreenEvidenceModal
        open={open}
        title={item.title || `${t.chart} ${item.id}`}
        type="chart"
        wide={true}
        lang={lang}
        onClose={() => setOpen(false)}
      >
        <BrowserOnly
          fallback={<div className={styles.fsLoadingMsg}>{t.loadingChart}</div>}
        >
          {() => (
            <Suspense
              fallback={
                <div className={styles.fsLoadingMsg}>
                  {t.starting} {item.title}…
                </div>
              }
            >
              {ChartViewerLazy ? (
                <ChartViewerLazy
                  chartId={currentId}
                  locale={lang}
                  onSelectChart={setCurrentId}
                />
              ) : (
                <div className={styles.fsLoadingMsg}>Vista de gráfica no disponible.</div>
              )}
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
      return <TableViewer item={item} lang={lang} />;
    case 'interactive':
      return <InteractiveViewer item={item} lang={lang} />;
    case 'chart':
      return <ChartSeriesViewer item={item} lang={lang} />;
    default:
      return null;
  }
}
