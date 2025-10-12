CREATE TABLE `anime_collection` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`tab` text NOT NULL,
	`title` text NOT NULL,
	`badge` text DEFAULT 'null',
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `anime_collection_title_unique` ON `anime_collection` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `title_idx` ON `anime_collection` (`title`);--> statement-breakpoint
CREATE TABLE `animes` (
	`id` text PRIMARY KEY NOT NULL,
	`session` text,
	`edition` text,
	`duration` text,
	`url` text NOT NULL,
	`snapshot` text,
	`episode` integer,
	`title` text NOT NULL,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text,
	`updated_at` text,
	`anime_id` integer NOT NULL,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE no action
);
