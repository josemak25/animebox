import { useMigrations as useMigrationsFromDrizzle } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

import { db, sqlite, migrations } from "@/db";

/**
 * Hook for managing database migrations and Drizzle Studio integration.
 *
 * Provides a unified interface for handling database schema migrations
 * and enables Drizzle Studio for database inspection during development.
 * Automatically runs pending migrations on app startup.
 *
 * @returns {Object} Migration status and control object
 * @returns {boolean} success - Whether migrations completed successfully
 * @returns {Array} error - Any migration errors that occurred
 * @returns {boolean} pending - Whether migrations are currently running
 *
 * @example
 * ```tsx
 * const { success, error, pending } = useMigrations();
 *
 * if (pending) {
 *   return <LoadingSpinner />;
 * }
 *
 * if (error) {
 *   return <ErrorMessage error={error} />;
 * }
 *
 * if (success) {
 *   return <MainApp />;
 * }
 * ```
 *
 * @see {@link https://orm.drizzle.team/docs/migrations Drizzle Migrations}
 * @see {@link https://github.com/drizzle-team/expo-drizzle-studio-plugin Drizzle Studio}
 */
export const useMigrations = () => {
  // Enable Drizzle Studio for database inspection in development
  useDrizzleStudio(sqlite);

  // Run database migrations using Drizzle's migration system
  return useMigrationsFromDrizzle(db, migrations);
};
