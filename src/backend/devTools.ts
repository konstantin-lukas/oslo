import {app, BrowserWindow, globalShortcut, ipcMain, Menu, MenuItem} from "electron";

export default function devTools(mainWindow: BrowserWindow) {
    let p = {
        x: 0,
        y: 0
    };
    const menu = new Menu()
    const menuItem = new MenuItem({
        label: 'Inspect Element',
        click: () => {
            mainWindow.webContents.inspectElement(p.x, p.y);
        }
    });
    menu.append(menuItem);
    ipcMain.on('context_menu', function(e, pos){
        p = pos;
        menu.popup();
    });
    globalShortcut.register('f5', function() {
        mainWindow.reload();
    });
    globalShortcut.register('ctrl+f5', function() {
        app.relaunch();
        app.exit();
    });
    globalShortcut.register('ctrl+i', function() {
        mainWindow.webContents.toggleDevTools();
    });
    mainWindow.webContents.openDevTools();
}
