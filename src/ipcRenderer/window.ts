import {ipcRenderer} from "electron";

const window = {
    minimizeApp: () => ipcRenderer.send('min'),
    maximizeApp: () => ipcRenderer.send('max'),
    closeApp: () => ipcRenderer.send('close'),
    maximizeCallback: (fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
        ipcRenderer.on('maximize', fn),
    unmaximizeCallback: (fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
        ipcRenderer.on('unmaximize', fn),
    unsubscribeMaximizeAll: () => {
        ipcRenderer.removeAllListeners('maximize');
    },
    unsubscribeUnmaximizeAll: () => {
        ipcRenderer.removeAllListeners('unmaximize');
    },
    export: async () => await ipcRenderer.invoke('export'),
    import: async () => await ipcRenderer.invoke('import'),
    contextMenu: (pos: {x: number, y: number}) => ipcRenderer.send('context_menu', pos)
};

export default window;