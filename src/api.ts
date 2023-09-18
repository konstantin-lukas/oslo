import {ipcRenderer} from "electron";

export default {
    send: (channel: string) => {
        ipcRenderer.send(channel);
    }
}