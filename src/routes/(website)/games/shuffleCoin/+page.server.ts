// +page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { getPoints } from '$lib/server/db/utilities';

export const load: PageServerLoad = async ({ locals }) => {
  // On récupère l'utilisateur depuis locals (adapter selon ton système d'authentification)
  const userId = locals.user?.id;
  if (!userId) {
    return { points: 0 };
  }
  const points = await getPoints(userId);
  return { points };
};

