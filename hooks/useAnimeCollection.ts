import { or, eq, like } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useEffect } from "react";

import { db, schema } from "@/db";
import { buildConflictUpdateColumns } from "@/db/utils";
import { batch } from "@/helpers/common";
import { HeaderLessParser } from "@/service/headless-parser";

import { useHeadlessBrowser } from "./useHeadlessBrowser";

export function useAnimeCollection(
  params: { search?: string; tab?: string; page?: number } = {}
) {
  const { data } = useLiveQuery(
    db
      .select()
      .from(schema.animeCollection)
      .where(
        or(
          eq(schema.animeCollection.tab, params.tab || "A"),
          like(schema.animeCollection.title, `%${params?.search || ""}%`)
        )
      )
      .offset(((params.page || 1) - 1) * 10)
      .limit(10)
  );

  const { html } = useHeadlessBrowser({
    staleTime: 1000 * 60 * 60 * 24 * 1, // 1 day
    url: `${HeaderLessParser.BASE_URL}/anime`,
  });

  const handleResponse = async (h: string) => {
    const parser = new HeaderLessParser();
    const collection = parser.fetchAllAnime(h);

    const payload = Object.entries(collection)
      .map(([tab, animes]) => animes.map((anime) => ({ ...anime, tab })))
      .flat();

    const operations = batch(payload, 200);

    for (const batch of operations) {
      await db
        .insert(schema.animeCollection)
        .values(batch)
        .onConflictDoUpdate({
          target: schema.animeCollection.title,
          set: buildConflictUpdateColumns(schema.animeCollection),
        });
    }
  };

  useEffect(() => {
    if (html) {
      handleResponse(html);
    }
  }, [html]);

  return { data };
}
