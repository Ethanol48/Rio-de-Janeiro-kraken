import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { LOGIN_REDIRECT } from '$lib/constants';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) {
    return redirect(302, LOGIN_REDIRECT);
	}

		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, LOGIN_REDIRECT);
};

