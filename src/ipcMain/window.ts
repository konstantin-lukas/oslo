import {BrowserWindow, ipcMain, dialog} from "electron";
import fs from "fs";

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
                    name: 'All files',
                    extensions: ['*']
                }
            ]
        });
        if (!path) return;
        try {
            fs.writeFileSync(path, JSON.stringify({"data":true}, null, 4));
        } catch (_) {}
    });
}
