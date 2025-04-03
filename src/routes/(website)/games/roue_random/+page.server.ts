import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { canUserSpin, processSpin } from '$lib/server/db/utilities';

const SEGMENT_POINTS = [0, 20, 10, 6, 4];

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/games');
	}

	const userId = event.locals.user.id;
	const { canPlay, nextSpin } = await canUserSpin(userId);
	return { canSpin: canPlay, nextSpin };
};

export const actions: Actions = {
	LaunchRoue: async ({ locals }) => {
		if (!locals.user) {
			throw redirect(302, '/games');
		}

		const userId = locals.user.id;
		const { canPlay, nextSpin } = await canUserSpin(userId);
		if (!canPlay) {
			return {
				status: 'failure',
				message: `Attendez encore ${nextSpin?.hours}h ${nextSpin?.minutes}min`,
				segment: 0,
				points: 0
			};
		}

		// Calcul du résultat du spin
		const probabilities = [5, 5, 10, 30, 50]; // Probabilités en %
		const random = Math.random() * 100;
		let cumulative = 0;
		let segment = 0;
		for (let i = 0; i < probabilities.length; i++) {
			cumulative += probabilities[i];
			if (random <= cumulative) {
				segment = i;
				break;
			}
		}
		const pointsWon = SEGMENT_POINTS[segment];
		await processSpin(userId, pointsWon);
		return {
			status: 'success',
			message: `Vous avez gagné ${pointsWon} points`,
			segment: segment,
			points: pointsWon
		};
	}
};
