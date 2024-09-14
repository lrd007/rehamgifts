<script lang="ts">
  import { language } from "$lib/stores/language";


  function toggleLanguage(): void {
    language.toggle();
  }
</script>

<label class="swap swap-rotate text-white">
  <input
    type="checkbox"
    class="bg-transparent"
    on:change={toggleLanguage}
    checked={$language === "ar"}
  />

  <div
    class="swap-on w-18 h-10 bg-rgHighlight rounded-full flex items-center p-2"
  >
    <span class="mx-auto">English</span>
  </div>

  <div
    class="swap-off w-18 h-10 bg-rgHighlight rounded-full flex items-center p-2"
  >
    <span class="mx-auto">عربي</span>
  </div>
</label>
