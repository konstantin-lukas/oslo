const electron = require('electron');
const url = require('url');
const path = require('path');
const ipc = electron.ipcMain;
const {app, BrowserWindow, Menu, globalShortcut, dialog, MenuItem} = electron;
const mode = 'dist';
const fs = require('fs');
const lang = JSON.parse(fs.readFileSync('json/lang.json', 'utf8'));
let mainWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        frame: false,
        show: false,
        minWidth: 500,
        minHeight: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        icon: 'img/favicon.ico'
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.maximize();
    mainWindow.show();
    Menu.setApplicationMenu(null);
    mainWindow.show();
    if (mode === 'dev') {
        let p;
        const menu = new Menu()
        const menuItem = new MenuItem({
            label: 'Inspect Element',
            click: () => {
                mainWindow.webContents.inspectElement(p.x, p.y);
            }
        });
        menu.append(menuItem);
        ipc.on('context_menu', function(e, pos){
            p = pos;
            menu.popup(mainWindow);
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
    }
    ipc.on('close', function(){
        mainWindow.close();
    });
    ipc.on('max', function(){
        if (!mainWindow.isMaximized()) {
            mainWindow.maximize();
        } else {
            mainWindow.unmaximize();
        }
    });
    ipc.on('min', function(){
        mainWindow.minimize();
    });
    mainWindow.on('maximize',function () {
        mainWindow.webContents.send('maximize');
    });
    mainWindow.on('unmaximize',function () {
        mainWindow.webContents.send('unmaximize');
    });
    ipc.on('last_tab',function (e, reply) {
        const config = JSON.parse(fs.readFileSync('json/config.json', 'utf8'));
        config.last_tab = parseInt(reply);
        fs.writeFile('json/config.json', JSON.stringify(config, null, 4), function (err) {
            if (err) return console.log(err);
        });
    });
    ipc.on('export_data',function (e, data) {
        const config = JSON.parse(fs.readFileSync('json/config.json', 'utf8'));
        let path = dialog.showSaveDialogSync(mainWindow,{
            title: lang[config.language].trans[18],
            properties: [
                'createDirectory',
                'ShowOverwriteConfirmation'
            ],
            filters: [
                {
                    name: 'JSON Files',
                    extensions: ['json']
                }
            ]
        });
        if (path == undefined) return;
        path = path.substr(0, path.lastIndexOf('.')) + '.json';
        fs.writeFile(path, JSON.stringify(data, null, 4), function (err) {
            if (err) return console.log(err);
        });
        mainWindow.webContents.send('close_settings');
    });
    ipc.on('import_data',function (e) {
        const config = JSON.parse(fs.readFileSync('json/config.json', 'utf8'));
        let path = dialog.showOpenDialogSync(mainWindow,{
            title: lang[config.language].trans[20],
            properties: [
                'openFile'
            ],
            filters: [
                {
                    name: 'JSON Files',
                    extensions: ['json']
                }
            ]
        });
        if (path == undefined) return;
        path = path[0];
        if (path.match(/\.json$/) == null) return;
        const import_data = JSON.parse(fs.readFileSync(path, 'utf8'));
        mainWindow.webContents.send('confirm_import', import_data);
    });
});
