import { createCards, Hand, State, Card, translateDecitionUser, Decision, StringToCards, CardToString, CardsToString } from '$lib/games/blackjack';
import { db } from '$lib/server/db';
import { blackjack } from '$lib/server/db/schema';
import {
  addPoints,
  CreateBlackJackGame,
  DoesGameExistAndNotEnded,
  GetBlackJackGame,
  getPoints,
  isGameOnGoing,
  reducePoints,
} from '$lib/server/db/utilities';
import { type RequestHandler, json, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

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
        message: "The url parameter 'decition' was not valid, it must be 'hit', 'double', 'start' or 'stand"
      },
      { status: 400 }
    );
  }

  // check the bet
  if (points > await getPoints(locals.user.id)) {
    return json({ message: 'You are not able to bet more that you already have' }, { status: 400 });
  }

  if (points < 0) {
    return json({ message: 'You cannot bet negative points!!!!' }, { status: 400 });
  }

  await reducePoints(GameReq.result.userId, points);

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

  const cards = StringToCards(GameReq.result.pile_cards);
  const player_cards = new Hand(StringToCards(GameReq.result.playerCards));
  const dealer_cards = new Hand(StringToCards(GameReq.result.dealerCards));

  if (decition_enum === Decision.START && (player_cards.cards.length > 0 || dealer_cards.cards.length > 0)) {
    return json({ message: 'You are not able to restart a game' }, { status: 400 });
  }

  console.log("pile_cards: ", GameReq.result.pile_cards)
  console.log("player_cards: ", GameReq.result.playerCards)
  console.log("dealer_cards: ", GameReq.result.dealerCards)
  console.log("cards: ", cards)


  let canreplay = true;
  let playerlost = false;
  let neutral = false;
  let start = decition_enum === Decision.START;
  let data: {
    player_cards: string
    dealer_cards: string
  }

  switch (decition_enum) {
    case Decision.START:

      data = {
        player_cards: CardsToString(player_cards.cards),
        dealer_cards: CardToString(dealer_cards.cards[1])
      }

      break;

    case Decision.STAND:
      canreplay = false;
      // make decitions of dealer

      const outcome = dealerPlay(player_cards, dealer_cards, cards);

      switch (outcome) {
        case State.PLAYER_WON:
          playerlost = false;
          canreplay = false;
          break;

        case State.NEUTRAL:
          playerlost = false;
          canreplay = false;
          neutral = true;
          break;

        case State.PLAYER_LOST:
          playerlost = true;
          canreplay = false;
          break;
      }

      // response format:
      // { PlayerLost: bool }
      break;

    case Decision.HIT:
      // check if the player busted
      // if yes, game ends, player
      // { PlayerLost: bool }

      let cardToGive;

      try {
        cardToGive = cards.shift()!;
      } catch (e) {
        return fail(500, { message: "There was an error in our part :(" })
      }

      console.log("card for player", cardToGive.ToString())
      player_cards.cards.push(cardToGive);

      if (player_cards.sumOfCards() > 21) {
        canreplay = false;
        playerlost = true;
      }


      break;

    case Decision.DOUBLE:
      // check if the player busted
      // if yes, game ends, player
      // { PlayerLost: bool }

      canreplay = false;

      let cardToGiveDouble;

      try {
        cardToGiveDouble = cards.shift()!;
      } catch (e) {
        return fail(500, { message: "There was an error in our part :(" })
      }

      console.log("card for player", cardToGiveDouble.ToString())
      player_cards.cards.push(cardToGiveDouble);

      if (!(player_cards.sumOfCards() > 21)) {
        const outcome = dealerPlay(player_cards, dealer_cards, cards);

        switch (outcome) {
          case State.PLAYER_WON:
            playerlost = false;
            canreplay = false;
            break;

          case State.NEUTRAL:
            playerlost = false;
            canreplay = false;
            neutral = true;
            break;

          case State.PLAYER_LOST:
            playerlost = true;
            canreplay = false;
            break;

        }

      } else {
        canreplay = false;
        playerlost = true;
      }
  }

  // send the cards as a string 
  data = {
    player_cards: CardsToString(player_cards.cards),
    dealer_cards: CardsToString(dealer_cards.cards)
  }


  try {
    changeGameDBState(canreplay, start, player_cards, dealer_cards, cards, GameReq.result.id);
  } catch (e) {
    return fail(500, { message: "There was an error in our part updating the game :(" })
  }

  // tmp
  return json({ playerLost: playerlost, canreplay: canreplay, neutral: neutral, start: start, data: data }, { status: 200 });
};



async function changeGameDBState(ended: boolean, started: Boolean, playerCards: Hand, dealer_cards: Hand, deck: Card[], gameId: string, state: State | null = null) {


  const game = await GetBlackJackGame(gameId);

  // start game
  if (started) {
    try {
      await db.update(blackjack)
        .set({
          playerCards: CardsToString(playerCards.cards),
          dealerCards: CardsToString(dealer_cards.cards),
          pile_cards: CardsToString(deck),
          started: true,
        })
        .where(eq(blackjack.id, game.id));

      return;
    } catch (e) {
      console.error(e)
      new Error("Error starting game")
    }
  }

  try {

    let playerWon = null;
    if (state !== null) {
      switch (state) {
        case State.PLAYER_WON:
          playerWon = true;
          // recupere mise + bet  
          addPoints(game.userId, game.totalbet * 2)
          break;

        case State.NEUTRAL:
          playerWon = false;
          // recupere mise
          addPoints(game.userId, game.totalbet)
          break;

        case State.PLAYER_LOST:
          playerWon = false;
          // do nothing
          break;
      }
    }


    if (playerWon !== null) {
      await db.update(blackjack)
        .set({
          playerCards: CardsToString(playerCards.cards),
          dealerCards: CardsToString(dealer_cards.cards),
          pile_cards: CardsToString(deck),
          playerWon: playerWon,
          ended: ended
        })
        .where(eq(blackjack.id, game.id));


    } else {

      await db.update(blackjack)
        .set({
          playerCards: CardsToString(playerCards.cards),
          dealerCards: CardsToString(dealer_cards.cards),
          pile_cards: CardsToString(deck),
          ended: ended
        })
        .where(eq(blackjack.id, game.id));


    }

  } catch (e) {
    console.error(e)
    new Error("Error updating game")
  }
}


function dealerPlay(player_hand: Hand, dealer_hand: Hand, deck: Card[]): State {
  const playerValue = player_hand.sumOfCards();
  let dealerValue = dealer_hand.sumOfCards();

  while (dealerValue < playerValue && dealerValue < 21) {
    const card = deck.shift()!;
    dealer_hand.cards.push(card)
    dealerValue = dealer_hand.sumOfCards();
  }

  if (dealerValue > 21) {
    return State.PLAYER_WON
  }
  else if (dealerValue == playerValue) {
    return State.NEUTRAL
  }
  else {
    return State.PLAYER_LOST
  }
}
