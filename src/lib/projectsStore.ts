/**
 * Portfolio projects, loaded from Supabase (table `projects`).
 *
 * Request:
 *   GET /rest/v1/projects?select=<columns>&order=sort_order.asc
 *
 * Strategy — stale-while-revalidate:
 *   1. If a copy from a previous visit is in localStorage, publish it right
 *      away (instant render, works offline).
 *   2. Fetch fresh data in the background (one automatic retry on transient
 *      errors) and publish it if it changed.
 *   3. If the network fails but a cached copy exists, keep showing it; only
 *      without any copy is an error published.
 *
 * Components subscribe with `onProjects()`; the first call to `loadProjects()`
 * starts the request and every later call shares it.
 */
import { SupabaseError, selectFrom, type SupabaseErrorKind } from './supabase';

export interface Project {
  id: string;
  name: string;
  roles: string[];
  description: string;
  caseStudyUrl: string | null;
  prototypeUrl: string | null;
  imageAlts: string[];
  cardImageAlts: string[];
}

export type ProjectsState =
  | { status: 'loading' }
  | { status: 'ready'; projects: Project[]; source: 'cache' | 'network' }
  | { status: 'error'; kind: SupabaseErrorKind };

/** Columns the anon role may read (see supabase/projects.sql). Always explicit. */
const COLUMNS =
  'id,name,roles,description,case_study_url,prototype_url,image_alts,card_image_alts';
const CACHE_KEY = 'portfolio:projects:v1';
const RETRY_DELAY_MS = 800;

// --- Parsing --------------------------------------------------------------

const asStrings = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const asUrl = (value: unknown) =>
  typeof value === 'string' && /^https?:\/\//.test(value) ? value : null;

/** Turn raw rows into `Project`s, dropping anything malformed instead of failing. */
function parse(data: unknown): Project[] {
  if (!Array.isArray(data)) throw new SupabaseError('server', 'Unexpected response shape.');
  return data
    .filter(
      (row) =>
        row &&
        typeof row.id === 'string' &&
        /^[a-z0-9-]+$/.test(row.id) &&
        typeof row.name === 'string' &&
        row.name.trim(),
    )
    .map((row) => ({
      id: row.id,
      name: row.name.trim(),
      roles: asStrings(row.roles),
      description: typeof row.description === 'string' ? row.description : '',
      caseStudyUrl: asUrl(row.case_study_url),
      prototypeUrl: asUrl(row.prototype_url),
      imageAlts: asStrings(row.image_alts),
      cardImageAlts: asStrings(row.card_image_alts),
    }));
}

// --- Cache ----------------------------------------------------------------

function readCache(): Project[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? parse(JSON.parse(raw).projects) : null;
  } catch {
    return null; // corrupted or unavailable storage: just skip the cache
  }
}

function writeCache(projects: Project[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), projects }));
  } catch {
    // Storage full or blocked (private mode): the site works without it.
  }
}

// --- Store ----------------------------------------------------------------

type Listener = (state: ProjectsState) => void;

let state: ProjectsState = { status: 'loading' };
const listeners = new Set<Listener>();
let inFlight: Promise<void> | null = null;

const publish = (next: ProjectsState) => {
  state = next;
  listeners.forEach((listener) => listener(state));
};

/** Subscribe to state changes; the listener is called right away with the current state. */
export function onProjects(listener: Listener) {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

export const getProjectsState = () => state;

const fetchProjects = async () =>
  parse(await selectFrom('projects', { select: COLUMNS, order: 'sort_order.asc' }));

/**
 * Start (or retry) loading. Resolves when the network attempt finishes,
 * whatever its outcome — read the result from the published state.
 */
export function loadProjects(): Promise<void> {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const cached = state.status === 'ready' ? state.projects : readCache();
    if (cached) publish({ status: 'ready', projects: cached, source: 'cache' });
    else publish({ status: 'loading' });

    try {
      let projects: Project[];
      try {
        projects = await fetchProjects();
      } catch (error) {
        const transient =
          error instanceof SupabaseError && ['offline', 'timeout', 'server'].includes(error.kind);
        if (!transient) throw error;
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        projects = await fetchProjects();
      }

      writeCache(projects);
      const changed = JSON.stringify(projects) !== JSON.stringify(cached);
      if (changed || !cached) publish({ status: 'ready', projects, source: 'network' });
    } catch (error) {
      // With a cached copy the visitor keeps seeing projects; no error needed.
      if (!cached) {
        publish({
          status: 'error',
          kind: error instanceof SupabaseError ? error.kind : 'server',
        });
      }
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
