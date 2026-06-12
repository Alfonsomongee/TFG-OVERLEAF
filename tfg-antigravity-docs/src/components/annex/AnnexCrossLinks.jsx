import React from 'react';
import Link from '@docusaurus/Link';
import styles from './AnnexCrossLinks.module.css';

export default function AnnexCrossLinks({ links = [] }) {
  if (!links || links.length === 0) return null;

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Anexos Relacionados</h4>
      <ul className={styles.list}>
        {links.map((link, idx) => (
          <li key={idx} className={styles.item}>
            <Link to={link.to} className={styles.link}>
              <span>{link.label}</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
