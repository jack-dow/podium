ALTER TABLE exercises ADD `created_at` integer NOT NULL;
ALTER TABLE exercises ADD `updated_at` integer NOT NULL;
ALTER TABLE exercises ADD `instructions` text;
ALTER TABLE exercises ADD `user_id` text;