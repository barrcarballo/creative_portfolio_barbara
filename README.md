# Barbara — Creative portfolio

Portfolio personal de diseño multimedial desarrollado con [Astro](https://astro.build).

## Requisitos

- Node.js **22.23.4 o superior** (ver `.nvmrc`)
- npm

## Cómo ejecutarlo

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:4321
npm run build     # build de producción en ./dist
npm run preview   # sirve el build localmente
```

## Estructura

```
src/
├── components/
│   ├── SiteHeader.astro     # Navegación principal; en mobile se colapsa en un menú desplegable
│   ├── FurName.astro        # Nombre con textura animal print que reacciona al cursor
│   ├── HangingStars.astro   # Navegación por secciones: estrellas colgadas de sogas
│   ├── Typewriter.astro     # Frase rotativa con efecto máquina de escribir
│   └── SectionDialog.astro  # Visor de secciones: la estrella vuela girando y se abre
├── data/
│   └── sections.ts          # Contenido de cada sección (id = hash de la URL)
├── layouts/
│   └── BaseLayout.astro     # HTML base, fuentes y metadatos
├── pages/
│   └── index.astro          # Home
└── styles/
    └── global.css           # Tokens (colores, tipografías) y estilos base
public/
├── fonts/                   # Dunbar Low, Tango Sans, Tempting
└── images/                  # Letras y estrella animal print, íconos
```

## Componentes e interacciones

### `FurName`

Cada letra del nombre es una imagen controlada por una simulación de resortes.
Al pasar el cursor, las letras se alejan del puntero, se inclinan en la dirección
del movimiento (como si se "peinara" el pelaje) y vuelven a su lugar con un rebote suave.
La animación solo corre mientras hay movimiento y se desactiva con `prefers-reduced-motion`.

### `HangingStars`

Navegación principal hacia las secciones del portfolio.

- **Entrada:** cuando la fila entra en pantalla, cada estrella cae desde arriba
  colgada de una soga elástica y rebota antes de quedarse quieta (con un pequeño desfase entre estrellas).
- **Hover / foco:** la estrella recibe un empujón en la dirección del cursor y se balancea
  como un péndulo cuyo pivote es el punto de anclaje de la soga.
- **Sin JavaScript o con movimiento reducido:** las estrellas se muestran directamente en su lugar.

### `SectionDialog`

Al hacer click en una estrella (o en cualquier link a `#about`, `#work`, `#services`, `#contact`),
la estrella vuela al centro de la pantalla girando una vuelta completa mientras crece (animación FLIP);
al llegar, su centro color crema se abre y aparece el contenido.

- **Siguiente:** la estrella gira una punta (72°) mientras cambia el contenido.
- **Volver / Escape / botón atrás del navegador:** la estrella vuelve girando a su soga.
- El hash de la URL refleja la sección abierta, así que los links directos (`/#about`) funcionan.
- Usa `<dialog>` nativo: foco atrapado, fondo inerte y el foco vuelve a la estrella al cerrar.

### `SiteHeader`

Barra de navegación fija. Debajo de 768px los links se agrupan en un panel
que se abre y cierra con un botón (accesible con teclado y `Escape`).

## Fuente de datos externa

_Pendiente: documentar la API utilizada, qué datos se obtienen y cómo se manejan límites y errores._

## Deploy

_Pendiente: URL pública._

## Créditos

- Tipografía **Tempting**: licencia de uso personal.
- Diseño original en Figma.
