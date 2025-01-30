import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { db } from '.';
import { user } from './schema';
import { asc } from 'drizzle-orm';

export const leaderBoard = () => {
  return db
    .select({
      login: user.login,
      points: user.points
    })
    .from(user)
    .orderBy(asc(user.points))
    .limit(10)
}
