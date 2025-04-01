import { db } from '$lib/server/db';
import { items, user } from '$lib/server/db/schema';
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

	return {
		users: users,
		items: items_
	};
};
