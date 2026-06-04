const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, nativeImage, shell } = require('electron');
const { execSync, exec } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

let mainWindow = null, tray = null;
const H = process.env.HOME || '/home/and1';
const PE = `:${H}/.bun/bin:${H}/.local/bin:${H}/.cargo/bin`;

function runCmd(cmd, timeout = 15000) {
  try {
    return execSync(cmd, { timeout, encoding: 'utf8', maxBuffer: 4*1024*1024,
      env: { ...process.env, HOME: H, PATH: (process.env.PATH||'')+PE }
    }).trim();
  } catch(e) { return `⚠ ${e.message.split('\n')[0]}`; }
}

function runCmdAsync(cmd, timeout = 15000) {
  return new Promise(r => {
    exec(cmd, { timeout, encoding: 'utf8', maxBuffer: 4*1024*1024,
      env: { ...process.env, HOME: H, PATH: (process.env.PATH||'')+PE }
    }, (err, stdout, stderr) => {
      if (err) r(`⚠ ${err.message.split('\n')[0]}\n${stderr}`.trim());
      else r((stdout||'(no output)').trim());
    });
  });
}

// ─── SOUND — generates WAV via Node, plays with aplay ───
function genWav(freqs, durs, rate = 44100) {
  let samples = [];
  for (let i = 0; i < freqs.length; i++) {
    const freq = freqs[i], dur = durs[i];
    for (let s = 0; s < Math.floor(rate * dur); s++) {
      const t = s / rate;
      const env = Math.max(0, 1 - t / dur);
      const v = Math.sin(2 * Math.PI * freq * t) * 0.3 * env;
      samples.push(Math.max(-32768, Math.min(32767, Math.round(v * 32767))));
    }
  }
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(s, i * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

function playWav(buf) {
  try {
    const tmp = `/tmp/hs_snd_${Date.now()}.wav`;
    fs.writeFileSync(tmp, buf);
    // Cross-platform audio: aplay (Linux/ALSA), paplay (PulseAudio), afplay (macOS)
    const platform = os.platform();
    let player;
    if (platform === 'darwin') player = 'afplay';
    else if (platform === 'win32') player = 'powershell -c "(New-Object Media.SoundPlayer \'' + tmp + '\').PlaySync()"';
    else player = 'aplay'; // Linux default
    exec(`${player} ${tmp} 2>/dev/null && rm -f ${tmp}`, { timeout: 5 });
  } catch(e) {}
}

const sounds = {
  hoot()    { playWav(genWav([800,1200,600],[0.12,0.08,0.15])); },
  click()   { playWav(genWav([1800],[0.04])); },
  success() { playWav(genWav([880,1100,1320],[0.08,0.08,0.12])); },
  error()   { playWav(genWav([200,150,100],[0.15,0.15,0.2])); },
  whoosh()  { playWav(genWav([200,1500],[0.15,0.12])); },
};

ipcMain.handle('play-sound', async (_, t) => { if(sounds[t])sounds[t](); return 'ok'; });
ipcMain.handle('cmd', async (_, c) => runCmdAsync(c));
ipcMain.handle('read-file', async (_, p) => { try{return fs.readFileSync(p,'utf8')}catch(e){return ''} });

ipcMain.handle('hermes-chat', async (_, msg) => {
  try {
    const tmp = '/tmp/hs_chat.txt';
    fs.writeFileSync(tmp, msg.slice(0, 2000));
    const res = await runCmdAsync(`hermes chat -q "$(cat ${tmp})" 2>&1`, 120000);
    return res || '(Hermes returned empty)';
  } catch(e) { return `Hoot! Error: ${e.message.split('\n')[0]}`; }
});

ipcMain.handle('write-file', async (_, p, c) => {
  try { fs.writeFileSync(p, c, 'utf8'); return 'ok'; } catch(e) { return `⚠ ${e.message}`; }
});

ipcMain.handle('sys-info', async () => {
  const mem = runCmd("free -h | awk '/Mem:/{print $3\" / \"$2}'", 5000);
  const disk = runCmd("df -h / | awk 'NR==2{print $3\" / \"$2\" (\"$5\")\"}'", 5000);
  const cpu = runCmd("nproc", 3000);
  const up = runCmd("uptime -p", 3000);
  return { mem, disk, cpu, uptime: up, hostname: os.hostname() };
});

ipcMain.handle('open-external', async (_, u) => { shell.openExternal(u); });

ipcMain.handle('cron-create', async (_, schedule, prompt, name) => {
  try {
    const n = name ? `--name "${name}"` : '';
    return runCmd(`hermes cron create "${schedule}" "${prompt.replace(/"/g,'\\"')}" ${n} 2>&1`, 10000);
  } catch(e) { return `⚠ ${e.message}`; }
});
ipcMain.handle('cron-delete', async (_, id) => runCmd(`hermes cron remove ${id} 2>&1`, 10000));
ipcMain.handle('cron-run', async (_, id) => runCmd(`hermes cron run ${id} 2>&1`, 10000));
ipcMain.handle('cron-pause', async (_, id) => runCmd(`hermes cron pause ${id} 2>&1`, 10000));
ipcMain.handle('cron-resume', async (_, id) => runCmd(`hermes cron resume ${id} 2>&1`, 10000));

ipcMain.on('hermes-status-sync', e => {
  e.returnValue = {
    ver: (runCmd('hermes --version 2>&1', 5000)+'').replace(/hermes:?/i,'').trim(),
    model: runCmd('hermes config get model.default 2>&1', 5000),
    path: runCmd('which hermes 2>&1', 5000)
  };
});

function createWindow() {
  const iconPath = path.join(__dirname, 'icon.png');
  mainWindow = new BrowserWindow({
    width: 1280, height: 860, minWidth: 900, minHeight: 600,
    title: 'HootSuite 🦉',
    icon: nativeImage.createFromPath(iconPath),
    webPreferences: { nodeIntegration: false, contextIsolation: true, preload: path.join(__dirname, 'preload.js') },
    titleBarStyle: 'hiddenInset', show: false,
  });
  mainWindow.loadFile('index.html');
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Play startup hoot
    setTimeout(() => sounds.hoot(), 500);
  });
  globalShortcut.register('CommandOrControl+Shift+I', () => mainWindow && mainWindow.webContents.toggleDevTools());
}

function createTray() {
  try {
    tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'icon-32.png')));
    tray.setToolTip('HootSuite 🦉');
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: '🦉 Open HootSuite', click: () => mainWindow && mainWindow.show() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() },
    ]));
    tray.on('double-click', () => mainWindow && mainWindow.show());
  } catch(e) {}
}

app.whenReady().then(() => { createWindow(); createTray(); });
app.on('window-all-closed', () => {});
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
