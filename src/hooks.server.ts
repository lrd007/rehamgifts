import { adminAuth, isUserAdmin } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
  const sessionCookie = event.cookies.get("__session");

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);
    event.locals.userID = decodedClaims.uid;
    event.locals.isAdmin = await isUserAdmin(decodedClaims.uid);
  } catch (e) {
    event.locals.userID = null;
    event.locals.isAdmin = false;
    // console.log("Error verifying session cookie:", e, event.locals.userID);
  }

  const lang = event.cookies.get("lang") || "en";

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace("%lang%", lang),
  });

  return response;
}) satisfies Handle;
