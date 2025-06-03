ALTER TABLE `project_key_values` RENAME TO `key_value_pairs`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_key_value_pairs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`enabled` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_updated_at` text,
	`project_id` integer,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_key_value_pairs`("id", "label", "key", "value", "enabled", "created_at", "last_updated_at", "project_id") SELECT "id", "label", "key", "value", "enabled", "created_at", "last_updated_at", "project_id" FROM `key_value_pairs`;--> statement-breakpoint
DROP TABLE `key_value_pairs`;--> statement-breakpoint
ALTER TABLE `__new_key_value_pairs` RENAME TO `key_value_pairs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;