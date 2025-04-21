import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';

const { Pool } = pkg;

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle({ client: pool });

import { eq, ne, and, sql } from 'drizzle-orm';
import { blackjack, user } from './schema';

const total = await db.$count(blackjack);
const played = await db.$count(blackjack, ne(blackjack.totalbet, 0));
const wins = await db.$count(blackjack, eq(blackjack.playerWon, true));
const proportion = Math.floor((wins / played) * 100);

async function statsPlayer(username: string) {
  return (
    await db
      .selectDistinct({
        username: user.username,

        total: db.$count(blackjack, eq(user.id, blackjack.userId)),

        played: db.$count(blackjack, and(ne(blackjack.totalbet, 0), eq(user.id, blackjack.userId))),

        won: db.$count(
          blackjack,
          and(
            ne(blackjack.totalbet, 0),
            eq(user.id, blackjack.userId),
            eq(blackjack.playerWon, true)
          )
        )
      })
      .from(blackjack)
      .where(ne(blackjack.totalbet, 0))
      .innerJoin(user, and(eq(blackjack.userId, user.id), eq(user.username, username)))
      .limit(1)
  ).at(0);
}

const adicted = (
  await db
    .select({
      username: user.username,
      gamesPlayed: sql<number>`COUNT(*)`.as('gamesplayed')
    })
    .from(blackjack)
    .where(ne(blackjack.totalbet, 0))
    .innerJoin(user, eq(blackjack.userId, user.id))
    .groupBy(user.username)
    .orderBy(sql`gamesplayed DESC`)
    .limit(1)
).at(0);

console.log('Blackjack stats:\n');
console.log(`Total games: ${total}`);
console.log(`Total played games: ${played}`);
console.log(`Total wins: ${wins}`);
console.log(`Win rate overall: ${proportion}%`);

console.log('adicted: ', adicted);
