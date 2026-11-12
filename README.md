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

### Variables de entorno

El libro de visitas usa Supabase (ver [Fuente de datos externa](#fuente-de-datos-externa)).
Creá un archivo `.env` en la raíz con:

```bash
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-public
```

Sin estas variables el sitio funciona igual: el libro de visitas muestra el estado
"todavía no está conectado" y deshabilita el envío.

## Estructura

```
src/
├── components/
│   ├── SiteHeader.astro     # Navegación principal; en mobile se colapsa en un menú desplegable
│   ├── FurName.astro        # Nombre con textura animal print que reacciona al cursor
│   ├── HangingStars.astro   # Navegación por secciones: estrellas colgadas de sogas
│   ├── Typewriter.astro     # Frase rotativa con efecto máquina de escribir
│   ├── SectionDialog.astro  # Visor de secciones y proyectos (animaciones + rutas por hash)
│   ├── ProjectConstellation.astro # Works: una estrella por proyecto
│   ├── ProjectDetail.astro  # Vista de proyecto: galería en forma de estrella + ficha
│   └── StarArt.astro        # Imagen recortada con la silueta de la estrella
├── assets/projects/<id>/    # Imágenes de cada proyecto (se detectan solas)
├── data/
│   ├── sections.ts          # Contenido de cada sección (id = hash de la URL)
│   └── projects.ts          # Proyectos de Works
├── lib/
│   └── projectImages.ts     # Busca y ordena las imágenes de cada proyecto
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

### Works: constelación de proyectos

La sección Works muestra una estrella por proyecto con su portada recortada en forma de estrella.
Al elegir una, la estrellita gira y crece hasta convertirse en una galería, junto a una ficha
con el nombre, lo que hice y la descripción. "Siguiente" pasa al próximo proyecto y "Volver"
regresa a la constelación. Cada proyecto tiene su propia URL (`#work/loopies`).

**Agregar imágenes:** copiá los archivos (`.jpg`, `.png`, `.webp`, `.avif`) en
`src/assets/projects/<id-del-proyecto>/`. Se ordenan por nombre de archivo
(por ejemplo `1-portada.jpg`, `2-app.png`); la primera es la portada. Astro las optimiza en el build.
Las descripciones para lectores de pantalla van en `imageAlts` dentro de `src/data/projects.ts`.

### `VisitorStars` — cielo de visitas

Libro de visitas en forma de cielo nocturno dentro de Contact. Al tocar el cielo se elige dónde
va a brillar la estrella; al enviarla aparece con una animación y muestra su mensaje. Al pasar el
cursor (o al hacer foco con el teclado) sobre cualquier estrella se ve el nombre, el mensaje y la fecha.
Consume datos externos: ver [Fuente de datos externa](#fuente-de-datos-externa).

### `SiteHeader`

Barra de navegación fija. Debajo de 768px los links se agrupan en un panel
que se abre y cierra con un botón (accesible con teclado y `Escape`).

## Fuente de datos externa

### Qué es

**Cielo de visitas** (sección Contact → "Dejá tu estrella", URL `#contact/estrellas`): un libro de
visitas donde cada visitante deja una estrella con su nombre y un mensaje corto, y todos ven la
constelación compartida. Los datos viven en una base PostgreSQL de [Supabase](https://supabase.com)
y el sitio la consume a través de su **API REST** (PostgREST) con `fetch`, sin SDK.

- Cliente de la API: [`src/lib/visitorStars.ts`](src/lib/visitorStars.ts)
- Interfaz y estados: [`src/components/VisitorStars.astro`](src/components/VisitorStars.astro)
- Esquema y reglas de acceso: [`supabase/schema.sql`](supabase/schema.sql)

### Qué datos se obtienen y se envían

| Operación | Pedido | Datos |
| --- | --- | --- |
| Leer el cielo | `GET /rest/v1/visitor_stars?select=id,name,message,x,y,created_at&order=created_at.desc&limit=150` | Las 150 estrellas más recientes: nombre, mensaje, posición (`x`, `y` en % del cielo) y fecha |
| Dejar una estrella | `POST /rest/v1/visitor_stars?select=id,name,message,x,y,created_at` con `Prefer: return=representation` | `name`, `message`, `x`, `y`; la API devuelve la estrella creada (con `id` y fecha) |

Los dos pedidos piden las columnas de forma explícita (`select`): el rol anónimo no puede leer la
columna de moderación `visible`, y sin `select` la API intentaría devolver todas las columnas y
respondería **401**.

Ambos pedidos llevan la clave pública (`apikey` / `Authorization: Bearer`).

### Seguridad

- La clave `anon` es **pública por diseño**: lo que limita lo que puede hacer es
  **Row Level Security** en la base. Cualquiera puede **leer** estrellas visibles y **crear** estrellas;
  nadie puede editarlas ni borrarlas, y solo puede escribir las columnas `name`, `message`, `x` e `y`.
- Las reglas de validación están **en la base de datos** (nombre de 1 a 30 caracteres, mensaje de 1 a 140,
  posición entre 0 y 100), así que no se pueden saltear modificando el navegador. El formulario repite
  esas reglas solo para dar feedback inmediato.
- Lo que escriben las visitas se muestra siempre con `textContent`, nunca como HTML, para evitar XSS.
- Moderación: desde el panel de Supabase se puede ocultar una estrella (`visible = false`) sin borrarla.

### Límites y errores

| Situación | Cómo se maneja |
| --- | --- |
| Variables de entorno faltantes | Estado "todavía no está conectado"; el envío queda deshabilitado |
| Sin conexión / error de red | Mensaje específico + botón **Reintentar** |
| Respuesta lenta | Timeout de 8 s (`AbortController`) → mensaje + Reintentar |
| Error del servidor (5xx) | Un reintento automático; si vuelve a fallar, mensaje + Reintentar |
| Límite de pedidos de Supabase (429) | "Hay muchas visitas a la vez, esperá un momento" |
| Datos rechazados por la base (400) | "Tu estrella no pudo guardarse: revisá el nombre y el mensaje" |
| Permisos / configuración (401/403) | Error del servidor: no es algo que la visita pueda corregir |
| Respuesta con forma inesperada | Se descartan las filas inválidas en lugar de romper el cielo |
| Spam desde el mismo navegador | Espera de 60 s entre estrellas (`localStorage`) |
| Cantidad de estrellas | Se muestran las 150 más recientes para que el cielo siga siendo legible |

### Estados de la interfaz

Carga ("Buscando estrellas…"), cielo con estrellas, vacío ("¡Dejá la primera!"), error con reintento,
no configurado, posición elegida (estrella punteada), enviando, enviada (la estrella aparece con una
animación y su mensaje) y errores de validación. Al volver a abrir el cielo, los datos se refrescan
si pasaron más de 30 segundos.

### Configurar Supabase

1. Crear un proyecto en Supabase.
2. En **SQL Editor**, ejecutar [`supabase/schema.sql`](supabase/schema.sql).
3. Copiar **Project URL** y la clave **`anon` `public`** (Project Settings → API) en `.env`
   y en las variables de entorno del deploy (Vercel).

## Deploy

https://barbaracarballo.vercel.app/

## Créditos

- Tipografía **Tempting**: licencia de uso personal.
- Diseño original en Figma.
