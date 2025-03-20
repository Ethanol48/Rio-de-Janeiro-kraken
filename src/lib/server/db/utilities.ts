import { db } from '.';
import { blackjack, enigme, items, user } from './schema';
import { count, desc, eq, sql } from 'drizzle-orm';
import { CardsToString, createCards, shuffle } from '$lib/games/blackjack';
import { md5 } from 'js-md5';
import { number } from 'zod';
import { point } from 'drizzle-orm/pg-core';

export const leaderBoard = async () => {
	return await db
		.select({ points: user.points, username: user.username })
		.from(user)
		.orderBy(desc(user.points))
		.limit(20);
};

export const BuyItem = async (userId: string, itemId: string): Promise<bool> => {
  const stock = await GetItem(itemId);

  return false;
}


export const GetItem = async (itemId: string): Promise<{present: boolean, stock: number}> => {
  const stock = await db
    .select({ stock: items.stock })
    .from(items)
    .where(eq(items.id, itemId))

  return {
    present: true,
    stock: 0
  }
}

export const CreateBlackJackGame = async (userId: string): Promise<string> => {
	const str = userId + Date.now().toString();
	const hash_str = md5.create().update(str).hex();

	const cards = createCards();
	shuffle(cards);

	let first_twenty = [];

	for (let i = 0; i < cards.length; i++) {
		const card = cards[i];
		first_twenty.push(card);
	}

	const pile_cards = CardsToString(first_twenty);
	const values = {
		id: hash_str,
		userId: userId,
		ended: false,
		pile_cards: pile_cards,
		createdAt: ''
	};

	const id = await db.insert(blackjack).values(values).returning({ id: blackjack.id });

	return id[0].id;
};

export const GetBlackJackGame = async (userId: string) => {
	const result_query = await db.select().from(blackjack).where(eq(blackjack.userId, userId));

	const game = result_query[0];
	return game;
};

export const GetBlackJackGameById = async (gameId: string) => {
	const result_query = await db.select().from(blackjack).where(eq(blackjack.id, gameId));
	return result_query.at(0);
};

export const DoesGameExist = async (gameId: string) => {
	const result_query = await db.select().from(blackjack).where(eq(blackjack.id, gameId));
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

export const isGameOnGoing = async (userId: string) => {
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

export const getUsername = async (userId: string) => {
	const result_query = await db
		.select({ username: user.username })
		.from(user)
		.where(eq(user.id, userId));

	return result_query[0]?.username;
};

export const reducePoints = async (userId: string, points: number) => {
	if (points <= 0) return;
	console.log('reducePoints - userId: ', userId);

	// this wont be null normally, you are only suppose to call this fonction
	const prevPoints = await getPoints(userId);
	if (prevPoints === null) {
		throw Error('error obtaining points');
	}

	try {
		await db
			.update(user)
			.set({ points: prevPoints - points })
			.where(eq(user.id, userId));

		console.log('ReducePoints - prevPoints: ', prevPoints);

		return;
	} catch (e) {
		console.error(e);
	}
};

export const addPoints = async (userId: string, points: number) => {
	// this wont be null normally, you are only suppose to call this fonction
	const prevPoints = await getPoints(userId);
	if (prevPoints === null) {
		throw Error('error obtaining points');
	}

	return await db
		.update(user)
		.set({ points: prevPoints + points })
		.where(eq(user.id, userId));
};

export const setPoints = async (userId: string, points: number) => {
	return await db.update(user).set({ points: points }).where(eq(user.id, userId));
};

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
	return db
		.update(user)
		.set({
			points: sql`${user.points} + ${points}`,
			last_spin: now // Timestamp actuel en secondes
		})
		.where(eq(user.id, userId));
};

// jeu du krak'rose

export const Combiendefoisjouer = async (userId: string) => {
	const result_query = await db
		.select({ numberofplaytoday: user.numberofplaytoday })
		.from(user)
		.where(eq(user.id, userId));

	const points = result_query[0].numberofplaytoday;
	return points;
};

export const Addplaynumber = async (userId: string) => {
	// this wont be null normally, you are only suppose to call this fonction
	const prevPoints = await Combiendefoisjouer(userId);

	return await db
		.update(user)
		.set({ numberofplaytoday: prevPoints! + 1 })
		.where(eq(user.id, userId));
};

export const setPlayerWonTrue = async (gameId: string) => {
	return await db
		.update(blackjack)
		.set({ playerWon: true, neutral: false })
		.where(eq(blackjack.id, gameId));
};

export const setPlayerWonFalse = async (gameId: string) => {
	return await db
		.update(blackjack)
		.set({ playerWon: false, neutral: false })
		.where(eq(blackjack.id, gameId));
};

export const setGameEnded = async (gameId: string) => {
	return await db.update(blackjack).set({ ended: true }).where(eq(blackjack.id, gameId));
};

export const setNeutral = async (gameId: string) => {
	return await db
		.update(blackjack)
		.set({ playerWon: false, neutral: true })
		.where(eq(blackjack.id, gameId));
};

export const setStand = async (gameId: string) => {
	return await db.update(blackjack).set({ stand: true }).where(eq(blackjack.id, gameId));
};

export const addToTotalBet = async (gameId: string, points: number) => {
	const game = await GetBlackJackGameById(gameId);
	return await db
		.update(blackjack)
		.set({ totalbet: game!.totalbet + points })
		.where(eq(blackjack.id, gameId));
};


// enigme



export const enigme_get_question = async (day: number, month: number) => {
	let check = await enigme_is_recuperer(day,month);

	const result_query = await db
		.select({question :enigme.question})
		.from(enigme)
		.where(sql`${enigme.date_day} = ${day} AND ${enigme.date_month} = ${month}`);
	if (result_query.length ===0){
		check = false;
	}
	const result = [result_query[0].question,check]
	return result;
};
// 

export const enigme_get_reponse = async (day: number, month: number) => {
	const result_query = await db
		.select({reponse :enigme.reponse})
		.from(enigme)
		.where(sql`${enigme.date_day} = ${day} AND ${enigme.date_month} = ${month}`);
	
	return result_query[0].reponse;
};
// 


export const enigme_check  = async (day: number, month: number, reponse:string, user_id:string, username:string ) => {
	let reponse_enigme = await enigme_get_reponse(day,month);
	if(reponse_enigme !== null && reponse_enigme === reponse){
		const result_query = await db
			.select({points :enigme.points})
			.from(enigme)
			.where(sql`${enigme.date_day} = ${day} AND ${enigme.date_month} = ${month}`);
		await addPoints(user_id,result_query[0].points);
		await db
			.update(enigme).set({is_recuperer :true}).where(sql`${enigme.date_day} = ${day} AND ${enigme.date_month} = ${month}`);
		await db
			.update(enigme).set({user_victory :username}).where(sql`${enigme.date_day} = ${day} AND ${enigme.date_month} = ${month}`);
		console.log("okpouraenigme")
		return [ result_query[0].points, true];
	}
	else{
		return[0 , false];
	}
};

export const enigme_is_recuperer  = async (day: number, month: number) => {
	
	const result_query = await db
		.select({is_recuperer :enigme.is_recuperer})
		.from(enigme)
		.where(sql`${enigme.date_day} = ${day} AND ${enigme.date_month} = ${month}`);
		return result_query[0].is_recuperer;

};

export const enigme_vainqueur  = async (day: number, month: number) => {
	
	const result_query = await db
		.select({user_victory :enigme.user_victory})
		.from(enigme)
		.where(sql`${enigme.date_day} = ${day} AND ${enigme.date_month} = ${month}`);
		return result_query[0].user_victory;

};
// 
