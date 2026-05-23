import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './UFLSVisualizer.module.css';

const UFLSVisualizer = () => {
  const [data, setData] = useState([]);
  const [hasError, setHasError] = useState(false);
  const dataUrl = useBaseUrl('/data/ufls_scheme_iberia.json');

  const { i18n: { currentLocale } } = useDocusaurusContext();

  const T = {
    es: {
      stagePrefix: "Etapa",
      error: "ERROR CRÍTICO: DATOS UFLS OFFLINE",
      title: "ESQUEMA DE CASCADA DE ACTIVACIÓN UFLS",
      subtitle: "Etapas de Deslastre de Carga vs Caída de Frecuencia",
      mwShed: "MW Deslastrados",
      legend1: "Etapa 1 (Activada a 49.0 Hz - Desencadenó cascada de sobretensión)",
      legend2: "Etapas 2-6 (No se activaron antes del colapso)"
    },
    en: {
      stagePrefix: "Stage",
      error: "CRITICAL ERROR: UFLS DATA OFFLINE",
      title: "UFLS ACTIVATION CASCADING SCHEME",
      subtitle: "Load Shedding Stages vs Frequency Decline",
      mwShed: "MW Shed",
      legend1: "Stage 1 (Activated at 49.0 Hz - Triggered Overvoltage Cascade)",
      legend2: "Stages 2-6 (Did not activate before collapse)"
    },
    pt: {
      stagePrefix: "Estágio",
      error: "ERRO CRÍTICO: DADOS UFLS OFFLINE",
      title: "ESQUEMA DE CASCATA DE ATIVAÇÃO UFLS",
      subtitle: "Estágios de Corte de Carga vs Queda de Frequência",
      mwShed: "MW Cortados",
      legend1: "Estágio 1 (Ativado a 49.0 Hz - Desencadeou cascata de sobretensão)",
      legend2: "Estágios 2-6 (Não ativados antes do colapso)"
    },
    fr: {
      stagePrefix: "Étape",
      error: "ERREUR CRITIQUE: DONNÉES UFLS HORS LIGNE",
      title: "SCHÉMA DE CASCADE D'ACTIVATION UFLS",
      subtitle: "Étapes de Délestage vs Baisse de Fréquence",
      mwShed: "MW Délestés",
      legend1: "Étape 1 (Activée à 49.0 Hz - A déclenché une cascade de surtension)",
      legend2: "Étapes 2-6 (Non activées avant l'effondrement)"
    },
    it: {
      stagePrefix: "Fase",
      error: "ERRORE CRITICO: DATI UFLS OFFLINE",
      title: "SCHEMA A CASCATA DI ATTIVAZIONE UFLS",
      subtitle: "Fasi di Distacco Carico vs Calo di Frequenza",
      mwShed: "MW Distaccati",
      legend1: "Fase 1 (Attivata a 49.0 Hz - Ha innescato la cascata di sovratensione)",
      legend2: "Fasi 2-6 (Non attivate prima del collasso)"
    },
    de: {
      stagePrefix: "Stufe",
      error: "KRITISCHER FEHLER: UFLS-DATEN OFFLINE",
      title: "UFLS-AKTIVIERUNGS-KASKADENSCHEMA",
      subtitle: "Lastabwurfstufen vs. Frequenzabfall",
      mwShed: "MW Abgeworfen",
      legend1: "Stufe 1 (Aktiviert bei 49,0 Hz - Löste Überspannungskaskade aus)",
      legend2: "Stufen 2-6 (Wurden vor dem Kollaps nicht aktiviert)"
    }
  };

  const t = T[currentLocale] || T.en;

  useEffect(() => {
    fetch(dataUrl)
      .then(res => res.json())
      .then(json => {
        const formattedData = json.stages.map(stage => ({
          name: `${t.stagePrefix} ${stage.stage}`,
          freq: stage.frequency_hz,
          shed_es: stage.load_shed_mw_spain,
          shed_pt: stage.load_shed_mw_portugal,
          total_shed: stage.load_shed_mw_spain + stage.load_shed_mw_portugal,
          zones: stage.zones_affected.join(', ')
        }));
        setData(formattedData);
        setHasError(false);
      })
      .catch(err => {
        console.error('Error loading UFLS data:', err);
        setHasError(true);
      });
  }, [dataUrl]);

  if (hasError) {
    return (
      <div className={styles.container} style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.errorBox}>
          <h3>{t.error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t.title}</h3>
      <p className={styles.subtitle}>{t.subtitle}</p>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--forensic-border)" horizontal={false} />
          <XAxis type="number" stroke="var(--forensic-border-strong)" tick={{ fill: "var(--forensic-text-secondary)", fontSize: 11, fontFamily: 'var(--telemetry-font)' }} />
          <YAxis dataKey="name" type="category" stroke="var(--forensic-border-strong)" tick={{ fill: "var(--forensic-text-secondary)", fontSize: 11, fontFamily: 'var(--telemetry-font)' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--forensic-bg-primary)', border: '1px solid var(--forensic-border-strong)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--telemetry-font)' }}
            labelStyle={{ color: 'var(--forensic-text-primary)' }}
            itemStyle={{ color: 'var(--forensic-amber-primary)' }}
            cursor={{fill: 'var(--forensic-amber-bg-subtle)'}}
          />
          <Bar dataKey="total_shed" name={t.mwShed} fill="var(--forensic-amber-primary)" barSize={20}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.freq <= 49.0 && entry.freq > 48.8 ? 'var(--forensic-amber-critical)' : 'var(--forensic-amber-muted)'} />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.colorBox} style={{ background: 'var(--forensic-amber-critical)' }}></span>
          <span>{t.legend1}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.colorBox} style={{ background: 'var(--forensic-amber-muted)' }}></span>
          <span>{t.legend2}</span>
        </div>
      </div>
    </div>
  );
};

export default UFLSVisualizer;
