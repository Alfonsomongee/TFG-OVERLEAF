import React, { useMemo, useState } from 'react';
import styles from './IberianInterconnectionsInteractiveFigure.module.css';
import {
  COUNTRY_PATHS,
  BORDER_PATHS,
  COASTLINE_PATHS,
  ADMIN1_PATHS,
} from '../data/cartography/naturalEarthIberiaPaths';

const STATES = {
  'pyrenees-ac': {
    title: 'Pyrenean AC links',
    metricA: '~870 MW typical physical flow',
    metricB: '~2,700 MW technical transfer capability',
    reading:
      'La frontera AC pirenaica es el principal acoplamiento sincrono con el sistema continental, pero su capacidad efectiva es reducida frente al tamano electrico de la Peninsula.',
  },
  'inelfe-hvdc': {
    title: 'HVDC INELFE-1',
    metricA: '1,000 MW operating',
    metricB: '2,000 MW design',
    reading:
      'El enlace HVDC aporta controlabilidad de flujo y soporte electronico, pero no transmite inercia sincrona entre el sistema iberico y el continental.',
  },
  morocco: {
    title: 'Morocco interconnection',
    metricA: '~314 MW typical physical flow',
    metricB: '~900 MW technical transfer capability',
    reading:
      'La interconexion con Marruecos proporciona una via de apoyo sur, util en reposicion, pero limitada frente a la escala del sistema iberico.',
  },
  ratio: {
    title: 'Iberian "energy island" condition',
    metricA: '~3-5% of installed capacity',
    metricB: 'EU target: 15%',
    reading:
      'La baja ratio de interconexion reduce la capacidad de amortiguar perturbaciones internas mediante apoyo externo, reforzando la condicion de isla energetica.',
  },
};

const OPTIONS = [
  ['ratio', 'Ratio'],
  ['pyrenees-ac', 'Pyrenees AC'],
  ['inelfe-hvdc', 'INELFE-1'],
  ['morocco', 'Morocco'],
];

const SPAIN_PATHS = COUNTRY_PATHS.ESP?.paths || [];
const PORTUGAL_PATHS = COUNTRY_PATHS.PRT?.paths || [];
const ANDORRA_PATHS = COUNTRY_PATHS.AND?.paths || [];
const FRANCE_PATHS = COUNTRY_PATHS.FRA?.paths || [];
const MOROCCO_PATHS = COUNTRY_PATHS.MAR?.paths || [];

const ADMIN_PATHS = (ADMIN1_PATHS || []).flatMap((item) =>
  item.country === 'ES' || item.country === 'PT' ? item.paths || [] : []
);

function cx(...names) {
  return names.filter(Boolean).join(' ');
}

