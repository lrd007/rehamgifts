import { countries } from "countries-list";
import type { PageServerLoad } from "./$types";
import type { Country } from "$lib/types";

interface IPAPIResponse {
  country_code: string;
}

export const load: PageServerLoad = async ({ fetch }) => {
  // Fetch user's country based on IP
  // const res = await fetch("https://ipapi.co/json/");
  // const data: IPAPIResponse = await res.json();
  // const userCountry = data.country_code;
  const userCountry = "IN";
  // console.log(userCountry);

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
    userCountry,
    countriesData,
  };
};
