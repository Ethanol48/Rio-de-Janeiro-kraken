import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { db } from '.';
import { user } from './schema';
import { desc, eq } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/mysql-core';

export const leaderBoard = async () => {
  return await db
    .select({ login: user.login, points: user.points })
    .from(user)
    .orderBy(desc(user.points))
    .limit(10)
}


export const foundedSecret = async (userId: string) => {
  return await db
    .select({ foundedSecret: user.foundSecret })
    .from(user)
    .where(eq(user.id, userId))
}
