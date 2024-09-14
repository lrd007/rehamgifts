import { writable, derived } from "svelte/store";
import { browser } from "$app/environment";
import { invalidateAll } from "$app/navigation";
import { translations } from "../utils/translations";

type Language = "en" | "ar";

function getBrowserLanguage(): Language {
  if (browser) {
    const lang = document.documentElement.lang as Language;
    return lang === "ar" ? "ar" : "en";
  }
  return "en";
}

function createLanguageStore() {
  const { subscribe, set, update } = writable<Language>(getBrowserLanguage());

  function setLanguage(lang: Language) {
    set(lang);
    if (browser) {
      document.cookie = `lang=${lang};path=/;max-age=31536000`;
      document.documentElement.lang = lang;
      invalidateAll();
    }
  }

  return {
    subscribe,
    setLanguage,
    toggle: () =>
      update((lang) => {
        const newLang = lang === "en" ? "ar" : "en";
        setLanguage(newLang);
        return newLang;
      }),
  };
}

export const language = createLanguageStore();

export const t = derived(
  language,
  ($language) => (key: string) => translations[$language][key] || key
);
