import {BrowserWindow, ipcMain, dialog} from "electron";
import fs from "fs";
import {open} from "sqlite";
import sqlite3 from "sqlite3";
import {database_dir} from "./database";


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
    ipcMain.handle('export',function () {
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
        if (!path) return 'cancel';
        if (!path.endsWith('.oslo')) {
            path += '.oslo';
        }
        try {
            fs.copyFileSync(database_dir, path);
        } catch (_) {
            return 'failure';
        }
        return 'success';
    });
    ipcMain.handle('import',async () => {
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
        if (!path?.[0] || !path[0].endsWith('.oslo')) return 'cancel';
        try {
            const db = await open({
                filename: path[0],
                driver: sqlite3.Database
            });
            await db.all('SELECT * FROM "account", "transaction", "standing_order", "meta"');
            await db.close();
        } catch (_) {
            return 'failure';
        }
        try {
            fs.copyFileSync(path[0], database_dir);
        } catch (_) {
            return 'failure';
        }
        return 'success';
    });
}
