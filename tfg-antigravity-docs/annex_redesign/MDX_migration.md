# Migración MDX — sustituir 4 componentes por AnnexOpening

Aplicar en los 10 archivos MDX de los anexos.

---

## 1. Añadir import al principio de cada MDX

AÑADIR junto a los demás imports:
```jsx
import AnnexOpening from '@site/src/components/annex/AnnexOpening';
```

---

## 2. Sustituir el bloque de apertura

### PATRÓN A BUSCAR (el orden puede variar entre anexos):
```jsx
<AnnexKeyQuestion>
  ...texto de la pregunta...
</AnnexKeyQuestion>

<AnnexThesisBox>
  ...texto de la tesis...
</AnnexThesisBox>

<AnnexBlackoutRelevance>
  ...texto de relevancia...
</AnnexBlackoutRelevance>

<AnnexMethodNote type="reconstruccion">
  ...texto de fuentes...
</AnnexMethodNote>
```

### REEMPLAZAR CON:
```jsx
<AnnexOpening
  question="...texto de la pregunta en una sola línea..."
  thesis="...texto de la tesis en una sola línea..."
  relevance="...texto de relevancia en una sola línea..."
  sources="...texto de fuentes en una sola línea..."
/>
```

---

## Ejemplo completo — Anexo I

### ANTES:
```jsx
<AnnexKeyQuestion>
¿Cómo condicionaban la demanda prevista, el mix de generación y el balance operativo del sistema peninsular el margen de seguridad dinámica disponible la mañana del 28 de abril de 2025?
</AnnexKeyQuestion>

<AnnexThesisBox>
La mañana del 28-A, la generación peninsular cubría la demanda con holgura. Pero la composición del mix — 82 % de fuentes basadas en inversores, solo 11 unidades síncronas acopladas — dejaba el sistema con la inercia más baja del año y una potencia de cortocircuito en el sur peninsular por debajo de los umbrales de operación segura. Las previsiones de demanda no anticipaban condiciones excepcionales; la desviación previsto-real era inferior al 5 %. La vulnerabilidad no residía en la cantidad de potencia disponible sino en las propiedades dinámicas de esa potencia.
</AnnexThesisBox>

<AnnexBlackoutRelevance>
Este anexo establece la precondición del colapso: un sistema con margen de potencia suficiente pero con margen dinámico insuficiente. Sin esta condición, la cascada del [Capítulo 3](/analisis-incidente) no se habría producido.
</AnnexBlackoutRelevance>

<AnnexMethodNote type="reconstruccion">
Fuentes primarias: Comité de Análisis del Gobierno (2025, pp. 20-38), ENTSO-E Factual Report (2025, Figuras 2-1 a 2-5), REE (datos ESIOS, indicadores 1293/1775/460/151/541/1395), NREL PMU Analysis (2025). Las series temporales se presentan con resolución de 5 minutos (ESIOS) u horaria (ENTSO-E). Las discrepancias entre fuentes se señalan explícitamente.
</AnnexMethodNote>
```

### DESPUÉS:
```jsx
<AnnexOpening
  question="¿Cómo condicionaban la demanda prevista, el mix de generación y el balance operativo del sistema peninsular el margen de seguridad dinámica disponible la mañana del 28 de abril de 2025?"
  thesis="La mañana del 28-A, la generación peninsular cubría la demanda con holgura. Pero la composición del mix —82 % de fuentes basadas en inversores, solo 11 unidades síncronas acopladas— dejaba el sistema con la inercia más baja del año y una potencia de cortocircuito en el sur peninsular por debajo de los umbrales de operación segura. La vulnerabilidad no residía en la cantidad de potencia disponible sino en las propiedades dinámicas de esa potencia."
  relevance="Este anexo establece la precondición del colapso: un sistema con margen de potencia suficiente pero con margen dinámico insuficiente. Sin esta condición, la cascada del Capítulo 3 no se habría producido."
  sources="Comité de Análisis del Gobierno (2025, pp. 20-38), ENTSO-E Factual Report (2025), REE (datos ESIOS), NREL PMU Analysis (2025)."
/>
```

---

## Nota sobre el prop `relevance` con links MDX

Si el texto de relevancia contiene un link en MDX como:
  `la cascada del [Capítulo 3](/analisis-incidente)`

Al pasar como string prop en JSX se pierde el link.
Dos opciones:

### Opción A — JSX inline (recomendada si hay links):
```jsx
<AnnexOpening
  question="..."
  thesis="..."
  relevance={<>Este anexo establece la precondición del colapso. Sin esta condición, la cascada del <a href="/analisis-incidente">Capítulo 3</a> no se habría producido.</>}
  sources="..."
/>
```

### Opción B — string sin el link (si el contexto lo permite):
```jsx
  relevance="Este anexo establece la precondición del colapso. Sin esta condición, la cascada del Capítulo 3 no se habría producido."
```

---

## Imports que ya no hacen falta en el MDX

Una vez migrado, eliminar del bloque de imports:
```jsx
import AnnexKeyQuestion from '@site/src/components/annex/AnnexKeyQuestion';
import AnnexThesisBox from '@site/src/components/annex/AnnexThesisBox';
import AnnexBlackoutRelevance from '@site/src/components/annex/AnnexBlackoutRelevance';
import AnnexMethodNote from '@site/src/components/annex/AnnexMethodNote';
```
