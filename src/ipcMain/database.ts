import sqlite3 from "sqlite3";
import { open } from 'sqlite'
import {app, ipcMain} from "electron";
import {MoneyCalculator, Money} from "moneydew";
import * as process from "process";
import {add, formatISO, getDaysInMonth, lastDayOfMonth, setDate} from "date-fns";
import {getDecimalPlaces, getZeroValue} from "../components/misc/Format";
import settings from "electron-settings";
import {promises as fs} from "fs";
import {resolve} from "path";
import {platform} from "os";

if (process.env.DEV_MODE)
    sqlite3.verbose();

export const database_path = (() => {
    const database = 'oslo_data.db';
    const p = platform();
    if (p === 'win32') {
        return resolve(app.getPath("userData"), database);
    } else if (p === 'linux') {
        return app.getPath("home") + "/.local/share/" + database;
    }
    return '/';
})();
async function openDB() {
    return open({
        filename: database_path,
        driver: sqlite3.Database
    })
}
export async function executeInterestRates() {
    const language = settings.getSync("language") || 'en';
    let json: TextContent | null;
    try {
        const rawData = await fs.readFile(__dirname + '/lang/' + language + '.json', 'utf-8');
        json = JSON.parse(rawData);
    } catch (e) {
        json = null;
    }
    const title = json?.interest_ || 'Interest';
    const accounts = await databaseGetAccounts();
    const currentYear = new Date().getFullYear();
    for (const account of accounts) {
        let lastInterest = account.last_interest;
        if (account.interest_rate > 0) {
            const decimalPlaces = getDecimalPlaces(account.currency);
            while (lastInterest < currentYear - 1) {
                const timestamp = (lastInterest + 2).toString() + '-01-01 00:00:00';
                const balance = parseInt(await databaseGetBalanceUntilExcluding(
                    null,
                    account.id,
                    timestamp
                ));
                if (balance > 0) {
                    const interest = (balance * (account.interest_rate / 100)).toFixed(decimalPlaces);
                    if (!/^0(\.0+)?$/.test(interest)) {
                        await databasePostTransaction(
                            null,
                            title + ` (${lastInterest + 1})`,
                            interest,
                            account.id,
                            timestamp
                        );
                    }
                }
                lastInterest++;
            }
        }
        if (account.last_interest < currentYear - 1) {
            const db = await openDB();
            await db.run(
                'UPDATE "account" SET "last_interest" = ? WHERE "id" = ?;',
                currentYear - 1, account.id
            );
            await db.close();
        }
    }
}
export async function executeStandingOrders() {
    const language = settings.getSync("language") || 'en';
    let json: TextContent | null;
    try {
        const rawData = await fs.readFile(__dirname + '/lang/' + language + '.json', 'utf-8');
        json = JSON.parse(rawData);
    } catch (e) {
        json = null;
    }
    const category = json?.category_ || 'Category';
    // EXECUTE STANDING ORDERS
    const db = await openDB();
    try {
        const standingOrders: (StandingOrder & {account: number})[] = await db.all('SELECT * FROM "standing_order"');
        for (const order of standingOrders) {
            const today = formatISO(new Date(), {representation: 'date'});
            let nextExecution = new Date(order.last_exec);
            do {
                let execDate = add(nextExecution, {
                    months: order.exec_interval
                });
                if (getDaysInMonth(execDate) < order.exec_on)
                    execDate = setDate(execDate, lastDayOfMonth(execDate).getDate());
                else
                    execDate = setDate(execDate, order.exec_on);
                if (formatISO(execDate, {representation: 'date'}) <= today) {
                    nextExecution = execDate;
                    await db.run(
                        'INSERT INTO "transaction" ("title", "sum", "account", "timestamp", "category") VALUES (?, ?, ?, ?, ?);',
                        order.title,
                        order.sum,
                        order.account,
                        formatISO(nextExecution, {representation: 'date'}) + ' 00:00:00',
                        category
                    );
                } else {
                    break;
                }
                // eslint-disable-next-line no-constant-condition
            } while (true);

            const newLastExec = formatISO(nextExecution, {representation: 'date'});
            if (newLastExec > order.last_exec) {
                await db.run('UPDATE "standing_order" SET "last_exec" = ? WHERE "id" = ?', newLastExec, order.id);
            }
        }
    } catch (e) {
        await db.close();
        console.log(e)
    } finally {
        await db.close();
    }
}

