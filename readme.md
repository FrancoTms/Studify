# Studify

## Integrantes
- Busnelli, Bruno
- Garcia, Franco Tomas

## Descripción breve
Studify es una aplicación web pensada para ayudar a estudiantes a organizar su
estudio en un solo lugar: seguimiento de horas estudiadas, sesiones completadas,
racha de días consecutivos, gestión de apuntes, temporizador Pomodoro,
estadísticas semanales, técnicas de estudio recomendadas y un asistente con IA
para resolver dudas sobre los temas que se están estudiando.

Este TP corresponde a la maquetación del **dashboard principal** de la
aplicación, desarrollado con HTML semántico y CSS puro (sin frameworks).

## Tecnologías utilizadas
- HTML5 semántico
- CSS3 (Flexbox, Grid, variables CSS, Media Queries)
- Git y GitHub para el control de versiones

## ¿Dónde utilizamos Flexbox?
Flexbox se usó en todos los componentes donde los elementos se organizan en
una sola dirección (fila o columna) y necesitan alinearse o repartirse el
espacio disponible:
- `.sidebar`: distribuye el logo, el menú de navegación y el usuario en
  columna, dejando el bloque de usuario pegado abajo con `justify-content: space-between`.
- `.sidebar-nav ul` y `.nav-item a`: alinean el ícono y el texto de cada link.
- `.dashboard-header`: separa el saludo de los botones de acción (notificaciones,
  tema y "Nuevo Apunte").
- `.stat-card`, `.note-item`, `.technique-content`, `.ai-assistant-header`:
  alinean un ícono con su información en fila.
- `.pomodoro-actions` y `.weekly-chart`: organizan los botones del Pomodoro y
  las barras del gráfico semanal.
- `.ai-assistant-form`: alinea el input de texto con el botón de enviar.

## ¿Dónde utilizamos Grid?
CSS Grid se usó en las secciones que necesitan una distribución en dos
dimensiones (filas y columnas):
- `.app-container`: define el layout general de la página en dos columnas
  (sidebar + contenido principal) usando `grid-template-columns: var(--sidebar-width) 1fr`.
- `.stats-cards`: distribuye las 4 tarjetas de resumen (Horas de estudio,
  Sesiones completadas, Racha actual, Apuntes guardados) en columnas iguales
  con `repeat(4, 1fr)`.
- `.dashboard-grid`: organiza las tres columnas principales del dashboard
  (Apuntes recientes, Pomodoro y la columna derecha con Estadísticas
  Semanales + Técnica recomendada) con proporciones `2fr 1.2fr 1fr`.

## ¿Qué variables CSS creamos?
Definimos un sistema de variables en `:root` para mantener consistencia y
facilitar el mantenimiento del diseño:
- **Colores:** `--color-primary`, `--color-primary-dark`, `--color-primary-light`,
  `--color-success`, `--color-warning`, `--color-danger`, `--color-bg`,
  `--color-surface`, `--color-border`, `--color-text`, `--color-text-secondary`,
  `--color-text-muted`.
- **Tipografía:** `--font-base` y una escala de tamaños (`--fs-xs` a `--fs-xl`).
- **Espaciados:** escala `--space-xs` a `--space-xl`, usada en paddings, margins y gaps.
- **Bordes y sombras:** `--radius-sm/md/lg` y `--shadow-sm/md`.
- **Layout:** `--sidebar-width`, para controlar el ancho de la barra lateral
  desde un solo lugar.

## ¿Cómo implementamos el Responsive Design?
Se usaron **Media Queries** con un enfoque de tres puntos de quiebre (breakpoints):

- **`max-width: 1024px` (tablet):** la sidebar se angosta, la grilla principal
  pasa de 3 a 2 columnas (el panel de apuntes ocupa todo el ancho arriba) y
  las tarjetas de estadísticas pasan a 2 columnas.
- **`max-width: 768px` (tablet chica / celular grande):** la sidebar deja de
  ser una columna fija y se convierte en una barra horizontal arriba del
  contenido (con `flex-direction: row`), y toda la grilla del dashboard se
  apila en una sola columna.
