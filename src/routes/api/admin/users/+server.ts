import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/client/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getCountFromServer,
  doc,
  getDoc,
} from "firebase/firestore";

export const GET: RequestHandler = async ({ url, setHeaders }) => {
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const pageSize = parseInt(url.searchParams.get("limit") ?? "20");

  const usersCollection = collection(db, "users");

  // Get total count
  const snapshot = await getCountFromServer(usersCollection);
  const totalUsers = snapshot.data().count;

  // Fetch users for the current page
  let q = query(usersCollection, orderBy("name"), limit(pageSize));

  // If it's not the first page, we need to use startAfter
  if (page > 1) {
    // Calculate the document to start after
    const startAfterDocIndex = (page - 1) * pageSize - 1;

    // Get all users up to the start point
    const startAfterQuery = query(
      usersCollection,
      orderBy("name"),
      limit(startAfterDocIndex + 1)
    );
    const startAfterSnapshot = await getDocs(startAfterQuery);
    const startAfterDoc =
      startAfterSnapshot.docs[startAfterSnapshot.docs.length - 1];

    // Update the query with startAfter
    q = query(
      usersCollection,
      orderBy("name"),
      startAfter(startAfterDoc),
      limit(pageSize)
    );
  }

  const userSnapshot = await getDocs(q);
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
};
