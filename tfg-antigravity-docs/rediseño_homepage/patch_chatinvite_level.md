# HomeChatInvite — Reducir protagonismo visual del chatbot
# Opción A (cosmética): 3 cambios en HomeChatInvite.module.css + 1 en JSX

---

## CAMBIO 1 · HomeChatInvite.module.css — reducir padding de sección

BUSCAR:
```css
.section {
  padding: 4.5rem 2rem 5rem;
```
REEMPLAZAR CON:
```css
.section {
  padding: 2.5rem 2rem 3rem;
```

---

## CAMBIO 2 · HomeChatInvite.module.css — eliminar el grid decorativo ::before

BUSCAR y ELIMINAR este bloque completo:
```css
.section::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(107, 16, 36, 0.035) 1px, transparent 1px),
    radial-gradient(circle at 78% 45%, rgba(107, 16, 36, 0.10), transparent 22rem);
  background-size: 36px 36px, auto;
}
```

RAZÓN: El fondo decorativo de cuadrícula refuerza visualmente
la sección como un bloque protagonista. El chatbot debe sentirse
como una herramienta auxiliar, no como una landing de producto.

---

## CAMBIO 3 · HomeChatInvite.module.css — reducir tamaño del heading

BUSCAR:
```css
.heading {
  font-size: 1.75rem;
  font-weight: 800;
```
REEMPLAZAR CON:
```css
.heading {
  font-size: 1.35rem;
  font-weight: 700;
```

---

## CAMBIO 4 · HomeChatInvite.jsx — bajar el h2 a h3

BUSCAR en el JSX:
```jsx
          <ScrollFloat tag="h2" className={styles.heading}>
            {t.heading.replace(/\n/g, ' ')}
          </ScrollFloat>
```
REEMPLAZAR CON:
```jsx
          <ScrollFloat tag="h3" className={styles.heading}>
            {t.heading.replace(/\n/g, ' ')}
          </ScrollFloat>
```

RAZÓN: El único h2 de cierre de la página debe ser de menor rango
que los h2 de los bloques de contenido principal (Timeline, Matrix, Annexes).
Bajar a h3 mejora también la jerarquía semántica del documento.
