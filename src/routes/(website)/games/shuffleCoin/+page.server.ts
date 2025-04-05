// +page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { addPoints, removePoints, getPoints } from '$lib/server/db/utilities';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	// On récupère l'utilisateur depuis locals (adapter selon ton système d'authentification)
	const userId = locals.user?.id;
	if (!userId) {
		return { points: 0 };
	}
	const points = await getPoints(userId);
	return { points };
};

export const actions: Actions = {
	CheckCup: async ({ params }) => {
		// Tirage aléatoire pour déterminer la victoire (33% de chances)
		const cup = params.Get;
		if (params.cup === undefined || params.cup === null || params.cup === ""){
			
		}
		const isWinner = Math.random() < 0.33;
		return {
			message: isWinner
				? "Bravo ! Vous avez gagné avec le gobelet 1 !"
				: "Dommage, essayez encore avec un autre gobelet.",
			isWinner,
			cup: 1
		};
	}
};
