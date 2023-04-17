/* eslint-disable @typescript-eslint/no-explicit-any */
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/sqlite-proxy";

import { dropDatabase, migrate } from "./migrate";

const sqlite = SQLite.openDatabase("podium.db");

// dropDatabase(sqlite);
// migrate(sqlite).catch((e: unknown) => console.error("[Drizzle Migrate] Failed to migrate", { e }));

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
} as const;
const logColor = (text: string, color: keyof typeof colors): string => {
  const resetColor = "\x1b[0m";
  const selectedColor = colors[color] || "";

  return `${selectedColor}${text}${resetColor}`;
};

export const db = drizzle(async (sql, params, method) => {
  console.log(
    `${logColor(`[SQL ${method} REQUEST]`, "cyan")} ${logColor(sql, "white")} - ${logColor(
      `[${params.join(",")}]`,
      "magenta",
    )}`,
  );
  try {
    if (method === "run") {
      const result: unknown[] = await new Promise((resolve, reject) => {
        sqlite.transaction((tx) => {
          tx.executeSql(
            // Fixes a sql bug that prevents transactions from working because it thinks one is already in progress
            sql === "begin" ? "END TRANSACTION; begin" : sql,
            params,
            (_, { rows: { _array } }) => {
              resolve(_array.map((i: Record<string, unknown>) => Object.values(i)));
            },
            (_, error) => {
              console.error("[Drizzle-ORM] Failed to run run query", { sql, params, error });
              reject([]);
              return true;
            },
          );
        });
      });

      return { rows: result as any[] };
    } else if (method === "all" || method === "values") {
      const result: unknown[] = await new Promise((resolve, reject) => {
        sqlite.transaction((tx) => {
          tx.executeSql(
            sql,
            params,
            (_, { rows: { _array } }) => {
              resolve(_array.map((i: Record<string, unknown>) => Object.values(i)));
            },
            (_, error) => {
              console.error("[Drizzle-ORM] Failed to run all or values query", { sql, params, error });
              reject([]);
              return true;
            },
          );
        });
      });

      return { rows: result as any[] };
    } else if (method === "get") {
      const result: unknown[] = await new Promise((resolve, reject) => {
        sqlite.transaction((tx) => {
          tx.executeSql(
            sql,
            params,
            (_, { rows: { _array } }) => {
              resolve(_array.map((i: Record<string, unknown>) => Object.values(i)));
            },
            (_, error) => {
              console.error("[Drizzle-ORM] Failed to run get query", { sql, params, error });
              reject([]);
              return true;
            },
          );
        });
      });

      return { rows: result.length > 0 ? (result[0] as any[]) : [] };
    }

    return { rows: [] };
  } catch (e: unknown) {
    throw new Error("[Drizzle-ORM] Error from sqlite proxy server", { cause: e });
  }
});
