<!-- /+page.svelte -->
<script lang="ts">
  import { VideoGrid, Pattern } from "$lib/components";
  import freeProgram from "$lib/assets/reham-assets/branding/free_program.jpeg";
  import { base } from "$app/paths";
</script>

<div class="flex justify-center">
  <a href="/watch" class="inline-block">
    <img
      class="w-auto md:max-h-[75vh] lg:max-h-[85vh]"
      src={freeProgram}
      alt="Free Program"
    />
  </a>
</div>
<Pattern left right animate />
