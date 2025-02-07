import type { Actions, PageServerLoad } from './$types';
import {
	foundedSecret,
	getPoints,
	isGameOnGoing,
	setFoundedSecret
} from '$lib/server/db/utilities';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		return {
			user: null,
			points: null,
			game: null
		};
	}

	return {
		user: locals.user,
		points: await getPoints(locals.user.id),
		game: params.game_id
	};
};
