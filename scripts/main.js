const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let splash = null;

function createSplash() {
  splash = new BrowserWindow({
    width: 420, height: 500, frame: false, resizable: false, movable: false,
    alwaysOnTop: true, show: false, center: true, skipTaskbar: true,
    backgroundColor: '#000000',
    icon: path.join(__dirname, 'build', 'app-icon.ico'),
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  // Same logo as the window / taskbar icon (build/app-icon.png), embedded so it always loads
  let logo = '';
  try { logo = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'build', 'app-icon.png')).toString('base64'); } catch (e) { /* splash still shows the ring */ }
  const html = `<!doctype html><meta charset="utf-8"><style>
    html,body{margin:0;height:100%;overflow:hidden;background:#000;font-family:'Segoe UI',Arial,sans-serif;user-select:none}
    body{display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:70px 0 44px;box-sizing:border-box}
    .stage{position:relative;width:240px;height:240px;flex:none}
    .stage img{position:absolute;inset:26px;width:188px;height:188px;object-fit:contain}
    .stage svg{position:absolute;inset:0;width:100%;height:100%}
    .spin{transform-origin:120px 120px;animation:r 1.6s linear infinite}
    @keyframes r{to{transform:rotate(360deg)}}
    .pw{text-align:center;color:#9aa3a0;font-size:14px;letter-spacing:.4px}
    .pw b{display:block;margin-top:4px;color:#fff;font-size:18px;font-weight:600;letter-spacing:.6px}
    .pw b span{color:#FFC93C}
  </style>
  <div class="stage">
    <svg viewBox="0 0 240 240">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#21C03A"/><stop offset="1" stop-color="#FFB800"/></linearGradient></defs>
      <circle cx="120" cy="120" r="108" fill="none" stroke="#3a403e" stroke-width="2"/>
      <g class="spin"><circle cx="120" cy="120" r="108" fill="none" stroke="url(#g)" stroke-width="12" stroke-linecap="round" stroke-dasharray="500 679" transform="rotate(-90 120 120)"/></g>
    </svg>
    <img src="${logo}">
  </div>
  <div class="pw">Powered by<b>Smart21<span>Brain</span></b></div>`;
  splash.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
  splash.once('ready-to-show', () => splash && splash.show());
}

function createWindow() {
  const started = Date.now();
  const win = new BrowserWindow({
    width: 1400, height: 880, minWidth: 900, minHeight: 600,
    title: 'Smart21network', show: false,
    backgroundColor: '#084F39',
    icon: path.join(__dirname, 'build', 'app-icon.ico'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  // reports, certificates and external links open in a normal window / the browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) { shell.openExternal(url); return { action: 'deny' }; }
    return { action: 'allow', overrideBrowserWindowOptions: { width: 1000, height: 800, autoHideMenuBar: true, icon: path.join(__dirname, 'build', 'app-icon.ico') } };
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  win.once('ready-to-show', () => {
    const wait = Math.max(0, 1400 - (Date.now() - started));
    setTimeout(() => {
      if (splash) { splash.destroy(); splash = null; }
      win.show();
    }, wait);
  });
}

function setupAutoUpdate() {
  if (!app.isPackaged) return;
  try {
    const { autoUpdater } = require('electron-updater');
    autoUpdater.autoDownload = true;
    autoUpdater.on('error', () => {});               // offline or no update server: stay silent
    autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  } catch (e) { /* electron-updater not installed */ }
}

app.whenReady().then(() => {
  createSplash();
  createWindow();
  setupAutoUpdate();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
