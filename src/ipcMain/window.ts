import {BrowserWindow, ipcMain, dialog} from "electron";
import fs from "fs";
import {resolve} from "path";
import process from "process";
export default function registerWindow(mainWindow: BrowserWindow) {
    ipcMain.on('close', function(){
        mainWindow.close();
    });
    ipcMain.on('max', function(){
        if (!mainWindow.isMaximized()) {
            mainWindow.maximize();
        } else {
            mainWindow.unmaximize();
        }
    });
    ipcMain.on('min', function(){
        mainWindow.minimize();
    });
    mainWindow.on('maximize',function () {
        mainWindow.webContents.send('maximize');
    });
    mainWindow.on('unmaximize',function () {
        mainWindow.webContents.send('unmaximize');
    });
    ipcMain.handle('export',function (_) {
        let path = dialog.showSaveDialogSync(mainWindow, {
            properties: [
                'createDirectory',
                'showOverwriteConfirmation'
            ],
            filters: [
                {
                    name: 'Oslo Files',
                    extensions: ['oslo']
                }
            ]
        });
        if (!path) return;
        if (!path.endsWith('.oslo')) {
            path += '.oslo';
        }
        try {
            const dbRoot = process.env.DEV_MODE ? '/tmp' : __dirname;
            fs.copyFileSync(resolve(dbRoot + "/account_info.db"), path);
        } catch (_) {
            return false;
        }
        return true;
    });
    ipcMain.handle('import',function (_) {
        const path = dialog.showOpenDialogSync(mainWindow, {
            properties: [
                'openFile'
            ],
            filters: [
                {
                    name: 'Oslo Files',
                    extensions: ['oslo']
                }
            ]
        });
        if (!path?.[0] || !path[0].endsWith('.oslo')) return false;
        try {
            const dbRoot = process.env.DEV_MODE ? '/tmp' : __dirname;
            fs.copyFileSync(path[0], resolve(dbRoot + "/account_info.db"));
        } catch (_) {
            return false;
        }
        return true;
    });
}
