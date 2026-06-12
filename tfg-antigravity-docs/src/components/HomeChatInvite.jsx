import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './HomeChatInvite.module.css';

const TRANSLATIONS = {
  es: {
    eyebrow: 'Asistente pericial',
    heading: 'Pregunta directamente\nal análisis forense',
    desc: 'El chatbot RAG tiene indexadas las 170 evidencias, los 28 simuladores y los capítulos del TFG. Responde con cadenas causales, cifras exactas y enlaces directos a las secciones relevantes.',
    note: 'Disponible en la esquina inferior derecha de cualquier página.',
    terminalTitle: 'Asistente del TFG — Apagón 28A',
    welcome: 'Hola. Soy el asistente pericial del TFG sobre el apagón del 28-A. Pregúntame sobre causas técnicas, evidencias, cifras o fuentes documentales.',
    suggestions: [
      '¿Por qué el UFLS agravó el colapso?',
      '¿Cuántos MW se perdieron en la cascada?',
      '¿Qué diferencia hay entre GFL y GFM?',
      '¿Por qué colapsó el sistema si había energía suficiente?',
    ]
  },
  en: {
    eyebrow: 'Expert assistant',
    heading: 'Ask the forensic\nanalysis directly',
    desc: 'The RAG chatbot has indexed all 170 pieces of evidence, 28 simulators, and the thesis chapters. It responds with causal chains, exact figures, and direct links to the relevant sections.',
    note: 'Available in the bottom-right corner of any page.',
    terminalTitle: 'Thesis Assistant — 28A Blackout',
    welcome: 'Hello. I am the expert assistant for the thesis on the 28-A blackout. Ask me about technical causes, evidence, figures, or documentary sources.',
    suggestions: [
      'Why did UFLS aggravate the collapse?',
      'How many MW were lost in the cascade?',
      'What is the difference between GFL and GFM?',
      'Why did the system collapse if there was enough energy?',
    ]
  },
  de: {
    eyebrow: 'Gutachterlicher Assistent',
    heading: 'Fragen Sie die forensische\nAnalyse direkt',
    desc: 'Der RAG-Chatbot hat die 170 Nachweise, die 28 Simulatoren und die Kapitel der Arbeit indexiert. Er antwortet mit Kausalketten, exakten Zahlen und direkten Links zu den relevanten Abschnitten.',
    note: 'Verfügbar in der unteren rechten Ecke jeder Seite.',
    terminalTitle: 'Abschlussarbeits-Assistent — 28A Blackout',
    welcome: 'Hallo. Ich bin der gutachterliche Assistent für die Arbeit über den 28-A-Blackout. Fragen Sie mich nach technischen Ursachen, Nachweisen, Zahlen oder dokumentarischen Quellen.',
    suggestions: [
      'Warum hat der UFLS-Lastabwurf den Zusammenbruch verschlimmert?',
      'Wie viele MW gingen in der Kaskade verloren?',
      'Was ist der Unterschied zwischen GFL und GFM?',
      'Warum brach das System zusammen, obwohl genügend Energie vorhanden war?',
    ]
  },
  'zh-Hans': {
    eyebrow: '专家级AI助手',
    heading: '直接提问法医分析',
    desc: '本项目的检索增强（RAG）聊天机器人已完整索引了170项实证证据、28个模拟器和论文的所有章节。它可以快速回答故障的因果链条、精确数据，并提供直达相关章节的链接。',
    note: '在任何页面的右下角均可使用。',
    terminalTitle: '毕业设计AI助手 — 28A大停电',
    welcome: '您好！我是关于28-A大停电毕业设计的法医分析助手。您可以向我咨询任何技术原因、实证数据、图表或文献来源。',
    suggestions: [
      '为什么低频减载（UFLS）反而加剧了系统崩溃？',
      '电网级联跳闸中共损失了多少兆瓦的容量？',
      '跟网型（GFL）和构网型（GFM）逆变器有什么区别？',
      '既然当时系统备用容量充足，为什么还会发生全网崩溃？',
    ]
  }
};

export default function HomeChatInvite() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h2 className={styles.heading}>
            {t.heading.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < t.heading.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p className={styles.desc}>{t.desc}</p>
          <p className={styles.note}>{t.note}</p>
        </div>
        <div className={styles.right}>
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <span className={styles.dot} style={{ background: '#ff5f57' }} />
              <span className={styles.dot} style={{ background: '#febc2e' }} />
              <span className={styles.dot} style={{ background: '#28c840' }} />
              <span className={styles.terminalTitle}>{t.terminalTitle}</span>
            </div>
            <div className={styles.terminalBody}>
              <div className={styles.msg}>
                <span className={styles.msgLabel}>asistente</span>
                <span className={styles.msgText}>{t.welcome}</span>
              </div>
              <div className={styles.suggestions}>
                {t.suggestions.map((s) => (
                  <button
                    key={s}
                    className={styles.suggestion}
                    tabIndex={-1}
                    disabled
                    aria-hidden="true"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
