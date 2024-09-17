import { countries } from "countries-list";
import type { PageServerLoad } from "./$types";
import type { Country } from "$lib/types";

export const load: PageServerLoad = async ({ fetch }) => {
  // Prepare countries data
  const countriesData: Country[] = Object.entries(countries)
    .filter(([code, info]) => info.name.toLowerCase() !== "israel") // Filter out Israel
    .map(([code, info]) => ({
      code,
      name: info.name,
      flag: `https://flagcdn.com/w20/${code.toLowerCase()}.png`,
      phoneCode: Array.isArray(info.phone) ? info.phone[0] : info.phone, // Handle both array and string cases
    }));

  return {
    countriesData,
  };
};
