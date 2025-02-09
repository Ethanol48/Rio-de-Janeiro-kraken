import { createCards, Hand, translateDecitionUser, Decision, StringToCards, CardsToString } from '$lib/games/blackjack';
import {
  CreateBlackJackGame,
  DoesGameExistAndNotEnded,
  getPoints,
  isGameOnGoing,

} from '$lib/server/db/utilities';
import { type RequestHandler, json } from '@sveltejs/kit';

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
  if (points > await getPoints(locals.user.id)) {
    return json({ message: 'You are not able to bet more that you already have' }, { status: 400 });
  }

  // take the points and put it in the bet

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

  const cards = new Hand(StringToCards(GameReq.result.pile_cards));
  const player_cards = new Hand(StringToCards(GameReq.result.playerCards));
  const dealer_cards = new Hand(StringToCards(GameReq.result.dealerCards));

  console.log("pile_cards: ", GameReq.result.pile_cards)
  console.log("player_cards: ", GameReq.result.playerCards)
  console.log("dealer_cards: ", GameReq.result.dealerCards)
  console.log("cards: ", cards)


  let canreplay = true;
  let playerlost = false;

  switch (decition_enum) {
    case Decision.STAND:

      canreplay = false;
      // make decitions of dealer

      // response format:
      // { PlayerLost: bool }
      break;

    case Decision.HIT:
      // check if the player busted
      // if yes, game ends, player
      // { PlayerLost: bool }

      const cardToGive = cards.shift();
      console.log(cardToGive!.ToString())


      break;

    case Decision.DOUBLE:
      // check if the player busted
      // if yes, game ends, player
      // { PlayerLost: bool }

      canreplay = false;

      const cardToGiveDouble = cards.shift();
      console.log(cardToGiveDouble!.ToString())

      // if not lost 
      //
      // plays the dealer
      break;
  }

  // tmp
  return json({ playerLost: playerlost, canreplay: canreplay }, { status: 200 });
};
