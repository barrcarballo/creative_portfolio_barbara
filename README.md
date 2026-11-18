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
npm run optimize-images  # regenera public/images/*.webp desde assets-src/images/
```

### Imágenes de diseño

Los originales pesados (letras, estrella animal print, estrella grande) están en `assets-src/images/`
y no se publican. `npm run optimize-images` los convierte a WebP en `public/images/` con el tamaño
justo para cómo se muestran (por ejemplo, las letras ya estiradas al doble de su tamaño en pantalla):
la home pasó de ~3,9 MB a ~0,4 MB de imágenes. Hay que correrlo solo si se reemplaza un original.
Las imágenes de los proyectos no pasan por acá: Astro las optimiza en el build.

### Vista previa para redes

`public/og-image.jpg` (1200 × 630) es la imagen que aparece al compartir el link en WhatsApp,
LinkedIn, X, etc. Se genera desde `assets-src/og/og-template.html`: abrirla en Chrome a 1200 × 630
y guardar una captura. Las etiquetas Open Graph / Twitter están en `src/layouts/BaseLayout.astro`
y usan `site` de `astro.config.mjs` para armar URLs absolutas.

### Variables de entorno

Los proyectos de Works se cargan desde Supabase (ver [Fuente de datos externa](#fuente-de-datos-externa)).
Creá un archivo `.env` en la raíz con:

```bash
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anon-public
```

Las mismas variables van en el deploy (Vercel → Settings → Environment Variables, entornos
**Production** y **Preview**) y requieren un nuevo deploy para aplicarse, porque se incrustan en el build.
Se declaran como públicas en `astro.config.mjs` (`env.schema`, módulo `astro:env/client`):
solo esas dos llegan al navegador.

Sin estas variables el sitio funciona igual: Works muestra el estado "todavía no están conectados".

## Estructura

```
src/
├── components/
│   ├── SiteHeader.astro           # Navegación principal; en mobile se colapsa en un menú desplegable
│   ├── FurName.astro              # Nombre con textura animal print que reacciona al cursor
│   ├── Typewriter.astro           # Frase rotativa con efecto máquina de escribir
│   ├── HangingStars.astro         # Navegación por secciones: estrellas colgadas de sogas
│   ├── SectionDialog.astro        # Visor de secciones y proyectos (animaciones + rutas por hash)
│   ├── ProjectConstellation.astro # Works: una estrella por proyecto (datos de la API)
│   ├── ProjectDetail.astro        # Vista de proyecto: galería en forma de estrella + ficha
│   ├── StarArt.astro              # Imagen recortada con la silueta de la estrella
│   ├── ServiceGrid.astro          # Services: grilla de servicios con íconos
│   └── ContactLinks.astro         # Contact: botones de email, WhatsApp e Instagram
├── assets/projects/<id>/          # Imágenes de cada proyecto (se detectan solas)
├── data/
│   └── sections.ts                # Contenido de las secciones y canales de contacto
├── lib/
│   ├── supabase.ts                # Cliente REST de Supabase (fetch, timeout, errores tipados)
│   ├── projectsStore.ts           # Proyectos: pedido, validación, caché y estados
│   └── projectImages.ts           # Busca y ordena las imágenes de cada proyecto
├── layouts/
│   └── BaseLayout.astro           # HTML base, fuentes y metadatos
├── pages/
│   └── index.astro                # Home
└── styles/
    └── global.css                 # Tokens (colores, tipografías) y estilos base
supabase/
└── projects.sql                   # Tabla, reglas de acceso y contenido inicial
assets-src/images/                 # Originales de diseño (no se publican)
scripts/
└── optimize-images.mjs            # Convierte los originales a WebP optimizados
public/
├── fonts/                         # Dunbar Low, Tango Sans, Tempting
└── images/                        # Imágenes optimizadas (WebP) e íconos
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

- **Siguiente:** la estrella da una vuelta completa mientras cambia el contenido.
- **Volver / Escape / botón atrás del navegador:** la estrella vuelve girando a su soga.
- El hash de la URL refleja la sección abierta, así que los links directos (`/#about`) funcionan.
- Usa `<dialog>` nativo: foco atrapado, fondo inerte y el foco vuelve a la estrella al cerrar.

### Works: constelación de proyectos

La sección Works muestra una estrella por proyecto con su portada recortada en forma de estrella.
Al elegir una, la estrellita gira y crece hasta convertirse en una galería, junto a una ficha
con el nombre, lo que hice, la descripción, pantallas ampliables y links al desarrollo completo
y al prototipo. "Siguiente" pasa al próximo proyecto y "Volver" regresa a la constelación.
Cada proyecto tiene su propia URL (`#work/loopies`).

El **contenido** (textos, roles, links, orden) viene de Supabase; las **imágenes** viven en el repo:

- `src/assets/projects/<id>/` → galería de la estrella (la primera es la portada). Los SVG y los
  archivos con "logo" en el nombre se muestran enteros; el resto se recorta para llenar la estrella.
- `src/assets/projects/<id>/ficha/` → imágenes debajo de la descripción. Las capturas muy altas
  se muestran recortadas y se recorren con scroll al ampliarlas.

Se ordenan por nombre de archivo (`1-logo.svg`, `2-app.png`) y Astro las optimiza en el build.
Como las imágenes se generan en el build pero la lista de proyectos llega en el navegador, cada
juego de imágenes se pre-renderiza dentro de un `<template>` y se clona cuando llega su proyecto.
Un proyecto sin carpeta de imágenes muestra su inicial como portada.

