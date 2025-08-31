import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db, schema } from "@/db";

export function useLatestReleases(options = {}) {
  const { data } = useLiveQuery(db.select().from(schema.animes));

  return { data };
}