- **`max-width: 480px` (celular):** las tarjetas de estadísticas pasan a una
  sola columna, el header se apila verticalmente, el botón "Nuevo Apunte"
  ocupa todo el ancho y el formulario del asistente IA pasa a columna.

Además se usó `box-sizing: border-box` de forma global para que paddings y
bordes no rompan los anchos calculados en ningún tamaño de pantalla, y
unidades relativas (`rem`, `%`, `fr`, `vh`) en lugar de valores fijos siempre
que fue posible, para que el diseño escale correctamente.

## Estructura del proyecto
```
studify/
├── img/
│   ├── logo.svg
│   ├── icon-pdf.svg
│   └── user-avatar.svg
├── css/
│   └── style.css
├── js/
│   └── script.js
├── index.html
└── README.md
```

## Flujo de trabajo con Git
- `main`: rama estable, solo recibe código integrado y probado mediante Pull Request.
- `dev`: rama principal de desarrollo, donde se integran las features antes de pasar a `main`.
- Ramas de trabajo (`feature/...`, `refactor/...`) se crean a partir de `dev` para
  cada tarea puntual y se integran a `dev` mediante Pull Request con revisión de compañeros.

---

## TP3 - Refactorización con Bootstrap

### ¿Qué cambió respecto al TP2?
El maquetado deja de depender exclusivamente del CSS propio y pasa a apoyarse en
**Bootstrap 5.3** (vía CDN) para el layout, los componentes y las utilidades. El
objetivo no fue agregar funcionalidades nuevas, sino mejorar la interfaz y ordenar
el código reutilizando un framework.

### Bootstrap incorporado
- **CDN de Bootstrap 5.3** (`bootstrap.min.css` y `bootstrap.bundle.min.js`).
- **Bootstrap Icons** vía CDN, en reemplazo de los emojis usados como íconos en el TP2.
- **Google Fonts (Inter)**, aplicada como tipografía base mediante la variable
  `--bs-body-font-family`.

### Componentes de Bootstrap utilizados
- **Navbar + Offcanvas**: en pantallas chicas, el sidebar se reemplaza por una
  barra superior (`navbar`) con un botón que abre el menú en un panel lateral
  (`offcanvas`), en vez de simplemente apilar la navegación.
- **Grid system de Bootstrap** (`container-fluid`, `row`, `col-*`): reemplaza el
  CSS Grid manual del TP2 para el layout general (sidebar + contenido) y para
  las tarjetas de estadísticas y el panel central del dashboard.
- **Cards**: todas las tarjetas (estadísticas, apuntes, Pomodoro, estadísticas
  semanales, técnica recomendada, asistente IA) usan el componente `card`.
- **List-group**: la lista de apuntes recientes.
- **Input-group**: el formulario del asistente IA (input + botón de enviar).
- **Nav pills**: el menú de navegación del sidebar y del offcanvas.
- **Utilidades de Bootstrap**: `d-flex`, `gap-*`, `rounded-*`, `bg-*-subtle`,
  `text-*`, `shadow-sm`, clases responsive (`d-none`, `d-lg-flex`, `col-lg-*`), etc.

### CSS propio (TP2)
Todo el CSS puro desarrollado en el TP2 se mantiene **comentado** al principio
de `css/style.css`, como referencia del trabajo anterior, tal como pide la
consigna. No se utiliza en el sitio actual.

### CSS propio nuevo (TP3)
Debajo del bloque comentado se agregó únicamente lo que Bootstrap no resuelve
por sí solo:
- Variables `--bs-*` para adaptar el color primario, la tipografía y los
  radios de borde de Bootstrap a la identidad de Studify.
- El círculo del temporizador Pomodoro (Bootstrap no tiene un componente de
  progreso circular).
- Las barras del gráfico de estadísticas semanales (altura proporcional a los
  datos mediante `calc()` y una variable CSS por barra).

### Responsive
- **Celular**: navbar superior + botón que abre el menú en un offcanvas;
  tarjetas de estadísticas en una columna; todo el contenido apilado.
