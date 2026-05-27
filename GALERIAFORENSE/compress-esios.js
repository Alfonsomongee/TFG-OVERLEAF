#!/usr/bin/env node
/**
 * compress-esios.js
 * 
 * Reduce el tamaño de los JSONs exportados de ESIOS/REE
 * y los transforma en formatos amigables para gráficas (series temporales,
 * agregaciones por categoría, etc.)
 * 
 * Uso: node compress-esios.js
 * 
 * Procesa todos los .json del directorio actual (o ./raw/) y genera versiones
 * comprimidas en ./compressed/
 */

const fs = require('fs');
const path = require('path');

const INPUT_DIR = fs.existsSync('./raw') ? './raw' : '.';
const OUTPUT_DIR = './compressed';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ---------------------------------------------------------------------
// 1. Detectar tipo de archivo según el nombre o el contenido
// ---------------------------------------------------------------------
function detectType(filename, dataSample) {
  if (filename.includes('subasta') || filename.includes('capacidad')) {
    return 'auction';
  }
  if (filename.includes('demanda') || filename.includes('generacion-y-consumo')) {
    return 'timeseries';
  }
  if (filename.includes('precio') || filename.includes('spot')) {
    return 'price';
  }
  if (filename.includes('potencia')) {
    return 'capacity';
  }
  // Por defecto, si tiene 'datetime' y 'value' es timeseries
  if (dataSample && dataSample.datetime && dataSample.value !== undefined) {
    return 'timeseries';
  }
  return 'generic';
}

// ---------------------------------------------------------------------
// 2. Procesar archivos de subastas explícitas (como el ejemplo)
// ---------------------------------------------------------------------
function processAuction(data) {
  // Agrupar por país (Francia / Portugal) y tipo de subasta (mensual, trimestral, anual)
  const result = {
    meta: { generated: new Date().toISOString(), type: 'auction' },
    france: { monthly: {}, annual: {} },
    portugal: { monthly: {}, quarterly: {}, annual: {} }
  };

  data.forEach(item => {
    const name = item.name;
    const value = item.value;
    // Detectar país
    let country = null;
    if (name.includes('Francia')) country = 'france';
    else if (name.includes('Portugal')) country = 'portugal';
    if (!country) return;

    // Detectar periodicidad
    let period = null;
    if (name.includes('mensual')) period = 'monthly';
    else if (name.includes('trimestral')) period = 'quarterly';
    else if (name.includes('anual')) period = 'annual';
    if (!period) return;

    // Detectar métrica
    let metric = null;
    if (name.includes('Participantes')) metric = 'participants';
    else if (name.includes('Adjudicatarios')) metric = 'awardees';
    else if (name.includes('Capacidad asignada')) metric = 'capacity_mw';
    else if (name.includes('Precio')) metric = 'price_eur_mwh';
    if (!metric) return;

    // Sentido (importador / exportador)
    let direction = null;
    if (name.includes('importador')) direction = 'import';
    else if (name.includes('exportador')) direction = 'export';
    if (!direction) return;

    // Almacenar en la estructura
    if (!result[country][period][metric]) {
      result[country][period][metric] = {};
    }
    result[country][period][metric][direction] = value;
  });

  return result;
}

// ---------------------------------------------------------------------
// 3. Procesar series temporales (demanda, precio, etc.)
// ---------------------------------------------------------------------
function processTimeseries(data) {
  // Asume que cada elemento tiene al menos { datetime, value } y opcionalmente name
  // Ordenar por fecha y eliminar duplicados (misma datetime)
  const sorted = [...data].sort((a,b) => new Date(a.datetime) - new Date(b.datetime));
  const unique = [];
  const seen = new Set();
  for (const item of sorted) {
    if (!seen.has(item.datetime)) {
      seen.add(item.datetime);
      unique.push({
        datetime: item.datetime,
        value: item.value,
        ...(item.name ? { metric: item.name } : {})
      });
    }
  }
  // Si hay muchas series (diferentes 'name'), las separamos
  const seriesMap = new Map();
  for (const item of unique) {
    const key = item.metric || 'value';
    if (!seriesMap.has(key)) seriesMap.set(key, []);
    seriesMap.get(key).push({ datetime: item.datetime, value: item.value });
  }
  // Devolver como objeto con series
  const result = {
    meta: { generated: new Date().toISOString(), type: 'timeseries' },
    series: Object.fromEntries(seriesMap)
  };
  return result;
}

// ---------------------------------------------------------------------
// 4. Procesar capacidad instalada (potencia)
// ---------------------------------------------------------------------
function processCapacity(data) {
  // Similar al auction pero más simple: extraer { tecnologia, mw }
  const techMap = new Map();
  for (const item of data) {
    const tech = item.name;
    const mw = item.value;
    if (!techMap.has(tech) || Math.abs(new Date(item.datetime) - new Date('2025-04-28T12:00:00')) < Math.abs(new Date(techMap.get(tech).datetime) - new Date('2025-04-28T12:00:00'))) {
      techMap.set(tech, { tecnologia: tech, mw: Math.round(mw), datetime: item.datetime });
    }
  }
  const snapshot = Array.from(techMap.values()).sort((a,b) => b.mw - a.mw);
  return {
    meta: { generated: new Date().toISOString(), type: 'capacity' },
    snapshot
  };
}

// ---------------------------------------------------------------------
// 5. Genérico: elimina campos innecesarios y reduce precisión
// ---------------------------------------------------------------------
function processGeneric(data) {
  // Elimina 'id', 'geoname' si son siempre iguales
  const cleaned = data.map(item => {
    const newItem = { ...item };
    delete newItem.id;
    if (newItem.geoname === 'Península') delete newItem.geoname;
    return newItem;
  });
  return {
    meta: { generated: new Date().toISOString(), type: 'generic' },
    data: cleaned
  };
}

// ---------------------------------------------------------------------
// 6. MAIN: procesar todos los archivos
// ---------------------------------------------------------------------
function main() {
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'));
  console.log(`📁 Procesando ${files.length} archivos desde ${INPUT_DIR}\n`);

  for (const file of files) {
    const fullPath = path.join(INPUT_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    let json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      console.log(`❌ Error parseando ${file}: ${e.message}`);
      continue;
    }
    // Si es un array (lo normal en ESIOS)
    let dataArray = Array.isArray(json) ? json : (json.included || json.data || []);
    if (dataArray.length === 0) {
      console.log(`⚠️  ${file} no contiene datos aprovechables`);
      continue;
    }

    const type = detectType(file, dataArray[0]);
    let processed;
    switch (type) {
      case 'auction':
        processed = processAuction(dataArray);
        break;
      case 'timeseries':
        processed = processTimeseries(dataArray);
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
