// src/routes/api/admin/users/+server.ts
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
} from "firebase/firestore";

export const GET: RequestHandler = async ({ url, setHeaders }) => {
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const pageSize = parseInt(url.searchParams.get("limit") ?? "20");

  const usersCollection = collection(db, "users");

  // Get total count
  const snapshot = await getCountFromServer(usersCollection);
  const totalUsers = snapshot.data().count;

  // Fetch users for the current page
  const q = query(
    usersCollection,
    orderBy("name"),
    limit(pageSize),
    startAfter((page - 1) * pageSize)
  );

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
