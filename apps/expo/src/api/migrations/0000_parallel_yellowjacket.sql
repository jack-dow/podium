CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`instructions` text
);

CREATE TABLE `template_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`user_id` text,
	`exercise_id` text NOT NULL,
	`template_id` text NOT NULL,
	`order` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE cascade,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON DELETE cascade
);

CREATE TABLE `template_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`user_id` text,
	`template_id` text NOT NULL,
	`template_exercise_id` text NOT NULL,
	`order` integer NOT NULL,
	`type` text NOT NULL,
	`repetitions` text NOT NULL,
	`comments` text,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON DELETE cascade,
	FOREIGN KEY (`template_exercise_id`) REFERENCES `template_exercises`(`id`) ON DELETE cascade
);

CREATE TABLE `templates` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`user_id` text,
	`name` text NOT NULL
);
