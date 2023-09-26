import {BrowserWindow, ipcMain, dialog} from "electron";
import fs from "fs";
import {resolve} from "path";
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
    ipcMain.on('export',function (_) {
        let path = dialog.showSaveDialogSync(mainWindow, {
            properties: [
                'createDirectory',
                'showOverwriteConfirmation'
            ],
            filters: [
                {
                    name: 'Osaca Files',
                    extensions: ['osaca']
                }
            ]
        });
        if (!path) return;
        if (!path.endsWith('.osaca')) {
            path += '.osaca';
        }
        try {
            fs.copyFileSync(resolve(__dirname + "/account_info.db"), path);
        } catch (_) {
            console.error('Error exporting data!')
        }
    });
}
