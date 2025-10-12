PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_animes` (
	`id` text PRIMARY KEY NOT NULL,
	`session` text,
	`edition` text,
	`url` text NOT NULL,
	`snapshot` text,
	`episode` integer,
	`duration` integer,
	`title` text NOT NULL,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
INSERT INTO `__new_animes`("id", "session", "edition", "url", "snapshot", "episode", "duration", "title", "created_at", "updated_at") SELECT "id", "session", "edition", "url", "snapshot", "episode", "duration", "title", "created_at", "updated_at" FROM `animes`;--> statement-breakpoint
DROP TABLE `animes`;--> statement-breakpoint
ALTER TABLE `__new_animes` RENAME TO `animes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;