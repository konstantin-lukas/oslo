import Database from 'better-sqlite3';
import {ipcMain} from "electron";

function openDB() {
    return new Database('spectrum-data.db');
}

export default function test() {
    ipcMain.handle('language', async (_) => {
        const db = openDB();
        db.pragma('journal_mode = WAL');
    });
}