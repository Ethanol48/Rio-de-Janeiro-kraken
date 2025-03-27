import { db } from '$lib/server/db';
import { items, user } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';


export const load: PageServerLoad = async () => {
  const users = db.select({ username: user.username, points: user.points, email: user.login, isAdmin: user.isAdmin }).from(user)
  const items_ = db.select({ name: items.name, price: items.price, desc: items.desc }).from(items)

  return {
    users: users,
    items: items_
  };
};
