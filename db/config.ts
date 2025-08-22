import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

import { expo } from "@/app.json";

const APP_NAME = expo.name.toUpperCase();

export const sqlite = openDatabaseSync(`${APP_NAME}.db`, {
  enableChangeListener: true,
});

export const db = drizzle(sqlite, { casing: "snake_case", logger: __DEV__ });
