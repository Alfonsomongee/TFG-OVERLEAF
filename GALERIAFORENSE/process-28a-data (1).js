#!/usr/bin/env node
/**
 * process-28a-data.js
 * Procesador de exports ESIOS/REE → JSONs reducidos para GalleryForensic
 *
 * USO:
 *   1. Coloca este script junto a los JSONs exportados de ESIOS
 *   2. node process-28a-data.js
 *   3. Copia la carpeta output/ → src/data/processed/
 *
 * INPUTS esperados (en la misma carpeta o subcarpeta ./raw/):
 *   - export_evolucion-demanda_2025-04-28*.json
 *   - export_generacion-y-consumo_2025-04-28*.json
 *   - export_generacion-medida_2025-04-28*.json
 *   - export_generacion-medida_2025-04-29*.json
 *   - export_balance-electrico_2025-04-28*.json
 *   - export_potencia_2025-04-28*.json
 *   - export_potencia_2025-04-29*.json
 *   - export_mercados-y-precios_2025-04-28*.json
 *   - export_otros-indicadores_2025-04-28*.json
 *   (los demás se ignoran)
 *
 * OUTPUT → ./output/
 *   - 28A_demand.json
 *   - 28A_generation_mix.json
 *   - 28A_price.json
 *   - 28A_balance.json
 *   - 28A_capacity.json
 *   - gallery-index.json
 */

const fs   = require('fs');
const path = require('path');

// ─── CONFIG ────────────────────────────────────────────────────────────────
const RAW_DIR    = fs.existsSync('./raw') ? './raw' : '.';
const OUTPUT_DIR = './output';
const BLACKOUT   = new Date('2025-04-28T12:33:00+02:00');
const RECOVERY   = new Date('2025-04-29T10:00:00+02:00');

// Ventana de análisis: 27-A 20:00 → 29-A 10:00
const WINDOW_START = new Date('2025-04-27T20:00:00+02:00');
const WINDOW_END   = new Date('2025-04-29T10:00:00+02:00');

// ─── HELPERS ───────────────────────────────────────────────────────────────

function readJsonFiles(pattern) {
  const files = fs.readdirSync(RAW_DIR).filter(f => f.includes(pattern) && f.endsWith('.json'));
  if (files.length === 0) return [];
  // Merge todos los archivos que coincidan (ej: 28 + 29)
  let merged = [];
  for (const f of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(RAW_DIR, f), 'utf8'));
    // ESIOS puede venir como array plano o como {included:[...]} o {data:[...]}
    const arr = Array.isArray(raw) ? raw
              : raw.included ? raw.included
              : raw.data     ? raw.data
              : [];
    merged = merged.concat(arr);
  }
  return merged;
}

function inWindow(datetimeStr) {
  const d = new Date(datetimeStr);
  return d >= WINDOW_START && d <= WINDOW_END;
}

function faseOf(datetimeStr) {
  const d = new Date(datetimeStr);
  if (d < new Date('2025-04-28T12:00:00+02:00')) return 'normal';
  if (d < new Date('2025-04-28T12:32:00+02:00')) return 'inestable';
  if (d < new Date('2025-04-28T12:35:00+02:00')) return 'colapso';
  if (d < new Date('2025-04-28T13:05:00+02:00')) return 'blackout';
  return 'recuperacion';
}

function shortLabel(datetimeStr) {
  // "2025-04-28T12:33:00+02:00" → "28-A 12:33"
  const d   = new Date(datetimeStr);
  const dia = d.getDate();
  const mes = d.getMonth() + 1; // abril = 4
  const hh  = String(d.getHours()).padStart(2, '0');
  const mm  = String(d.getMinutes()).padStart(2, '0');
  const diaLabel = dia === 28 ? '28-A' : dia === 29 ? '29-A' : `${dia}-A`;
  return `${diaLabel} ${hh}:${mm}`;
}

