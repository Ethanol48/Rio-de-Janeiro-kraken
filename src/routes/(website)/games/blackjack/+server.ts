import {
	Hand,
	State,
	Card,
	translateDecitionUser,
	Decision,
	StringToCards,
	CardToString,
	CardsToString
} from '$lib/games/blackjack';
import { db } from '$lib/server/db';
import { blackjack, user } from '$lib/server/db/schema';
import {
	CreateBlackJackGame,
	DoesGameExistAndNotEnded,
	GetBlackJackGameById,
	getPoints,
	reducePoints,
	setPlayerWonTrue,
	setPlayerWonFalse,
	setNeutral,
	setStand,
	addToTotalBet,
	setPoints,
	addPoints,
	setGameEnded
} from '$lib/server/db/utilities';
import { type RequestHandler, json, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	if (locals.user === null) {
		return json({ message: 'You are not allowed to play you must be signed in' }, { status: 401 });
	}

	const resp = await DoesGameExistAndNotEnded(locals.user.id);
	if (!resp.game) {
		// create game

		//console.log('creamos juego');
		const gameid = await CreateBlackJackGame(locals.user.id);
		//console.log('id del juego creado: ', gameid);

		return json({ id: gameid }, { status: 200 });
	} else {
		//console.log('cae bien :)');
		//console.log('id: ', resp.data!.id);
		//console.log('ended: ', resp.data?.ended);

		return json({ id: resp.data!.id }, { status: 200 });
	}
};

const PointsToPlayerByState = async (
	userId: string,
	gameId: string,
	state: State,
	totalbet: number
) => {
	if (state === State.PLAYER_WON) {
		console.log('puntos que va a ganar: ', totalbet * 2);

		await setPlayerWonTrue(gameId);
		await addPoints(userId, totalbet * 2);
	} else if (state === State.NEUTRAL) {
		console.log('puntos que va a ganar: ', totalbet);

		await setNeutral(gameId);
		await addPoints(userId, totalbet);
	} else if (state === State.PLAYER_LOST) {
		await setPlayerWonFalse(gameId);
	}

	await setGameEnded(gameId);
};

