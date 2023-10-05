import settings from "electron-settings";
import {ipcMain} from "electron";

export default function registerSettings() {
    ipcMain.handle('settings.getLanguage', async (_) => {
        const language = await settings.get('language');
        return ((typeof language === 'string') ? language : false);
    });
    ipcMain.handle('settings.setLanguage', async (_, lang) => {
        await settings.set('language', lang);
    });
    ipcMain.handle('settings.getLastTab', async (_) => {
        const last_tab = await settings.get('last_tab');
        return ((typeof last_tab === 'number') ? last_tab : false);
    });
    ipcMain.handle('settings.setLastTab', async (_, id) => {
        await settings.set('last_tab', id);
    });
    ipcMain.handle('settings.getLightMode', async (_) => {
        const light_mode = await settings.get('light_mode');
        return ((typeof light_mode === 'boolean') ? light_mode : false);
    });
    ipcMain.handle('settings.setLightMode', async (_, yes) => {
        await settings.set('light_mode', yes);
    });
}