function write(filename, data) {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const fpath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(fpath, JSON.stringify(data, null, 2), 'utf8');
  const kb = (fs.statSync(fpath).size / 1024).toFixed(1);
  console.log(`  ✅ ${filename} — ${Array.isArray(data) ? data.length : Object.keys(data).length} entradas — ${kb} KB`);
}

// ─── PROCESADORES ──────────────────────────────────────────────────────────

/**
 * 1. DEMANDA — export_evolucion-demanda
 * Produce: [{t, mw, fase}]
 * Filtra ventana + resolución 15 min (coge solo :00 y :30 para no inflar)
 */
function processDemand() {
  console.log('\n📊 Procesando demanda...');
  const raw = readJsonFiles('evolucion-demanda');
  if (!raw.length) { console.log('  ⚠️  No encontrado — usando fallback'); return false; }

  // ESIOS demanda tiene varios "name": filtramos "Demanda real"
  const filtered = raw
    .filter(r => inWindow(r.datetime))
    .filter(r => r.name && (
      r.name.toLowerCase().includes('demanda real') ||
      r.name.toLowerCase().includes('real demand') ||
      r.name.toLowerCase().includes('demanda')
    ))
    // Resolución: cada 15 min (minutos 00 y 30 y 15 y 45 ya son 15min nativos en ESIOS)
    .map(r => ({
      t:    shortLabel(r.datetime),
      iso:  r.datetime,
      mw:   Math.round(r.value),
      fase: faseOf(r.datetime),
    }))
    .sort((a, b) => new Date(a.iso) - new Date(b.iso));

  // Eliminar duplicados de datetime
  const seen = new Set();
  const deduped = filtered.filter(r => {
    if (seen.has(r.iso)) return false;
    seen.add(r.iso);
    return true;
  });

  write('28A_demand.json', deduped);
  return true;
}

/**
 * 2. MIX DE GENERACIÓN — export_generacion-y-consumo + export_generacion-medida
 * Produce: [{t, iso, solar, wind, nuclear, hydro, gas, coal, other, total}]
 * Un punto cada hora (suficiente para el gráfico de área apilada)
 */
function processGenerationMix() {
  console.log('\n⚡ Procesando mix de generación...');
  const raw = [
    ...readJsonFiles('generacion-y-consumo'),
    ...readJsonFiles('generacion-medida'),
  ];
  if (!raw.length) { console.log('  ⚠️  No encontrado'); return false; }

  // Agrupamos por datetime, luego por "name" (tecnología)
  const byDatetime = {};
  raw
    .filter(r => inWindow(r.datetime))
    .forEach(r => {
      const key = r.datetime;
      if (!byDatetime[key]) byDatetime[key] = { iso: key, t: shortLabel(key) };
      const name = (r.name || '').toLowerCase();
      // Mapeo de nombres ESIOS → categorías
      if (name.includes('solar fotovoltaica') || name.includes('solar fotov'))
        byDatetime[key].solar_pv  = (byDatetime[key].solar_pv  || 0) + (r.value || 0);
      else if (name.includes('solar térmica') || name.includes('termosolar'))
        byDatetime[key].solar_th  = (byDatetime[key].solar_th  || 0) + (r.value || 0);
      else if (name.includes('eólica') || name.includes('eolica') || name.includes('wind'))
        byDatetime[key].wind      = (byDatetime[key].wind      || 0) + (r.value || 0);
      else if (name.includes('nuclear'))
        byDatetime[key].nuclear   = (byDatetime[key].nuclear   || 0) + (r.value || 0);
      else if (name.includes('hidráulica') || name.includes('hidraulica') || name.includes('hydro'))
        byDatetime[key].hydro     = (byDatetime[key].hydro     || 0) + (r.value || 0);
      else if (name.includes('ciclo combinado') || name.includes('gas'))
        byDatetime[key].gas       = (byDatetime[key].gas       || 0) + (r.value || 0);
      else if (name.includes('carbón') || name.includes('carbon') || name.includes('coal'))
        byDatetime[key].coal      = (byDatetime[key].coal      || 0) + (r.value || 0);
      else if (name.includes('cogeneración') || name.includes('cogen'))
        byDatetime[key].cogen     = (byDatetime[key].cogen     || 0) + (r.value || 0);
      else if (name.includes('generación total') || name.includes('total'))
        byDatetime[key].total_raw = r.value || 0;
    });

  const result = Object.values(byDatetime)
    .map(r => {
      const solar = Math.round((r.solar_pv || 0) + (r.solar_th || 0));
      const wind  = Math.round(r.wind    || 0);
      const nuc   = Math.round(r.nuclear || 0);
      const hyd   = Math.round(r.hydro   || 0);
      const gas   = Math.round(r.gas     || 0);
      const coal  = Math.round(r.coal    || 0);
      const cogen = Math.round(r.cogen   || 0);
      const total = solar + wind + nuc + hyd + gas + coal + cogen;
      return {
        t: r.t, iso: r.iso,
        solar, wind, nuclear: nuc, hydro: hyd, gas, coal, cogen,
        total: total || Math.round(r.total_raw || 0),
        fase: faseOf(r.iso),
        // % renovable
        pct_renovable: total > 0 ? Math.round((solar + wind + hyd) / total * 100) : 0,
      };
    })
    .sort((a, b) => new Date(a.iso) - new Date(b.iso));

  // Downsample a cada hora (coge el primero de cada hora)
  const hourly = [];
  const seenH  = new Set();
  for (const r of result) {
    const hkey = r.iso.slice(0, 13); // "2025-04-28T12"
    if (!seenH.has(hkey)) { seenH.add(hkey); hourly.push(r); }
  }

  write('28A_generation_mix.json', hourly);
  return true;
}

