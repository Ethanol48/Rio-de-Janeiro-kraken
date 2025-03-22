CREATE TABLE `blackjack` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`player_cards` text DEFAULT '' NOT NULL,
	`dealer_cards` text DEFAULT '' NOT NULL,
	`pile_cards` text NOT NULL,
	`total_bet` integer DEFAULT 0 NOT NULL,
	`stand` integer DEFAULT false,
	`started` integer DEFAULT false,
	`first_play` integer DEFAULT true,
	`neutral` integer DEFAULT false,
	`ended` integer DEFAULT false,
	`player_won` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `enigme` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`reponse` text NOT NULL,
	`date_month` integer NOT NULL,
	`date_day` integer NOT NULL,
	`is_recuperer` integer DEFAULT false,
	`points` integer DEFAULT 0 NOT NULL,
	`user_victory` text DEFAULT 'None' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `games` (
	`user_id` text PRIMARY KEY NOT NULL,
	`foundSecret` integer DEFAULT false NOT NULL,
	`button` integer DEFAULT false NOT NULL,
	`last_spin` integer DEFAULT 0 NOT NULL,
	`numberofplaytoday` integer DEFAULT 0 NOT NULL,
	`lastdayplayed_gobelet` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stock` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`desc` text NOT NULL,
	`price` integer NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` text NOT NULL,
	`claimed` integer DEFAULT false,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `stock`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`login` text NOT NULL,
	`username` text NOT NULL,
	`passwordHash` text NOT NULL,
	`points` integer DEFAULT 10 NOT NULL,
	`claimed_orders` integer DEFAULT false NOT NULL,
	`is_admin` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stock_name_unique` ON `stock` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_login_unique` ON `user` (`login`);
