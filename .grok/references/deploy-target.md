# Build & deploy target

You never trigger the deploy yourself, **but the app you build is eventually
deployed to Netlify** by the platform — so your output must build cleanly under
Netlify's process. `npm run build` must succeed and emit valid output, and code
that works under `npm run dev` but breaks a production / SSR build is a bug.
Watch for dev-only deps, server-only Node APIs run at import time, runtime
filesystem writes, and hard-coded ports / hosts / secrets.

## A passing `npm run build` does not mean the deployed app renders

The most common blank-deploy failure is
`Failed to load module script … MIME type "text/html"`: the built `index.html`
requests JS assets that 404 in prod, so the server returns the HTML fallback
(wrong MIME) and the page is blank. Fix the asset base path / build output so
`/assets/*` resolve, and ensure the SPA/SSR fallback doesn't shadow real asset
requests — then re-verify the served build renders.

If you edited source after kicking off the build, re-run `npm run build` first,
then `npm run preview:restart` — it frees `:8081` before serving, so you never
smoke the previous build's output.

## What `vite.config.ts` already does

The workspace ships a ready `vite.config.ts` and `tsconfig.json` — don't
recreate them, and don't import a vendored `vite-tanstack-config` preset. The
config:

- binds the dev port `0.0.0.0:8080`;
- pins `vite preview` to loopback `127.0.0.1:8081`, so the built output can
  never be picked up as the user's live preview;
- gates `nitro({ preset: process.env.NITRO_PRESET || "netlify" })` on
  `command === "build" || isPreview`, so
  it never runs in dev — left on in dev, nitro opens a second dev-server port,
  which breaks the single-port 8080 live preview — but still serves the built
  output under `vite preview`;
- mounts `grokPwaPlugin()`.

If you edit it, preserve both port contracts, the build/preview-gated nitro
plugin **including its `serverDir: "./server"` option** (without it the deployed
app loses the Home Screen install page), and `grokPwaPlugin()`.

## Netlify output layout (do not hardcode a publish directory)

The `netlify` preset writes static assets — plus the `_headers` / `_redirects`
it generates — to `dist/`, and the SSR handler to
`.netlify/functions-internal/server/`, which Netlify picks up automatically as
a framework-generated function. `netlify.toml` pins `publish = "dist"` and
overrides any publish directory set in the Netlify UI; keep the two in sync if
you ever change the preset. A publish directory of `dist/client` is wrong for
this preset and fails the deploy with "Deploy directory does not exist".
