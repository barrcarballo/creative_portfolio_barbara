/**
 * Client for the visitor stars guestbook, stored in Supabase.
 *
 * Talks to Supabase's REST API (PostgREST) with plain `fetch` — no SDK — so
 * every request is explicit:
 *   GET  /rest/v1/visitor_stars?select=…&order=created_at.desc&limit=…  → list
 *   POST /rest/v1/visitor_stars  (Prefer: return=representation)       → create
 *
 * The anon key is public by design; Row Level Security in the database
 * (see supabase/schema.sql) is what limits it to "read + insert".
 *
 * Every failure is turned into a `StarsError` with a `kind`, so the UI can show
 * a specific message instead of a generic "something went wrong".
 */

export interface VisitorStar {
  id: number;
  name: string;
  message: string;
  /** Position in the sky, 0–100 (% of width / height). */
  x: number;
  y: number;
  created_at: string;
}

export interface NewVisitorStar {
  name: string;
  message: string;
  x: number;
  y: number;
}

export type StarsErrorKind =
  | 'not-configured' // env vars missing
  | 'offline' // no network / DNS / CORS
  | 'timeout' // server too slow
  | 'rate-limit' // 429 from Supabase
  | 'invalid' // rejected by the database checks
  | 'server'; // anything else (5xx, unexpected response)

export class StarsError extends Error {
  constructor(
    public kind: StarsErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'StarsError';
  }
}

/** Limits mirrored from the database constraints, for instant feedback. */
export const LIMITS = { name: 30, message: 140 } as const;

/** Most recent stars shown in the sky. */
const MAX_STARS = 150;
const TIMEOUT_MS = 8000;

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const endpoint = () => `${SUPABASE_URL!.replace(/\/$/, '')}/rest/v1/visitor_stars`;

const headers = () => ({
  apikey: SUPABASE_ANON_KEY!,
  Authorization: `Bearer ${SUPABASE_ANON_KEY!}`,
  'Content-Type': 'application/json',
});

/** fetch with a timeout and errors mapped to `StarsError`. */
async function request(input: string, init: RequestInit = {}): Promise<Response> {
  if (!isConfigured) {
    throw new StarsError('not-configured', 'Supabase environment variables are missing.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(input, {
      ...init,
      headers: { ...headers(), ...(init.headers as Record<string, string> | undefined) },
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) throw new StarsError('timeout', 'The request timed out.');
    throw new StarsError('offline', error instanceof Error ? error.message : 'Network error.');
  } finally {
    clearTimeout(timer);
  }

  if (response.ok) return response;

  if (response.status === 429) {
    throw new StarsError('rate-limit', 'Too many requests.');
  }
  // PostgREST reports constraint violations (e.g. message too long) as 400:
  // that's the visitor's input.
  if ([400, 409, 422].includes(response.status)) {
    throw new StarsError('invalid', `Rejected by the database (${response.status}).`);
  }
  // 401/403 mean a permissions/configuration problem (keys, RLS, grants):
  // not something the visitor can fix, so it's reported as a server error.
  if (response.status === 401 || response.status === 403) {
    throw new StarsError('server', `Not allowed by the database (${response.status}).`);
  }
  throw new StarsError('server', `Unexpected response (${response.status}).`);
}

const isVisitorStar = (value: unknown): value is VisitorStar => {
  const star = value as VisitorStar;
  return (
    typeof star?.id === 'number' &&
    typeof star.name === 'string' &&
    typeof star.message === 'string' &&
    Number.isFinite(Number(star.x)) &&
    Number.isFinite(Number(star.y))
  );
};

/** Parse and sanitise rows: drop anything malformed instead of breaking the sky. */
function toStars(data: unknown): VisitorStar[] {
  if (!Array.isArray(data)) throw new StarsError('server', 'Unexpected response shape.');
  return data.filter(isVisitorStar).map((star) => ({
    ...star,
    x: Math.min(100, Math.max(0, Number(star.x))),
    y: Math.min(100, Math.max(0, Number(star.y))),
  }));
}

/**
 * Columns the anon role is allowed to read (see the column grants in
 * supabase/schema.sql). Always request them explicitly: without `select`,
 * PostgREST returns `*`, which includes the hidden `visible` column and fails
 * with 42501 → HTTP 401.
 */
const PUBLIC_COLUMNS = 'id,name,message,x,y,created_at';

export async function fetchStars(): Promise<VisitorStar[]> {
  const query = new URLSearchParams({
    select: PUBLIC_COLUMNS,
    order: 'created_at.desc',
    limit: String(MAX_STARS),
  });

  const load = async () => toStars(await (await request(`${endpoint()}?${query}`)).json());

  try {
    return await load();
  } catch (error) {
    // One automatic retry for transient failures.
    if (error instanceof StarsError && ['offline', 'timeout', 'server'].includes(error.kind)) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return load();
    }
    throw error;
  }
}

/** Client-side validation matching the database checks. Returns an error message or null. */
export function validate(star: Pick<NewVisitorStar, 'name' | 'message'>): string | null {
  const name = star.name.trim();
  const message = star.message.trim();
  if (!name) return 'Contanos tu nombre.';
  if (name.length > LIMITS.name) return `El nombre puede tener hasta ${LIMITS.name} caracteres.`;
  if (!message) return 'Escribí un mensaje para tu estrella.';
  if (message.length > LIMITS.message)
    return `El mensaje puede tener hasta ${LIMITS.message} caracteres.`;
  return null;
}

export async function addStar(star: NewVisitorStar): Promise<VisitorStar> {
  const body = {
    name: star.name.trim(),
    message: star.message.trim(),
    x: Math.round(Math.min(100, Math.max(0, star.x)) * 100) / 100,
    y: Math.round(Math.min(100, Math.max(0, star.y)) * 100) / 100,
  };

  // `select` limits the returned row to readable columns (see PUBLIC_COLUMNS).
  const response = await request(`${endpoint()}?select=${PUBLIC_COLUMNS}`, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(body),
  });

  const [created] = toStars(await response.json());
  if (!created) throw new StarsError('server', 'The star was not returned.');
  return created;
}
