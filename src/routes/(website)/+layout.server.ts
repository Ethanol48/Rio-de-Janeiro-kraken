import { isUserAdmin } from '$lib/server/db/utilities';
import { setContext } from 'svelte';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	let admin = false;
	if (event.locals.user !== null) {
		admin = await isUserAdmin(event.locals.user.id);
	}

	return {
		user: event.locals.user,
		admin: admin
	};
};
