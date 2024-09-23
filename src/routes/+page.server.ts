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
      phoneCode: info.phone[0],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    countriesData,
  };
};
