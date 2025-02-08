import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { foundedSecret, setFoundedSecret } from '$lib/server/db/utilities';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return redirect(302, '/games');
  }

  return {
    user: event.locals.user,
    claimed: await foundedSecret(event.locals.user.id),
  };
};

export const actions: Actions = {
  foundSecret: async ({ locals }) => {
    const userId = locals.user?.id;
    if (!userId) return fail(401, { message: 'Unauthorized' });

    const claimed = await foundedSecret(userId);

    if (claimed) {
      return fail(400, { youClaimedItAlready: true });
    }

    try {
<<<<<<< HEAD
=======
      // Récupérer l'utilisateur actuel pour connaître ses points
      const user = await db
        .select()
        .from(table.user)
        .where(eq(table.user.id, userId))
        .limit(1);

      if (user.length === 0) {
        return fail(404, { message: 'User not found' });
      }

      const currentPoints = user[0].points || 0;

      // Mettre à jour le champ foundSecret et ajouter 10 points
      await db
        .update(table.user)
        .set({ foundSecret: true, points: currentPoints + 10 })
        .where(eq(table.user.id, userId));
>>>>>>> 491bf7a (dernierpush)

      setFoundedSecret(userId);
      return { success: true };
    } catch (e) {
      console.error('Error updating user:', e);
      return fail(500, { message: 'An error occurred' });
    }
  },
};
