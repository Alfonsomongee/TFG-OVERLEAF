import { useDocLang } from '@site/src/hooks/useDocLang';
import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './DocumentLibrary.module.css';

const documents = [
  {
    id: 'tfg',
    title_es: "Trabajo de Fin de Grado Completo (PDF)",
    title_en: "Full Bachelor's Thesis (PDF)",
    description_es: "Documento académico completo en formato PDF, incluyendo anexos técnicos, formulación matemática avanzada y bibliografía exhaustiva.",
    description_en: "Complete academic document in PDF format, including technical annexes, advanced mathematical formulation, and exhaustive bibliography.",
    filename: "tfg_antigravity(1).pdf",
    icon: "🎓"
  },
  {
    id: 'entsoe',
    title_es: "Informe Factual ENTSO-E",
    title_en: "ENTSO-E Factual Report",
    description_es: "Análisis preliminar de la Red Europea de Gestores de Redes de Transporte de Electricidad sobre las oscilaciones inter-área y la pérdida de sincronismo.",
    description_en: "Preliminary analysis by the European Network of Transmission System Operators for Electricity on inter-area oscillations and loss of synchronism.",
    filename: "informe_electricidad_mas_barata.pdf", // Assuming this corresponds to it or another official doc
    icon: "🇪🇺"
  },
  {
    id: 'csn',
    title_es: "Presentación del Comité de Análisis",
    title_en: "Analysis Committee Presentation",
    description_es: "Presentación ejecutiva del Gobierno de España con la reconstrucción de los hechos y primeras medidas regulatorias propuestas.",
    description_en: "Executive presentation by the Government of Spain reconstructing the events and proposing initial regulatory measures.",
    filename: "presentacion_gobierno.pdf",
    icon: "🏛️"
  }
];

export default function DocumentLibrary({}) {
  const lang = useDocLang();
  const isEn = lang === 'en';

  return (
    <div className={styles.libraryContainer}>
      <p className={styles.introText}>
        {isEn 
          ? "Below you can download the original PDF documents that serve as primary sources for this forensic analysis:"
          : "A continuación puedes descargar los documentos PDF originales que sirven de fuente primaria para este análisis forense:"}
      </p>
      
      <div className={styles.cardGrid}>
        {documents.map((doc) => {
          const fileUrl = useBaseUrl(`/${doc.filename}`);
          
          return (
            <div key={doc.id} className={styles.documentCard}>
              <div className={styles.cardHeader}>
                <span className={styles.docIcon}>{doc.icon}</span>
                <h3 className={styles.docTitle}>
                  {isEn ? doc.title_en : doc.title_es}
                </h3>
              </div>
              
              <div className={styles.cardBody}>
                <p className={styles.docDescription}>
                  {isEn ? doc.description_en : doc.description_es}
                </p>
              </div>
              
              <div className={styles.cardFooter}>
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="button button--primary button--block"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', verticalAlign: 'text-bottom'}}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  {isEn ? "Download PDF" : "Descargar PDF"}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
