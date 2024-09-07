// src/vite-env.d.ts
/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module "*.json" {
  const value: { [key: string]: string };
  export default value;
}
