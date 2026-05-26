# Plan de Implementación: Interactividad Narrativa (Timeline Sincronizado)

Este plan detalla la implementación de la MEJORA #1 del plan de optimización: integrar el `VerticalTimeline` de forma sticky y sincronizada con la lectura del capítulo 3, además de añadir la funcionalidad de reproducción en 27 segundos.

## ⚠️ User Review Required

- **Dependencias**: Mencionas `react-intersection-observer`. Actualmente el proyecto ya usa `framer-motion` (que incluye `useInView`), con lo cual podríamos evitarnos instalar una librería extra. Aun así, voy a usar la API nativa `IntersectionObserver` encapsulada en un custom hook `useActiveSection` para no añadir peso al bundle, ya que es perfectamente capaz de hacer esto. ¿Estás de acuerdo con no añadir dependencias extra?
- **Espacio (Layout)**: Para que el timeline "sticky" a la derecha no pise el texto en Docusaurus, ocultaré la tabla de contenidos (TOC) nativa añadiendo `hide_table_of_contents: true` al _frontmatter_ del capítulo 3, y le daré un margen derecho al contenedor del artículo principal (o fijaré el timeline en el hueco del TOC). 
- **Tiempos de la secuencia (27 segundos)**: Los eventos en `timelineEvents` abarcan desde el 22 de abril hasta el 29 de abril. La cascada real desde el "Disparo Raíz" (12:32:56) hasta el "Cero Eléctrico" (12:33:29) dura unos 33 segundos reales. Para la reproducción (Play), ajustaré la velocidad de transición para que la simulación completa de los 10 eventos transcurra a lo largo de ~27 segundos proporcionales, resaltando el evento y haciendo scroll hasta él en cada paso.

## Open Questions

1. ¿Te parece bien ocultar la tabla de contenidos nativa (TOC) del capítulo 3 para aprovechar ese espacio en la columna derecha para anclar el `StickyTimeline`?
2. Los eventos del timeline van desde `t1` (22 de abril) hasta `t10` (29 de abril). En la "reproducción de 27 segundos", ¿quieres que se reproduzcan los 10 eventos comprimidos en esos 27s de forma acelerada, o solo la ventana estricta del colapso (ej. de t4 a t8)? Lo ideal es que reproduzca los 10 con una velocidad relativa adaptada para que cuadre en ~27s.

## Proposed Changes

### Componentes

#### [NEW] `src/components/StickyTimeline.jsx`
- Creará un contenedor `aside` con `position: sticky; top: 100px;`.
- Albergará el custom hook `useActiveSection` utilizando la API nativa de `IntersectionObserver` con un `rootMargin` de `-10% 0px -30% 0px`.
- Mantendrá el estado de la reproducción (`isPlaying`), usando un ciclo asíncrono para iterar por los 10 eventos y hacer scroll (`scrollIntoView`) a medida que avanza.
- Contendrá el botón "▶ Reproducir colapso" y el estado de pausa.

#### [MODIFY] `src/components/VerticalTimeline.jsx`
- Añadiré las `props`: `activeEventId` y `onEventClick`.
- Cuando se haga click en un evento, se disparará `onEventClick(id)`.
- El evento cuyo ID coincida con `activeEventId` recibirá una clase especial (ej. `.activeEvent`) para iluminar su borde y su círculo de estado.

### Estilos

#### [NEW] `src/css/timeline-sync.css`
- Estilos para el wrapper de `StickyTimeline` (incluyendo la ocultación/colapso en modo móvil con media queries `< 996px`).
- Animaciones CSS para resaltar el evento activo en el `VerticalTimeline` (ej. brillo, resaltado del texto, etc.).

### Contenido

#### [MODIFY] `docs/03-analisis-incidente.mdx`
- Añadir `<span id="t1"></span>`, `<span id="t2"></span>`, ..., `<span id="t10"></span>` en los lugares precisos que correspondan con los eventos de la narrativa.
- Añadir `id="fase-0"`, `id="fase-1"`, etc. en los respectivos `##`.
- Añadir `hide_table_of_contents: true` al frontmatter.
- Importar y montar el componente `<StickyTimeline />`.
- Ajustar la estructura (ej. agrupar el texto en un contenedor para dividir el layout si fuera necesario, aunque Docusaurus y CSS Grid nos permiten situar el StickyTimeline de manera fluida).

## Verification Plan

### Manual Verification
- Cargar la página `/analisis-incidente` en modo normal y observar si el Timeline de la derecha cambia de estado a medida que se hace scroll.
- Hacer clic en el evento 6 (t6) del timeline y verificar que hace "smooth scroll" hasta el texto exacto.
- Hacer clic en el botón "Reproducir" y comprobar que inicia el auto-scroll saltando por cada evento de forma secuencial, tardando aproximadamente 27 segundos en completar la lista.
- Comprimir la ventana del navegador a modo móvil y verificar que el timeline no pisa el texto, sino que se colapsa (o se sitúa debajo de forma amigable).
