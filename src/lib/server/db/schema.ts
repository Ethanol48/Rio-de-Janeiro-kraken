import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  login: text('login').notNull().unique(),
  passwordHash: text('passwordHash').notNull(),
  points: integer('points').default(0),
  foundSecret: integer('foundSecret', { mode: 'boolean' }).default(false)
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
