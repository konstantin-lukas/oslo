import sqlite3 from "sqlite3";
import { open } from 'sqlite'
import {ipcMain} from "electron";
import {MoneyCalculator, Money} from "moneydew";
import * as process from "process";

if (process.env.DEV_MODE)
    sqlite3.verbose();
async function openDB() {
    const dbRoot = process.env.DEV_MODE ? '/tmp' : __dirname;
    return open({
        filename: dbRoot + "/account_info.db",
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
            // DO NOT USE SQLITE'S SUM HERE; IT SUFFERS FROM FLOATING POINT PRECISION PROBLEMS; USE MONEYDEW INSTEAD


            const result = await db.all('SELECT "sum" FROM "transaction" WHERE "account" = ?;', id);
            // TODO: FORMAT
            const sum: Money = result.reduce((previousValue, currentValue) => {
                return MoneyCalculator.add(previousValue, new Money(currentValue.sum));
            }, new Money('0.00'));
            await db.close();
            return sum.value;
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
            await db.run('DELETE FROM "transaction" WHERE id = ?;', id);
            await db.close();
            return;
        } catch (_) {
            return;
        }
    });
    ipcMain.handle('postTransaction', async (_, title, sum, id) => {
        try {
            const db = await openDB();
            await db.run('INSERT INTO "transaction" ("title", "sum", "account") VALUES (?, ?, ?);', title, sum, id);
            await db.close();
            return;
        } catch (_) {
            return;
        }
    });
    ipcMain.handle('deleteAccount', async (_, id) => {
        try {
            const db = await openDB();
            await db.exec('PRAGMA foreign_keys = ON;');
            await db.run('DELETE FROM "account" WHERE id = ?;', id);
            await db.close();
            return;
        } catch (_) {
            return;
        }
    });
    ipcMain.handle('postAccount', async (
            _,
            name,
            currency,
            allow_overdrawing,
            theme_color,
            last_interest
        ) => {
        try {
            const db = await openDB();
            await db.run(
                'INSERT INTO "account" ("name", "currency", "allow_overdrawing", "theme_color", "last_interest") VALUES (?, ?, ?, ?, ?);',
                name,
                currency,
                allow_overdrawing,
                theme_color,
                last_interest
            );
            await db.close();
            return;
        } catch (_) {
            return;
        }
    });
    ipcMain.handle('getBalanceUntilExcluding', async (_, id, date) => {
        try {
            const db = await openDB();
            const until_stamp = date + " 00:00:00";
            // DO NOT USE SQLITE'S SUM HERE; IT SUFFERS FROM FLOATING POINT PRECISION PROBLEMS; USE MONEYDEW INSTEAD
            const result = await db.all(
                'SELECT "sum" FROM "transaction" WHERE "account" = ? AND "timestamp" < ?;',
                id,
                until_stamp
            );
            // TODO: FORMAT
            const sum: Money = result.reduce((previousValue, currentValue) => {
                return MoneyCalculator.add(previousValue, new Money(currentValue.sum));
            }, new Money('0.00'));
            await db.close();
            return sum.value;
        } catch (_) {
            return null;
        }
    });
    ipcMain.handle('patchAccount', async (_, id, name, color, allow_overdrawing, interest_rate) => {
        try {
            const db = await openDB();
            await db.run(
                'UPDATE "account" ' +
                'SET "theme_color" = ?, ' +
                '"name" = ?, ' +
                '"allow_overdrawing" = ?, ' +
                '"interest_rate" = ? ' +
                'WHERE "id" = ?;',
                color,
                name,
                allow_overdrawing,
                interest_rate,
                id
            );
            await db.close();
            return
        } catch (_) {
            return;
        }
    });

}