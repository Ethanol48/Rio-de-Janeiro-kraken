import type { Actions, PageServerLoad } from './$types';
import { BuyItem, GetItem, GetItems, getPoints } from '$lib/server/db/utilities';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	let items = await GetItems();

	items = items.filter((item) => item.id !== '10');
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

		const Item = await GetItem(itemId);
		if (Item.stock === 0) {
			return fail(401, { error: 'There are no more items left to buy :(' });
		}

		const priceItem = (await GetItem(itemId)).price;
		const pointsUser = await getPoints(userId);
		if (pointsUser < priceItem) {
			return fail(500, { error: 'You are too poor to buy this' });
		}

		try {
			BuyItem(userId, itemId);
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'an error ocurred' });
		}
	}
};
