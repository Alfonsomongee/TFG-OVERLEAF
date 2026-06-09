import React, { useMemo, useState } from 'react';
import styles from './Annex.module.css';

/**
 * AnnexTabs
 *
 * Pestañas internas para anexos.
 *
 * Props:
 * - tabs: [{ id: string, label: string, content: React.ReactNode }]
 * - defaultTab?: string
 * - ariaLabel?: string
 */
export default function AnnexTabs({
  tabs = [],
  defaultTab,
  ariaLabel = 'Secciones del anexo',
}) {
  const initialTab = defaultTab || tabs[0]?.id || null;
  const [activeTab, setActiveTab] = useState(initialTab);

  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex((tab) => tab.id === activeTab)),
    [tabs, activeTab],
  );

  if (!tabs.length || !activeTab) {
    return null;
  }

  const selectByIndex = (index) => {
    const nextTab = tabs[index];
    if (nextTab) {
      setActiveTab(nextTab.id);
    }
  };

  return (
    <div className={styles.tabsWrapper}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={styles.tabList}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`annex-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`annex-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault();
                  selectByIndex((activeIndex + 1) % tabs.length);
                }

                if (event.key === 'ArrowLeft') {
                  event.preventDefault();
                  selectByIndex((activeIndex - 1 + tabs.length) % tabs.length);
                }

                if (event.key === 'Home') {
                  event.preventDefault();
                  selectByIndex(0);
                }

                if (event.key === 'End') {
                  event.preventDefault();
                  selectByIndex(tabs.length - 1);
                }
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`annex-panel-${tab.id}`}
            aria-labelledby={`annex-tab-${tab.id}`}
            hidden={!isActive}
            className={styles.tabPanel}
          >
            {isActive ? tab.content : null}
          </div>
        );
      })}
    </div>
  );
}
