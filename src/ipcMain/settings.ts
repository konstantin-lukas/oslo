import settings from "electron-settings";
import {ipcMain} from "electron";

export default function registerSettings() {
    ipcMain.handle('settings.getLanguage', async (_) => {
        return settings.get('language');
    });
    ipcMain.handle('settings.setLanguage', async (_, lang) => {
        return settings.set('language', lang);
    });
    ipcMain.handle('settings.getLastTab', async (_) => {
        return settings.get('last_tab');
    });
    ipcMain.handle('settings.setLastTab', async (_, id) => {
        return settings.set('last_tab', id);
    });
    ipcMain.handle('settings.getLightMode', async (_) => {
        return settings.get('light_mode');
    });
    ipcMain.handle('settings.setLightMode', async (_, yes) => {
        return settings.set('light_mode', yes);
    });
}