#!/usr/bin/env node
/**
 * compress-esios-to-charts.js
 * 
 * Convierte cualquier JSON de ESIOS/REE en un formato ultra-ligero
 * listo para gráficas con Recharts (series temporales o categorías).
 * 
 * Uso: node compress-esios-to-charts.js
 * 
 * Lee todos los .json del directorio actual (o de ./raw)
 * Genera versiones *_compressed.json en ./compressed
 */

const fs = require('fs');
const path = require('path');

// Configuración
const INPUT_DIR = fs.existsSync('./raw') ? './raw' : '.';
const OUTPUT_DIR = './compressed';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ─────────────────────────────────────────────────────────────
// 1. Detectar tipo de archivo por nombre o por muestra
// ─────────────────────────────────────────────────────────────
function detectType(filename, firstItem) {
  const name = filename.toLowerCase();
  if (name.includes('generacion-y-consumo') || name.includes('demanda') || name.includes('evolucion-demanda'))
    return 'timeseries';
  if (name.includes('mercados-y-precios') || name.includes('precio') || name.includes('spot'))
    return 'price';
  if (name.includes('subasta') || name.includes('capacidad'))
    return 'auction';
  if (name.includes('potencia') || name.includes('instalada'))
    return 'capacity';
  if (firstItem && firstItem.datetime && firstItem.value !== undefined)
    return 'timeseries';
  return 'generic';
}

// ─────────────────────────────────────────────────────────────
// 2. Procesar series temporales (demanda, precio, etc.)
// ─────────────────────────────────────────────────────────────
function processTimeseries(data, filename) {
  // Agrupar por nombre de métrica (si hay varias: "Demanda real", "Demanda programada", etc.)
  const seriesMap = new Map();
  for (const item of data) {
    const metric = item.name || 'value';
    if (!seriesMap.has(metric)) seriesMap.set(metric, []);
    seriesMap.get(metric).push({
      datetime: item.datetime,
      value: Math.round(item.value)
    });
  }
  // Ordenar cada serie por fecha
  for (const [metric, points] of seriesMap.entries()) {
    points.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  }
  const result = {
    meta: {
      source: path.basename(filename, '.json'),
      generated: new Date().toISOString(),
      type: 'timeseries',
      total_points: data.length,
      unique_series: seriesMap.size
    },
    series: Object.fromEntries(seriesMap)
  };
  return result;
}

// ─────────────────────────────────────────────────────────────
// 3. Procesar subastas (Francia/Portugal, mensual/anual, etc.)
// ─────────────────────────────────────────────────────────────
function processAuction(data) {
  const result = {
    meta: { generated: new Date().toISOString(), type: 'auction' },
    france: { monthly: {}, annual: {} },
    portugal: { monthly: {}, quarterly: {}, annual: {} }
  };
  for (const item of data) {
    const name = item.name;
    let country = null;
    if (name.includes('Francia')) country = 'france';
    else if (name.includes('Portugal')) country = 'portugal';
    if (!country) continue;
    let period = null;
    if (name.includes('mensual')) period = 'monthly';
    else if (name.includes('trimestral')) period = 'quarterly';
    else if (name.includes('anual')) period = 'annual';
    if (!period) continue;
    let metric = null;
    if (name.includes('Participantes') && !name.includes('Adjudicatarios')) metric = 'participants';
    else if (name.includes('Adjudicatarios')) metric = 'awardees';
    else if (name.includes('Capacidad asignada')) metric = 'capacity_mw';
    else if (name.includes('Precio')) metric = 'price_eur_mwh';
    if (!metric) continue;
    let direction = null;
    if (name.includes('importador')) direction = 'import';
    else if (name.includes('exportador')) direction = 'export';
    if (!direction) continue;
    if (!result[country][period][metric]) result[country][period][metric] = {};
    result[country][period][metric][direction] = item.value;
  }
  return result;
}

// ─────────────────────────────────────────────────────────────
// 4. Procesar capacidad instalada / potencia
// ─────────────────────────────────────────────────────────────
function processCapacity(data) {
  const snapshot = data.map(item => ({
    tecnologia: item.name,
    mw: Math.round(item.value)
  })).sort((a, b) => b.mw - a.mw);
  return {
    meta: { generated: new Date().toISOString(), type: 'capacity' },
    snapshot
  };
}

// ─────────────────────────────────────────────────────────────
// 5. Genérico: solo elimina ids y geoname repetitivo
// ─────────────────────────────────────────────────────────────
function processGeneric(data) {
  const cleaned = data.map(item => {
    const { id, geoname, ...rest } = item;
    if (rest.value !== undefined) rest.value = Math.round(rest.value);
    return rest;
  });
  return {
    meta: { generated: new Date().toISOString(), type: 'generic' },
    data: cleaned
  };
}

// ─────────────────────────────────────────────────────────────
// 6. MAIN: procesar todos los archivos
// ─────────────────────────────────────────────────────────────
function main() {
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json') && !f.includes('_compressed'));
  console.log(`📁 Procesando ${files.length} archivos desde ${INPUT_DIR}\n`);
  for (const file of files) {
    const fullPath = path.join(INPUT_DIR, file);
    let json;
    try {
      json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    } catch (e) {
      console.log(`❌ Error parseando ${file}: ${e.message}`);
      continue;
    }
    let dataArray = Array.isArray(json) ? json : (json.included || json.data || []);
    if (dataArray.length === 0) {
      console.log(`⚠️  ${file} no contiene datos aprovechables`);
      continue;
    }
    const type = detectType(file, dataArray[0]);
    let processed;
    switch (type) {
      case 'timeseries':
        processed = processTimeseries(dataArray, file);
        break;
      case 'auction':
        processed = processAuction(dataArray);
        break;
      case 'capacity':
        processed = processCapacity(dataArray);
        break;
      default:
        processed = processGeneric(dataArray);
    }
    const outName = file.replace(/\.json$/, '_compressed.json');
    const outPath = path.join(OUTPUT_DIR, outName);
    fs.writeFileSync(outPath, JSON.stringify(processed, null, 2));
    const origSize = (fs.statSync(fullPath).size / 1024).toFixed(1);
    const newSize = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log(`✅ ${outName} (${origSize} KB → ${newSize} KB) - tipo: ${type}`);
  }
  console.log(`\n🎉 Compresión completada. Archivos en: ${OUTPUT_DIR}`);
}

main();