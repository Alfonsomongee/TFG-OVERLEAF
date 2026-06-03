import React, { useState, useMemo } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import { useDocLang } from '@site/src/hooks/useDocLang';
import datosForensesES from '@site/src/data/datosForenses.json';
import datosForensesEN from '@site/src/data/datosForenses_en.json';
import styles from './styles.module.css';

// Función para aplanar el JSON maestro en un array de filas
function flattenData(obj, prefix = '') {
  let rows = [];
  for (const key in obj) {
    if (key.startsWith('_')) continue; // Saltar metadatos
    const val = obj[key];
    if (val && typeof val === 'object' && !Array.isArray(val) && val.valor !== undefined) {
      rows.push({
        id: prefix + key,
        name: key.replace(/_/g, ' '),
        ...val
      });
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      rows = rows.concat(flattenData(val, `${prefix}${key}.`));
    }
  }
  return rows;
}

const allDataES = flattenData(datosForensesES);
const allDataEN = flattenData(datosForensesEN);

function getFilteredData(lang, selectedSources) {
  const data = lang === 'en' ? allDataEN : allDataES;
  if (selectedSources.length === 0) return data;
  return data.filter(d => d.fuentePrimaria && selectedSources.includes(d.fuentePrimaria));
}

export default function TablaMaestra28A() {
  const lang = useDocLang();
  const [selectedSources, setSelectedSources] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  
  const allSources = useMemo(() => {
    const data = lang === 'en' ? allDataEN : allDataES;
    return Array.from(new Set(data.map(d => d.fuentePrimaria).filter(Boolean)));
  }, [lang]);

  const toggleSource = (source) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const filteredData = useMemo(() => getFilteredData(lang, selectedSources), [lang, selectedSources]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3><Translate id="tablaMaestra.title">Base de Datos Maestra 28-A</Translate></h3>
        <p><Translate id="tablaMaestra.desc">Datos validados y triangulados desde las fuentes primarias de la investigación.</Translate></p>
      </div>

      <div className={styles.filterSection}>
        <span className={styles.filterLabel}><Translate id="tablaMaestra.filtrarPor">Filtrar por Fuente Primaria:</Translate></span>
        <div className={styles.badges}>
          {allSources.map(source => (
            <button
              key={source}
              className={`${styles.badge} ${selectedSources.includes(source) ? styles.badgeActive : ''}`}
              onClick={() => toggleSource(source)}
            >
              {source}
            </button>
          ))}
          {selectedSources.length > 0 && (
            <button className={styles.badgeClear} onClick={() => setSelectedSources([])}>
              ✖ <Translate id="tablaMaestra.borrarFiltros">Borrar filtros</Translate>
            </button>
          )}
        </div>
      </div>

      <div className="table-scroll-wrapper">
        <table className={styles.table}>
          <thead>
            <tr>
              <th><Translate id="tablaMaestra.magnitud">Magnitud</Translate></th>
              <th><Translate id="tablaMaestra.valor">Valor</Translate></th>
              <th><Translate id="tablaMaestra.fuenteOficial">Fuente Oficial</Translate></th>
              <th><Translate id="tablaMaestra.pag">Pág.</Translate></th>
              <th><Translate id="tablaMaestra.auditoria">Auditoría</Translate></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <React.Fragment key={row.id}>
                <tr 
                  className={expandedRow === row.id ? styles.rowExpanded : ''}
                  onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                >
                  <td style={{ textTransform: 'capitalize' }}>{row.name}</td>
                  <td className={styles.valor}>
                    {row.valor !== null ? row.valor : <span className={styles.na}>N/A</span>} 
                    {row.unidad && <span className={styles.unidad}> {row.unidad}</span>}
                  </td>
                  <td className={styles.fuente}>{row.fuentePrimaria || '-'}</td>
                  <td>{row.pagina || '-'}</td>
                  <td>
                    <button className={styles.expandBtn}>
                      {expandedRow === row.id ? translate({id: 'tablaMaestra.ocultar', message: 'Ocultar info'}) : translate({id: 'tablaMaestra.verContexto', message: 'Ver contexto'})}
                    </button>
                  </td>
                </tr>
                {expandedRow === row.id && (
                  <tr className={styles.expandedDetail}>
                    <td colSpan="5">
                      <div className={styles.detailBox}>
                        {row.contexto && <p><strong><Translate id="tablaMaestra.contexto">Contexto:</Translate></strong> {row.contexto}</p>}
                        {row.notaDiscrepancia && (
                          <div className={styles.discrepancyBox}>
                            <strong>⚠️ <Translate id="tablaMaestra.notaDiscrepancia">Nota de Discrepancia:</Translate></strong> {row.notaDiscrepancia}
                            {row.valorAlternativo && (
                              <p className={styles.altVal}>
                                {translate({id: 'tablaMaestra.valorAlt', message: 'Valor alternativo registrado:'})} {row.valorAlternativo} {row.unidad}
                              </p>
                            )}
                          </div>
                        )}
                        {row.url && (
                          <a href={row.url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
                            🔗 <Translate id="tablaMaestra.consultarOriginal">Consultar documento original</Translate>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
