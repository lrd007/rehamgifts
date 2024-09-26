import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { videos } = await parent();
  return {
    videos,
  };
};
