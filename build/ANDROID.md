# Smart21network on Android and tablets

## Option 1: install as an app (PWA), no store needed
1. Put this folder on any HTTPS web server (for example the school server, nginx, GitHub Pages).
2. Open `index.html` in Chrome on the phone or tablet, menu → **Install app** / **Add to Home screen**.
3. It then works offline. Use two fingers to zoom the network; tap the ☰ button for the menus.

## Option 2: a real Android app (APK / AAB) with Capacitor
This was prepared but **not built here** (it needs Android Studio and the Android SDK on your computer).
```
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android
npm run android:prep          # copies the web app into ./www
npx cap add android
npx cap sync android
npx cap open android          # opens Android Studio: Build → Generate Signed Bundle / APK
```
`capacitor.config.json` already sets the app id `com.smart21brain.smart21network`.
After changing the app, run `npm run android:prep && npx cap sync android` again.

Notes
* The voice-input button needs the device browser's speech service; it is hidden-in-effect (shows a message) where that is missing.
* To use the AI assistant, the phone needs internet. Set the address in Settings.
