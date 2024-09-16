import adapter from '@sveltejs/adapter-node'; // uncomment for making a build file
// import adapter from '@sveltejs/adapter-auto'; // comment for making a build file

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
};

export default config;