import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { adminDB } from "$lib/server/admin";
import type { UserData } from "$lib/types";

export const GET: RequestHandler = async ({ locals, setHeaders }) => {
  // Check if the user is authenticated and an admin
  if (!locals.userID || !locals.isAdmin) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usersCollection = adminDB.collection("users");
    const userSnapshot = await usersCollection.get();

    const users: UserData[] = userSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as UserData)
    );

    // Create CSV content with only the specified fields
    const csvHeader = [
      "Name",
      "Email",
      "Country",
      "Phone Number",
      "Watched Videos",
    ];
    const csvRows = users.map((user) => [
      user.name || "",
      user.email || "",
      user.country || "",
      user.phoneNumber || "",
      (user.watchedVideos || []).join(";"), // Join watched videos with semicolon
    ]);

    const csvContent = [
      csvHeader.join(","),
      ...csvRows.map((row) => row.map((field) => `"${field}"`).join(",")), // Wrap each field in quotes to handle commas in data
    ].join("\n");

    const date = new Date().toISOString().split("T")[0];
    const filename = `users_export_${date}.csv`;
    setHeaders({
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${filename}`,
    });

    return new Response(csvContent);
  } catch (error) {
    console.error("Error exporting users:", error);
    return json({ error: "Failed to export users" }, { status: 500 });
  }
};
