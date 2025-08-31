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
CREATE UNIQUE INDEX `anime_collection_tab_unique` ON `anime_collection` (`tab`);--> statement-breakpoint
CREATE UNIQUE INDEX `anime_collection_title_unique` ON `anime_collection` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `title_idx` ON `anime_collection` (`title`);--> statement-breakpoint
CREATE TABLE `animes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`disc` text NOT NULL,
	`fansub` text NOT NULL,
	`session` text NOT NULL,
	`edition` text NOT NULL,
	`filler` integer NOT NULL,
	`snapshot` text NOT NULL,
	`episode` integer NOT NULL,
	`anime_id` integer NOT NULL,
	`episode2` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`completed` integer NOT NULL,
	`anime_title` text NOT NULL,
	`anime_session` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text,
	`updated_at` text,
	`anime_id` integer NOT NULL,
	FOREIGN KEY (`anime_id`) REFERENCES `animes`(`id`) ON UPDATE no action ON DELETE no action
);
