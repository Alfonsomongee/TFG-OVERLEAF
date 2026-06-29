# HomeHero.jsx — Patch copy numbers strip + chain detail
# 4 cambios · 4 locales = 16 str_replace

---

## CAMBIO 1 · strip numbers ES

BUSCAR:
```js
    numbers: [
      { value: '57 M', label: 'personas afectadas' },
      { value: '15.000', label: 'MW perdidos' },
      { value: '33 s', label: 'de colapso total' },
      { value: '18,5 h', label: 'de reposición' },
      { value: '>666 M€', label: 'coste Op. Reforzada' },
    ],
```
REEMPLAZAR CON:
```js
    numbers: [
      { value: '>50 M', label: 'personas afectadas' },
      { value: '15.000', label: 'MW perdidos' },
      { value: '<1 min', label: 'cascada al cero' },
      { value: '18,5 h', label: 'de reposición' },
      { value: '>666 M€', label: 'coste Op. Reforzada' },
    ],
```

---

## CAMBIO 2 · strip numbers EN

BUSCAR:
```js
    numbers: [
      { value: '57 M', label: 'people affected' },
      { value: '15,000', label: 'MW lost' },
      { value: '33 s', label: 'of total collapse' },
      { value: '18.5 h', label: 'of restoration' },
      { value: '>666 M€', label: 'Reinforced Op. cost' },
    ],
```
REEMPLAZAR CON:
```js
    numbers: [
      { value: '>50 M', label: 'people affected' },
      { value: '15,000', label: 'MW lost' },
      { value: '<1 min', label: 'cascade to blackout' },
      { value: '18.5 h', label: 'of restoration' },
      { value: '>666 M€', label: 'Reinforced Op. cost' },
    ],
```

---

## CAMBIO 3 · strip numbers DE

BUSCAR:
```js
    numbers: [
      { value: '57 M', label: 'betroffene Personen' },
      { value: '15.000', label: 'verlorene MW' },
      { value: '33 s', label: 'bis zum Gesamtzusammenbruch' },
      { value: '18,5 h', label: 'Wiederversorgungszeit' },
      { value: '>666 M€', label: 'Kosten verstärkter Betrieb' },
    ],
```
REEMPLAZAR CON:
```js
    numbers: [
      { value: '>50 M', label: 'betroffene Personen' },
      { value: '15.000', label: 'verlorene MW' },
      { value: '<1 Min.', label: 'Kaskade bis Null' },
      { value: '18,5 h', label: 'Wiederversorgungszeit' },
      { value: '>666 M€', label: 'Kosten verstärkter Betrieb' },
    ],
```

---

## CAMBIO 4 · strip numbers ZH-Hans

BUSCAR:
```js
    numbers: [
      { value: '57 M', label: '受影响人数' },
      { value: '15,000', label: '损失兆瓦' },
      { value: '33 秒', label: '全网崩溃时间' },
      { value: '18.5 小时', label: '恢复供电耗时' },
      { value: '>6.66 亿€', label: '强化运维成本' },
    ],
```
REEMPLAZAR CON:
```js
    numbers: [
      { value: '>5000万', label: '受影响人数' },
      { value: '15,000', label: '损失兆瓦' },
      { value: '<1分钟', label: '级联至停电' },
      { value: '18.5 小时', label: '恢复供电耗时' },
      { value: '>6.66 亿€', label: '强化运维成本' },
    ],
```

---

## CAMBIO 5 · chain detail fase "Cero de tensión" ES

BUSCAR (dentro del array chain, locale es):
```js
      {
        label: 'Cero de tensión',
        time: '12:33:29,741 CEST',
        detail: '57 millones sin suministro · área ibérica aislada',
        href: '/resumen-de-cifras',
      },
```
REEMPLAZAR CON:
```js
      {
        label: 'Cero de tensión',
        time: '12:33:29,741 CEST',
        detail: '>50 millones sin suministro · área ibérica aislada',
        href: '/resumen-de-cifras',
      },
```

---

## CAMBIO 6 · chain detail fase "Voltage blackout" EN

BUSCAR (dentro del array chain, locale en):
```js
      {
        label: 'Voltage blackout',
        time: '12:33:29.741 CEST',
        detail: '57 million without supply · Iberian area isolated',
        href: '/resumen-de-cifras',
      },
```
REEMPLAZAR CON:
```js
      {
        label: 'Voltage blackout',
        time: '12:33:29.741 CEST',
        detail: '>50 million without supply · Iberian area isolated',
        href: '/resumen-de-cifras',
      },
```

---

## CAMBIO 7 · chain detail fase "Spannungsnull" DE

BUSCAR:
```js
      {
        label: 'Spannungsnull',
        time: '12:33:29,741 CEST',
        detail: '57 Millionen ohne Versorgung · iberisches Gebiet isoliert',
        href: '/resumen-de-cifras',
      },
```
REEMPLAZAR CON:
```js
      {
        label: 'Spannungsnull',
        time: '12:33:29,741 CEST',
        detail: '>50 Millionen ohne Versorgung · iberisches Gebiet isoliert',
        href: '/resumen-de-cifras',
      },
```

---

## CAMBIO 8 · chain detail fase "电压归零" ZH

BUSCAR:
```js
      {
        label: '电压归零',
        time: '12:33:29.741 CEST',
        detail: '5700万人无电力供应 · 伊比利亚区域孤网运行',
        href: '/resumen-de-cifras',
      },
```
REEMPLAZAR CON:
```js
      {
        label: '电压归零',
        time: '12:33:29.741 CEST',
        detail: '>5000万人无电力供应 · 伊比利亚区域孤网运行',
        href: '/resumen-de-cifras',
      },
```
