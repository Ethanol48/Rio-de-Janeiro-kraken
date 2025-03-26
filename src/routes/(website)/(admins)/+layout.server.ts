import { LOGIN_REDIRECT } from "$lib/constants";
import { isUserAdmin } from "$lib/server/db/utilities";
import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (locals.user === null) {
    return redirect(302, LOGIN_REDIRECT);
  }

  const admin = await isUserAdmin(locals.user.id);

  if (!admin) {
    return redirect(302, '/home');
  }
};
