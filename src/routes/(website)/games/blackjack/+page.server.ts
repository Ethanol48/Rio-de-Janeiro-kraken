import type { Actions, PageServerLoad } from './$types';
import {
  foundedSecret,
  getPoints,
  isGameOnGoing,
  setFoundedSecret
} from '$lib/server/db/utilities';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/games');
  }

  let game = await isGameOnGoing(locals.user.id);
  const gameId = game.data!.id;

  return {
    user: locals.user,
    points: await getPoints(locals.user.id),
    game: gameId
  };
};
