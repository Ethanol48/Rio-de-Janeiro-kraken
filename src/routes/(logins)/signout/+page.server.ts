import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { PageServerLoad } from './$types';
import { LOGIN_REDIRECT } from '$lib/constants';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) {
    return redirect(302, LOGIN_REDIRECT);
	}

  await auth.invalidateSession(event.locals.session.id);
  auth.deleteSessionTokenCookie(event);

  return redirect(302, LOGIN_REDIRECT);
};

