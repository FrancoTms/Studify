# Studify
 
## Integrantes
- Nombre Apellido 1
- Nombre Apellido 2
- Nombre Apellido 3
*(completar con los datos reales del grupo)*
 
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
- Ramas de trabajo (`feature/...`) se crean a partir de `dev` para cada tarea puntual
  y se integran a `dev` mediante Pull Request con revisión de compañeros.
