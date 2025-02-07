import { createCards, translateDecitionUser, Decision } from '$lib/games/blackjack';
import {
	CreateBlackJackGame,
	DoesGameExistAndNotEnded,
	getPoints,
	isGameOfUser,
	isGameOnGoing
} from '$lib/server/db/utilities';
import { fail, type RequestHandler, json } from '@sveltejs/kit';
import { point } from 'drizzle-orm/pg-core';
import { message } from 'sveltekit-superforms';
import type { PageServerData } from '../$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (locals.user === null) {
		return json({ message: 'Not allowed you must be signed in' }, { status: 401 });
	}

	const resp = await isGameOnGoing(locals.user.id);
	if (!resp.game) {
		// create game
		const gameid = await CreateBlackJackGame(locals.user.id);

		return json({ id: gameid }, { status: 200 });
	} else {
		return json({ id: resp.id! }, { status: 200 });
	}
};

// interact with game, hit / stand / double /
export const POST: RequestHandler = async ({ request, locals, url }) => {
	if (locals.user === null) {
		return json({ message: 'Not allowed you must be signed in' }, { status: 401 });
	}

	const UserDecition = url.searchParams.get('decition');
	if (UserDecition === null)
		return json(
			{ message: "The url parameter 'decition' was not set, it must be 'hit' 'double' or 'stand" },
			{ status: 400 }
		);

	const decition_enum = translateDecitionUser(UserDecition);
	let points = 0;
	let gameId = '';

	try {
		// get - gameSession and userid

		const req = await request.json();

		points = req.points;
		gameId = req.gameId;
	} catch (e) {
		return json(
			{
				message:
					"The data sent is not properly formated, you must send the 'gameId', 'points', and 'decition' "
			},
			{ status: 400 }
		);
	}

	const GameReq = await DoesGameExistAndNotEnded(gameId);
	if (!GameReq.theres_result) {
		return json({ message: 'There is no game with this id' }, { status: 400 });
	}

	// check if the game is of the player
	if (GameReq.result.userId !== locals.user.id) {
		return json({ message: 'You are not allowed to play other persons game' }, { status: 401 });
	}

	// get action of player
	if (decition_enum === Decision.UNKOWN) {
		return json(
			{
				message: "The url parameter 'decition' was not valid, it must be 'hit' 'double' or 'stand"
			},
			{ status: 400 }
		);
	}

	// check the bet
	if (points > locals.user.points!) {
		return json({ message: 'You are not able to bet more that you already have' }, { status: 400 });
	}

	// game logic
	//
	// give cards to:
	// dealer (not show)
	// player
	// dealer
	// player

	// if card shown of dealer >= 10, check if there's blackjack
	// if blackjack check_status of game

	// else
	//
	// request user decition

	switch (decition_enum) {
		case Decision.STAND:
			// make decitions of dealer
			break;

		case Decision.HIT:
			// check if the player busted
			// if yes, game ends, player
			break;

		case Decision.DOUBLE:
			// check if the player busted
			// if yes, game ends, player
			break;
	}

	// tmp
	return json({}, { status: 200 });
};
