import { db } from '$lib/server/db';
import { enigme, items, user } from '$lib/server/db/schema';
import {
	CreateEnigme,
	enigme_get_question,
	GetAllEnigme,
	HasEnigme,
	ModifiyEnigme
} from '$lib/server/db/utilities';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await db
		.select({
			id: user.id,
			username: user.username,
			points: user.points,
			login: user.login,
			isAdmin: user.isAdmin,
			wantToClaim: user.wantToClaim,
			claimedOrders: user.claimedOrders
		})
		.from(user);
	const items_ = await db
		.select({ id: items.id, name: items.name, price: items.price, desc: items.desc })
		.from(items);

	let enigmes = await GetAllEnigme();

	return {
		users: users,
		items: items_,
		enigmes: enigmes
	};
};

export const actions = {
	CreateQuestion: async ({ request, locals }) => {
		if (!locals.user) return;

		const data = await request.formData();
		const question = data.get('question');
		const answer = data.get('answer');
		const day = data.get('day');
		const mois = data.get('mois');
		const point = data.get('point');
		if (day === null || mois === null || point === null) return { success: false };

		const QuestionString = question!.toString();
		const AnswerString = answer!.toString();
		const dayString = parseInt(day!.toString());
		const moisString = parseInt(mois!.toString());
		const pointString = parseInt(point!.toString());
		console.log(question, answer, day, mois, point);

		if ((await HasEnigme(dayString, moisString - 1)).length === 0) {
			try {
				await CreateEnigme(QuestionString, AnswerString, dayString, moisString - 1, pointString);
				return { success: true, message: "L'énigme a été crée avec succès !" };
			} catch (e) {
				return {
					success: false,
					message: "Une erreur est survenue lors de la création de l'énigme"
				};
			}
		} else {
			try {
				await ModifiyEnigme(QuestionString, AnswerString, dayString, moisString - 1, pointString);
				return { success: true, message: "L'énigme a été mis à jour avec succès !" };
			} catch (e) {
				return {
					success: false,
					message: "Une erreur est survenue lors de la modification de l'énigme"
				};
			}
		}
	}
};