/**
 * 3. PRECIO SPOT — export_mercados-y-precios o export_precio-final-energia
 * Produce: [{t, iso, eur_mwh, fase}]
 */
function processPrice() {
  console.log('\n💶 Procesando precio SPOT...');
  const raw = [
    ...readJsonFiles('mercados-y-precios'),
    ...readJsonFiles('precio-final-energia'),
    ...readJsonFiles('Mercado-spot-diario'),
  ];
  if (!raw.length) { console.log('  ⚠️  No encontrado'); return false; }

  const filtered = raw
    .filter(r => inWindow(r.datetime))
    .filter(r => {
      const n = (r.name || '').toLowerCase();
      return n.includes('precio') || n.includes('spot') || n.includes('price');
    })
    .map(r => ({
      t:       shortLabel(r.datetime),
      iso:     r.datetime,
      eur_mwh: Math.round(r.value * 100) / 100,
      fase:    faseOf(r.datetime),
    }))
    .sort((a, b) => new Date(a.iso) - new Date(b.iso));

  const seen = new Set();
  const deduped = filtered.filter(r => {
    if (seen.has(r.iso)) return false;
    seen.add(r.iso);
    return true;
  });

  write('28A_price.json', deduped);
  return true;
}

/**
 * 4. BALANCE ELÉCTRICO — export_balance-electrico
 * Produce: [{t, iso, generacion, demanda, saldo_inter, fase}]
 */
function processBalance() {
  console.log('\n⚖️  Procesando balance eléctrico...');
  const raw = readJsonFiles('balance-electrico');
  if (!raw.length) { console.log('  ⚠️  No encontrado'); return false; }

  const byDatetime = {};
  raw
    .filter(r => inWindow(r.datetime))
    .forEach(r => {
      const key = r.datetime;
      if (!byDatetime[key]) byDatetime[key] = { iso: key, t: shortLabel(key) };
      const name = (r.name || '').toLowerCase();
      if (name.includes('generación') || name.includes('generacion'))
        byDatetime[key].generacion = r.value;
      else if (name.includes('demanda'))
        byDatetime[key].demanda = r.value;
      else if (name.includes('saldo') || name.includes('intercambio'))
        byDatetime[key].saldo_inter = r.value;
    });

  const result = Object.values(byDatetime)
    .map(r => ({
      t:          r.t,
      iso:        r.iso,
      generacion: Math.round(r.generacion || 0),
      demanda:    Math.round(r.demanda    || 0),
      saldo_inter: Math.round(r.saldo_inter || 0),
      fase:       faseOf(r.iso),
    }))
    .sort((a, b) => new Date(a.iso) - new Date(b.iso));

  write('28A_balance.json', result);
  return true;
}

