import {app, BrowserWindow, Menu} from 'electron';
import * as process from "process";
import registerWindow from "./ipcMain/window";
import registerDevTools from "./ipcMain/devTools";
import registerTextContent from "./ipcMain/textContent";
import registerDatabase from "./ipcMain/database";
import registerSettings from "./ipcMain/settings";
import {resolve} from "path";
import {open} from "sqlite";
import sqlite3 from "sqlite3";

if (process.env.DEV_MODE)
    sqlite3.verbose();
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.disableHardwareAcceleration();

const createWindow = async () => {

    const dbRoot = process.env.DEV_MODE ? '/tmp' : __dirname;
    const dbPath = resolve( dbRoot + "/account_info.db");
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });
    await db.exec('CREATE TABLE IF NOT EXISTS "account" ("id" INTEGER NOT NULL UNIQUE,"name" TEXT NOT NULL,"currency" TEXT NOT NULL DEFAULT \'USD\' CHECK(length(currency) = 3),"allow_overdrawing" INTEGER NOT NULL DEFAULT 0 CHECK(allow_overdrawing = 0 OR allow_overdrawing = 1),"creation_date" TEXT NOT NULL DEFAULT CURRENT_DATE,"theme_color" TEXT NOT NULL DEFAULT \'ff33a3\',"interest_rate" INTEGER NOT NULL DEFAULT 0 CHECK(interest_rate >= 0 AND interest_rate <= 100),"last_interest" INTEGER NOT NULL CHECK(last_interest >= 1000 AND last_interest <= 9999),PRIMARY KEY("id" AUTOINCREMENT) ON CONFLICT ROLLBACK)');
    await db.exec('CREATE TABLE IF NOT EXISTS "standing_order" ("id" INTEGER NOT NULL UNIQUE,"title" TEXT NOT NULL,"sum" TEXT NOT NULL,"exec_interval" INTEGER NOT NULL,"exec_on" INTEGER NOT NULL,"last_exec" TEXT NOT NULL,"account" INTEGER NOT NULL,PRIMARY KEY("id" AUTOINCREMENT), FOREIGN KEY("account") REFERENCES "account"("id") ON DELETE CASCADE )');
    await db.exec('CREATE TABLE IF NOT EXISTS "transaction" ("id" INTEGER NOT NULL UNIQUE, "title" TEXT NOT NULL, "sum" TEXT NOT NULL, "timestamp" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, "account" INTEGER NOT NULL, PRIMARY KEY("id" AUTOINCREMENT) ON CONFLICT ROLLBACK, FOREIGN KEY("account") REFERENCES "account"("id") ON DELETE CASCADE )');
    await db.exec('CREATE TABLE IF NOT EXISTS "meta" ("version" TEXT NOT NULL DEFAULT "0.0.0", PRIMARY KEY("version") ON CONFLICT ROLLBACK)');
    await db.exec('INSERT INTO "meta" ("version") SELECT "0.0.0" WHERE NOT EXISTS (SELECT * FROM "meta")');
    await db.close();

  // Create the browser window.
    const mainWindow = new BrowserWindow({
        frame: false,
        show: false,
        minWidth: 500,
        minHeight: 500,
        webPreferences: {
          preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
          nodeIntegration: false, // is default value after Electron v5
          contextIsolation: true, // protect against prototype pollution
        },
        icon: resolve(__dirname + '/img/favicon.png')
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
          .then(() => {
              mainWindow.maximize();
              Menu.setApplicationMenu(null);
              mainWindow.show();
              registerWindow(mainWindow);
              registerTextContent();
              registerDatabase();
              registerSettings();
              if (process.env.DEV_MODE) {
                  registerDevTools(mainWindow);
              }
          })
          .catch(e => {
            console.log(e);
          });

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow().then();
  }
});