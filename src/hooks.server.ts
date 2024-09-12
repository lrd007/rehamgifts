import { adminAuth } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
    // Authentication logic
    const sessionCookie = event.cookies.get("__session");

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);
        event.locals.userID = decodedClaims.uid;
    } catch (e) {
        event.locals.userID = null;
    }

    // Language handling
    const lang = event.cookies.get('lang') || 'en';
    
    const response = await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('%lang%', lang)
    });

    return response;
}) satisfies Handle;