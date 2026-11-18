# Barbara — Creative portfolio

**Sitio:** https://barbaracarballo.vercel.app · **Repositorio:** https://github.com/barrcarballo/creative_portfolio_barbara

## Sobre el proyecto

Portfolio personal de Barbara Carballo, diseñadora multimedial con perfil UX/UI y desarrollo front y back.

**La propuesta:** un portfolio que se recorre como un objeto, no como un documento. La identidad
gira alrededor de una textura de **animal print con pelaje**: el nombre es de peluche y reacciona al
cursor, las secciones son **estrellas colgadas de sogas** que caen al cargar la página y se balancean
al pasar el mouse, y al elegir una, la estrella vuela girando hasta el centro y se abre para mostrar
su contenido. La idea es que la forma de navegar ya cuente cómo diseña: con personalidad, pero sin
perder claridad.

**Público:** potenciales clientes, estudios y equipos que buscan una diseñadora multimedial
(identidad, UX/UI, edición de video) que además pueda llevar sus diseños a código. El sitio prioriza
ver los trabajos rápido (en dos clicks se llega a cualquier proyecto) y contactar sin fricción
(WhatsApp, email e Instagram a un toque).

**Secciones:** Sobre mí · Trabajos (5 proyectos con galería, pantallas y links) · Servicios · Contacto.

## Tecnologías y decisiones principales

