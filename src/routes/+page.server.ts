import { countries } from "countries-list";
import type { PageServerLoad } from "./$types";
import type { Country } from "$lib/types";

export const load: PageServerLoad = async ({ fetch }) => {
  // Prepare countries data
  const countriesData: Country[] = Object.entries(countries).map(
    ([code, info]) => ({
      code,
      name: info.name,
      flag: `https://flagcdn.com/w20/${code.toLowerCase()}.png`,
      phoneCode: info.phone[0], // Handle both array and string cases
    })
  );
  return {
    countriesData,
  };
};
