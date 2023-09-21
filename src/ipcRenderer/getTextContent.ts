import {ipcRenderer} from "electron";

export default async function getTextContent (lang: string) {
    return await ipcRenderer.invoke('language', lang);
}