// interact with game, hit / stand / double /
export const POST: RequestHandler = async ({ request, locals }) => {
	console.log('\n');
	if (locals.user === null) {
		return json({ message: 'Not allowed you must be signed in' }, { status: 401 });
	}

	const req = await request.json();
	//console.log("request: ", req)

	let decition_enum: Decision;
	let points = 0;
	//let prevPoints = await getPoints(locals.user.id);
	let gameId = '';

	try {
		// get - gameSession and userid

		points = req.points;
		gameId = req.gameId;
		decition_enum = translateDecitionUser(req.decition);

		//console.log("API points: ", points);
		//console.log("API gameId: ", gameId)
		//console.log("API decition: ", decition_enum)
	} catch (e) {
		return json(
			{
				message:
					"The data sent is not properly formated, you must send the 'gameId', 'points', and 'decition' "
			},
			{ status: 400 }
		);
	}

	const GameReq = await GetBlackJackGameById(gameId);
	if (GameReq === undefined || GameReq === null) {
		return json({ message: 'There is no game with this id' }, { status: 400 });
	}

	// check if the game is of the player
	if (GameReq.userId !== locals.user.id) {
		return json({ message: 'You are not allowed to play other persons game' }, { status: 401 });
	}

	// get action of player
	if (decition_enum === Decision.UNKOWN) {
		return json(
			{
				message:
					"The parameter 'decition' was not valid, it must be 'hit', 'double', 'start' or 'stand"
			},
			{ status: 400 }
		);
	}

	if (GameReq.ended === true) {
		return json(
			{
				message: 'You cannot make a decition a game that it has ended!'
			},
			{ status: 400 }
		);
	}

	if (decition_enum === Decision.START && GameReq.started === true) {
		return json(
			{
				message: 'You cannot start a game that it has already started'
			},
			{ status: 400 }
		);
	}

	const actualPoints = await getPoints(locals.user.id);

	if (decition_enum === Decision.DOUBLE) {
		if (GameReq.totalbet > actualPoints!) {
			return json({ message: 'You are to poor to double the pot' }, { status: 400 });
		}
	}

	// check the bet
	if (points > actualPoints!) {
		return json({ message: 'You are not able to bet more that you already have' }, { status: 400 });
	}

	if (points === 0 && decition_enum === Decision.START) {
		return json({ message: 'You cannot bet 0 points!!!' }, { status: 400 });
	}

	if (points < 0) {
		return json({ message: 'You cannot bet negative points!!!!' }, { status: 400 });
	}

	const cards = StringToCards(GameReq.pile_cards);
	const player_cards = new Hand(StringToCards(GameReq.playerCards));
	const dealer_cards = new Hand(StringToCards(GameReq.dealerCards));

	if (
		decition_enum === Decision.START &&
		(player_cards.cards.length > 0 || dealer_cards.cards.length > 0)
	) {
		return json({ message: 'You are not able to restart a game' }, { status: 400 });
	}

	let canreplay = true;
	let start = decition_enum === Decision.START;
	let state: State | null = null;
	let data: {
		player_cards: string;
		dealer_cards: string;
	};

	let puntos_jugador = locals.user.points;
	if (puntos_jugador === null) {
		console.log('puntos_jugador');
		return fail(500, { message: 'There was an error in our part :(' });
	}

	switch (decition_enum) {
		case Decision.START:
			dealer_cards.cards.push(cards.shift()!);
			player_cards.cards.push(cards.shift()!);

			dealer_cards.cards.push(cards.shift()!);
			player_cards.cards.push(cards.shift()!);

			data = {
				player_cards: CardsToString(player_cards.cards),
				dealer_cards: CardToString(dealer_cards.cards[1])
			};

			await addToTotalBet(GameReq.id, points);
			await reducePoints(locals.user.id, points);

			break;

		case Decision.STAND:
			canreplay = false;
			// make decitions of dealer

			await setStand(GameReq.id);

			state = dealerPlay(player_cards, dealer_cards, cards);

			data = {
				player_cards: CardsToString(player_cards.cards),
				dealer_cards: CardsToString(dealer_cards.cards)
			};

			PointsToPlayerByState(locals.user.id, GameReq.id, state, GameReq.totalbet);

			break;

		case Decision.HIT:
			let cardToGive;

			try {
				cardToGive = cards.shift()!;
			} catch (e) {
				console.log('error giving card hit');
				return fail(500, { message: 'There was an error in our part :(' });
			}

			player_cards.cards.push(cardToGive);

			if (player_cards.sumOfCards() > 21) {
				canreplay = false;
				state = State.PLAYER_LOST;
			}

			data = {
				player_cards: CardsToString(player_cards.cards),
				dealer_cards: CardToString(dealer_cards.cards[1])
			};

			break;

		case Decision.DOUBLE:
			console.log('\n decition is DOUBLE \n');
			//await reducePoints(GameReq.userId, GameReq.totalbet);
			canreplay = false;
			let cardToGiveDouble;

			try {
				cardToGiveDouble = cards.shift()!;
			} catch (e) {
				console.log('error giving card double');
				return fail(500, { message: 'There was an error in our part :(' });
			}

			await reducePoints(locals.user.id, GameReq.totalbet);
			await addToTotalBet(GameReq.id, GameReq.totalbet);
			await setStand(GameReq.id);

			GameReq.totalbet *= 2;
			player_cards.cards.push(cardToGiveDouble);

			if (player_cards.sumOfCards() <= 21) {
				state = dealerPlay(player_cards, dealer_cards, cards);

				PointsToPlayerByState(locals.user.id, GameReq.id, state, GameReq.totalbet);
			} else {
				// over 21
				await setPlayerWonFalse(GameReq.id);
			}

			data = {
				player_cards: CardsToString(player_cards.cards),
				dealer_cards: CardsToString(dealer_cards.cards)
			};
	}

	// send the cards as a string

	//const prevPoints = await getPoints(locals.user.id);
	//if (prevPoints === null) {
	//	return fail(500, { message: 'There was an error part updating the game :(' });
	//}

	try {
		changeGameDBState(start, player_cards, dealer_cards, cards, GameReq.id, state);
	} catch (e) {
		return fail(500, { message: 'There was an error in our part updating the game :(' });
	}

	if (state !== null) {
		await setStand(GameReq.id);

		return json(
			{
				playerWon: state === State.PLAYER_WON,
				playerNeutral: state === State.NEUTRAL,
				canreplay: canreplay,
				start: start,
				data: data
			},
			{ status: 200 }
		);
	} else {
		return json(
			{
				canreplay: canreplay,
				start: start,
				data: data
			},
			{ status: 200 }
		);
	}
};

