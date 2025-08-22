# Drizzle ORM Setup Guide

This guide explains how Drizzle ORM is set up and used in the AnimeBox React
Native app for type-safe database operations.

## 🚀 What is Drizzle ORM?

Drizzle is a lightweight TypeScript ORM that provides type-safe database
operations while maintaining close-to-SQL syntax. It generates TypeScript types
from your database schema and provides excellent IntelliSense support.

## 📦 Dependencies

The project uses these Drizzle-related packages:

```json
{
  "drizzle-orm": "^0.44.4", // Core ORM library
  "drizzle-kit": "^0.31.4", // CLI tools for migrations
  "expo-drizzle-studio-plugin": "^0.2.0" // Database browser plugin
}
```

## 📁 Database Structure

```text
/db/
  ├── index.ts              # Database connection and utilities
  ├── schema.ts             # Database schema definitions
  └── migrations/           # Auto-generated migration files
      ├── 0000_initial.sql
      ├── meta/
      │   ├── _journal.json
      │   └── 0000_snapshot.json
      └── ...
```

## 🗄️ Database Schema

The app uses two main tables for anime tracking:

```typescript
// db/schema.ts
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
  id: integer("id").primaryKey({ autoIncrement: true }),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
  anime_id: integer("anime_id")
    .notNull()
    .references(() => animes.id), // Foreign key relationship
});
```

### Type Safety

Drizzle automatically generates TypeScript types from your schema:

```typescript
// Auto-generated types
export type AnimeInterface = typeof animes.$inferSelect;
export type BookmarkInterface = typeof bookmarks.$inferSelect;

// Usage in components
const anime: AnimeInterface = {
  id: 1,
  anime_title: "Attack on Titan",
  episode: 25,
  completed: 1,
  // ... all properties are type-checked
};
```

## 🔧 Database Connection

The database connection is configured with live query support:

```typescript
// db/index.ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { animes, bookmarks } from "./schema";
import migrations from "./migrations/migrations";

// Open database with change listener for live queries
const expoDb = openDatabaseSync("animebox.db", {
  enableChangeListener: true, // Essential for useLiveQuery
});

// Create Drizzle instance
export const db = drizzle(expoDb, {
  schema: { animes, bookmarks },
});

export { migrations };
export * from "./schema";
```

## 🎯 Live Queries with useLiveQuery

One of Drizzle's most powerful features is live queries that automatically
update your UI when data changes:

```typescript
// hooks/useAnimes.ts
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/db";
import { animes } from "@/db/schema";
import { desc } from "drizzle-orm";

export const useAnimes = () => {
  const { data: animeList, error } = useLiveQuery(
    db.select().from(animes).orderBy(desc(animes.updated_at))
  );

  return {
    animes: animeList || [],
    error,
  };
};
```

### Benefits of Live Queries

- **Automatic UI Updates**: UI updates instantly when database changes
- **No Manual State Management**: No need to manually refetch data
- **Real-time Sync**: Multiple components stay in sync automatically

## 🔨 Database Operations

### Basic CRUD Operations

```typescript
import { db } from "@/db";
import { animes, bookmarks } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// Create
const newAnime = await db.insert(animes).values({
  anime_title: "New Anime",
  episode: 1,
  completed: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  // ... other required fields
});

// Read with filters
const completedAnimes = await db
  .select()
  .from(animes)
  .where(eq(animes.completed, 1))
  .orderBy(desc(animes.updated_at));

// Update
await db
  .update(animes)
  .set({
    episode: 25,
    completed: 1,
    updated_at: new Date().toISOString(),
  })
  .where(eq(animes.id, 1));

// Delete
await db.delete(animes).where(eq(animes.id, 1));
```

### Complex Queries with Joins

```typescript
// Get animes with their bookmarks
const animesWithBookmarks = await db
  .select({
    id: animes.id,
    title: animes.anime_title,
    episode: animes.episode,
    isBookmarked: bookmarks.id,
  })
  .from(animes)
  .leftJoin(bookmarks, eq(animes.id, bookmarks.anime_id));
```

## 🎣 Custom Hooks

The app provides custom hooks for common database operations:

### useAnimes Hook

```typescript
// hooks/useAnimes.ts
export const useAnimes = () => {
  const { data: animeList, error } = useLiveQuery(
    db.select().from(animes).orderBy(desc(animes.updated_at))
  );

  return {
    animes: animeList || [],
    error,
  };
};

// Usage in components
function AnimeListScreen() {
  const { animes, error } = useAnimes();

  if (error) return <ErrorScreen error={error} />;

  return (
    <FlatList
      data={animes}
      renderItem={({ item }) => <AnimeCard anime={item} />}
    />
  );
}
```

### useBookmarks Hook

```typescript
// hooks/useBookmarks.ts
export const useBookmarks = () => {
  const { data: bookmarksList, error } = useLiveQuery(
    db
      .select({
        id: bookmarks.id,
        anime_id: bookmarks.anime_id,
        anime_title: animes.anime_title,
        created_at: bookmarks.created_at,
      })
      .from(bookmarks)
      .innerJoin(animes, eq(bookmarks.anime_id, animes.id))
      .orderBy(desc(bookmarks.created_at))
  );

  const addBookmark = async (animeId: number) => {
    await db.insert(bookmarks).values({
      anime_id: animeId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  const removeBookmark = async (bookmarkId: number) => {
    await db.delete(bookmarks).where(eq(bookmarks.id, bookmarkId));
  };

  return {
    bookmarks: bookmarksList || [],
    addBookmark,
    removeBookmark,
    error,
  };
};
```

## 🔄 Database Initialization

The app automatically handles database initialization and migrations:

```typescript
// hooks/useMigrations.ts
import { useMigrations } from "drizzle-orm/expo-sqlite";
import { db, migrations } from "@/db";

export const useAppDatabase = () => {
  const { success, error } = useMigrations(db, migrations);

  return {
    isReady: success,
    error,
  };
};

// Usage in App.tsx
function App() {
  const { isReady, error } = useAppDatabase();

  if (error) return <DatabaseErrorScreen />;
  if (!isReady) return <LoadingScreen />;

  return <MainApp />;
}
```

## 🔧 Development Tools

### Drizzle Studio

Browse and edit your database visually:

```bash
npx drizzle-kit studio
```

### Configuration

```typescript
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  driver: "expo",
} satisfies Config;
```

## 🎯 Key Benefits

### Enhanced Type Safety

- **Compile-time Error Checking**: TypeScript catches database errors before runtime
- **Auto-completion**: Full IntelliSense support for all database operations
- **Inferred Types**: Types are automatically generated from your schema

### Performance

- **Optimized Queries**: Drizzle generates efficient SQL queries
- **Live Queries**: Only re-render components when relevant data changes
- **Minimal Bundle Size**: Lightweight ORM with no runtime overhead

### Developer Experience

- **SQL-like Syntax**: Familiar query builder that resembles SQL
- **Migration System**: Automatic schema migration generation
- **Database Browser**: Visual database editor with Drizzle Studio

## 📱 Real-World Usage

In the AnimeBox app, Drizzle powers:

- **Anime Tracking**: Managing anime episodes, completion status
- **Bookmarking**: Favorite anime management with foreign key relationships
- **Live Updates**: UI automatically updates when data changes
- **Type Safety**: All database operations are fully type-checked

This setup provides a robust, type-safe database layer that scales with your
app's complexity while maintaining excellent developer experience.
