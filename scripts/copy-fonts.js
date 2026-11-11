// Copies the Poppins and Nunito web fonts into ./fonts so the app works fully offline.
// Run automatically after "npm install" (needs internet once). Safe to run again.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(root, 'fonts');
fs.mkdirSync(out, { recursive: true });
let n = 0;
['poppins', 'nunito'].forEach(f => {
  const dir = path.join(root, 'node_modules', '@fontsource', f, 'files');
  if (!fs.existsSync(dir)) { console.warn('[fonts] @fontsource/' + f + ' is not installed. Run "npm install" first.'); return; }
  fs.readdirSync(dir).filter(x => /-latin-(400|500|600|700|800)-normal\.woff2$/.test(x)).forEach(x => { fs.copyFileSync(path.join(dir, x), path.join(out, x)); n++; });
});
console.log('[fonts] copied ' + n + ' font files to ./fonts');
