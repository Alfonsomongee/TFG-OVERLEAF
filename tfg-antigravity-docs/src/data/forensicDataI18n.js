import { useMemo } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import * as es from './forensicData';
import * as en from './forensicData_en';
import * as pt from './forensicData_pt';
import * as fr from './forensicData_fr';
import * as it from './forensicData_it';
import * as de from './forensicData_de';

const LOCALES = { es, en, pt, fr, it, de };

export function useForensicDataTablas() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n?.currentLocale || 'es';
  return useMemo(() => LOCALES[locale] || LOCALES.es, [locale]);
}