- **Tablet**: tarjetas de estadísticas en 2 columnas; el dashboard central
  reorganiza sus columnas según el ancho disponible gracias al grid de Bootstrap.
- **Escritorio**: sidebar fija a la izquierda, tarjetas en 4 columnas y el
  dashboard central en 3 columnas (apuntes, Pomodoro, estadísticas + técnica).

### Organización de ramas
```
dev
├── refactor/navbar
├── refactor/home
├── refactor/pomodoro
└── refactor/footer
```
Cada integrante trabaja su sector en su propia rama `refactor/...` creada a
partir de `dev`, y la integra a `dev` mediante Pull Request revisado por el resto
del equipo.

---

## TP4 - JavaScript y DOM

### Funcionalidades incorporadas
Todas viven en `js/script.js`, organizadas en funciones `init...()` (una por
funcionalidad) que se llaman al final del archivo, dentro de un único listener
`DOMContentLoaded`.

1. **Tema claro/oscuro** (`initThemeToggle`): togglea el atributo nativo de
   Bootstrap `data-bs-theme` en el `<html>` y guarda la preferencia en
   `localStorage`, respetando además el modo del sistema operativo en la
   primera visita.
2. **Navegación** (`initNavigation`): marca como activo el link del sidebar
   sobre el que se hizo clic y cierra automáticamente el menú offcanvas en
   mobile al elegir una sección.
3. **Notificaciones** (`initNotifications`): oculta el badge de "no leídas"
   al abrir el menú desplegable.
4. **Temporizador Pomodoro** (`initPomodoro`): cuenta regresiva real (25 min
   estudio / 5 min descanso) con `setInterval`, actualiza el anillo de
   progreso (variable CSS `--progress`), registra cada sesión completada en
   una lista y suma automáticamente esas horas a la tarjeta "Horas de
   estudio" y "Sesiones completadas".
5. **Alta de apuntes** (`initNewNoteForm`): el formulario del modal "Nuevo
   Apunte" crea un `<li>` nuevo con `createElement`/`innerHTML` y lo inserta
   arriba de la lista, sin recargar la página, actualizando el contador de
   "Apuntes guardados".
6. **Baja de apuntes** (`initNoteDeletion`): usa **delegación de eventos**
   sobre la lista completa (un solo listener en `#notesList`), para que el
   botón "Eliminar" funcione tanto en los apuntes originales como en los
   agregados dinámicamente.
7. **Estadísticas semanales** (`initWeeklyStats`): el `<select>` de período
   cambia el dataset del gráfico de barras (variable CSS `--valor` por
   barra) y recalcula el total de horas.
8. **Asistente IA simulado** (`initAiAssistant`): chat básico que responde
   con sugerencias según palabras clave de la pregunta (Pomodoro, exámenes,
   apuntes, descanso), usando `setTimeout` para simular el tiempo de
   respuesta.

### Manipulación del DOM y eventos utilizados
`querySelector`/`querySelectorAll`, `addEventListener` (`click`, `submit`,
`change`, `transitionend`), `createElement`/`innerHTML`, `classList`,
`closest`, `dataset`, `style.setProperty` (variables CSS) y las APIs de
Bootstrap (`bootstrap.Modal`, `bootstrap.Offcanvas`) para controlar
componentes desde JS.

### SEO
Se mantienen y refuerzan las buenas prácticas trabajadas en clase:
- `<title>` y `<meta name="description">` descriptivos y específicos del
  contenido de la página.
- `meta name="keywords"`, `meta name="robots" content="index, follow"` y
  `link rel="canonical"`.
- Open Graph (`og:title`, `og:description`, `og:image`, `og:locale`) para
  que se vea bien al compartir el link.
- Un único `<h1>` por página (el saludo "¡Hola, Usuario!"), con jerarquía
  descendente y consistente de encabezados (`h2`, `h3`) en el resto del
  contenido.
- Atributos `alt` descriptivos en todas las imágenes.
- HTML semántico (`header`, `nav`, `main`, `section`, `article`, `footer`)
  heredado del TP1/TP2, que ayuda a los motores de búsqueda a entender la
  estructura de la página.
