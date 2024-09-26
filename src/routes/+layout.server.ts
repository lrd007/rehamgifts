// /+layout.server.ts
import { countries } from "countries-list";
import type { LayoutServerLoad } from "./$types";
import type { Country, VideoWithId } from "$lib/types";

export const load: LayoutServerLoad = async ({ fetch }) => {
  // Prepare countries data
  const countriesData: Country[] = Object.entries(countries)
    .filter(([code, info]) => info.name.toLowerCase() !== "israel")
    .map(([code, info]) => ({
      code,
      name: info.name,
      phoneCode: info.phone[0],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Fetch videos data
  let videos: VideoWithId[] = [];
  try {
    const response = await fetch("/api/videos");
    if (response.ok) {
      videos = await response.json();
    } else {
      console.error("Failed to fetch videos");
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
  }

  return {
    countriesData,
    videos,
  };
};