const databasePostTransaction = async (_: any, title: string, sum: string, id: number, category: null | string, timestamp?: string) => {
    try {
        const db = await openDB();
        if (timestamp)
            await db.run('INSERT INTO "transaction" ("title", "sum", "account", "category", "timestamp") VALUES (?, ?, ?, ?, ?);', title, sum, id, category, timestamp);
        else
            await db.run('INSERT INTO "transaction" ("title", "sum", "account", "category") VALUES (?, ?, ?, ?);', title, sum, id, category);
        await db.close();
        return;
    } catch (_) {
        return;
    }
}
const databaseGetBalanceUntilExcluding = async (_: any, id: number, date: string) => {
    try {
        const db = await openDB();

        const currency = (await db.get('SELECT "currency" from "account" WHERE id = ?', id)).currency;
        const until_stamp = date + " 00:00:00";
        // DO NOT USE SQLITE'S SUM HERE; IT SUFFERS FROM FLOATING POINT PRECISION PROBLEMS; USE MONEYDEW INSTEAD
        const result = await db.all(
            'SELECT "sum" FROM "transaction" WHERE "account" = ? AND "timestamp" < ?;',
            id,
            until_stamp
        );

        const sum: Money = result.reduce((previousValue, currentValue) => {
            return MoneyCalculator.add(new Money(previousValue.value), new Money(currentValue.sum));
        }, new Money(getZeroValue(getDecimalPlaces(currency))));
        await db.close();
        return sum.value;
    } catch (_) {
        return null;
    }
};
const databaseGetAccounts = async (): Promise<AccountData[]> => {
    try {
        const db = await openDB();
        const result = await db.all('SELECT * FROM "account"');
        await db.close();
        return result;
    } catch (_) {
        return null;
    }
};

const databaseGetBalance = async (_: any, id: number) => {
    try {
        const db = await openDB();
        // DO NOT USE SQLITE'S SUM HERE; IT SUFFERS FROM FLOATING POINT PRECISION PROBLEMS; USE MONEYDEW INSTEAD
        const currency = (await db.get('SELECT "currency" from "account" WHERE id = ?', id)).currency;
        const result = await db.all('SELECT "sum" FROM "transaction" WHERE "account" = ?;', id);
        const sum: Money = result.reduce((previousValue, currentValue) => {
            return MoneyCalculator.add(new Money(previousValue.value), new Money(currentValue.sum));
        }, new Money(getZeroValue(getDecimalPlaces(currency))));
        await db.close();
        return sum.value;
    } catch (_) {
        return null;
    }
};
export default function registerDatabase() {
    ipcMain.handle('getAccounts', databaseGetAccounts);
    ipcMain.handle('getBalance', databaseGetBalance);
    ipcMain.handle('getTransactions', async (_, id, from, until) => {
        const from_stamp = from + " 00:00:00";
        const until_stamp = until + " 23:59:59";
        try {
            const db = await openDB();
            const result = await db.all(
                'SELECT "id", "title", "sum", "timestamp", "category" ' +
                'FROM "transaction"' +
                'WHERE "account" = ? AND "timestamp" >= ? AND "timestamp" <= ? ORDER BY "timestamp" DESC;',
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
    ipcMain.handle('postTransaction', databasePostTransaction);
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
    ipcMain.handle('getBalanceUntilExcluding', databaseGetBalanceUntilExcluding);
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
    ipcMain.handle('postStandingOrder', async (_, account, title, sum, exec_interval, exec_on, last_exec) => {
        try {
            const db = await openDB();
            await db.run(
                'INSERT INTO "standing_order" ("account", "title", "sum", "exec_interval", "exec_on", "last_exec") VALUES (?, ?, ?, ?, ?, ?);',
                account,
                title,
                sum,
                exec_interval,
                exec_on,
                last_exec
            );
            await db.close();
            return
        } catch (_) {
            return;
        }
    });
    ipcMain.handle('getStandingOrders', async (_, account) => {
        try {
            const db = await openDB();
            const result = await db.all(
                'SELECT ' +
                '"id", ' +
                '"title", ' +
                '"sum", ' +
                '"exec_interval", ' +
                '"exec_on", ' +
                '"last_exec" ' +
                'FROM "standing_order" WHERE "account" = ?;',
                account);
            await db.close();
            return result;
        } catch (_) {
            return null;
        }
    });
    ipcMain.handle('deleteStandingOrder', async (_, id) => {
        try {
            const db = await openDB();
            await db.run('DELETE FROM "standing_order" WHERE id = ?;', id);
            await db.close();
            return;
        } catch (_) {
            return;
        }
    });
    ipcMain.handle('patchStandingOrder', async (_, id, title, sum, exec_interval, exec_on) => {
        try {
            const db = await openDB();
            await db.run(
                'UPDATE "standing_order" ' +
                'SET "title" = ?, ' +
                '"sum" = ?, ' +
                '"exec_interval" = ?, ' +
                '"exec_on" = ? ' +
                'WHERE "id" = ?;',
                title, sum, exec_interval, exec_on, id
            );
            await db.close();
            return
        } catch (_) {
            return;
        }
    });
    ipcMain.handle('executeStandingOrders', executeStandingOrders);
}