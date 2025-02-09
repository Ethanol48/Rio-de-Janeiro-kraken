import { createCards, Hand, State, Card, translateDecitionUser, Decision, StringToCards, CardToString, CardsToString } from '$lib/games/blackjack';
import { db } from '$lib/server/db';
import { blackjack } from '$lib/server/db/schema';
import {
  addPoints,
  CreateBlackJackGame,
  DoesGameExistAndNotEnded,
  GetBlackJackGameById,
  getPoints,
  isGameOnGoing,
  reducePoints,
} from '$lib/server/db/utilities';
import { type RequestHandler, json, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { point } from 'drizzle-orm/pg-core';

export const GET: RequestHandler = async ({ locals }) => {
  if (locals.user === null) {
    return json({ message: 'Not allowed you must be signed in' }, { status: 401 });
  }


  const resp = await DoesGameExistAndNotEnded(locals.user.id);
  if (!resp.game) {
    // create game
    const gameid = await CreateBlackJackGame(locals.user.id);

    return json({ id: gameid }, { status: 200 });
  } else {


    console.log("cae bien :)")
    console.log("id: ", resp.data!.id)
    console.log("ended: ", resp.data?.ended)


    return json({ id: resp.data!.id }, { status: 200 });
  }
};

// interact with game, hit / stand / double /
export const POST: RequestHandler = async ({ request, locals }) => {
  if (locals.user === null) {
    return json({ message: 'Not allowed you must be signed in' }, { status: 401 });
  }

  const req = await request.json();
  console.log("request: ", req)

  let decition_enum: Decision;
  let points = 0;
  let gameId = '';

  try {
    // get - gameSession and userid


    points = req.points;
    gameId = req.gameId;
    decition_enum = translateDecitionUser(req.decition);

    console.log("API points: ", points);
    console.log("API gameId: ", gameId)
    console.log("API decition: ", decition_enum)

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
        message: "The url parameter 'decition' was not valid, it must be 'hit', 'double', 'start' or 'stand"
      },
      { status: 400 }
    );
  }


  if (decition_enum === Decision.START && GameReq.started === true) {
    return json(
      {
        message: "You cannot start a game that it has already started"
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

  if (points < 0) {
    return json({ message: 'You cannot bet negative points!!!!' }, { status: 400 });
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

  const cards = StringToCards(GameReq.pile_cards);
  const player_cards = new Hand(StringToCards(GameReq.playerCards));
  const dealer_cards = new Hand(StringToCards(GameReq.dealerCards));

  if (decition_enum === Decision.START && (player_cards.cards.length > 0 || dealer_cards.cards.length > 0)) {
    return json({ message: 'You are not able to restart a game' }, { status: 400 });
  }

  console.log("pile_cards: ", GameReq.pile_cards)
  console.log("player_cards: ", GameReq.playerCards)
  console.log("dealer_cards: ", GameReq.dealerCards)
  //console.log("cards: ", cards)
  console.log("game is started?: ", GameReq.started)


  let canreplay = true;
  let playerlost = false;
  let start = decition_enum === Decision.START;
  let state: State | null = null;
  let data: {
    player_cards: string
    dealer_cards: string
  }

  switch (decition_enum) {
    case Decision.START:

      dealer_cards.cards.push(cards.shift()!)
      player_cards.cards.push(cards.shift()!)

      dealer_cards.cards.push(cards.shift()!)
      player_cards.cards.push(cards.shift()!)


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
          break;

        case State.PLAYER_LOST:
          playerlost = true;
          canreplay = false;
          break;
      }

      data = {
        player_cards: CardsToString(player_cards.cards),
        dealer_cards: CardsToString(dealer_cards.cards)
      }


      state = dealerPlay(player_cards, dealer_cards, cards);

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

      player_cards.cards.push(cardToGive);

      if (player_cards.sumOfCards() > 21) {
        canreplay = false;
        playerlost = true;
        state = State.PLAYER_LOST;
      }

      data = {
        player_cards: CardsToString(player_cards.cards),
        dealer_cards: CardToString(dealer_cards.cards[1])
      }


      break;

    case Decision.DOUBLE:
      // check if the player busted
      // if yes, game ends, player
      // { PlayerLost: bool }

      await reducePoints(GameReq.userId, points);

      canreplay = false;

      let cardToGiveDouble;


      try {

        cardToGiveDouble = cards.shift()!;

      } catch (e) {
        return fail(500, { message: "There was an error in our part :(" })
      }

      player_cards.cards.push(cardToGiveDouble);

      if (player_cards.sumOfCards() <= 21) {
        state = dealerPlay(player_cards, dealer_cards, cards);

        canreplay = false;

        switch (state) {
          case State.PLAYER_WON:
            playerlost = false;
            break;

          case State.NEUTRAL:
            playerlost = false;
            break;

          case State.PLAYER_LOST:
            playerlost = true;
            break;

        }

      } else {
        state = State.PLAYER_LOST
        canreplay = false;
        playerlost = true;
      }


      data = {
        player_cards: CardsToString(player_cards.cards),
        dealer_cards: CardsToString(dealer_cards.cards)
      }
  }

  // send the cards as a string 


  try {
    changeGameDBState(canreplay, start, player_cards, dealer_cards, cards, GameReq.id, state, points);


    await reducePoints(GameReq.userId, points);
  } catch (e) {
    return fail(500, { message: "There was an error in our part updating the game :(" })
  }

  // tmp
  return json({ playerLost: playerlost, canreplay: canreplay, outcome: state, start: start, data: data }, { status: 200 });
};



async function changeGameDBState(
  ended: boolean,
  started: Boolean,
  playerCards: Hand,
  dealer_cards: Hand,
  deck: Card[],
  gameId: string,
  state: State | null = null,
  points: number = 0,
) {


  const tmp = await GetBlackJackGameById(gameId);

  const game = tmp!;
  if (game === undefined && game === null) {
    new Error("The game session was not found")
  }


  // start game
  if (started) {
    try {
      await db
        .update(blackjack)
        .set({
          playerCards: CardsToString(playerCards.cards),
          dealerCards: CardsToString(dealer_cards.cards),
          pile_cards: CardsToString(deck),
          totalbet: game.totalbet + points,
          started: true,
        })
        .where(eq(blackjack.id, game.id));

      return;
    } catch (e) {
      console.error(e)
      new Error("Error starting game")
    }
  }


  if (state === null) {
    console.log("\n\nended tiene que ser false: ", ended, "\n\n")
    // for hit
    await db.update(blackjack)
      .set({
        playerCards: CardsToString(playerCards.cards),
        dealerCards: CardsToString(dealer_cards.cards),
        pile_cards: CardsToString(deck),
        totalbet: game.totalbet + points,
        firstPlay: false,
      })
      .where(eq(blackjack.id, game.id));


  } else {
    console.log("\n\nended tiene que ser true: ", ended, "\n\n")

    let playerWon = null;
    let neutral = false;
    ended = true;
    console.log(state);

    switch (state) {
      case State.PLAYER_WON:
        playerWon = true;
        // recupere mise + bet  
        addPoints(game.userId, game.totalbet * 2)
        break;

      case State.NEUTRAL:
        playerWon = false;
        neutral = true;
        // recupere mise
        addPoints(game.userId, game.totalbet)
        break;

      case State.PLAYER_LOST:
        playerWon = false;
        // do nothing
        break;
    }

    await db.update(blackjack)
      .set({
        playerCards: CardsToString(playerCards.cards),
        dealerCards: CardsToString(dealer_cards.cards),
        pile_cards: CardsToString(deck),
        playerWon: playerWon,
        firstPlay: false,
        neutral: neutral,
        ended: ended
      })
      .where(eq(blackjack.id, game.id));
  }
}


function dealerPlay(player_hand: Hand, dealer_hand: Hand, deck: Card[]): State {
  const playerValue = player_hand.sumOfCards();
  let dealerValue = dealer_hand.sumOfCards();

  while (dealerValue < playerValue && dealerValue < 21 && playerValue <= 21) {
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
