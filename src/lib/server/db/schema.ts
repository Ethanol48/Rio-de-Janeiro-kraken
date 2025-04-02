import { pgTable, varchar, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: varchar('id').primaryKey(),
	login: varchar('login').notNull().unique(),
	username: varchar('username').notNull(),
	passwordHash: varchar('passwordHash').notNull(),
	points: integer('points').notNull().default(10),
	claimedOrders: boolean('claimed_orders').notNull().default(false),
	wantToClaim: boolean('want_to_claim').notNull().default(false),
	isAdmin: boolean('is_admin').notNull().default(false)
});

export const session = pgTable('session', {
	id: varchar('id').primaryKey(),
	userId: varchar('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at').notNull()
	//expiresAt: integer('expires_at').notNull()
});

export const games = pgTable('games', {
	userId: varchar('user_id')
		.primaryKey()
		.references(() => user.id),
	foundSecret: boolean('foundSecret').notNull().default(false),
	button: boolean('button').notNull().default(false),
	last_spin: integer('last_spin').notNull().default(0),
	numberofplaytoday: integer('numberofplaytoday').notNull().default(0),
	lastdayplayed_gobelet: varchar('lastdayplayed_gobelet').notNull().default('')
});

export const orders = pgTable('orders', {
	id: varchar('id').primaryKey(),
	userId: varchar('user_id')
		.notNull()
		.references(() => user.id),
	productId: varchar('product_id')
		.notNull()
		.references(() => items.id)
});

export const items = pgTable('stock', {
	id: varchar('id').primaryKey(),
	name: varchar('name').unique().notNull(),
	desc: varchar('desc').notNull(),
	price: integer('price').notNull(),
	stock: integer('stock').notNull().default(0)
});

export const blackjack = pgTable('blackjack', {
	id: varchar('id').primaryKey(),
	userId: varchar('user_id')
		.notNull()
		.references(() => user.id),

	// safe the cards as a string?
	// {Color}{symbol/number};{Carta};{Carta}
	playerCards: varchar('player_cards').notNull().default(''),
	dealerCards: varchar('dealer_cards').notNull().default(''),
	pile_cards: varchar('pile_cards').notNull(),
	totalbet: integer('total_bet').notNull().default(0),
	stand: boolean('stand').default(false),
	started: boolean('started').default(false),
	firstPlay: boolean('first_play').default(true),
	neutral: boolean('neutral').default(false),
	ended: boolean('ended').default(false),
	playerWon: boolean('player_won').default(false),
	createdAt: timestamp('created_at')
		.notNull()
		.defaultNow()
});

export const enigme = pgTable('enigme', {
	id: varchar('id').primaryKey(),
	question: varchar('question').notNull(),
	reponse: varchar('reponse').notNull(),
	date_month: integer('date_month').notNull(),
	date_day: integer('date_day').notNull(),
	is_recuperer: boolean('is_recuperer').default(false),
	points: integer('points').notNull().default(0),
	user_victory: varchar('user_victory').notNull().default('None')
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Orders = typeof orders.$inferSelect;
export type Items = typeof items.$inferSelect;
export type Enigme = typeof enigme.$inferSelect;
export type Games = typeof games.$inferSelect;
