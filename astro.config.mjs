// @ts-check
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  env: {
    // Explicit allow-list of variables exposed to the browser. Only these two
    // ever reach client code, regardless of what else is defined in the env.
    // Both are optional: without them the guestbook shows its "not connected" state.
    schema: {
      SUPABASE_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      SUPABASE_ANON_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
