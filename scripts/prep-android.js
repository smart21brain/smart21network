// Prepares ./www for Capacitor (Android / iOS). See ANDROID.md.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), www = path.join(root, 'www');
fs.rmSync(www, { recursive: true, force: true }); fs.mkdirSync(www, { recursive: true });
['index.html', 'manifest.webmanifest', 'sw.js', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'].forEach(f => fs.copyFileSync(path.join(root, f), path.join(www, f)));
const fonts = path.join(root, 'fonts');
if (fs.existsSync(fonts)) { fs.mkdirSync(path.join(www, 'fonts'), { recursive: true }); fs.readdirSync(fonts).forEach(f => fs.copyFileSync(path.join(fonts, f), path.join(www, 'fonts', f))); }
console.log('[android] www/ is ready. Next: npx cap add android && npx cap sync android && npx cap open android');
