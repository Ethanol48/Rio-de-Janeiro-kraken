
import { getPoints, isGameOnGoing } from '$lib/server/db/utilities';


export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return {
      user: null, points: null, game: null
    }
  }

  return {
    user: event.locals.user,
    points: await getPoints(event.locals.user.id),
    game: await isGameOnGoing(event.locals.users.id).then((r) => { r.id })
  };
};
