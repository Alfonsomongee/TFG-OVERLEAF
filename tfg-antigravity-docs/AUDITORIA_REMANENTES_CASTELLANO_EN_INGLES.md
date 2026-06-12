# Auditoría de Remanentes de Castellano en Inglés (TFG Apagón Ibérico 28A)

Este informe detalla la auditoría de control de calidad sobre la versión inglesa del sitio web académica del TFG, con el objetivo de asegurar que ningún texto en castellano sea visible de forma inadecuada para el usuario final en la localización en inglés, identificando a la vez los elementos legítimos que deben permanecer en su idioma original (nombres propios, siglas oficiales, archivos de datos, etc.).

---

## 1. Clasificación de Excepciones Permitidas

Para mantener el rigor académico y técnico, ciertos fragmentos en castellano no se traducen por los siguientes motivos:
1. **Nombres propios de entidades e instituciones**: Organismos públicos y privados reguladores u operadores (*Red Eléctrica*, *Redeia*, *CNMC*, *OMIE*, *MIBEL*, *BOE*, *Iberdrola*, *Endesa*, *Naturgy*, *Repsol*, *Mercuria Sostenible*).
2. **Nombres propios de instalaciones y ubicaciones**: Centrales de generación y subestaciones eléctricas (*Aldeadávila*, *Núñez de Balboa*, *Huéneja*, *Torrão*, *Zêzere*, *Granada*, *Badajoz*, *Huelva*, *Seville*, *Cáceres*, *Torrão*, *Castelo do Bode*, *Pocinho*).
3. **Nomenclatura oficial de normativas**: Procedimientos de Operación específicos (*P.O. 7.4*).
4. **Arquitectura interna de Docusaurus**: Enlaces y rutas de archivos MDX locales (que deben coincidir con la nomenclatura física en disco, ej: `./anexo-cascada-protecciones-desconexiones.mdx`).
5. **Rutas de recursos estáticos**: Carpetas y nombres de imágenes estáticas (ej: `/figuras/figuraB3-light.png`).

---

## 2. Tabla de Auditoría de Remanentes

| Archivo | Fragmento | ¿Debe traducirse? | Acción realizada o recomendada |
| :--- | :--- | :--- | :--- |
| Todos los MDX traducidos | `./07-resiliencia-futuro.mdx`, `./anexo-cascada-protecciones-desconexiones.mdx` | **No** | **Legítimo**: Son rutas relativas internas de archivos en disco. Docusaurus requiere que apunten a los nombres de archivo físicos originales. Los títulos de los enlaces visibles están 100% traducidos al inglés. |
| Todos los MDX traducidos | `/figuras/figuraB3-light.png`, `/figuras/nunez_balboa_precursores.png` | **No** | **Legítimo**: Rutas a assets gráficos del sistema. Las figuras y sus pies de foto correspondientes se muestran completamente traducidos al inglés en la versión inglesa. |
| `01-introduccion.mdx` | `Redes Energéticas Nacionais (REN)` | **No** | **Legítimo**: Nombre propio oficial del TSO (operador del sistema de transmisión) portugués. |
| `01-introduccion.mdx`, `03-analisis-incidente.mdx`, `07b-consecuencias-financieras.mdx` | `Red Eléctrica (REE)` | **No** | **Legítimo**: Nombre propio oficial del TSO español. En su primera aparición se añade la traducción aclaratoria: *"Red Eléctrica, the Spanish transmission system operator"*. |
| `03-analisis-incidente.mdx`, `05-analisis-informes.mdx` | `Núñez de Balboa` | **No** | **Legítimo**: Nombre propio de la planta solar fotovoltaica de 500 MW (Badajoz) precursora del colapso. |
| `03-analisis-incidente.mdx`, `04-reaccion-reposicion.mdx` | `Aldeadávila` | **No** | **Legítimo**: Nombre propio de la central hidroeléctrica reversible del Duero (≈1.100 MW), núcleo de la restauración del sistema. |
| `04-reaccion-reposicion.mdx`, `10-resumen-de-cifras.mdx` | `Castelo do Bode`, `Torrão` | **No** | **Legítimo**: Nombres propios de las centrales hidroeléctricas de la cuenca del Zêzere en Portugal. |
| `07-resiliencia-futuro.mdx` | `P.O. 7.4` | **No** | **Legítimo**: Nomenclatura del Procedimiento de Operación 7.4 (Control de Tensión de la Red de Transporte). |
| `07b-consecuencias-financieras.mdx` | `Boletín Oficial del Estado (BOE)`, `BOE-A-2025` | **No** | **Legítimo**: Referencia al boletín oficial español y a su código de registro legislativo. |
| `07b-consecuencias-financieras.mdx` | `Mercuria Sostenible`, `Huéneja` | **No** | **Legítimo**: Nombres propios de la empresa gestora de evacuación y de la subestación de Granada origen del disparo raíz. |
| `08.5-actualizacion-2026.mdx` | `Teodoro Ladrón` | **No** | **Legítimo**: Nombre propio del magistrado del Juzgado de lo Mercantil Nº 15 de Madrid. |
| `GlosarioTecnico.jsx` | Siglas como `aFRR`, `mFRR`, `RR`, `P.O. 7.4` | **No** | **Legítimo**: Siglas técnicas internacionales y normativas oficiales que se mantienen según el glosario unificado. Sus definiciones están traducidas íntegramente. |

---

## 3. Conclusión

Tras revisar de forma exhaustiva todos los MDX de documentación, páginas y componentes personalizados de la interfaz React, se confirma que:
* **El 100% del contenido de texto visible para el usuario en la versión inglesa está en inglés.**
* Los únicos términos en español corresponden a nombres propios institucionales, geográficos, nombres de centrales, archivos en disco o constantes de configuración técnica de red que no admiten ni requieren traducción.
* No se detectan tildes huérfanas en textos expositivos, leyendas o títulos dentro de la versión `/en/`.
