import type { Actions, PageServerLoad } from './$types';
import { BuyItem, GetItem, GetItems, getPoints } from '$lib/server/db/utilities';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const items = await GetItems();
	return { user: locals.user, items: items };
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (locals.user === null) return fail(401, { error: 'You need to be authenticated' });
		const userId = locals.user.id;

		let itemId: string | undefined = '';

		const data = await request.formData();
		itemId = data.get('itemId')?.toString();

		if (itemId === null || itemId === '' || itemId === undefined) {
			return fail(401, { error: 'The request was malformed, the field itemId was not especified' });
		}


		const item = (await GetItem(itemId));
    if (item.stock === 0) {
      return fail(401, { error: 'The are no items left :(' });
    }



		const pointsUser = await getPoints(userId);
		if (pointsUser < item.price) {
			return fail(401, { error: 'You are too poor to buy this' });
		}

		try {
			BuyItem(userId, itemId);
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'an error ocurred' });
		}
	}
};
