import {ipcRenderer} from "electron";

const settings = {
    getLanguage: async () => {
        return ipcRenderer.invoke('settings.getLanguage');
    },
    setLanguage: async (lang: string) => {
        return ipcRenderer.invoke('settings.setLanguage', lang);
    },
    getLastTab: async () => {
        return ipcRenderer.invoke('settings.getLastTab');
    },
    setLastTab: async (id: number) => {
        return ipcRenderer.invoke('settings.setLastTab', id);
    }
}

export default settings;