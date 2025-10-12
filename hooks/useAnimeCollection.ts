import { eq, like, and } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useCallback } from "react";

import { db, schema } from "@/db";
import { buildConflictUpdateColumns } from "@/db/utils";
import { batch } from "@/helpers/common";
import { HeaderLessParser } from "@/service/headless-parser";

import { useHeadlessBrowser } from "./useHeadlessBrowser";

/**
 * Custom React hook for fetching and searching anime collections.
 *
 * This hook leverages the headless browser cache to fetch the latest anime collection
 * from the remote source, parses the HTML, and stores the results in the local SQLite database.
 * It also provides live query access to the anime collection, supporting search and pagination.
 *
 * @param {Object} params - Query parameters
 * @param {string} [params.search] - Search string for anime titles
 * @param {string} [params.tab] - Tab/category filter
 * @param {number} [params.page=1] - Page number for pagination (10 items per page)
 * @returns {Object} data - The current anime collection data from the database
 *
 * @example
 * const { data } = useAnimeCollection({ search: "Naruto", tab: "A", page: 2 });
 *
 * @remarks
 * - Uses Drizzle ORM for type-safe database operations
 * - Uses batch insert to avoid SQLite variable limits
 * - Automatically updates the local DB when new HTML is fetched
 */

export function useAnimeCollection(
  params: { search?: string; tab?: string; page?: number } = {}
) {
  // Live query for anime collection with search and pagination
  const { data } = useLiveQuery(
    db
      .select()
      .from(schema.animeCollection)
      .where(
        and(
          eq(schema.animeCollection.tab, params?.tab || "A"),
          like(schema.animeCollection.title, `%${params?.search || ""}%`)
        )
      )
      .offset(((params.page || 1) - 1) * 10)
      .limit(10)
  );

  /**
   * Parses the HTML and upserts the anime collection into the local DB in batches.
   * Uses batch insert to avoid SQLite's variable limit errors.
   *
   * @param {string} h - The HTML string to parse
   */
  const onSuccess = useCallback(async (h: string) => {
    const parser = new HeaderLessParser();
    const collection = parser.fetchAllAnime(h);

    const payload = Object.entries(collection)
      .map(([tab, animes]) => animes.map((anime) => ({ ...anime, tab })))
      .flat();

    // Batch the payload to avoid SQLite's variable limit (e.g., 999 variables per statement)
    const operations = batch(payload, 200);

    // Insert each batch into the DB, upserting on title conflict
    for (const batch of operations) {
      await db
        .insert(schema.animeCollection)
        .values(batch)
        .onConflictDoUpdate({
          target: schema.animeCollection.title,
          set: buildConflictUpdateColumns(schema.animeCollection),
        });
    }
  }, []);

  // Fetch HTML for the anime collection page using the headless browser cache
  const response = useHeadlessBrowser({
    onSuccess,
    staleTime: 1000 * 60 * 60 * 24 * 1, // 1 day
    url: `${HeaderLessParser.BASE_URL}/anime`,
  });

  return { ...response, data };
}
