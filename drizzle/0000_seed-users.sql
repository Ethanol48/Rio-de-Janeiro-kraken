-- Custom SQL migration file, put you code below! --
INSERT INTO "user" (id, login, passwordHash, points, foundSecret, button ) 
VALUES (
    'superid-admin',
    'beta.testing',
    '$argon2id$v=19$m=19456,t=2,p=1$4AScNg6CrQKWhS8AZqfi4A$JdUwm0tbU3D+XgjMjFoMwU9cffoyFsytpAKwIAmaHwQ',
    10,
    0,
    0
)




-- export const user = sqliteTable('user', {
--   id: text('id').primaryKey(),
--   login: text('login').notNull().unique(),
--   passwordHash: text('passwordHash').notNull(),
--   points: integer('points').default(10),
--   foundSecret: integer('foundSecret', { mode: 'boolean' }).default(false),
--   button: integer('button', { mode: 'boolean' }).default(false)
-- });
