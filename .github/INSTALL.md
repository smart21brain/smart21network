# Smart21network for Windows

## Install (people who only want to use the app)
1. Double-click **Smart21network-Setup-1.0.0.exe**.
2. Windows may show "Windows protected your PC" because the installer is not code-signed. Click **More info → Run anyway**.
3. Choose the install folder, click **Install**. A desktop shortcut and a Start-menu entry are created.
4. Start **Smart21network**. It works fully offline; fonts, icons and the AI knowledge notes are inside the app.

To remove it: Windows **Settings → Apps → Smart21network → Uninstall**.

## Build the installer yourself (developers)
You need Windows 10/11 and [Node.js LTS](https://nodejs.org).
1. Double-click **BUILD-WINDOWS.bat** (or run `npm install` then `npm run dist:win`).
2. The installer appears in the **dist** folder: `Smart21network-Setup-1.0.0.exe`.
3. For a single portable `.exe` that needs no installation: `npm run dist:portable`.

Run the app without building an installer: `npm install` then `npm start`.

On Linux or macOS run `./build.sh` (needs Wine with 32-bit support for the NSIS step).

## Notes
- Automatic updates look at `https://smart21brain.com/updates/smart21network/` (set in `package.json` → `build.publish`). If that address does not exist the app stays silent and keeps working.
- The installer is not code-signed. To remove the SmartScreen warning, buy a code-signing certificate and add `certificateFile` / `certificatePassword` to `build.win` in `package.json`.
- The Smart21network icon and version details are written into the .exe by `scripts/after-pack.js`, so Wine is not needed for that step.
- AI answers use `https://smart21brain.com/api/ai-assistant`; without internet the built-in notes answer instead.
