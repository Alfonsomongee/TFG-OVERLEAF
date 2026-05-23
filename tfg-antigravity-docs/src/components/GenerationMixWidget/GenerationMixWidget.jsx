import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './GenerationMixWidget.module.css';

const GenerationMixWidget = () => {
  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const dataUrl = useBaseUrl('/data/generation_mix_28A.json');

  const { i18n: { currentLocale } } = useDocusaurusContext();

  const T = {
    es: {
      error: "ERROR CRÍTICO: DATOS DE GENERACIÓN OFFLINE",
      loading: "Cargando...",
      title: "MIX DE GENERACIÓN Y DÉFICIT DE INERCIA",
      subtitle: "12:30 CEST — Estado Pre-Colapso",
      renPen: "PENETRACIÓN RENOVABLE",
      ibr: "Recursos basados en inversores (IBR)",
      inertia: "INERCIA DEL SISTEMA (H)",
      criticalLow: "Críticamente Baja (Seguro > 4.5s)",
      degrad: "DEGRADACIÓN DE INERCIA",
      compared: "Comparado con el promedio histórico de primavera"
    },
    en: {
      error: "CRITICAL ERROR: GENERATION MIX DATA OFFLINE",
      loading: "Loading...",
      title: "GENERATION MIX & INERTIA DEFICIT",
      subtitle: "12:30 CEST — Pre-Collapse State",
      renPen: "RENEWABLE PENETRATION",
      ibr: "Inverter-Based Resources (IBR)",
      inertia: "SYSTEM INERTIA (H)",
      criticalLow: "Critically Low (Safe > 4.5s)",
      degrad: "INERTIA DEGRADATION",
      compared: "Compared to historical spring avg"
    },
    pt: {
      error: "ERRO CRÍTICO: DADOS DE GERAÇÃO OFFLINE",
      loading: "Carregando...",
      title: "MIX DE GERAÇÃO E DÉFICIT DE INÉRCIA",
      subtitle: "12:30 CEST — Estado Pré-Colapso",
      renPen: "PENETRAÇÃO RENOVÁVEL",
      ibr: "Recursos Baseados em Inversores (IBR)",
      inertia: "INÉRCIA DO SISTEMA (H)",
      criticalLow: "Criticamente Baixa (Seguro > 4.5s)",
      degrad: "DEGRADAÇÃO DE INÉRCIA",
      compared: "Comparado à média histórica de primavera"
    },
    fr: {
      error: "ERREUR CRITIQUE : DONNÉES DE GÉNÉRATION HORS LIGNE",
      loading: "Chargement...",
      title: "MIX DE GÉNÉRATION ET DÉFICIT D'INERTIE",
      subtitle: "12:30 CEST — État Pré-Effondrement",
      renPen: "PÉNÉTRATION RENOUVELABLE",
      ibr: "Ressources basées sur des onduleurs (IBR)",
      inertia: "INERTIE DU SYSTÈME (H)",
      criticalLow: "Critiquement Faible (Sûr > 4.5s)",
      degrad: "DÉGRADATION D'INERTIE",
      compared: "Par rapport à la moyenne historique du printemps"
    },
    it: {
      error: "ERRORE CRITICO: DATI DI GENERAZIONE OFFLINE",
      loading: "Caricamento...",
      title: "MIX DI GENERAZIONE E DEFICIT DI INERZIA",
      subtitle: "12:30 CEST — Stato Pre-Collasso",
      renPen: "PENETRAZIONE RINNOVABILE",
      ibr: "Risorse basate su inverter (IBR)",
      inertia: "INERZIA DEL SISTEMA (H)",
      criticalLow: "Criticamente Bassa (Sicuro > 4.5s)",
      degrad: "DEGRADO DELL'INERZIA",
      compared: "Rispetto alla media storica primaverile"
    },
    de: {
      error: "KRITISCHER FEHLER: ERZEUGUNGSDATEN OFFLINE",
      loading: "Wird geladen...",
      title: "ERZEUGUNGSMIX & TRÄGHEITSDEFIZIT",
      subtitle: "12:30 CEST — Zustand vor dem Kollaps",
      renPen: "ERNEUERBARE DURCHDRINGUNG",
      ibr: "Wechselrichterbasierte Ressourcen (IBR)",
      inertia: "SYSTEMTRÄGHEIT (H)",
      criticalLow: "Kritisch Niedrig (Sicher > 4,5s)",
      degrad: "TRÄGHEITSDEGRADATION",
      compared: "Im Vergleich zum historischen Frühlingsdurchschnitt"
    }
  };

  const t = T[currentLocale] || T.en;

  useEffect(() => {
    fetch(dataUrl)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setHasError(false);
      })
      .catch(err => {
        console.error('Error loading generation mix data:', err);
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

  if (!data) return <div className={styles.container}>{t.loading}</div>;

  const chartData = data.generation_mix.map(item => ({
    name: item.technology.split(' (')[0], // Simplify names
    value: item.capacity_mw,
    inertia: item.inertia_constant_h_seconds,
    type: item.grid_interaction_type.includes('inverters') ? 'ibr' : 'sync'
  }));

  // Forensic Amber Palette using CSS variables
  const COLORS = {
    ibr: ['var(--forensic-amber-warning)', 'var(--forensic-amber-primary)'],
    sync: ['var(--forensic-sync-1)', 'var(--forensic-sync-2)', 'var(--forensic-sync-3)']
  };

  let ibrCount = 0;
  let syncCount = 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t.title}</h3>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => {
                  const colorList = entry.type === 'ibr' ? COLORS.ibr : COLORS.sync;
                  const colorIndex = entry.type === 'ibr' ? ibrCount++ : syncCount++;
                  return <Cell key={`cell-${index}`} fill={colorList[colorIndex % colorList.length]} />;
                })}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--forensic-bg-primary)', border: '1px solid var(--forensic-border-strong)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--telemetry-font)' }}
                itemStyle={{ color: 'var(--forensic-amber-primary)' }}
                formatter={(value, name, props) => [`${value} MW (H=${props.payload.inertia}s)`, name]}
              />
              <Legend wrapperStyle={{ fontFamily: 'var(--telemetry-font)', fontSize: 'var(--telemetry-xs)', color: 'var(--forensic-text-secondary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>{t.renPen}</div>
            <div className={styles.statValue}>{data.renewable_penetration_percent}%</div>
            <div className={styles.statSub}>{t.ibr}</div>
          </div>
          
          <div className={styles.statBox}>
            <div className={styles.statLabel}>{t.inertia}</div>
            <div className={`${styles.statValue} ${styles.critical}`}>{data.equivalent_system_inertia_h_weighted}s</div>
            <div className={styles.statSub}>{t.criticalLow}</div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statLabel}>{t.degrad}</div>
            <div className={`${styles.statValue} ${styles.warning}`}>-{data.inertia_degradation_percent}%</div>
            <div className={styles.statSub}>{t.compared}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationMixWidget;
