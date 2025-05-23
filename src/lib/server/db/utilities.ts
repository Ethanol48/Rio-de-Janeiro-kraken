import { db } from '.';
import { blackjack, enigme, games, items, orders, user } from './schema';
import { and, count, desc, eq } from 'drizzle-orm';
import { CardsToString, createCards, shuffle } from '$lib/games/blackjack';
import { md5 } from 'js-md5';

export const leaderBoard = async () => {
	return await db
		.select({ points: user.points, username: user.username })
		.from(user)
		.orderBy(desc(user.points))
		.limit(20);
};

// blackjack

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
		pile_cards: pile_cards
	};

	const id = await db.insert(blackjack).values(values).returning({ id: blackjack.id });

	return id[0].id;
};

export const CreateEnigme = async (
	question: string,
	reponse: string,
	day: number,
	month: number,
	points: number
) => {
	await db.insert(enigme).values({
		id: crypto.randomUUID(),
		question: question,
		reponse: reponse,
		points: points,
		date_day: day,
		date_month: month
	});
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
		.where(and(eq(blackjack.id, gameId), eq(blackjack.ended, false)));

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

export const isGameOfUser = async (gameId: string, userId: string) => {
	const result_query = await db
		.select({ gameUserId: blackjack.userId })
		.from(blackjack)
		.where(eq(blackjack.id, gameId));

	const gameUserId = result_query[0].gameUserId;
	return gameUserId === userId;
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

// other games

export const foundedSecret = async (userId: string): Promise<boolean> => {
	//  TODO:  REFACTOR  // DONE
	const result_query = await db
		.select({ foundedSecret: games.foundSecret })
		.from(games)
		.where(eq(games.userId, userId));

	const claimed = result_query.at(0);

	if (claimed === undefined) {
		console.error('foundedSecret: claimed value is undefined');
		throw new Error('An error has ocurred, contact with the website administrators');
	}

	return claimed.foundedSecret;
};

export const setFoundedSecret = async (userId: string) => {
	// TODO: REFACTOR // DONE
	return await db.update(games).set({ foundSecret: true }).where(eq(games.userId, userId));
};

export const foundedButton = async (userId: string) => {
	// TODO: REFACTOR // DONE
	const result_query = await db
		.select({ button: games.button })
		.from(games)
		.where(eq(games.userId, userId));

	const claimed = result_query.at(0);

	if (claimed === undefined) {
		console.error('foundedButton: claimed value is undefined');
		throw new Error('An error has ocurred, contact with the website administrators');
	}

	return claimed.button;
};

export const setButton = async (userId: string) => {
	// TODO: REFACTOR // DONE
	return await db.update(games).set({ button: true }).where(eq(games.userId, userId));
};

export const isUserAdmin = async (userId: string): Promise<boolean> => {
	const query = await db.select({ admin: user.isAdmin }).from(user).where(eq(user.id, userId));

	const result = query.at(0);

	if (result === undefined) {
		console.error('isUserAdmin: No user was found? error reading db?');
		return false;
	} else {
		return result.admin;
	}
};

export const getPoints = async (userId: string) => {
	const result_query = await db
		.select({ points: user.points })
		.from(user)
		.where(eq(user.id, userId));

	return result_query.at(0)!.points;
};

export const getIfClaimed = async (userId: string) => {
	const result_query = await db
		.select({ claimedOrders: user.claimedOrders })
		.from(user)
		.where(eq(user.id, userId));

	return result_query.at(0)!.claimedOrders;
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

export const removePoints = async (userId: string, points: number) => {
	// try to prevent fuck ups
	if (points < 0) points = -points;

	const prevPoints = await getPoints(userId);
	if (prevPoints === null) {
		throw Error('error obtaining points');
	}

	if (prevPoints - points < 0) {
		throw Error('ilegal operation: negative points are not allowed');
	}

	return await db
		.update(user)
		.set({ points: prevPoints - points })
		.where(eq(user.id, userId));
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
	// TODO: REFACTOR
	// DONE
	const result = await db
		.select({ last_spin: games.last_spin })
		.from(games)
		.where(eq(games.userId, userId));

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
	// TODO: REFACTOR
	// DONE
	const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
	await addPoints(userId, points);

	return db
		.update(games)
		.set({
			last_spin: now // Timestamp actuel en secondes
		})
		.where(eq(games.userId, userId));
};

// jeu du krak'rose

export const Combiendefoisjouer = async (userId: string) => {
	// TODO: REFACTOR
	// DONE
	const result_query = await db
		.select({ numberofplaytoday: games.numberofplaytoday })
		.from(games)
		.where(eq(games.userId, userId));

	const points = result_query[0].numberofplaytoday;
	return points;
};

export const Addplaynumber = async (userId: string) => {
	// TODO: REFACTOR
	// this wont be null normally, you are only suppose to call this fonction
	const prevPoints = await Combiendefoisjouer(userId);

	return await db
		.update(games)
		.set({ numberofplaytoday: prevPoints! + 1 })
		.where(eq(games.userId, userId));
};

// enigme

export const enigme_get_question = async (day: number, month: number) => {
	let check = await enigme_is_recuperer(day, month);

	const result_query = await db
		.select({ question: enigme.question })
		.from(enigme)
		.where(and(eq(enigme.date_day, day), eq(enigme.date_month, month)));

	if (result_query.length === 0) {
		check = false;
	}
	const result = [result_query[0].question, check];
	return result;
};

export const HasEnigme = async (day: number, month: number) => {
	const result_query = await db
		.select({ question: enigme.question })
		.from(enigme)
		.where(and(eq(enigme.date_day, day), eq(enigme.date_month, month)));

	return result_query;
};

export const ModifiyEnigme = async (
	question: string,
	reponse: string,
	day: number,
	month: number,
	points: number
) => {
	return await db
		.update(enigme)
		.set({ question: question, reponse: reponse, points: points })
		.where(and(eq(enigme.date_day, day), eq(enigme.date_month, month)));
};
export const GetAllEnigme = async () => {
	const result_query = await db
		.select({
			question: enigme.question,
			reponse: enigme.reponse,
			points: enigme.points,
			month: enigme.date_month,
			day: enigme.date_day
		})
		.from(enigme);

	return result_query;
};
//

export const enigme_get_reponse = async (day: number, month: number) => {
	const result_query = await db
		.select({ reponse: enigme.reponse })
		.from(enigme)
		.where(and(eq(enigme.date_day, day), eq(enigme.date_month, month)));

	return result_query[0].reponse;
};
//

export const enigme_check = async (
	day: number,
	month: number,
	reponse: string,
	user_id: string,
	username: string
) => {
	let reponse_enigme = await enigme_get_reponse(day, month);
	if (reponse_enigme !== null && reponse_enigme === reponse) {
		const result_query = await db
			.select({ points: enigme.points })
			.from(enigme)
			.where(and(eq(enigme.date_day, day), eq(enigme.date_month, month)));

		await addPoints(user_id, result_query[0].points);
		await db
			.update(enigme)
			.set({ is_recuperer: true })
			.where(and(eq(enigme.date_day, day), eq(enigme.date_month, month)));

		await db
			.update(enigme)
			.set({ user_victory: username })
			.where(and(eq(enigme.date_day, day), eq(enigme.date_month, month)));

		console.log('okpouraenigme');
		return [result_query[0].points, true];
	} else {
		return [0, false];
	}
};

export const enigme_is_recuperer = async (day: number, month: number) => {
	const result_query = await db
		.select({ is_recuperer: enigme.is_recuperer })
		.from(enigme)
		.where(and(eq(enigme.date_day, day), eq(enigme.date_month, month)));

	return result_query[0].is_recuperer;
};

export const enigme_vainqueur = async (day: number, month: number) => {
	const result_query = await db
		.select({ user_victory: enigme.user_victory })
		.from(enigme)
		.where(and(eq(enigme.date_day, day), eq(enigme.date_month, month)));

	return result_query[0].user_victory;
};

export const OrderSend = async (userid: string) => {
	const result_db = await db
		.select({ productid: orders.productId })
		.from(orders)
		.where(eq(orders.userId, userid));

	return result_db;
};

export const GetNameItem = async (product_id: string) => {
	const result_db = await db
		.select({ item: items.name })
		.from(items)
		.where(eq(items.id, product_id));
	return result_db[0].item;
};

export const GetListOrder = async () => {
	const result_db = await db
		.select({ userid: orders.userId, itemid: orders.productId })
		.from(orders);

	return result_db;
};

export const GetWantToClaim = async (userId: string) => {
	const result_db = await db
		.select({ claim: user.wantToClaim })
		.from(user)
		.where(eq(user.id, userId));
	return result_db[0].claim;
};

export const GetClamed = async (userId: string) => {
	const result_db = await db
		.select({ claim: user.claimedOrders })
		.from(user)
		.where(eq(user.id, userId));
	return result_db[0].claim;
};

export const SetWantToClaim = async (username: string) => {
	return await db.update(user).set({ wantToClaim: true }).where(eq(user.username, username));
};

export const SetClamed = async (username: string) => {
	await db.update(user).set({ claimedOrders: true }).where(eq(user.username, username));

	await db.update(user).set({ wantToClaim: false }).where(eq(user.username, username));
};

export const DisClamed = async (username: string) => {
	await db.update(user).set({ claimedOrders: false }).where(eq(user.username, username));

	await db.update(user).set({ wantToClaim: false }).where(eq(user.username, username));
};

export const GetOrdersOfUser = async (userId: string) => {
	const joined = await db
		.select({
			product: items.name,
			claimed: user.claimedOrders
		})
		.from(orders)
		.leftJoin(user, eq(user.id, orders.userId))
		.leftJoin(items, eq(items.id, orders.productId))
		.where(eq(orders.userId, userId));

	return joined;
};
export const GetOrdersOfUserWithDesc = async (userId: string) => {
	const joined = await db
		.select({
			product: items.name,
			itemsDesc: items.desc
		})
		.from(orders)
		.leftJoin(user, eq(user.id, orders.userId))
		.leftJoin(items, eq(items.id, orders.productId))
		.where(eq(orders.userId, userId));

	return joined;
};

export const GetPendingOrders = async () => {
	const joined = await db
		.select({
			username: user.username,
			product: items.name
		})
		.from(orders)
		.leftJoin(user, eq(user.id, orders.userId))
		.leftJoin(items, eq(items.id, orders.productId))
		.groupBy(orders.userId);

	return joined;
};

export const GetItems = async () => {
	const query = await db.select().from(items);

	return query;
};

export const GetItem = async (
	itemId: string
): Promise<{ present: boolean; stock: number; price: number }> => {
	const stock = await db
		.select({ stock: items.stock, price: items.price })
		.from(items)
		.where(eq(items.id, itemId));

	let realStock = 0;
	let price = 0;
	let present = false;

	if (stock.at(0)?.stock !== null) {
		realStock = stock.at(0)!.stock!;
		present = true;
		price = stock.at(0)!.price;
	}

	return {
		present: present,
		stock: realStock,
		price: price
	};
};

export const BuyItem = async (userId: string, itemId: string): Promise<boolean> => {
	const item = await GetItem(itemId);

	if (!item.present) {
		console.error("tried to buy an item that doesn't exist");
		return false;
	} else {
		if (item.stock > 0) {
			// take points from user
			try {
				await removePoints(userId, item.price);
			} catch (e) {
				// negative points or other
				throw e + ' contact with the website administrators';
			}

			try {
				// update stock of item
				await db
					.update(items)
					.set({ stock: item.stock - 1 })
					.where(eq(items.id, itemId));
			} catch (e) {
				// race condition
				throw e + ' contact with the website administrators';
			}

			// I hate js, why isn't it golang????

			const id = crypto.randomUUID();

			await db.insert(orders).values({ id: id, userId: userId, productId: itemId });
		}
	}

	return true;
};

export const NbOfMystery = async (): Promise<number> => {
	const query = await db.select({ stock: items.stock }).from(items).where(eq(items.id, '10'));
	return query[0].stock;
};

export const GiveItem = async (userId: string, itemId: string): Promise<boolean> => {
	const item = await GetItem(itemId);

	if (!item.present) {
		console.error("tried to buy an item that doesn't exist");
		return false;
	} else {
		const id = crypto.randomUUID();

		await db.insert(orders).values({ id: id, userId: userId, productId: itemId });
		await db
			.update(items)
			.set({ stock: item.stock - 1 })
			.where(eq(items.id, itemId));
	}

	return true;
};

export const SetAdminStatus = async (userId: string, value: boolean): Promise<void> => {
	await db.update(user).set({ isAdmin: value }).where(eq(user.id, userId));
};

///
// jeu des gobelets

export const GetLastDayPlayed = async (user_id: string) => {
	const joined = await db
		.select({
			lastday: games.lastdayplayed_gobelet
		})
		.from(games)
		.where(eq(games.userId, user_id));

	return joined[0].lastday;
};

export const SetLastDayPlayed = async (user_id: string, date: string) => {
	return await db
		.update(games)
		.set({ lastdayplayed_gobelet: date, numberofplaytoday: 1 })
		.where(eq(games.userId, user_id));
};

export const GetNumberOfPlay = async (user_id: string) => {
	const joined = await db
		.select({
			NumberOfPlay: games.numberofplaytoday
		})
		.from(games)
		.where(eq(games.userId, user_id));

	return joined[0].NumberOfPlay;
};

export const AddNewGameGobelet = async (user_id: string) => {
	return await db
		.update(games)
		.set({ numberofplaytoday: (await GetNumberOfPlay(user_id)) + 1 })
		.where(eq(games.userId, user_id));
};

// jeu row

export const ResetLastSpin = async (userId: string) => {
	await db.update(games).set({ last_spin: 0 }).where(eq(games.userId, userId));
};
