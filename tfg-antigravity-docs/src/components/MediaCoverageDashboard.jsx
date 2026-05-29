import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

function MediaCoverageContent({ lang = 'es' }) {
  const [activeTab, setActiveTab] = useState('critica');

  const getStrings = (l) => {
    switch (l) {
      case 'en': return { 
        critica: 'Critical Narrative', fav: 'Favorable Narrative', intl: 'International Press',
        criticaDesc: 'Focus on government management, renewables policy, and lack of inertia.',
        favDesc: 'Focus on REE operation, inherited grid infrastructure, and lack of interconnection.',
        intlDesc: 'Focus on European synchronization, market impact, and structural weaknesses.',
        source: 'Source: Own elaboration'
      };
      case 'pt': return { 
        critica: 'Narrativa Crítica', fav: 'Narrativa Favorável', intl: 'Imprensa Internacional',
        criticaDesc: 'Foco na gestão governamental, política de renováveis e falta de inércia.',
        favDesc: 'Foco na operação da REE, rede herdada e falta de interconexão.',
        intlDesc: 'Foco na sincronização europeia, impacto no mercado e fraquezas estruturais.',
        source: 'Fonte: Elaboração própria'
      };
      case 'fr': return { 
        critica: 'Narrative Critique', fav: 'Narrative Favorable', intl: 'Presse Internationale',
        criticaDesc: 'Accent sur la gestion gouvernementale, politique renouvelable et manque d\'inertie.',
        favDesc: 'Accent sur l\'opération de REE, réseau hérité et manque d\'interconnexion.',
        intlDesc: 'Accent sur la synchronisation européenne, l\'impact du marché et les faiblesses.',
        source: 'Source : Élaboration propre'
      };
      case 'it': return { 
        critica: 'Narrativa Critica', fav: 'Narrativa Favorevole', intl: 'Stampa Internazionale',
        criticaDesc: 'Focus sulla gestione governativa, politica rinnovabili e mancanza di inerzia.',
        favDesc: 'Focus sull\'operazione REE, rete ereditata e mancanza di interconnessione.',
        intlDesc: 'Focus sulla sincronizzazione europea, impatto sul mercato e debolezze.',
        source: 'Fonte: Elaborazione propria'
      };
      case 'de': return { 
        critica: 'Kritische Erzählung', fav: 'Günstige Erzählung', intl: 'Internationale Presse',
        criticaDesc: 'Fokus auf Regierungsführung, Erneuerbaren-Politik und mangelnde Trägheit.',
        favDesc: 'Fokus auf REE-Betrieb, veraltetes Netz und mangelnde Verbindung.',
        intlDesc: 'Fokus auf europäische Synchronisierung, Marktauswirkungen und Schwächen.',
        source: 'Quelle: Eigene Ausarbeitung'
      };
      default: return { 
        critica: 'Narrativa Crítica', fav: 'Narrativa Favorable', intl: 'Prensa Internacional',
        criticaDesc: 'Foco en la gestión gubernamental, política de renovables y falta de inercia.',
        favDesc: 'Foco en la operación de REE, red de transporte heredada y falta de interconexión.',
        intlDesc: 'Foco en la resincronización continental, impacto de mercado y debilidades estructurales.',
        source: 'Fuente: Elaboración propia'
      };
    }
  };

  const strings = getStrings(lang);

  const tabs = [
    { id: 'critica', label: strings.critica, desc: strings.criticaDesc, img: '/figuras/collage_conservador.png', color: '#ef4444' },
    { id: 'fav', label: strings.fav, desc: strings.favDesc, img: '/figuras/collage_progresista.png', color: '#3b82f6' },
    { id: 'intl', label: strings.intl, desc: strings.intlDesc, img: '/figuras/medios_internacionales.png', color: '#10b981' }
  ];

  const activeData = tabs.find(t => t.id === activeTab);

  return (
    <div style={{ backgroundColor: '#0d1117', borderRadius: '12px', border: '1px solid #30363d', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Tabs Header */}
      <div style={{ display: 'flex', borderBottom: '1px solid #30363d', backgroundColor: '#010409' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.05)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
              color: activeTab === tab.id ? tab.color : '#8b949e',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ color: '#c9d1d9', fontSize: '0.95rem', marginBottom: '20px', textAlign: 'center', maxWidth: '600px' }}>
          {activeData.desc}
        </p>
        
        <div style={{ 
          width: '100%', 
          maxWidth: '800px', 
          backgroundColor: '#000', 
          borderRadius: '8px',
          overflow: 'hidden',
          border: `1px solid ${activeData.color}40`,
          boxShadow: `0 4px 20px ${activeData.color}20`
        }}>
          <img 
            src={activeData.img} 
            alt={activeData.label} 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
        
        <div style={{ marginTop: '15px', color: '#8b949e', fontSize: '0.75rem', fontStyle: 'italic' }}>
          {strings.source}
        </div>
      </div>
    </div>
  );
}

export default function MediaCoverageDashboard({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={<div style={{height: 400, backgroundColor: '#0d1117', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa'}}>Cargando...</div>}>
      {() => <MediaCoverageContent lang={lang} />}
    </BrowserOnly>
  );
}
