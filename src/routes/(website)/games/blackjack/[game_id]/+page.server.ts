import type { Actions, PageServerLoad } from './$types';
import {
  GetBlackJackGameById,
  getPoints,
} from '$lib/server/db/utilities';
import { redirect } from '@sveltejs/kit';
import { LOGIN_REDIRECT } from '$lib/constants';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(302, LOGIN_REDIRECT)
  }

  const game = await GetBlackJackGameById(params.game_id)
  if (game !== undefined && game !== null) {
    game.pile_cards = "";

    if (!game.firstPlay) {
      let buffer = "";
      buffer += game.dealerCards[3];
      buffer += game.dealerCards[4];

      game.dealerCards = buffer;
    }
  }

  const puntos = await getPoints(locals.user.id);

  return {
    user: locals.user,
    points: puntos,
    game: game
  };
};
