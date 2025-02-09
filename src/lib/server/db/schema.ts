import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  login: text('login').notNull().unique(),
  passwordHash: text('passwordHash').notNull(),
  points: integer('points').default(0),
  foundSecret: integer('foundSecret', { mode: 'boolean' }).default(false),
  button: integer('button', { mode: 'boolean' }).default(false),
  last_spin: integer('last_spin').default(0), 
  lastpoint: integer('lastpoint').default(0), // Timestamp en secondes
  lastplayday: text('lastplayday'), // Timestamp en secondes
  numberofplaytoday: integer('numberofplaytoday').default(0), // Timestamp en secondes
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
