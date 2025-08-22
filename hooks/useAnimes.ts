import { db, schema } from "@/db";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useAnimes(options = {}) {
  const { data } = useLiveQuery(db.select().from(schema.animes));

  return { data };
}
