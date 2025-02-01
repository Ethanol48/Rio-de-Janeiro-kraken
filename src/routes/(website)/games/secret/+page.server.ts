import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { foundedSecret } from '$lib/server/db/utilities';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, '/games');
  }

  return {
    user: event.locals.user,
    claimed: await foundedSecret(event.locals.user.id)
  };
};

export const actions: Actions = {
  foundSecret: async ({ locals }) => {
    const userId = locals.user?.id;
    if (!userId) return fail(401, { message: 'Unauthorized' });

    const claimed = await foundedSecret(userId)

    if (claimed) {
      return fail(400, { youClaimedItAlready: true });
    }

    try {
      await db
        .update(table.user)
        .set({ foundSecret: true })
        .where(eq(table.user.id, userId))

      return { success: true };

    } catch (e) {
      return fail(500, { message: "an error ocurred" });
    }
  }
};


