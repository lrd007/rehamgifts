import { adminAuth, isUserAdmin } from "$lib/server/admin";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { idToken } = await request.json();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    const decodedIdToken = await adminAuth.verifyIdToken(idToken);
    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
      // Check if the user is an admin
      const isAdmin = await isUserAdmin(decodedIdToken.uid);
      if (!isAdmin) {
        throw error(403, "User is not an admin");
      }

      const cookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      });
      const options = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
        path: "/",
      };
      cookies.set("__session", cookie, options);
      return json({ status: "adminSignedIn" });
    } else {
      throw error(401, "Recent sign in required!");
    }
  } catch (err) {
    console.error("Error signing in admin:", err);
    throw error(500, "An error occurred while signing in admin.");
  }
};
