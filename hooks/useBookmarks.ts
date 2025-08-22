import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db, schema } from "@/db";

export function useBookmarks(options = {}) {
  const { data } = useLiveQuery(db.select().from(schema.bookmarks));

  return { data };
}
