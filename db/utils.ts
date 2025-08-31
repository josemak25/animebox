import { sql, SQL, getTableColumns } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";

export const buildConflictUpdateColumns = <T extends SQLiteTable>(table: T) => {
  const cls = getTableColumns(table);
  const columns = Object.keys(cls) as (keyof T["_"]["columns"])[];

  return columns.reduce(
    (acc, column) => {
      const colName = cls[column].name;
      acc[column] = sql.raw(`excluded.${colName}`);
      return acc;
    },
    {} as Record<keyof T["_"]["columns"], SQL>
  );
};
