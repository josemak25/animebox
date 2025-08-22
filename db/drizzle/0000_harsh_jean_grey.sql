CREATE TABLE `anime` (
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
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`anime_id` integer NOT NULL,
	FOREIGN KEY (`anime_id`) REFERENCES `anime`(`id`) ON UPDATE no action ON DELETE no action
);
