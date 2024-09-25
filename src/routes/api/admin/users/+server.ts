import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { adminDB } from "$lib/server/admin";

export const GET: RequestHandler = async ({ url, locals, setHeaders }) => {
  // Check if the user is authenticated and an admin
  if (!locals.userID || !locals.isAdmin) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = parseInt(url.searchParams.get("page") ?? "1");
  const pageSize = parseInt(url.searchParams.get("limit") ?? "20");

  const usersCollection = adminDB.collection("users");

  try {
    // Get total count
    const snapshot = await usersCollection.count().get();
    const totalUsers = snapshot.data().count;

    // Fetch users for the current page
    let query = usersCollection.orderBy("name").limit(pageSize);

    // If it's not the first page, we need to use startAfter
    if (page > 1) {
      // Calculate the document to start after
      const startAfterDocIndex = (page - 1) * pageSize - 1;

      // Get all users up to the start point
      const startAfterQuery = usersCollection
        .orderBy("name")
        .limit(startAfterDocIndex + 1);
      const startAfterSnapshot = await startAfterQuery.get();
      const startAfterDoc = startAfterSnapshot.docs[startAfterSnapshot.docs.length - 1];

      // Update the query with startAfter
      query = usersCollection
        .orderBy("name")
        .startAfter(startAfterDoc)
        .limit(pageSize);
    }

    const userSnapshot = await query.get();
    const users = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setHeaders({
      "Cache-Control": "max-age=60", // Cache for 60 seconds
    });

    return json({
      users,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};