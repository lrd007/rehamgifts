// src/routes/admin/+page.server.ts
import { base } from "$app/paths";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
  // We'll keep the authentication check here
  if (!locals.isAdmin) {
    throw redirect(303, `${base}/`);
  }

  return {
    userID: locals.userID,
    isAdmin: locals.isAdmin,
  };
}) satisfies PageServerLoad;