async function changeGameDBState(
	started: Boolean,
	player_cards: Hand,
	dealer_cards: Hand,
	deck: Card[],
	gameId: string,
	state: State | null = null
) {
	const tmp = await GetBlackJackGameById(gameId);

	const game = tmp!;
	if (game === undefined && game === null) {
		new Error('The game session was not found');
	}

	// start game
	if (started) {
		try {
			await db
				.update(blackjack)
				.set({
					playerCards: CardsToString(player_cards.cards),
					dealerCards: CardsToString(dealer_cards.cards),
					pile_cards: CardsToString(deck),
					started: true
				})
				.where(eq(blackjack.id, game.id));

			return;
		} catch (e) {
			console.error(e);
			new Error('Error starting game');
		}
	}

	if (state === null) {
		// for hit
		await db
			.update(blackjack)
			.set({
				playerCards: CardsToString(player_cards.cards),
				dealerCards: CardsToString(dealer_cards.cards),
				pile_cards: CardsToString(deck),
				firstPlay: false
			})
			.where(eq(blackjack.id, game.id));
	} else {
		//switch (state) {
		//	case State.PLAYER_WON:
		//		await setPlayerWonTrue(game.id);
		//
		//		console.log('totalBet: ', game.totalbet);
		//		//console.log('prevPoints: ', prevPoints);
		//		console.log('the player will win: ', game.totalbet * 2);
		//		// recupere mise + bet
		//		//await setPoints(game.userId, (prevPoints + (game.totalbet * 2)));
		//		break;
		//
		//	case State.NEUTRAL:
		//		await setNeutral(game.id);
		//
		//		// recupere mise
		//		//await setPoints(game.userId, (prevPoints + game.totalbet));
		//		break;
		//
		//	case State.PLAYER_LOST:
		//		await setPlayerWonFalse(game.id);
		//		break;
		//}

		console.log('playerWon??: ', state == State.PLAYER_WON);

		await db
			.update(blackjack)
			.set({
				playerCards: CardsToString(player_cards.cards),
				dealerCards: CardsToString(dealer_cards.cards),
				pile_cards: CardsToString(deck),
				firstPlay: false
			})
			.where(eq(blackjack.id, game.id));
	}
}

function dealerPlay(player_hand: Hand, dealer_hand: Hand, deck: Card[]): State {
	const playerValue = player_hand.sumOfCards();
	let dealerValue = dealer_hand.sumOfCards();

	//console.log('\ncards of Player:', CardsToString(player_hand.cards));

	//console.log('cards of Dealer before:', CardsToString(dealer_hand.cards));
	//console.log('calculating outcome');

	while (dealerValue < 17) {
		const card = deck.shift()!;
		dealer_hand.cards.push(card);
		dealerValue = dealer_hand.sumOfCards();
	}

	//console.log('cards of Dealer after:', CardsToString(dealer_hand.cards));

	if (dealerValue > 21) {
		//console.log('dealer lost, dealer value: ', dealerValue);
		//console.log('player value: ', playerValue);
		return State.PLAYER_WON;
	} else if (dealerValue == playerValue) {
		//console.log('neutral dealer value: ', dealerValue);
		//console.log('player value: ', playerValue);
		return State.NEUTRAL;
	} else {
		//console.log('player lost, dealer value: ', dealerValue);
		//console.log('player value: ', playerValue);
		return State.PLAYER_LOST;
	}
}
