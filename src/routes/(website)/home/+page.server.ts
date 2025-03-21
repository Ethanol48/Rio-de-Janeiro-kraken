import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { addPoints, foundedButton, getPoints, getUsername, setButton } from '$lib/server/db/utilities';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return {
			user: null,
			claimed: null
		};
	}

	const claimed = await foundedButton(event.locals.user.id);
	const username = await getUsername(event.locals.user.id)
	const points = await getPoints(event.locals.user.id)

	return {
		user: event.locals.user,
		claimed: claimed,
		username: username,
		points:points
	};
};

export const actions: Actions = {
	foundButton: async ({ locals }) => {
		const userId = locals.user?.id;
		if (!userId) return fail(401, { message: 'Unauthorized' });

		const claimed = await foundedButton(userId);

		if (claimed) {
			return fail(401, { message: 'You already claimed the points' });
		}

		try {
			await setButton(userId);
			await addPoints(userId, 5);
			return { success: true };
		} catch (e) {
			return fail(500, { message: 'an error ocurred' });
		}
	}
};
