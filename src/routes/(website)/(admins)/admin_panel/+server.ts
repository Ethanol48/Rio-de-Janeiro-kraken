import { LOGIN_REDIRECT } from '$lib/constants';
import { isUserAdmin, SetAdminStatus, setPoints } from '$lib/server/db/utilities';
import { fail, redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, url }) => {
	if (locals.user === null) {
		redirect(302, LOGIN_REDIRECT);
	}

	if (!isUserAdmin(locals.user.id)) {
		redirect(401, '/');
	}

	const op = url.searchParams.get('operation');
	const userId = url.searchParams.get('userId');
	const value = url.searchParams.get('value');

	console.log('request has been received');
	console.log('op: ', op);
	console.log('userId: ', userId);
	console.log('value: ', value);

	if (op !== null && userId !== null && value !== null) {
		switch (op) {
			case 'points':
				if (!isNaN(parseInt(value))) {
					await setPoints(userId, parseInt(value));
				}

				break;

			case 'isAdmin':
				if (value === 'true' || value === 'false') {
					SetAdminStatus(userId, value === 'true');
				}
		}

		return new Response();
	} else {
		return fail(412);
	}
};
