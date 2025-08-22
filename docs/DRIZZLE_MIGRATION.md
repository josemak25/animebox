# Drizzle Migration Guide

This guide covers how Drizzle migrations work in the AnimeBox app and how to
add new columns or tables safely.

## 🔄 How Drizzle Migrations Work

Drizzle migrations are automatically generated SQL files that track changes to
your database schema. They ensure your database structure stays in sync
across all environments (development, testing, production).

### Migration Process

1. **Schema Changes**: You modify your schema in `db/schema.ts`
2. **Generate Migration**: Drizzle compares your schema with the current database
3. **Create Migration File**: A SQL file is generated with the necessary changes
4. **Apply Migration**: The migration runs and updates your database structure

### Migration Lifecycle

```text
Schema Change → Generate → Apply → Database Updated
```

## 📁 Migration Files Structure

```text
/db/migrations/
  ├── 0000_initial_migration.sql        # Initial schema
  ├── 0001_add_completed_column.sql     # Added completed column
  ├── 0002_add_bookmarks_table.sql      # Added bookmarks table
  └── meta/
      ├── _journal.json                 # Migration metadata
      └── 0000_snapshot.json           # Schema snapshots
```

## 🆕 Adding a New Column

### Step 1: Update Schema

```typescript
// db/schema.ts - Before
export const animes = sqliteTable("animes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  anime_title: text("anime_title").notNull(),
  episode: integer("episode").notNull(),
  // ... other columns
});

// db/schema.ts - After (adding a new column)
export const animes = sqliteTable("animes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  anime_title: text("anime_title").notNull(),
  episode: integer("episode").notNull(),
  rating: integer("rating"), // ← New column added
  // ... other columns
});
```

### Step 2: Generate Migration

```bash
npx drizzle-kit generate
```

This creates a new migration file:

```sql
-- 0003_add_rating_column.sql
ALTER TABLE `animes` ADD COLUMN `rating` integer;
```

### Step 3: Apply Migration

The migration runs automatically when your app starts via the `useMigrations` hook:

```typescript
// hooks/useMigrations.ts handles this automatically
const { success, error } = useMigrations(db, migrations);
```

## 🗃️ Adding a New Table

### Step 1: Define New Table Schema

```typescript
// db/schema.ts - Adding a reviews table
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  anime_id: integer("anime_id")
    .notNull()
    .references(() => animes.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});

// Export the type
export type ReviewInterface = typeof reviews.$inferSelect;
```

### Step 2: Generate Table Migration

```bash
npx drizzle-kit generate
```

Creates migration file:

```sql
-- 0004_add_reviews_table.sql
CREATE TABLE `reviews` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `anime_id` integer NOT NULL,
  `rating` integer NOT NULL,
  `comment` text,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL,
  FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`)
    ON UPDATE no action ON DELETE no action
);
```

### Step 3: Create Hook for New Table

```typescript
// hooks/useReviews.ts
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/db";
import { reviews } from "@/db/schema";

export const useReviews = () => {
  const { data: reviewsList, error } = useLiveQuery(db.select().from(reviews));

  return {
    reviews: reviewsList || [],
    error,
  };
};
```

## 🔧 Migration Commands

### Available Scripts

```json
// package.json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "npx drizzle-kit studio"
  }
}
```

### Command Usage

```bash
# Generate migration after schema changes
npm run db:generate

# Push schema directly (development only - skips migrations)
npm run db:push

# Open database browser
npm run db:studio
```

## 🚨 Migration Best Practices

### ✅ Safe Migrations

```typescript
// Adding nullable columns (safe)
rating: integer("rating"), // No default needed

// Adding columns with defaults (safe)
status: text("status").default("active"),

// Adding non-null columns with defaults (safe)
created_at: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
```

### ⚠️ Potentially Breaking Changes

```typescript
// Adding non-null columns without defaults (risky)
required_field: text("required_field").notNull(), // May fail if table has data

// Changing column types (risky)
// From: episode: text("episode")
// To:   episode: integer("episode") // Data loss possible
```

### 🛡️ Safe Migration Strategy

```typescript
// Step 1: Add nullable column
new_episode_number: integer("new_episode_number"),

// Step 2: Populate data in a separate migration
// Step 3: Make column non-null if needed
// Step 4: Remove old column if necessary
```

## 📊 Live Query Integration

When you add new tables, they automatically work with live queries:

```typescript
// New hook automatically reactive
export const useNewTable = () => {
  const { data, error } = useLiveQuery(db.select().from(newTable));

  return { data: data || [], error };
};
```

## 🔍 Migration Debugging

### Check Migration Status

```typescript
// View migration metadata
const migrations = await db.select().from(migrations_table);
console.log("Applied migrations:", migrations);
```

### Manual Migration Recovery

```sql
-- If migrations get corrupted, you can manually reset
DELETE FROM __drizzle_migrations;
-- Then run migrations again
```

## 🎯 Real Example: Adding User Preferences

### Step 1: Schema Update

```typescript
export const userPreferences = sqliteTable("user_preferences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  theme: text("theme").notNull().default("system"),
  autoplay: integer("autoplay", { mode: "boolean" }).notNull().default(false),
  playback_speed: text("playback_speed").notNull().default("1.0"),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});
```

### Step 2: Generate & Apply

```bash
npm run db:generate  # Creates migration
# Migration applies automatically on app restart
```

### Step 3: Use New Table

```typescript
// hooks/useUserPreferences.ts
export const useUserPreferences = () => {
  const { data: prefs } = useLiveQuery(
    db.select().from(userPreferences).limit(1)
  );

  const updatePreference = async (updates: Partial<UserPreference>) => {
    if (prefs?.[0]) {
      await db
        .update(userPreferences)
        .set({ ...updates, updated_at: new Date().toISOString() })
        .where(eq(userPreferences.id, prefs[0].id));
    }
  };

  return {
    preferences: prefs?.[0] || null,
    updatePreference,
  };
};
```

This migration system ensures your database evolves safely while maintaining
data integrity and providing automatic UI updates through live queries.
