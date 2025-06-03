CREATE TABLE `provider` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`token` text NOT NULL,
	`expire_at` text NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `provider_token_unique` ON `provider` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `provider_userId_unique` ON `provider` (`user_id`);--> statement-breakpoint
ALTER TABLE `mail` ADD `to` text NOT NULL;