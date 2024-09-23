<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import AdminLogin from "$lib/components/admin/AdminLogin.svelte";
  import { AdminDashboard } from "$lib/components/index.js";
  import LanguageToggle from "$lib/components/ui/LanguageToggle.svelte";
  import { signInAdmin } from "$lib/services/auth";

  export let data;
  $: ({ userID, isAdmin } = data);

  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  async function handleAdminLogin() {
    loading = true;
    error = "";
    try {
      await signInAdmin(email, password);
      await invalidateAll();
    } catch (err) {
      error = "Admin login failed. Please check your credentials.";
    } finally {
      loading = false;
    }
  }
</script>

<LanguageToggle />

{#if userID && isAdmin}
  <AdminDashboard />
{:else}
  <AdminLogin />
{/if}
