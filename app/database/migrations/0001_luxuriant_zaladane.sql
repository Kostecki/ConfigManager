ALTER TABLE `project` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_project_key_values` (
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
INSERT INTO `__new_project_key_values`("id", "label", "key", "value", "enabled", "created_at", "last_updated_at", "project_id") SELECT "id", "label", "key", "value", "enabled", "created_at", "last_updated_at", "project_id" FROM `project_key_values`;--> statement-breakpoint
DROP TABLE `project_key_values`;--> statement-breakpoint
ALTER TABLE `__new_project_key_values` RENAME TO `project_key_values`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_voltages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reading` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`project_id` integer,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_voltages`("id", "reading", "created_at", "project_id") SELECT "id", "reading", "created_at", "project_id" FROM `voltages`;--> statement-breakpoint
DROP TABLE `voltages`;--> statement-breakpoint
ALTER TABLE `__new_voltages` RENAME TO `voltages`;