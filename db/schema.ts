import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { generateUUID } from "../helpers/uuid";

/* ************************************************************************************** *
 * **************************                               ***************************** *
 * **************************           DB SCHEMAS          ***************************** *
 * **************************                               ***************************** *
 * ************************************************************************************** */

export const animes = sqliteTable("animes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  disc: text("disc").notNull(),
  fansub: text("fansub").notNull(),
  session: text("session").notNull(),
  edition: text("edition").notNull(),
  filler: integer("filler").notNull(),
  snapshot: text("snapshot").notNull(),
  episode: integer("episode").notNull(),
  anime_id: integer("anime_id").notNull(),
  episode2: integer("episode2").notNull(),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
  completed: integer("completed").notNull(),
  anime_title: text("anime_title").notNull(),
  anime_session: text("anime_session").notNull(),
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
