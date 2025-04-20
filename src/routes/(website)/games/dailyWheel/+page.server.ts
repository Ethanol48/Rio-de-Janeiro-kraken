import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {  canUserSpin, GiveItem, NbOfMystery, processSpin, ResetLastSpin } from '$lib/server/db/utilities';

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
				message: `Wait again ${nextSpin?.hours}h ${nextSpin?.minutes}min`,
				segment: 0,
				points: 0
			};
		}

		// Calcul du résultat du spin
		const probabilities = [5, 5, 10, 40, 40];
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
		if (pointsWon === 0) {
			const stockMystery = await NbOfMystery();
			if (stockMystery === 0) {
				await ResetLastSpin(userId); // on remet le compteur à 0

				return {
					status: 'success',
					message: `The mystery gift is exhausted, relaunch the page and restart the wheel !`,
					segment: segment,
					points: pointsWon
				};
			}
		
			await GiveItem(userId, "10"); // cadeau mystère
		}

		let message = '';
		if (pointsWon === 0) {
			// ajouter l'item
			return {
				status: 'success',
				message: `You have won a mystery gift ! Go check in your inventory what it is 😉`,
				segment: segment,
				points: pointsWon
			};
		}

		return {
			status: 'success',
			message: `You have won ${pointsWon} points ! ${message}`,
			segment: segment,
			points: pointsWon
		};
	}
};
