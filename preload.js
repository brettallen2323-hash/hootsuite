const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('hs', {
  cmd: (c) => ipcRenderer.invoke('cmd', c),
  chat: (m) => ipcRenderer.invoke('hermes-chat', m),
  sysInfo: () => ipcRenderer.invoke('sys-info'),
  writeFile: (p, c) => ipcRenderer.invoke('write-file', p, c),
  hermesStatus: () => ipcRenderer.sendSync('hermes-status-sync'),
  openExternal: (u) => ipcRenderer.invoke('open-external', u),
  playSound: (t) => ipcRenderer.invoke('play-sound', t),
  cronCreate: (schedule, prompt, name) => ipcRenderer.invoke('cron-create', schedule, prompt, name),
  cronDelete: (id) => ipcRenderer.invoke('cron-delete', id),
  cronRun: (id) => ipcRenderer.invoke('cron-run', id),
  cronPause: (id) => ipcRenderer.invoke('cron-pause', id),
  cronResume: (id) => ipcRenderer.invoke('cron-resume', id),
  readFile: (p) => ipcRenderer.invoke('read-file', p),
});
