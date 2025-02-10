import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { addPoints, foundedButton, setButton, getPoints , getUsername} from '$lib/server/db/utilities';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return {
      user: null,
      claimed: null,
      usename: null,
      points: 0
    };
  }

  const claimed = await foundedButton(event.locals.user.id)
  const point = await getPoints(event.locals.user.id)
  const username_ = await getUsername(event.locals.user.id)
  return {
    user: event.locals.user,
    claimed: claimed,
    usename: username_,
    points: point
  };
};

export const actions: Actions = {
  foundButton: async ({ locals }) => {
    const userId = locals.user?.id;
    if (!userId) return fail(401, { success: false, message: 'Unauthorized' });

    const claimed = await foundedButton(userId)

    if (claimed) {
      return fail(401, { success: false, message: 'You already claimed the points' });
    }

    try {
      setButton(userId);
      addPoints(userId, 5)
      return { success: true };

    } catch (e) {
      return fail(500, { message: "an error ocurred" });
    }
  }
};
