import { db } from '.';
import { user } from './schema';
import { desc, eq ,sql} from 'drizzle-orm';

export const leaderBoard = async () => {
  return await db
    .select({  points: user.points, username:user.username })
    .from(user)
    .orderBy(desc(user.points))
    .limit(20)
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

export const getUsername = async (userId: string) => {
  const result_query = await db
    .select({ username: user.username }) 
    .from(user)
    .where(eq(user.id, userId));

  return result_query[0]?.username; 
}


export const addPoints = async (userId: string, points: number) => {
  // this wont be null normally, you are only suppose to call this fonction
  const prevPoints = await getPoints(userId)

  return await db
    .update(user)
    .set({ points: (prevPoints! + points) })
    .where(eq(user.id, userId))
}






// jeu roue

// utilities/games.ts

// Vérifie si l'utilisateur peut jouer
export const canUserSpin = async (userId: string) => {
  const result = await db
    .select({ last_spin: user.last_spin })
    .from(user)
    .where(eq(user.id, userId));

  const lastSpin = result[0]?.last_spin;
  
  // Si l'utilisateur n'a jamais joué, il peut jouer
  if (!lastSpin) return { canPlay: true, nextSpin: null };

  const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
  const nextSpinTime = lastSpin + 3 * 60 * 60; // 3 heures en secondes

  if (now >= nextSpinTime) {
    return { canPlay: true, nextSpin: null };
  } else {
    const waitSeconds = nextSpinTime - now;
    const hours = Math.floor(waitSeconds / 3600);
    const minutes = Math.round((waitSeconds % 3600) / 60);
    return { canPlay: false, nextSpin: { hours, minutes } };
  }
};

// Met à jour le dernier spin et ajoute les points
export const processSpin = async (userId: string, points: number) => {
  const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
  return db.update(user)
    .set({
      points: sql`${user.points} + ${points}`,
      //last_spin: now // Timestamp actuel en secondes
    })
    .where(eq(user.id, userId));
};



// jeu du krak'rose



export const Combiendefoisjouer = async (userId: string) => {
  const result_query = await db
    .select({ numberofplaytoday: user.numberofplaytoday })
    .from(user)
    .where(eq(user.id, userId))

  const points = result_query[0].numberofplaytoday
  return points
}

export const Addplaynumber = async (userId: string, ) => {
  // this wont be null normally, you are only suppose to call this fonction
  const prevPoints = await Combiendefoisjouer(userId)

  return await db
    .update(user)
    .set({ numberofplaytoday: (prevPoints! + 1) })
    .where(eq(user.id, userId))
}
