import {ipcRenderer} from "electron";

export default async function textContent (lang: string) {
    return await ipcRenderer.invoke('language', lang);
}