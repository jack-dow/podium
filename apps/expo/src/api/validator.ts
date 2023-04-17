import { type SQLiteTable } from "drizzle-orm/sqlite-core";

/* eslint-disable @typescript-eslint/no-explicit-any */
type TableFieldsAsBooleans<Table extends SQLiteTable<any>> = {
  [K in keyof Omit<Table, "_">]?: boolean;
};

type ValidatorResult<Table extends SQLiteTable<any>, Fields> = {
  [K in keyof Table]: K extends keyof Fields ? (Fields[K] extends true ? Table[K] : never) : never;
};

type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

export function validator<Table extends SQLiteTable<any>, Fields extends TableFieldsAsBooleans<Table>>(
  table: Table,
  fields: Fields,
) {
  const result = Object.keys(fields).reduce((acc, key) => {
    if (fields[key as keyof typeof fields]) {
      acc[key] = table[key as keyof typeof table];
    }
    return acc;
  }, {} as Record<string, unknown>);

  return result as Prettify<OmitByType<ValidatorResult<Table, Fields>, never>>;
}