/**
 * 5. POTENCIA INSTALADA — export_potencia
 * Produce: snapshot de capacidad instalada por tecnología
 */
function processCapacity() {
  console.log('\n🔋 Procesando potencia instalada...');
  const raw = readJsonFiles('potencia');
  if (!raw.length) { console.log('  ⚠️  No encontrado'); return false; }

  // Solo el snapshot más cercano al 28-A mediodía
  const target = new Date('2025-04-28T12:00:00+02:00');
  const byName = {};
  raw.forEach(r => {
    const d = new Date(r.datetime);
    const name = r.name || 'other';
    if (!byName[name] || Math.abs(d - target) < Math.abs(new Date(byName[name].datetime) - target)) {
      byName[name] = r;
    }
  });

  const snapshot = Object.values(byName).map(r => ({
    tecnologia: r.name,
    mw:         Math.round(r.value),
  })).sort((a, b) => b.mw - a.mw);

  write('28A_capacity.json', snapshot);
  return true;
}

/**
 * 6. GALLERY INDEX — metadatos de todos los archivos generados
 */
function buildIndex(generated) {
  console.log('\n📑 Generando gallery-index.json...');
  const index = {
    generated_at: new Date().toISOString(),
    version: '2.0',
    incident: {
      name: 'Apagón Ibérico 28-A',
      date: '2025-04-28',
      blackout_start: '2025-04-28T12:33:00+02:00',
      blackout_end:   '2025-04-28T13:05:00+02:00',
      recovery_end:   '2025-04-29T09:30:00+02:00',
    },
    files: {
      demand:         { file: '28A_demand.json',         available: generated.demand,     description: 'Demanda real peninsular 5-15 min' },
      generation_mix: { file: '28A_generation_mix.json', available: generated.gen,        description: 'Mix de generación por tecnología (horario)' },
      price:          { file: '28A_price.json',          available: generated.price,      description: 'Precio SPOT mercado diario (€/MWh)' },
      balance:        { file: '28A_balance.json',        available: generated.balance,    description: 'Balance generación-demanda-intercambios' },
      capacity:       { file: '28A_capacity.json',       available: generated.capacity,   description: 'Potencia instalada snapshot 28-A' },
    },
  };
  write('gallery-index.json', index);
}

// ─── MAIN ──────────────────────────────────────────────────────────────────

console.log('╔══════════════════════════════════════════════╗');
console.log('║  Procesador ESIOS → GalleryForensic 28-A    ║');
console.log('║  v2.0                                        ║');
console.log('╚══════════════════════════════════════════════╝');
console.log(`\nBuscando JSONs en: ${path.resolve(RAW_DIR)}`);
console.log(`Output en:        ${path.resolve(OUTPUT_DIR)}\n`);

const generated = {
  demand:   processDemand(),
  gen:      processGenerationMix(),
  price:    processPrice(),
  balance:  processBalance(),
  capacity: processCapacity(),
};
buildIndex(generated);

const ok  = Object.values(generated).filter(Boolean).length;
const tot = Object.keys(generated).length;
console.log(`\n✨ Completado: ${ok}/${tot} datasets procesados`);
console.log(`\n👉 Copia output/ → src/data/processed/ en tu proyecto Docusaurus`);
console.log('👉 En GalleryForensic.jsx, los loaders leerán automáticamente estos archivos\n');