### `ServiceGrid` y `ContactLinks`

Services muestra cuatro servicios en una grilla con íconos que se iluminan al pasar el cursor.
Contact muestra botones a email, WhatsApp e Instagram sin exponer los datos en pantalla;
el botón "Hablemos" del header abre el mismo WhatsApp.

### `SiteHeader`

Barra de navegación fija. Debajo de 768px los links se agrupan en un panel
que se abre y cierra con un botón (accesible con teclado y `Escape`).

## Fuente de datos externa

### Qué es

Los **proyectos de Works** se guardan en una tabla de [Supabase](https://supabase.com) (PostgreSQL)
que funciona como un CMS propio: se agregan, editan, ordenan u ocultan desde el panel de Supabase
**sin tocar código ni hacer un nuevo deploy**. El sitio los consume a través de la **API REST** de
Supabase (PostgREST) con `fetch`, sin SDK.

- Cliente HTTP: [`src/lib/supabase.ts`](src/lib/supabase.ts)
- Pedido, validación, caché y estados: [`src/lib/projectsStore.ts`](src/lib/projectsStore.ts)
- Interfaz: [`ProjectConstellation.astro`](src/components/ProjectConstellation.astro) y
  [`ProjectDetail.astro`](src/components/ProjectDetail.astro)
- Tabla, reglas de acceso y contenido inicial: [`supabase/projects.sql`](supabase/projects.sql)

### Qué datos se obtienen

```
GET /rest/v1/projects
    ?select=id,name,roles,description,case_study_url,prototype_url,image_alts,card_image_alts
    &order=sort_order.asc
```

| Campo | Uso en el sitio |
| --- | --- |
| `id` | URL del proyecto (`#work/<id>`) y carpeta de sus imágenes |
| `name` | Nombre en la constelación y título de la ficha |
| `roles` | Etiquetas de "qué hice" |
| `description` | Texto de la ficha |
| `case_study_url`, `prototype_url` | Botones "Ver desarrollo completo" y "Ver prototipo" (solo si existen) |
| `image_alts`, `card_image_alts` | Descripciones de las imágenes para lectores de pantalla |

Las columnas se piden siempre de forma explícita: el rol anónimo no tiene permiso sobre las
columnas internas (`published`, `updated_at`), y sin `select` la API intentaría devolver todas
y respondería **401**.

### Estrategia de carga: stale-while-revalidate

1. Si el navegador tiene una copia de una visita anterior (`localStorage`), los proyectos se
   muestran **al instante** desde ahí.
2. En paralelo se piden los datos frescos a la API; si cambiaron, se actualiza la vista y la copia.
3. Si la API falla pero hay copia, la visita sigue viendo los proyectos sin ningún error.

Los proyectos se empiezan a pedir apenas carga la página, así que cuando se abre Works ya están listos.
Si alguien entra por un link directo a un proyecto (`/#work/frameit`), la vista espera los datos
antes de abrirlo; si el proyecto no existe o no está publicado, vuelve a la constelación.

### Seguridad

- La clave `anon` es **pública por diseño**: lo que la limita es **Row Level Security**.
  Solo puede **leer proyectos publicados** (`published = true`); no puede crear, editar ni borrar.
- Todo el contenido que llega de la API se inserta con `textContent`, nunca como HTML (sin XSS),
  y los links solo se usan si empiezan con `http(s)://` (descarta `javascript:` y similares).
- Las filas mal formadas se descartan en lugar de romper la página.

### Límites y errores

| Situación | Cómo se maneja |
| --- | --- |
| Variables de entorno faltantes | "Los proyectos todavía no están conectados" (sin reintento) |
| Sin conexión / error de red | Copia guardada si existe; si no, mensaje + **Reintentar** |
| Respuesta lenta | Timeout de 8 s (`AbortController`) |
| Error del servidor (5xx) | Un reintento automático; si vuelve a fallar, copia guardada o mensaje + Reintentar |
| Límite de pedidos de Supabase (429) | "Hay muchas visitas a la vez. Probá de nuevo en un momento." |
| Permisos / configuración (401/403) | "No pudimos acceder a los proyectos." |
| Respuesta con forma inesperada | Se descartan las filas inválidas |
| Tabla vacía | "Pronto vas a ver mis proyectos acá." |
| `localStorage` lleno o bloqueado | El sitio funciona igual, sin caché |
| Datos que cambian con un proyecto abierto | Se aplican al cerrar la ficha, nunca bajo los ojos de la visita |

### Estados de la interfaz

Carga (esqueleto de estrellas), constelación con proyectos, vacío, error con reintento,
no configurado, proyecto seleccionado (ficha abierta) e imagen ampliada.

### Configurar Supabase

1. Crear un proyecto en Supabase.
2. En **SQL Editor**, ejecutar [`supabase/projects.sql`](supabase/projects.sql): crea la tabla,
   las reglas de acceso y carga los proyectos actuales.
3. Copiar **Project URL** y la clave **`anon` `public`** (Project Settings → API) en `.env`
   y en las variables de entorno del deploy (Vercel).

**Agregar un proyecto:** crear la carpeta `src/assets/projects/<id>/` con sus imágenes (requiere
deploy) y una fila en la tabla `projects` con el mismo `id`. **Editar textos o links:** solo desde
Supabase, sin deploy.

## Deploy

https://barbaracarballo.vercel.app/

## Créditos

- Tipografía **Tempting**: licencia de uso personal.
- Diseño original en Figma.
