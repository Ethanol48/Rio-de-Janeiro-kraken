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


export const LastlayRoue = async (userId: string) => {
  const result_query = await db
    .select({ LastlayRoue: user.LastPlayRoue })
    .from(user)
    .where(eq(user.id, userId))


  return result_query
}

function dateToInt(date: Date): number {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois de 1 à 12
  const day = String(date.getDate()).padStart(2, '0'); // Jour de 1 à 31
  const hours = String(date.getHours()).padStart(2, '0'); // Heures de 0 à 23
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes de 0 à 59

  return parseInt(`${year}${month}${day}${hours}${minutes}`);
}

export async function canUserPlay(userId: string): Promise<{ canPlay: boolean, waitTime?: number }> {
  // Récupérer la dernière date de jeu de l'utilisateur
  const result = await LastlayRoue(userId);
  const lastPlayInt = result[0]?.LastlayRoue;

  // Si l'utilisateur n'a jamais joué, il peut jouer
  if (!lastPlayInt) {
    return { canPlay: true };
  }

  // Obtenir la date et l'heure actuelles au format YYYYMMDDHHmm
  const now = new Date();
  const nowInt = dateToInt(now);

  // Calculer la différence de temps
  const timeDifference = nowInt - lastPlayInt;

  // Vérifier si la différence est d'au moins 3 heures (3000 en format entier)
  if (timeDifference >= 3000) {
    // L'utilisateur peut jouer, on met à jour la date de dernier jeu
    await db.update(user)
      .set({ LastPlayRoue: nowInt })
      .where(eq(user.id, userId));

    return { canPlay: true };
  } else {
    // L'utilisateur doit attendre
    const waitTime = 3000 - timeDifference; // Temps d'attente restant en minutes
    return { canPlay: false, waitTime };
  }
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
  addPoints(userId, 10)

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


















