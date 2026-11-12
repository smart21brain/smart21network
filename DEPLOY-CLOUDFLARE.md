# Deploy Smart21network on Cloudflare Workers (website + Workers AI)

Same setup as Smart21 ElectroLab: ONE Worker serves the website and answers `POST /api/ai-assistant` with Workers AI.

## From your computer
1. `npm install`
2. `npx wrangler login`
3. `npm run cf:deploy`   (copies the web app into `www/`, then deploys `worker/index.js` + `www/`)

Local test: `npm run cf:dev`

## From GitHub (Cloudflare "Workers Builds")
Cloudflare dashboard -> Workers & Pages -> Create -> Import a repository -> pick your repo.
- Build command: `npm run web:prep`
- Deploy command: `npx wrangler deploy`
(Environment variable for the build: `ELECTRON_SKIP_BINARY_DOWNLOAD` = `1`)

## Give it the address the apps expect
Worker -> Settings -> Domains & Routes -> Add -> Custom domain -> `smart21network.smart21brain.com`.
The Android and Windows apps call `https://smart21network.smart21brain.com/api/ai-assistant` by default.
Using another address? In the app: Plus -> Settings -> AI server address (or tell the builder so it is built in).

## Check it
1. Open `https://smart21network.smart21brain.com/api/ai-assistant` in a browser. You must see `{"ok":true,"ai":true,...}`.
   (`"ai":false` = the Workers AI binding named `AI` is missing: Worker -> Settings -> Bindings -> Add -> Workers AI -> name `AI`.)
2. In the app: Plus -> Settings -> **Test AI connection** must say WORKS.

## How the app picks the AI address
1. The address typed in Settings (if any).
2. On the real website: the same website (`/api/ai-assistant`).
3. In the Android app, the Windows app or a local copy: `https://smart21network.smart21brain.com/api/ai-assistant`.
Offline or unreachable: the built-in offline tutor answers and shows "You are using offline AI, connect to internet for best result."

## Only a Worker, no website? (quick alternative)
Dashboard -> Create Worker -> paste `worker/index.js` -> Settings -> Bindings -> Workers AI named `AI`. Use its `workers.dev` address in Settings -> AI server address.
