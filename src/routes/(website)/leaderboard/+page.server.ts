import type { PageServerLoad } from './$types';
import { leaderBoard } from '$lib/server/db/utilities';

export const load: PageServerLoad = async () => {
  const profiles = await leaderBoard();
	return { profiles };
};
