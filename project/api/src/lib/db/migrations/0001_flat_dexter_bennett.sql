CREATE TABLE `mail` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`subject` text,
	`sender` text,
	`body` text,
	`date` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mail_uuid_unique` ON `mail` (`uuid`);