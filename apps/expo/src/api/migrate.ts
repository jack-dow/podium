import { type Database } from "expo-sqlite";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

import migrations from "./migrations.json";

export async function migrate(db: Database) {
  console.info("[Drizzle Migrate] Running db migration...");

  const migrationTableCreate = `CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
		id SERIAL PRIMARY KEY,
		hash text NOT NULL,
		created_at numeric
	)`;

  db.transaction((tx) => {
    tx.executeSql(migrationTableCreate, [], undefined, (_, error) => {
      console.error("[Drizzle Migrate] Failed to create migration table", { error });
      return false;
    });
  });

  const dbMigrations: unknown[] = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT id, hash, created_at FROM "__drizzle_migrations" ORDER BY created_at DESC LIMIT 1',
        [],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          console.error("[Drizzle Migrate] Failed to get migrations", { error });
          reject([]);
          return true;
        },
      );
    });
  });

  const DbMigrationType = z.object({
    id: z.string(),
    hash: z.string(),
    created_at: z.number(),
  });

  const lastDbMigration = dbMigrations[0] ? DbMigrationType.parse(dbMigrations[0]) : undefined;

  try {
    const queriesToRun: string[] = [];
    for (const migration of migrations.entries) {
      if (!lastDbMigration || lastDbMigration.created_at < migration.folderMillis) {
        queriesToRun.push(...migration.sql);
        queriesToRun.push(
          `INSERT INTO "__drizzle_migrations" ("id", "hash", "created_at") VALUES('${createId()}','${
            migration.hash
          }', '${migration.folderMillis}');`,
        );
      }
    }

    if (queriesToRun.length > 0) {
      for (const query of queriesToRun) {
        const innerQueries = query.split(";");

        // Had to run every single query individually, so this makes sure that happens
        for (const innerQuery of innerQueries) {
          console.log(innerQuery);
          if (innerQuery.trim() === "") {
            continue;
          }

          db.transaction((tx) => {
            tx.executeSql(innerQuery, [], undefined, (_, error) => {
              console.error("[Drizzle Migrate] Failed to run migration", { error });
              return false;
            });
          });
        }
      }
    }
  } catch (e) {
    throw e;
  }
}

export async function dropDatabase(db: Database) {
  console.info("[Drizzle Migrate] WARNING: Dropping all tables");

  const tables: unknown[] = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table'",
        [],
        (_, { rows: { _array } }) => {
          resolve(_array.map((t: Record<string, unknown>) => t.name));
        },
        (_, error) => {
          console.error("[Drizzle Migrate] Failed to get tables", { error });
          reject([]);
          return true;
        },
      );
    });
  });

  if (tables.length > 0) {
    console.log(`DROP TABLE IF EXISTS ${tables.map((t) => `"${t}"`).join(", ")};`);
    db.transaction((tx) => {
      for (const table of tables) {
        tx.executeSql(`DROP TABLE IF EXISTS "${table}";`, [], undefined, (_, error) => {
          console.error("[Drizzle Migrate] Failed to drop table", { error });
          return false;
        });
      }
    });
  } else {
    console.log("[Drizzle Migrate] No tables to drop");
  }
}
