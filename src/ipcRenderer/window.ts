import {ipcRenderer} from "electron";

export const minimizeApp = () => ipcRenderer.send('min');
export const maximizeApp = () => ipcRenderer.send('max');
export const closeApp = () => ipcRenderer.send('close');
export const maximizeCallback = (fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on('maximize', fn);
export const unmaximizeCallback = (fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on('unmaximize', fn);