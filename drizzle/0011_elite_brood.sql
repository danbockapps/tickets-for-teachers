PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_domains` (
	`domain` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_domains`("domain", "created_at") SELECT "domain", "created_at" FROM `domains`;--> statement-breakpoint
DROP TABLE `domains`;--> statement-breakpoint
ALTER TABLE `__new_domains` RENAME TO `domains`;--> statement-breakpoint
PRAGMA foreign_keys=ON;