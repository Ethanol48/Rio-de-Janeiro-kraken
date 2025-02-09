import type { Actions, PageServerLoad } from './$types';
import {
  DoesGameExist,
  foundedSecret,
  GetBlackJackGame,
  getPoints,
  isGameOnGoing,
  setFoundedSecret
} from '$lib/server/db/utilities';
import { redirect } from '@sveltejs/kit';
import { LOGIN_REDIRECT } from '$lib/constants';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    redirect(302, LOGIN_REDIRECT)
  }


  const gameExist = await DoesGameExist(params.game_id)
  let game;

  if (gameExist) {
    game = await GetBlackJackGame(params.game_id);
  } else {
    game = null;
  }

  return {
    user: locals.user,
    points: await getPoints(locals.user.id),
    game: game
  };
};
