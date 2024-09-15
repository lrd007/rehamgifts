<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import { AdminDashboard } from "$lib/components/index.js";
  import { signInAdmin } from "$lib/services/auth";

  export let data;
  $: ({ userID, isAdmin } = $page.data);

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

{#if userID && isAdmin}
  <AdminDashboard />
{:else}
  <div class="min-h-screen flex items-center justify-center">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold text-center mb-6">
          Admin Login
        </h2>
        <form on:submit|preventDefault={handleAdminLogin} class="space-y-4">
          <div class="form-control">
            <label for="email" class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              bind:value={email}
              placeholder="admin@example.com"
              required
              class="input input-bordered w-full"
            />
          </div>
          <div class="form-control">
            <label for="password" class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              type="password"
              id="password"
              bind:value={password}
              placeholder="••••••••"
              required
              class="input input-bordered w-full"
            />
          </div>
          {#if error}
            <div class="alert alert-error shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  /></svg
                >
                <span>{error}</span>
              </div>
            </div>
          {/if}
          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary" disabled={loading}>
              {#if loading}
                <span class="loading loading-spinner"></span>
              {:else}
                Login
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
