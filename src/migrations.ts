import {resolve} from "path";
import {database_path} from "./ipcMain/database";
import {open, Database} from "sqlite";
import sqlite3 from "sqlite3";

const migrations: {
    version: string,
    exec: (db: Database) => Promise<void>
}[] = [{
    version: "3.1.0",
    exec: async (db) => {
        await db.exec('UPDATE "transaction" SET ("title") = (\'\') WHERE "title" IS NULL;');
        await db.exec(`
            create table transaction_dg_tmp(
                id INTEGER not null primary key autoincrement unique,
                title TEXT default '' not null,
                sum TEXT not null,
                timestamp TEXT default CURRENT_TIMESTAMP not null,
                account INTEGER not null references account on delete cascade,
                category TEXT default '' not null
            );
        `);
        await db.exec(`
            insert into transaction_dg_tmp(id, title, sum, timestamp, account)
            select id, title, sum, timestamp, account
            from "transaction";
        `);
        await db.exec('drop table "transaction";');
        await db.exec('alter table transaction_dg_tmp rename to "transaction";');
    }
}];

export default async function createDatabase() {
    const dbPath = resolve(database_path);
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });
    await db.exec('CREATE TABLE IF NOT EXISTS "account" ("id" INTEGER NOT NULL UNIQUE,"name" TEXT NOT NULL,"currency" TEXT NOT NULL DEFAULT "USD" CHECK(length(currency) = 3),"allow_overdrawing" INTEGER NOT NULL DEFAULT 0 CHECK(allow_overdrawing = 0 OR allow_overdrawing = 1),"creation_date" TEXT NOT NULL DEFAULT CURRENT_DATE,"theme_color" TEXT NOT NULL DEFAULT "ff33a3","interest_rate" INTEGER NOT NULL DEFAULT 0 CHECK(interest_rate >= 0 AND interest_rate <= 100),"last_interest" INTEGER NOT NULL CHECK(last_interest >= 1000 AND last_interest <= 9999),PRIMARY KEY("id" AUTOINCREMENT) ON CONFLICT ROLLBACK)');
    await db.exec('CREATE TABLE IF NOT EXISTS "standing_order" ("id" INTEGER NOT NULL UNIQUE,"title" TEXT NOT NULL,"sum" TEXT NOT NULL,"exec_interval" INTEGER NOT NULL,"exec_on" INTEGER NOT NULL,"last_exec" TEXT NOT NULL,"account" INTEGER NOT NULL,PRIMARY KEY("id" AUTOINCREMENT), FOREIGN KEY("account") REFERENCES "account"("id") ON DELETE CASCADE )');
    await db.exec('CREATE TABLE IF NOT EXISTS "transaction" ("id" INTEGER NOT NULL UNIQUE, "title" TEXT NOT NULL, "sum" TEXT NOT NULL, "timestamp" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, "account" INTEGER NOT NULL, PRIMARY KEY("id" AUTOINCREMENT) ON CONFLICT ROLLBACK, FOREIGN KEY("account") REFERENCES "account"("id") ON DELETE CASCADE )');
    await db.exec('CREATE TABLE IF NOT EXISTS "meta" ("version" TEXT NOT NULL DEFAULT "0.0.0", PRIMARY KEY("version") ON CONFLICT ROLLBACK)');
    await db.exec('INSERT INTO "meta" ("version") SELECT "3.0.0" WHERE NOT EXISTS (SELECT * FROM "meta")');
    let version = (await db.get('SELECT "version" FROM "meta" LIMIT 1')).version;


    for (const migration of migrations) {
        if (migration.version > version) {
            await migration.exec(db);
            version = migration.version;
        }
    }
    await db.run('UPDATE "meta" SET "version" = ? WHERE 1 = 1;', version);
    await db.close();
}

