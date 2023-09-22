import sqlite3 from "sqlite3";
import { open } from 'sqlite'
import {ipcMain} from "electron";
import * as process from "process";

if (process.env.DEV_MODE)
    sqlite3.verbose();
async function openDB() {
    return open({
        filename: './src/account_info.db',
        driver: sqlite3.Database
    })
}

export default function registerDatabase() {
    ipcMain.handle('getAccounts', async (_) => {
        try {
            const db = await openDB();
            const result = await db.all('SELECT * FROM "account"');
            await db.close();
            return result;
        } catch (_) {
            return null;
        }
    });
    ipcMain.handle('getBalance', async (_, id) => {
        try {
            const db = await openDB();
            const result = await db.get('SELECT SUM(sum) AS "balance" FROM "transaction" WHERE "account" = ?', id);
            await db.close();
            return result?.["balance"]?.toString() || null;
        } catch (_) {
            return null;
        }
    });
    ipcMain.handle('getTransactions', async (_, id, from, until) => {
        const from_stamp = from + " 00:00:00";
        const until_stamp = until + " 23:59:59";
        try {
            const db = await openDB();
            const result = await db.all(
                'SELECT * FROM "transaction" WHERE "account" = ? AND "timestamp" >= ? AND "timestamp" <= ? ORDER BY "timestamp" DESC;',
                id, from_stamp, until_stamp);
            await db.close();
            return result;
        } catch (_) {
            return null;
        }
    });
    ipcMain.handle('deleteTransaction', async (_, id) => {
        try {
            const db = await openDB();
            await db.run('DELETE FROM "transaction" WHERE id = ?', id);
            await db.close();
            return;
        } catch (_) {
            return;
        }
    });
}