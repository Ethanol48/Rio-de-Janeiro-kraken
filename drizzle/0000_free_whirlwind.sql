CREATE TABLE "blackjack" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"player_cards" varchar DEFAULT '' NOT NULL,
	"dealer_cards" varchar DEFAULT '' NOT NULL,
	"pile_cards" varchar NOT NULL,
	"total_bet" integer DEFAULT 0 NOT NULL,
	"stand" boolean DEFAULT false,
	"started" boolean DEFAULT false,
	"first_play" boolean DEFAULT true,
	"neutral" boolean DEFAULT false,
	"ended" boolean DEFAULT false,
	"player_won" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enigme" (
	"id" varchar PRIMARY KEY NOT NULL,
	"question" varchar NOT NULL,
	"reponse" varchar NOT NULL,
	"date_month" integer NOT NULL,
	"date_day" integer NOT NULL,
	"is_recuperer" boolean DEFAULT false,
	"points" integer DEFAULT 0 NOT NULL,
	"user_victory" varchar DEFAULT 'None' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"foundSecret" boolean DEFAULT false NOT NULL,
	"button" boolean DEFAULT false NOT NULL,
	"last_spin" integer DEFAULT 0 NOT NULL,
	"numberofplaytoday" integer DEFAULT 0 NOT NULL,
	"lastdayplayed_gobelet" varchar DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"desc" varchar NOT NULL,
	"price" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "stock_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"product_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"expires_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"login" varchar NOT NULL,
	"username" varchar NOT NULL,
	"passwordHash" varchar NOT NULL,
	"points" integer DEFAULT 10 NOT NULL,
	"claimed_orders" boolean DEFAULT false NOT NULL,
	"want_to_claim" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_login_unique" UNIQUE("login")
);
--> statement-breakpoint
ALTER TABLE "blackjack" ADD CONSTRAINT "blackjack_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_stock_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."stock"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;