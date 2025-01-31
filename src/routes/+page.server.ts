import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { LOGIN_REDIRECT } from '$lib/constants'

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, LOGIN_REDIRECT);
	}
	return { user: event.locals.user };
};