| Tecnología | Para qué | Por qué |
| --- | --- | --- |
| [Astro](https://astro.build) 7 | Sitio estático, componentes `.astro` | Genera HTML estático (carga rápida, buen SEO) y solo envía JavaScript donde hay interacción. |
| TypeScript + JavaScript sin framework | Interacciones (resortes, péndulos, rutas, carga de datos) | Las interacciones son pocas y muy específicas; un framework de UI agregaría peso sin resolver nada que el DOM no resuelva. |
| CSS propio con estilos *scoped* de Astro | Estilos | Cada componente trae sus estilos; tokens de color y tipografía en `global.css`. Medidas fluidas con `clamp()` y unidades de contenedor (`cqw`). |
| Web Animations API | Vuelo de estrellas, giros, transiciones | Animaciones encadenables con `await` y canceladas al cerrar, sin librerías. |
| `<dialog>` nativo | Visor de secciones, proyectos e imágenes | Trae gratis foco atrapado, fondo inerte, cierre con `Escape` y devolución del foco. |
| Rutas por hash (`#work/loopies`) | Navegación entre secciones y proyectos | Cada vista tiene URL propia (links directos, botón atrás) sin necesidad de servidor. |
| [Supabase](https://supabase.com) (API REST con `fetch`) | Contenido de los proyectos | Funciona como CMS: el contenido se edita sin deploy. Sin SDK, para que cada pedido sea explícito. Ver [Fuente de datos externa](#fuente-de-datos-externa). |
| `astro:assets` + [sharp](https://sharp.pixelplumbing.com) | Imágenes | Las imágenes de proyectos se optimizan en el build (WebP, varios tamaños); las de diseño, con un script propio. |
| [Vercel](https://vercel.com) | Deploy | Deploy automático desde `main` y previews por branch. |

**Otras decisiones:**
- **Mejora progresiva:** sin JavaScript el contenido igual se ve (las estrellas aparecen en su lugar,
  el título muestra la primera frase). Las animaciones son una capa encima, no un requisito.
- **El contenido de los proyectos en una base de datos y las imágenes en el repo:** así se edita
  texto sin deploy, pero las imágenes siguen pasando por la optimización de Astro.
- **Un solo origen de datos por tema:** las secciones y los canales de contacto en `src/data/sections.ts`
  (el botón "Hablemos" y Contacto usan el mismo WhatsApp); los proyectos en Supabase.

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

### `Typewriter`

La línea debajo del nombre se escribe sola y va rotando entre "diseñadora multimedial", "creativa",
"diseñadora UX/UI" y "fan de los detalles". El tamaño de la línea se calcula para que entre la frase
más larga, así el cambio de frase nunca mueve el resto de la página. Los lectores de pantalla reciben
la lista completa una sola vez (no cada letra); con movimiento reducido, las frases cambian sin tipeo.

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

### `StarArt`

Recorta cualquier imagen con la silueta de la estrella (usando la propia imagen de la estrella como
máscara) y le pone el borde de pelaje. Lo usan las estrellitas de la constelación y la galería de la ficha.

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

## Responsive

El diseño se adapta, no solo se achica: en pantallas chicas cambia la disposición de cada parte.

- **Tipografía y espacios fluidos** con `clamp()`: el título va de 26 a 80 px según el ancho.
  Dentro de la estrella grande, los tamaños usan unidades de contenedor (`cqw`), así el contenido
  escala con la estrella y no con la ventana.
- **Alturas de pantalla móviles** con `svh` / `dvh`, para que la barra del navegador del celular no
  tape contenido.
- **Imágenes responsivas:** las de proyectos se sirven en varios tamaños (`srcset` / `sizes`) y el
  navegador elige la adecuada; el borde de pelaje tiene una versión chica y una grande.

| Ancho | Cambios |
| --- | --- |
| < 1100 px | El navbar reduce la separación entre links |
| < 768 px | El navbar se colapsa en un menú desplegable (botón "menú" / "cerrar") |
| < 720 px | Estrellas en 2 × 2; la estrella grande se agranda y desborda a los costados para que su centro siga siendo legible; Servicios muestra solo ícono y título; la constelación de proyectos usa estrellitas más grandes |
| < 900 px | La ficha de proyecto pasa de dos columnas (galería + texto) a una, con scroll |

Las capturas de página completa se muestran recortadas en la ficha y se recorren con scroll al
ampliarlas, en lugar de achicarse hasta ser ilegibles. Revisado en 390, 1280, 1366, 1440 y 1920 px de ancho.

## Accesibilidad

- **Estructura semántica:** `lang="es"`, `header`, `nav` con etiqueta ("Principal", "Secciones del
  portfolio"), `main`, jerarquía de títulos; cada vista del visor anuncia su título (`aria-labelledby`).
- **Teclado:** todo lo interactivo es un link o un botón real, con foco visible. `Escape` cierra, en
  orden, la imagen ampliada, el proyecto, la sección y el menú mobile. El `<dialog>` atrapa el foco,
  lo lleva al título al abrir un proyecto y lo devuelve a la estrella al cerrar. El contenido oculto
  se marca como `inert` para que el teclado no llegue a lo que no se ve.
- **Movimiento reducido:** con `prefers-reduced-motion` no hay caída de estrellas, balanceo, giros,
  tipeo ni destellos; las transiciones pasan a ser fundidos cortos o cambios directos.
- **Textos alternativos:** las imágenes de proyectos tienen descripciones propias (cargadas desde
  Supabase); las decorativas usan `alt=""`. Los links externos avisan "se abre en una pestaña nueva"
  a lectores de pantalla; los íconos llevan texto oculto con su nombre.
- **Estados anunciados:** `aria-busy` mientras cargan los proyectos, mensajes de error y vacío con
  `role="status"`, miniaturas de galería con `aria-pressed`.
- **Contraste:** marrón `#4a2500` sobre crema `#fbebda` y crema sobre marrón en botones y navbar.

## Limitaciones conocidas y posibles mejoras

**Limitaciones**

- **Plan gratuito de Supabase:** los proyectos inactivos se pausan después de una semana sin uso. Si
  pasa, quien ya visitó el sitio sigue viendo los trabajos desde la copia guardada, pero una visita
  nueva ve el mensaje de error hasta que se reactive el proyecto desde el panel.
- **Agregar un proyecto requiere deploy:** el texto se edita en Supabase, pero las imágenes viven en el
  repo para que Astro las optimice.
- **Las secciones dependen de JavaScript:** el contenido de Sobre mí, Servicios y Contacto está en el
  HTML, pero se muestra dentro del visor animado. Los proyectos se cargan en el navegador, así que
  los buscadores no los indexan.
- **Firefox** todavía no soporta `text-box`: el texto "menú" del navbar mobile queda unos píxeles más
  abajo que en Chrome y Safari.
- **Logo de Studio3:** el SVG tiene el texto sin convertir a curvas y depende de Avenir Next; en
  Windows y Android se ve con otra tipografía.
- **Datos de contacto:** no se muestran en pantalla, pero el email y el número están en los links
  (`mailto:` y `wa.me`), así que quien lea el código fuente los puede ver.
- **Accesibilidad:** revisada con teclado y en el navegador, pero no probada a fondo con lectores de
  pantalla (VoiceOver, NVDA).
- **Sin tests automatizados**, y el sitio está solo en español.

**Posibles mejoras**

- Guardar las imágenes de los proyectos en **Supabase Storage** para agregar trabajos sin deploy.
- Evitar la pausa del plan gratuito con un pedido programado (cron) o un plan pago.
- Generar los proyectos en el build y revalidar periódicamente, para que sean indexables sin perder
  la edición sin deploy.
- Tests end-to-end (por ejemplo con Playwright) para la navegación y los estados de la API.
- Versión en inglés.
- La branch `feat/parallax-scroll` tiene una prueba de escena con parallax ("cae la noche") que quedó
  sin integrar.

## Deploy

https://barbaracarballo.vercel.app/ (Vercel, deploy automático desde `main`).

## Créditos y licencias

**Diseño y contenido:** diseño original de Barbara Carballo en Figma. Las imágenes de los proyectos,
las letras y las estrellas de animal print son material propio.

**Tipografías**

| Tipografía | Uso | Licencia |
| --- | --- | --- |
| [Jost](https://fonts.google.com/specimen/Jost) | Textos | SIL Open Font License, vía Google Fonts |
| Georgia | Títulos | Tipografía del sistema (no se distribuye con el sitio) |
| Dunbar Low | Navegación, botones | Comercial |
| Tango Sans | "soy" del título | Comercial |
| Tempting | Iniciales decorativas | Comercial (versión de uso personal) |

> **Nota sobre tipografías:** Dunbar Low, Tango Sans y Tempting son tipografías comerciales usadas
> en este proyecto **con fines académicos**, sin licencia de uso web. Antes de usar el sitio
> profesionalmente hay que adquirir sus licencias o reemplazarlas por alternativas libres (OFL);
> el cambio está centralizado en los tokens de `src/styles/global.css`.

**Software**

- [Astro](https://astro.build) — MIT
- [sharp](https://sharp.pixelplumbing.com) — Apache 2.0
- [Supabase](https://supabase.com) — servicio de base de datos y API (plan gratuito)
- Íconos de servicios, contacto, lupa y cierre: SVG dibujados para el sitio.
- Flechas (`arrow-*.svg`): [Phosphor Icons](https://phosphoricons.com) — MIT.
