import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useMigrations as useMigrationsFromDrizzle } from "drizzle-orm/expo-sqlite/migrator";

import { db, sqlite, migrations } from "@/db";

export const useMigrations = () => {
  useDrizzleStudio(sqlite);
  return useMigrationsFromDrizzle(db, migrations);
};
