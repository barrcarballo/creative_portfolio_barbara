/**
 * Minimal Supabase REST (PostgREST) client: plain `fetch`, no SDK, so every
 * request is explicit and easy to document.
 *
 * The anon key is public by design; Row Level Security in the database is what
 * limits it (see supabase/projects.sql). Every failure becomes a
 * `SupabaseError` with a `kind`, so the UI can react specifically.
 */
import { SUPABASE_ANON_KEY, SUPABASE_URL } from 'astro:env/client';

export type SupabaseErrorKind =
  | 'not-configured' // env vars missing
  | 'offline' // no network / DNS / CORS
  | 'timeout' // server too slow
  | 'rate-limit' // 429
  | 'forbidden' // 401/403: keys, RLS or grants misconfigured
  | 'server'; // 5xx or an unexpected response

export class SupabaseError extends Error {
  constructor(
    public kind: SupabaseErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const TIMEOUT_MS = 8000;

/** GET a table through PostgREST and return the parsed JSON. */
export async function selectFrom(table: string, query: Record<string, string>): Promise<unknown> {
  if (!isConfigured) {
    throw new SupabaseError('not-configured', 'Supabase environment variables are missing.');
  }

  const url = `${SUPABASE_URL!.replace(/\/$/, '')}/rest/v1/${table}?${new URLSearchParams(query)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${SUPABASE_ANON_KEY!}`,
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) throw new SupabaseError('timeout', 'The request timed out.');
    throw new SupabaseError('offline', error instanceof Error ? error.message : 'Network error.');
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 429) throw new SupabaseError('rate-limit', 'Too many requests.');
  if (response.status === 401 || response.status === 403) {
    throw new SupabaseError('forbidden', `Not allowed (${response.status}).`);
  }
  if (!response.ok) throw new SupabaseError('server', `Unexpected response (${response.status}).`);

  try {
    return await response.json();
  } catch {
    throw new SupabaseError('server', 'The response was not valid JSON.');
  }
}
