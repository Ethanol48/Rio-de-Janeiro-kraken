import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	login: text('login').notNull().unique(),
	username: text('username').notNull(),
	passwordHash: text('passwordHash').notNull(),
	points: integer('points').default(10),
	foundSecret: integer('foundSecret', { mode: 'boolean' }).default(false),
	button: integer('button', { mode: 'boolean' }).default(false),
	last_spin: integer('last_spin').default(0),
	numberofplaytoday: integer('numberofplaytoday').default(0),
	lastdayplayed_gobelet: text('lastdayplayed_gobelet').default('')
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const ordrer = sqliteTable('ordrer', {
	userId: text('user_id').primaryKey().notNull(),
	cereal: integer('nb_cereal').default(0),
	pate: integer('nb_pate').default(0),
	nb_kebab: integer('nb_kebab').default(0),
	nb_chocolat: integer('nb_chocolat').default(0),
	nb_billet: integer('nb_billet').default(0)
});

export const stock = sqliteTable('stock', {
	id: integer('id').primaryKey(),
	stock: integer('stock').default(0),
	item: text('item')
});

export const blackjack = sqliteTable('blackjack', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),

	// safe the cards as a string?
	// {Color}{symbol/number};{Carta};{Carta}
	playerCards: text('player_cards').notNull().default(''),
	dealerCards: text('dealer_cards').notNull().default(''),
	pile_cards: text('pile_cards').notNull(),

	totalbet: integer('total_bet').notNull().default(0),

	stand: integer('stand', { mode: 'boolean' }).default(false),
	started: integer('started', { mode: 'boolean' }).default(false),
	firstPlay: integer('first_play', { mode: 'boolean' }).default(true),
	neutral: integer('neutral', { mode: 'boolean' }).default(false),
	ended: integer('ended', { mode: 'boolean' }).default(false),
	playerWon: integer('player_won', { mode: 'boolean' }).default(false),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(current_timestamp)`)
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Order = typeof ordrer.$inferSelect;
export type Stock = typeof stock.$inferSelect;