export default function IberianInterconnectionsInteractiveFigure() {
  const [active, setActive] = useState('ratio');
  const current = STATES[active];

  const activeClasses = useMemo(
    () => ({
      ratio: active === 'ratio',
      pyrenees: active === 'pyrenees-ac',
      inelfe: active === 'inelfe-hvdc',
      morocco: active === 'morocco',
    }),
    [active]
  );

  const select = (next) => setActive(next);

  return (
    <figure className={styles.figure}>
      <div className={styles.shell}>
        <div className={styles.mapPane}>
          <svg
            viewBox="20 20 940 760"
            className={styles.map}
            role="img"
            aria-labelledby="iberian-interconnections-title iberian-interconnections-desc"
          >
            <title id="iberian-interconnections-title">
              Iberian interconnections and energy island condition
            </title>
            <desc id="iberian-interconnections-desc">
              Technical map of the Iberian Peninsula, France and Morocco showing Pyrenean AC links,
              HVDC INELFE-1, the Morocco interconnection and the interconnection ratio versus the EU target.
            </desc>

            <rect x="0" y="0" width="1000" height="800" className={styles.ocean} />

            <g aria-hidden="true">
              {[140, 260, 380, 500, 620, 740, 860].map((x) => (
                <path key={`v-${x}`} d={`M${x},0 L${x},800`} className={styles.grid} />
              ))}
              {[120, 240, 360, 480, 600, 720].map((y) => (
                <path key={`h-${y}`} d={`M0,${y} L1000,${y}`} className={styles.grid} />
              ))}
            </g>

            <g>
              {FRANCE_PATHS.map((d, i) => (
                <path key={`fr-${i}`} d={d} className={styles.neighborLand} />
              ))}
              {MOROCCO_PATHS.map((d, i) => (
                <path key={`ma-${i}`} d={d} className={styles.neighborLand} />
              ))}
              {SPAIN_PATHS.map((d, i) => (
                <path key={`es-${i}`} d={d} className={styles.mainLand} />
              ))}
              {PORTUGAL_PATHS.map((d, i) => (
                <path key={`pt-${i}`} d={d} className={styles.mainLand} />
              ))}
              {ANDORRA_PATHS.map((d, i) => (
                <path key={`ad-${i}`} d={d} className={styles.mainLand} />
              ))}
            </g>

            <g aria-hidden="true">
              {ADMIN_PATHS.map((d, i) => (
                <path key={`admin-${i}`} d={d} className={styles.adminLine} />
              ))}
              {BORDER_PATHS.map((d, i) => (
                <path key={`border-${i}`} d={d} className={styles.borderLine} />
              ))}
              {COASTLINE_PATHS.map((d, i) => (
                <path key={`coast-${i}`} d={d} className={styles.coastLine} />
              ))}
            </g>

            <g className={styles.labels} aria-hidden="true">
              <text x="742" y="90">France · RTE</text>
              <text x="115" y="522">Portugal</text>
              <text x="438" y="416">Spain</text>
              <text x="300" y="772">Morocco · ONEE</text>
              <text x="296" y="340" className={styles.majorLabel}>Iberian Peninsula</text>
            </g>

            <g className={styles.interconnections}>
              <path
                d="M 485,210 L 505,188"
                className={cx(styles.link, styles.acLink, activeClasses.pyrenees && styles.activeLink)}
                onMouseEnter={() => select('pyrenees-ac')}
                onClick={() => select('pyrenees-ac')}
              />
              <path
                d="M 595,225 L 610,195"
                className={cx(styles.link, styles.acLink, activeClasses.pyrenees && styles.activeLink)}
                onMouseEnter={() => select('pyrenees-ac')}
                onClick={() => select('pyrenees-ac')}
              />
              <path
                d="M 710,234 L 720,210"
                className={cx(styles.link, styles.acLink, activeClasses.pyrenees && styles.activeLink)}
                onMouseEnter={() => select('pyrenees-ac')}
                onClick={() => select('pyrenees-ac')}
              />
              <g className={cx(styles.terminals, activeClasses.pyrenees && styles.activeTerminals)} aria-hidden="true">
                {[
                  [485, 210], [505, 188], [595, 225], [610, 195], [710, 234], [720, 210],
                ].map(([x, y], index) => (
                  <circle key={`py-terminal-${index}`} cx={x} cy={y} r="4" className={styles.acTerminal} />
                ))}
              </g>

              <path
                d="M 775,236 Q 785,227 785,218"
                className={cx(styles.link, styles.hvdcLink, activeClasses.inelfe && styles.activeLink)}
                onMouseEnter={() => select('inelfe-hvdc')}
                onClick={() => select('inelfe-hvdc')}
              />
              <g className={cx(styles.terminals, activeClasses.inelfe && styles.activeTerminals)} aria-hidden="true">
                <circle cx="775" cy="236" r="4" className={styles.hvdcTerminal} />
                <circle cx="785" cy="218" r="4" className={styles.hvdcTerminal} />
              </g>

              <path
                d="M 290,648 Q 285,662 290,675"
                className={cx(styles.link, styles.moroccoLink, activeClasses.morocco && styles.activeLink)}
                onMouseEnter={() => select('morocco')}
                onClick={() => select('morocco')}
              />
              <g className={cx(styles.terminals, activeClasses.morocco && styles.activeTerminals)} aria-hidden="true">
                <circle cx="290" cy="648" r="4" className={styles.moroccoTerminal} />
                <circle cx="290" cy="675" r="4" className={styles.moroccoTerminal} />
              </g>
            </g>

            <g
              className={cx(styles.ratioBadge, activeClasses.ratio && styles.activeRatio)}
              onMouseEnter={() => select('ratio')}
              onClick={() => select('ratio')}
              aria-hidden="true"
            >
              <rect x="48" y="42" width="210" height="84" rx="6" />
              <text x="62" y="66" className={styles.badgeTitle}>Interconnection ratio</text>
              <text x="62" y="91">Iberia: ~3-5%</text>
              <text x="62" y="112">EU target: 15%</text>
              <path d="M 170,92 L 242,92" className={styles.ratioTrack} />
              <path d="M 170,92 L 194,92" className={styles.ratioValue} />
              <path d="M 170,113 L 242,113" className={styles.ratioTrack} />
              <path d="M 170,113 L 242,113" className={styles.ratioTarget} />
            </g>

            <g className={styles.callouts} aria-hidden="true">
              <text x="390" y="168">Pyrenean AC links</text>
              <path d="M 533,172 L 596,212" />
              <text x="724" y="284">HVDC INELFE-1</text>
              <path d="M 790,272 L 782,229" />
              <text x="360" y="710">Morocco interconnection</text>
              <path d="M 470,704 L 292,661" />
            </g>
          </svg>
        </div>

        <aside className={styles.infoPanel} aria-live="polite">
          <div key={active} className={styles.panelContent}>
            <p className={styles.kicker}>Selected layer</p>
            <h3>{current.title}</h3>
            <dl className={styles.metrics}>
              <div>
                <dt>Measure</dt>
                <dd>{current.metricA}</dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>{current.metricB}</dd>
              </div>
            </dl>
            <p className={styles.reading}>{current.reading}</p>
          </div>
          <div className={styles.controls} aria-label="Seleccionar capa de interconexion">
            {OPTIONS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={styles.controlButton}
                data-active={active === key ? 'true' : 'false'}
                aria-pressed={active === key}
                onClick={() => select(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <figcaption className={styles.caption}>
        <strong>Figura B2.</strong> Interconexiones funcionales del sistema iberico y condicion de isla energetica.
        La baja capacidad de transferencia exterior limita el soporte dinamico importable desde los sistemas vecinos.
      </figcaption>
    </figure>
  );
}
