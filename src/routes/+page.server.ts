import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { countriesData, videos } = await parent();
  return {
    countriesData,
    videos,
  };
};
