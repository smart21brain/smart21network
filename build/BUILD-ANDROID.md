# Building the Android APK (Smart21network)

The Android app is the same web app (`index.html`) wrapped with Capacitor.

## Easiest: GitHub builds it for you (nothing to install)
1. Put every file of this folder in a GitHub repository (include the hidden `.github` folder).
2. Open **Actions → Build Android APK → Run workflow**.
3. After 5-10 minutes open the finished run and download **Smart21Network-apk** (a zip with `app-debug.apk`).
4. Send the APK to your phone, open it, and allow "Install unknown apps" when Android asks.
   If an older Smart21network build is already installed, uninstall it first (each GitHub build is signed with a new debug key).

## How the AI works in the app
* **Online:** questions go to the Workers AI server (default `https://smart21brain.com/api/ai-assistant`, changeable in Plus → Settings → AI server address).
* **Offline, server unreachable, or no answer within 20 seconds:** the app switches to the built-in offline tutor by itself and shows: "You are using offline AI, connect to internet for best result."
* When the internet is back, the next question uses Workers AI again.
