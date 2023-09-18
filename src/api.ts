import {ipcRenderer} from "electron";

export default {
    send: (channel: string) => {
        ipcRenderer.send(channel);
    },
    on: (channel: string, fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on(channel, fn);
    }
}