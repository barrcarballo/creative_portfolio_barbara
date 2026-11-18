-- Portfolio projects ("Works"): run this once in Supabase → SQL Editor.
--
-- The site reads this table through Supabase's REST API (PostgREST) with the
-- public "anon" key. Row Level Security makes that key read-only and limited
-- to published projects. Edit content from the dashboard (Table Editor):
-- changes show up on the site without a new deploy.
--
-- Images are NOT stored here: they live in the repo under
-- src/assets/projects/<id>/ so Astro can optimise them. `id` must match that
-- folder name.

create table if not exists public.projects (
  -- Slug used in the URL (#work/<id>) and as the image folder name.
  id               text primary key check (id ~ '^[a-z0-9-]+$'),
  name             text   not null check (char_length(btrim(name)) between 1 and 60),
  -- What Barbara did on the project, shown as tags.
  roles            text[] not null default '{}',
  description      text   not null default '',
  case_study_url   text   check (case_study_url is null or case_study_url ~ '^https?://'),
  prototype_url    text   check (prototype_url is null or prototype_url ~ '^https?://'),
  -- Screen-reader descriptions for the gallery / card images, in file order.
  image_alts       text[] not null default '{}',
  card_image_alts  text[] not null default '{}',
  -- Lower numbers first.
  sort_order       int    not null default 0,
  -- Unpublished projects are hidden from the site.
  published        boolean not null default true,
  updated_at       timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "Anyone can read published projects" on public.projects;
create policy "Anyone can read published projects"
  on public.projects for select
  to anon
  using (published = true);

-- No insert/update/delete policies → the anon key is read-only.
-- Anon may only read the columns the site uses (always request them with an
-- explicit `select`, otherwise PostgREST asks for `*` and gets a 401).
revoke all on public.projects from anon;
grant select (id, name, roles, description, case_study_url, prototype_url,
              image_alts, card_image_alts, sort_order)
  on public.projects to anon;

-- Keep updated_at fresh when editing from the dashboard.
create or replace function public.touch_projects_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_projects_updated_at();

-- ---------------------------------------------------------------------------
-- Initial content (generated from the previous src/data/projects.ts).
-- Safe to re-run: existing rows are updated.
-- ---------------------------------------------------------------------------
insert into public.projects
  (id, name, roles, description, case_study_url, prototype_url, image_alts, card_image_alts, sort_order)
values
  ('loopies', 'Loopies', array['Identidad', 'Diseño de app']::text[],
   'Loopies es una pâtisserie con un toque cannábico. El nombre sale de “Loop”, que así se llama a los bucles de la montaña rusa. Este juego suele relacionarse con la diversión y podría considerarse un “viaje”, una palabra que suele ser parte de la jerga de la marihuana. Básicamente, todo el branding gira alrededor del nombre. El concepto apunta a lo creativo, innovador y colorido buscando, aún así, generar empatía con los clientes utilizando elementos ya conocidos por ellos.',
   'https://www.figma.com/proto/ZItD0tuRLJQxi8Rb3Hp2wT/Loopies---version-2.0?node-id=63-4378&viewport=377%2C178%2C0.06&t=G1F3lZ1kHUXPkQYK-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=63%3A4378&page-id=63%3A4377',
   'https://www.figma.com/proto/vxVygBysZXcy7lka1a1715/Proyecto-final---Figma?node-id=2118-1544&viewport=207%2C-125%2C0.13&t=ReseP4MRra162ihD-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=2118%3A1544&page-id=0%3A1',
   array['Logo de Loopies en violeta, con las dos “o” dibujadas como espirales']::text[], array['Cuatro pantallas de la app de Loopies: inicio, menú de cookies, puntos acumulados y perfil']::text[], 10),
  ('ketupe', 'KeTuPé', array['Rediseño web', 'Nuevo lanzamiento']::text[],
   'KeTuPé es una marca de ropa urbana que propone prendas pensadas para usarse afuera, en la ciudad y en el día a día. La marca se inspira en el movimiento, el calor y los cuerpos reales, y busca construir una identidad cercana, auténtica y visualmente fuerte. El sitio web funciona como un espacio de exploración visual, donde la fotografía lifestyle y la comunidad ocupan un rol central dentro de la experiencia.',
   'https://www.figma.com/proto/LqvylADtneHCxVFZ1p5jjG/KTP---Redesign?node-id=1-3&viewport=238%2C346%2C0.04&t=1NMWSHgg82wNWQFV-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=1%3A3&page-id=0%3A1',
   'https://www.figma.com/proto/LqvylADtneHCxVFZ1p5jjG/KTP---Redesign?node-id=27-227&viewport=238%2C346%2C0.04&t=1NMWSHgg82wNWQFV-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=1%3A3&page-id=0%3A1',
   array['Logo de KeTuPé: las letras KTP en marrón']::text[], array['Rediseño del sitio de KeTuPé en desktop y mobile: banner de la colección Verano 26, best sellers y sección para postularse como modelo']::text[], 20),
  ('studio3', 'Studio3', array['UI web', 'Frontend']::text[],
   'Studio3 es un estudio creativo de diseñadoras multimediales.',
   null,
   'https://prog3-tp4-ecommerce.vercel.app/',
   array['Logo de Studio3: la palabra “studio” con un 3 en superíndice']::text[], array['Landing completa de Studio3: hero “Think. Build. Connect.”, servicios en pestañas de colores, el equipo y una grilla de trabajos']::text[], 30),
  ('girliesout', 'GirliesOut', array['UX/UI', 'App mobile iOS']::text[],
   'GirliesOut es una app para que las jóvenes encuentren planes divertidos y seguros en la Ciudad de Buenos Aires.',
   'https://www.figma.com/proto/elhhQCSv6907oJ2NPpJsRS/girliesOut---iOS-app?node-id=659-3980&viewport=429%2C339%2C0.09&t=k3o58UVgxdbvBqNy-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=659%3A3980&page-id=659%3A3979',
   'https://www.figma.com/proto/elhhQCSv6907oJ2NPpJsRS/girliesOut---iOS-app?node-id=657-5331&viewport=914%2C519%2C0.07&t=npsYikpPKCHYrZCA-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=657%3A5331&page-id=237%3A682',
   array['Ícono de la app GirliesOut: una “g” blanca sobre fondo rojo, rodeada de destellos']::text[], array['Cinco pantallas de la app GirliesOut: login, inicio con nuevos eventos, reservas, búsqueda por categorías y perfil']::text[], 40),
  ('frameit', 'FrameIt', array['Identidad de marca', 'Branding', 'UX/UI', 'Modelado 3D', 'Frontend', 'Backend']::text[],
   'FrameIt es una cabina de fotos portátil y autónoma, diseñada para transformar cualquier evento en una experiencia memorable. A diferencia de las cabinas de alquiler genéricas, FrameIt combina tecnología, diseño de producto y creatividad visual en un dispositivo compacto que se adapta a bodas, fiestas corporativas y festivales. Cada captura se convierte en un recuerdo personalizado a través de marcos generativos únicos, tiras fotográficas y una galería digital que conecta lo físico con lo digital. FrameIt no es solo una cabina de fotos: es una pieza de diseño que documenta momentos y los convierte en contenido compartible.',
   'https://drive.google.com/file/d/1WQWu3S93WCUfjgjxhdi3wVistryqNox0/view?usp=sharing',
   'https://frameit-lac.vercel.app/',
   array['Logo de FrameIt: la palabra “Frame” y “it” dentro de un recuadro de visor de cámara']::text[], array['Seis pantallas de la cabina FrameIt: inicio, elección de modo, captura con cuenta regresiva, preview de la tira, elección de fondo y código QR para descargar la foto']::text[], 50)
on conflict (id) do update set
  name = excluded.name,
  roles = excluded.roles,
  description = excluded.description,
  case_study_url = excluded.case_study_url,
  prototype_url = excluded.prototype_url,
  image_alts = excluded.image_alts,
  card_image_alts = excluded.card_image_alts,
  sort_order = excluded.sort_order;
