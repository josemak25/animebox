import { db, schema } from "@/db";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useBookmarks(options = {}) {
  const { data } = useLiveQuery(db.select().from(schema.bookmarks));

  return { data };
}
