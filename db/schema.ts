import {
  text,
  integer,
  uniqueIndex,
  sqliteTable,
} from "drizzle-orm/sqlite-core";

import { generateUUID } from "@/helpers/uuid";

/* ************************************************************************************** *
 * **************************                               ***************************** *
 * **************************           DB SCHEMAS          ***************************** *
 * **************************                               ***************************** *
 * ************************************************************************************** */

export const animes = sqliteTable("animes", {
  id: text("id")
    .primaryKey()
    .$default(() => generateUUID()),
  session: text("session"),
  edition: text("edition"),
  snapshot: text("snapshot"),
  episode: integer("episode"),
  duration: integer("duration"),
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  created_at: text("created_at").$default(() => new Date().toISOString()),
  updated_at: text("updated_at").$default(() => new Date().toISOString()),
});

export const bookmarks = sqliteTable("bookmarks", {
  id: text("id")
    .primaryKey()
    .$default(() => generateUUID()),
  created_at: text("created_at").$default(() => new Date().toISOString()),
  updated_at: text("updated_at").$default(() => new Date().toISOString()),
  anime_id: integer("anime_id")
    .notNull()
    .references(() => animes.id),
});

export const animeCollection = sqliteTable(
  "anime_collection",
  {
    id: text("id")
      .primaryKey()
      .$default(() => generateUUID()),
    url: text("url").notNull(),
    tab: text("tab").notNull(),
    title: text("title").unique().notNull(),
    badge: text("badge", { mode: "json" }).default(null),
    created_at: text("created_at").$default(() => new Date().toISOString()),
    updated_at: text("updated_at").$default(() => new Date().toISOString()),
  },
  (table) => [uniqueIndex("title_idx").on(table.title)]
);

/* ************************************************************************************** *
 * **************************                               ***************************** *
 * **************************          SCHEMA TYPES         ***************************** *
 * **************************                               ***************************** *
 * ************************************************************************************** */

export type AnimeInterface = typeof animes.$inferSelect;
export type BookmarkInterface = typeof bookmarks.$inferSelect;
