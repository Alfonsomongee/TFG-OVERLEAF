import { useMemo } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import * as es from './forensicCharts';
import * as en from './forensicCharts_en';
import * as pt from './forensicCharts_pt';
import * as fr from './forensicCharts_fr';
import * as it from './forensicCharts_it';
import * as de from './forensicCharts_de';

const LOCALES = { es, en, pt, fr, it, de };

export function useForensicData() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n?.currentLocale || 'es';
  return useMemo(() => LOCALES[locale] || LOCALES.es, [locale]);
}
