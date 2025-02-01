import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { LOGIN_REDIRECT } from '$lib/constants'

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, LOGIN_REDIRECT);
	}
	return { user: event.locals.user };
};

