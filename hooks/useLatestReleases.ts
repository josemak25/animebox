import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useCallback } from "react";

import { db, schema } from "@/db";
import { buildConflictUpdateColumns } from "@/db/utils";
import { HeaderLessParser } from "@/service/headless-parser";

import { useHeadlessBrowser } from "./useHeadlessBrowser";

export function useLatestReleases(options = {}) {
  const { data } = useLiveQuery(db.select().from(schema.animes));

  /**
   * Parses the HTML and upserts the anime collection into the local DB in batches.
   * Uses batch insert to avoid SQLite's variable limit errors.
   *
   * @param {string} h - The HTML string to parse
   */
  const onSuccess = useCallback(async (h: string) => {
    const parser = new HeaderLessParser();
    const collection = parser.fetchLatestReleases(h);

    // If no data, skip processing
    if (!collection?.data?.length) {
      return;
    }

    // Insert each batch into the DB, upserting on title conflict
    await db
      .insert(schema.animes)
      .values(collection.data)
      .onConflictDoUpdate({
        target: schema.animes.url,
        set: buildConflictUpdateColumns(schema.animes),
      });
  }, []);

  // Fetch HTML for the anime collection page using the headless browser cache
  const response = useHeadlessBrowser({
    onSuccess,
    url: HeaderLessParser.BASE_URL,
    staleTime: 1000 * 60 * 60 * 24 * 1, // 1 day
  });

  return { ...response, data };
}
