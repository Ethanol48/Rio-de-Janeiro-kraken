import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { db } from '.';
import { blackjack, user } from './schema';
import { count, desc, eq } from 'drizzle-orm';
import { boolean } from 'drizzle-orm/mysql-core';

export const leaderBoard = async () => {
  return await db
    .select({ login: user.login, points: user.points })
    .from(user)
    .orderBy(desc(user.points))
    .limit(10)
}

export const GetBlackJackGame = async (userId: string) => {
  const result_query = await db
    .select({ id: blackjack.id })
    .from(blackjack)
    .where(eq(blackjack.userId, userId))

  const gameId = result_query[0].id
  return gameId
}


export const isGameOnGoing = async (userId: string):
  Promise<{ game: Boolean, id: string | null }> => {

  const result_query: { number: number }[] = await db
    .select({ number: count() })
    .from(blackjack)
    .where(eq(blackjack.userId, userId))

  const num = result_query[0].number

  if (num == 0) return { game: false, id: null }
  return { game: true, id: await GetBlackJackGame(userId) }
}


export const foundedSecret = async (userId: string) => {
  const result_query = await db
    .select({ foundedSecret: user.foundSecret })
    .from(user)
    .where(eq(user.id, userId))

  const claimed = result_query[0].foundedSecret
  return claimed
}


export const setFoundedSecret = async (userId: string) => {
  return await db
    .update(user)
    .set({ foundSecret: true })
    .where(eq(user.id, userId))
}


export const foundedButton = async (userId: string) => {

  const result_query = await db
    .select({ button: user.button })
    .from(user)
    .where(eq(user.id, userId))

  const claimed = result_query[0].button
  return claimed
}


export const setButton = async (userId: string) => {
  return await db
    .update(user)
    .set({ button: true })
    .where(eq(user.id, userId))
}


export const getPoints = async (userId: string) => {
  const result_query = await db
    .select({ points: user.points })
    .from(user)
    .where(eq(user.id, userId))

  const points = result_query[0].points
  return points
}

export const addPoints = async (userId: string, points: number) => {
  // this wont be null normally, you are only suppose to call this fonction
  const prevPoints = await getPoints(userId)

  return await db
    .update(user)
    .set({ points: (prevPoints! + points) })
    .where(eq(user.id, userId))
}


















