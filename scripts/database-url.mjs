// @ts-check
/**
 * One place that answers "is a real Postgres configured, and at what URL?" —
 * shared by every reader: `scripts/migrate.mjs` (deploy-time migrator),
 * `src/lib/db.ts` (app data) and `src/lib/auth/*` (Better Auth). They must
 * agree, or the app would migrate one database and query another.
 *
 * `DATABASE_URL` wins so an explicit override always beats auto-detection.
 * `NETLIFY_DATABASE_URL` is what Netlify Database injects into the build and
 * function environments once the site's managed Postgres is connected; the
 * `_UNPOOLED` variant is the direct (non-pooled) endpoint and is the last
 * resort, since serverless functions want the pooled one.
 *
 * Nothing set -> `undefined`, which selects the embedded PGLite fallback.
 */
const CANDIDATES = ["DATABASE_URL", "NETLIFY_DATABASE_URL", "NETLIFY_DATABASE_URL_UNPOOLED"];

/**
 * @param {Record<string, string | undefined>} [env]
 * @returns {string | undefined}
 */
export function resolveDatabaseUrl(env) {
  const source = env ?? (typeof process !== "undefined" ? process.env : {});
  for (const name of CANDIDATES) {
    // An empty/whitespace value (an easy misconfig in deploy UIs) must mean
    // "unset" — otherwise production silently runs on the PGLite fallback, or
    // hands an empty connection string to `pg`.
    const value = source?.[name];
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}
