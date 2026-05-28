README - Modo Cine del Apagón Ibérico (28-A)
==============================================

Versión: 2.0 (junio 2026)
Autor: TFG Ingeniería Eléctrica

DESCRIPCIÓN GENERAL
-------------------
El "Modo Cine" es una experiencia inmersiva e interactiva dentro de la web del TFG que narra de forma cronológica y cinematográfica el colapso eléctrico de la Península Ibérica ocurrido el 28 de abril de 2025. A través de un reproductor de escenas con scroll, gráficas forenses en tiempo real, efectos visuales y sincronización con un dashboard de telemetría (Streamlit), el usuario puede recorrer las fases del apagón, desde el contexto previo hasta la restauración del sistema.

ESTRUCTURA DE ARCHIVOS
----------------------
src/components/cine-mode/
├── CineModePlayer.jsx      # Orquestador principal (scroll, estado, sincronización)
├── Scene.jsx               # Envuelve cada bloque/escena
├── TimelineController.jsx  # Barra de control (slider, play/pausa, spotlight, kiosco)
├── ActTransition.jsx       # Fundido a negro entre actos
├── ParticleSystem.jsx      # Partículas contextuales (canvas)
├── PDFExportButton.jsx     # Exportar escena actual a PDF
├── chartRegistry.js        # Registro de componentes y metadatos de escenas
└── cine-mode.css           # Estilos globales del modo cine

src/pages/cine.jsx          # Página dedicada al modo cine (ruta /cine)

DEPENDENCIAS PRINCIPALES
------------------------
- React 18+ (hooks, lazy loading)
- framer-motion (scroll, animaciones)
- react-spring (contadores animados)
- html2canvas + jsPDF (exportación PDF)
- recharts / plotly.js (gráficas)
- Intersection Observer API (lazy loading)

INSTALACIÓN
-----------
1. Copiar todos los archivos de `src/components/cine-mode/` a tu proyecto Docusaurus.
2. Asegurar que las dependencias están instaladas:
   npm install framer-motion react-spring html2canvas jspdf
3. Importar y usar la página `cine.jsx` en el enrutamiento (Docusaurus lo detecta automáticamente en `src/pages/`).
4. Opcional: añadir un botón flotante en el layout principal que enlace a `/cine`.

USO BÁSICO
----------
- Accede a `https://tu-dominio.com/cine`
- Desplázate hacia abajo: las escenas se activan automáticamente según el scroll.
- Usa la barra de control inferior para:
  ▶️ Play/Pausa (avance automático)
  ⏪⏩ Escena anterior/siguiente
  🎚️ Slider para saltar a cualquier escena
  ⏭️ Skip intro (saltar al Acto II)
  🐢🐇 Velocidad (0.5x, 1x, 1.5x, 2x)
  🌙 Modo spotlight (atenúa todo excepto escena activa)
  🖥️ Modo kiosco (pantalla completa, oculta controles)
  📄 Exportar escena a PDF

FUNCIONALIDADES CLAVE
---------------------
1. **Navegación por scroll y controles** – el usuario puede avanzar de forma libre o usar la reproducción automática.
2. **Sincronización con Streamlit** – mediante postMessage, el dashboard externo puede saltar a la misma escena y viceversa.
3. **Transiciones de acto** – fundido a negro y texto “ACTO X – Título” al cambiar de bloque narrativo.
4. **Partículas dinámicas** – cambian de color, forma y movimiento según el acto (polvo solar, glitch rojo, ceniza, etc.).
5. **Modo spotlight** – oscurece el fondo y resalta la escena activa.
6. **Exportación a PDF** – genera un documento con la gráfica visible y metadatos de la escena.
7. **Lazy loading de gráficas** – las visualizaciones pesadas se cargan solo al entrar en el viewport.
8. **Miniaturas en el timeline** – al hacer hover sobre el slider, muestra una vista previa de la escena.
9. **Modo presentación (kiosk)** – para ferias o exposiciones autónomas.

INTEGRACIÓN CON EL DASHBOARD DE STREAMLIT
-----------------------------------------
El modo cine emite mensajes `postMessage` al iframe del dashboard:
- Cuando cambia de escena: `{ type: 'SCENE_CHANGE', sceneId }`
- Cuando el reproductor está listo: `{ type: 'CINE_MODE_READY' }`
El dashboard puede enviar: `{ type: 'SYNC_SCENE', sceneId }` para saltar a una escena.

Para que funcione, el dashboard debe tener un listener de mensajes en su `app.py` y configurar CORS adecuadamente (`.streamlit/config.toml` con `enableCORS = false`).

PERSONALIZACIÓN
---------------
- **Añadir nuevas escenas**: editar `chartRegistry.js` (sceneMetadata) y `scenes.json`.
- **Cambiar partículas por acto**: modificar `PARTICLE_CONFIGS` en `ParticleSystem.jsx`.
- **Ajustar duración de transiciones**: modificar `duration` en `ActTransition.jsx` y las animaciones CSS.
- **Modificar colores**: usar las variables CSS en `cine-mode.css` (paleta forense).

SOLUCIÓN DE PROBLEMAS COMUNES
-----------------------------
| Problema | Posible solución |
|----------|------------------|
| El slider no se sincroniza con el scroll | Verificar que `IntersectionObserver` tiene `threshold: 0.3` y que los `data-scene-id` están bien asignados. |
| Las partículas ralentizan la página | Reducir `count` en `PARTICLE_CONFIGS` o desactivarlas en móvil con media query. |
| La exportación PDF sale borrosa | Aumentar `scale: 3` en `html2canvas` y usar `useCORS: true`. |
| El iframe de Streamlit se queda en blanco | Asegurar `.streamlit/config.toml` tiene `enableCORS = false` y `enableXsrfProtection = false`. |
| El menú hamburguesa de Docusaurus no se despliega | Comprobar que el botón de cierre del modo cine no capture eventos; usar `z-index` adecuado. |

CHECKLIST DE PRUEBAS
--------------------
☐ Navegación por scroll: todas las escenas se activan correctamente.
☐ Botón Play/Pausa: reproduce y detiene el avance automático.
☐ Slider manual: al moverlo, salta a la escena correspondiente.
☐ Velocidad: 0.5x, 1x, 1.5x, 2x ajustan el intervalo de autoavance.
☐ Skip Intro: salta al Acto II (primera escena con act === 2).
☐ Modo spotlight: atenúa el fondo y resalta la escena actual.
☐ Modo kiosco: pantalla completa, controles ocultos, scroll snapping.
☐ Exportación PDF: genera archivo con la gráfica visible.
☐ Partículas: cambian según el acto (inspeccionar canvas).
☐ Transiciones de acto: aparece fundido a negro al cambiar de acto.
☐ Sincronización con Streamlit: enviar y recibir mensajes postMessage.
☐ Lazy loading: las gráficas solo se cargan cuando la escena entra en el viewport.
☐ Responsive móvil: todos los controles son accesibles y las partículas se desactivan o reducen.
☐ Rendimiento: el bundle inicial es < 500 KB y la memoria no crece indefinidamente.

CRÉDITOS Y REFERENCIAS
----------------------
- Datos: ESIOS (REE), ENTSO-E Transparency Platform.
- Informes técnicos: IIT-ICAI, ENTSO-E Final Report, NREL.
- Iconografía: Lucide React.
- Tipografía: Google Fonts (Outfit, Inter, JetBrains Mono).

CONTACTO
--------
Para cualquier incidencia o sugerencia sobre el modo cine, escribir al autor del TFG.

Fin del README