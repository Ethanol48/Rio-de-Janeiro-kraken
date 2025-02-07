import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  login: text('login').notNull().unique(),
  passwordHash: text('passwordHash').notNull(),
  points: integer('points').default(10),
  foundSecret: integer('foundSecret', { mode: 'boolean' }).default(false),
  button: integer('button', { mode: 'boolean' }).default(false)
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});


export const blackjack = sqliteTable('blackjack', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  ended: integer('ended', { mode: 'boolean' }).default(false),
  totalbet: integer('total_bet').notNull().default(0),

  // safe the cards as a string?
  // {Color}{symbol/number};{Carta};{Carta}
  playerCards: text('player_cards').notNull().default(""),
  dealerCards: text('dealer_cards').notNull().default("")
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
