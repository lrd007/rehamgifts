<!-- routes/admin/+page.svelte -->
<script lang="ts">
  import AdminLogin from "$lib/components/admin/AdminLogin.svelte";
  import { AdminDashboard } from "$lib/components/index.js";
  import LanguageToggle from "$lib/components/ui/LanguageToggle.svelte";

  export let data;
  $: ({ userID, isAdmin } = data);
</script>

<LanguageToggle />

{#if userID && isAdmin}
  <AdminDashboard />
{:else}
  <AdminLogin />
{/if}
