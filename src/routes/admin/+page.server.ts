import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  return {
    userID: locals.userID,
    isAdmin: locals.isAdmin,
  };
}) satisfies PageServerLoad;
