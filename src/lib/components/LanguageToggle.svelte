<script lang="ts">
  import { locale } from "svelte-i18n";

  function toggleLanguage(): void {
    $locale = $locale === "en" ? "ar" : "en";
  }
</script>

<label class="swap swap-rotate text-white">
  <input
    type="checkbox"
    on:change={toggleLanguage}
    checked={$locale === "ar"}
    class="hidden"
  />
  
  <div class="swap-on w-18 h-10 bg-[#EE8FA5] rounded-full flex items-center p-2">
    <span>English</span>
  </div>
  
  <div class="swap-off w-18 h-10 bg-[#EE8FA5] rounded-full flex items-center p-2">
    <span>عربي</span>
  </div>
</label>