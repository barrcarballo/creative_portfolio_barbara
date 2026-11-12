-- Visitor stars ("libro de visitas"): run this once in Supabase → SQL Editor.
--
-- The site talks to this table through Supabase's REST API (PostgREST) using
-- the public "anon" key. That key is safe to ship in the browser because the
-- Row Level Security policies below are what actually decide what it can do:
-- anyone may read and add stars, nobody may edit or delete them.
-- Validation lives in the database, so it can't be bypassed from the client.

create table if not exists public.visitor_stars (
  id          bigint generated always as identity primary key,
  name        text        not null check (char_length(btrim(name)) between 1 and 30),
  message     text        not null check (char_length(btrim(message)) between 1 and 140),
  -- Position in the constellation, 0–100 (% of the sky), picked by the visitor's browser.
  x           numeric(5,2) not null check (x between 0 and 100),
  y           numeric(5,2) not null check (y between 0 and 100),
  created_at  timestamptz not null default now(),
  -- Moderation: set to false from the dashboard to hide a star without deleting it.
  visible     boolean     not null default true
);

create index if not exists visitor_stars_created_at_idx
  on public.visitor_stars (created_at desc);

alter table public.visitor_stars enable row level security;

-- Read: only stars that haven't been hidden.
drop policy if exists "Anyone can read visible stars" on public.visitor_stars;
create policy "Anyone can read visible stars"
  on public.visitor_stars for select
  to anon
  using (visible = true);

-- Create: anyone, but they can't sneak in a hidden/visible flag of their own.
drop policy if exists "Anyone can add a star" on public.visitor_stars;
create policy "Anyone can add a star"
  on public.visitor_stars for insert
  to anon
  with check (visible = true);

-- No update/delete policies → those operations are denied for the anon key.

-- Anon may only write the visitor-provided columns.
revoke all on public.visitor_stars from anon;
grant select (id, name, message, x, y, created_at) on public.visitor_stars to anon;
grant insert (name, message, x, y) on public.visitor_stars to anon;
