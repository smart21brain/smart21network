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

## If Cloudflare says "cannot be made on a static website" when you add the Workers AI binding
Cloudflare created a STATIC site (files only, no Worker code), so it refuses bindings. The AI binding does not need to be added by hand: it is already written in `wrangler.jsonc`. You only need to deploy the project as a Worker. The most reliable way is to let GitHub do it:

1. Cloudflare dashboard -> your profile (top right) -> **My Profile -> API Tokens -> Create Token** -> use the template **Edit Cloudflare Workers** -> Continue -> Create Token. Copy the token (shown once).
2. Cloudflare dashboard -> **Workers & Pages** -> on the right side copy your **Account ID**.
3. GitHub repository -> **Settings -> Secrets and variables -> Actions -> New repository secret**. Add:
   - `CLOUDFLARE_API_TOKEN` = the token
   - `CLOUDFLARE_ACCOUNT_ID` = the Account ID
4. GitHub -> **Actions -> Deploy website + AI to Cloudflare -> Run workflow**.
5. When it is green, open Cloudflare -> Workers & Pages -> `smart21network` -> Settings -> Domains & Routes and copy the **workers.dev** address. Open it plus `/api/ai-assistant`: you must see `"ai":true`.
6. Then add the custom domain `smart21network.smart21brain.com` (Domains & Routes -> Add -> Custom domain), or paste the workers.dev address in the app: Plus -> Settings -> AI server address.

Delete the old static project first (Workers & Pages -> the static project -> Settings -> Delete) so the name `smart21network` is free.
If the project folder is INSIDE your GitHub repository (not at the top), the files `wrangler.jsonc`, `package.json` and `.github` must be at the top of the repository.
