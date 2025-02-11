import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { db } from '.';
import { blackjack, user } from './schema';
import { count, desc, eq, sql } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
import { CardsToString, createCards, shuffle } from '$lib/games/blackjack';
import { md5 } from 'js-md5';

export const leaderBoard = async () => {
  return await db
    .select({ login: user.login, points: user.points })
    .from(user)
    .orderBy(desc(user.points))
    .limit(10);
};

export const CreateBlackJackGame = async (userId: string): Promise<string> => {
  const str = userId + Date.now().toString();
  const hash_str = md5.create().update(str).hex()

  const cards = createCards();
  shuffle(cards);

  let first_twenty = [];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    first_twenty.push(card);
  }

  const pile_cards = CardsToString(first_twenty);
  const values = { id: hash_str, userId: userId, ended: false, pile_cards: pile_cards };

  const id = await db.insert(blackjack).values(values).returning({ id: blackjack.id });

  return id[0].id;
};

export const GetBlackJackGame = async (userId: string) => {
  const result_query = await db
    .select()
    .from(blackjack)
    .where(eq(blackjack.userId, userId));

  const game = result_query[0];
  return game;
};


export const GetBlackJackGameById = async (gameId: string) => {
  const result_query = await db
    .select()
    .from(blackjack)
    .where(eq(blackjack.id, gameId));

  return result_query.at(0);
};


export const DoesGameExist = async (gameId: string) => {
  const result_query = await db
    .select()
    .from(blackjack)
    .where(eq(blackjack.id, gameId));

  const theres_result = result_query.length > 0;

  return theres_result;
};

export const DoesGameExistAndNotEnded = async (gameId: string) => {
  const result_query = await db
    .select()
    .from(blackjack)
    .where(sql`${blackjack.id} = ${gameId} AND ${blackjack.ended} = 0`);

  const theres_result = result_query.length > 0;

  return { game: theres_result, data: result_query.at(0) };
};


export const isGameOnGoing = async (
  userId: string
) => {
  const result_query: { number: number }[] = await db
    .select({ number: count() })
    .from(blackjack)
    .where(eq(blackjack.userId, userId));

  const num = result_query[0].number;

  if (num == 0) return { game: false, id: null };
  return { game: true, data: await GetBlackJackGame(userId) };
};


// TODO: Done
//export const addBetToGame = async (gameId: string, points: number) => {
//  // this wont be null normally, you are only suppose to call this fonction
//  const game = await GetBlackJackGame(gameId);
//
//
//  return await db
//    .update(blackjack)
//    .set({ points: game! + points })
//    .where(eq(blackjack.id, gameId));
//};

export const isGameOfUser = async (gameId: string, userId: string) => {
  const result_query = await db
    .select({ gameUserId: blackjack.userId })
    .from(blackjack)
    .where(eq(blackjack.id, gameId));

  const gameUserId = result_query[0].gameUserId;
  return gameUserId === userId;
};


export const foundedSecret = async (userId: string) => {
  const result_query = await db
    .select({ foundedSecret: user.foundSecret })
    .from(user)
    .where(eq(user.id, userId));

  const claimed = result_query[0].foundedSecret;
  return claimed;
};

export const setFoundedSecret = async (userId: string) => {
  return await db.update(user).set({ foundSecret: true }).where(eq(user.id, userId));
};

export const foundedButton = async (userId: string) => {
  const result_query = await db
    .select({ button: user.button })
    .from(user)
    .where(eq(user.id, userId));

  const claimed = result_query[0].button;
  return claimed;
};

export const setButton = async (userId: string) => {
  return await db.update(user).set({ button: true }).where(eq(user.id, userId));
};

export const getPoints = async (userId: string) => {
  const result_query = await db
    .select({ points: user.points })
    .from(user)
    .where(eq(user.id, userId));

  return result_query.at(0)!.points;
};

export const reducePoints = async (userId: string, points: number) => {
  if (points < 0) return;
  console.log("ReducePoints - userId: ", userId)

  // this wont be null normally, you are only suppose to call this fonction
  const prevPoints = await getPoints(userId);
  console.log("ReducePoints - prevPoints: ", prevPoints)

  try {
    await db
      .update(user)
      .set({ points: prevPoints! - points })
      .where(eq(user.id, userId));

    console.log("ReducePoints - prevPoints: ", prevPoints)


    return;
  } catch (e) {
    console.error(e)
  }
};

export const addPoints = async (userId: string, points: number) => {
  // this wont be null normally, you are only suppose to call this fonction
  const prevPoints = await getPoints(userId);

  return await db
    .update(user)
    .set({ points: prevPoints! + points })
    .where(eq(user.id, userId));
};


export const setPlayerWonTrue = async (gameId: string) => {
  return await db.update(blackjack).set({ playerWon: true, neutral: false }).where(eq(blackjack.id, gameId));
};

export const setPlayerWonFalse = async (gameId: string) => {
  return await db.update(blackjack).set({ playerWon: false, neutral: false }).where(eq(blackjack.id, gameId));
};

export const setNeutral = async (gameId: string) => {
  return await db.update(blackjack).set({ playerWon: false, neutral: true, }).where(eq(blackjack.id, gameId));
};

export const setStand = async (gameId: string) => {
  return await db.update(blackjack).set({ stand: true }).where(eq(blackjack.id, gameId));
};
