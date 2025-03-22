import type { PageServerLoad } from './$types';
import { GetItems } from '$lib/server/db/utilities';

export const load: PageServerLoad = async ({ locals }) => {
  const items = await GetItems();
  return { user: locals.user, items: items };
};
