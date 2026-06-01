import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export function useDocLang() {
  const { i18n } = useDocusaurusContext();
  return i18n?.currentLocale || 'es';
}
