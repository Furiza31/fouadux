PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_mail` (
	`id` text PRIMARY KEY NOT NULL,
	`subject` text,
	`sender` text,
	`body` text,
	`date` text,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_mail`("id", "subject", "sender", "body", "date", "user_id") SELECT "id", "subject", "sender", "body", "date", "user_id" FROM `mail`;--> statement-breakpoint
DROP TABLE `mail`;--> statement-breakpoint
ALTER TABLE `__new_mail` RENAME TO `mail`;--> statement-breakpoint
PRAGMA foreign_keys=ON;