<script lang="ts">
  import CredentialsLogin from "$lib/components/CredentialsLogin.svelte";
  import { auth, user } from "$lib/firebase";
  import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
  import { goto } from "$app/navigation";

  export let data;

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);

    const idToken = await credential.user.getIdToken();

    const res = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });
    console.log(res);
  }

  async function signOutSSR() {
    const res = await fetch("/api/signin", { method: "DELETE" });
    await signOut(auth);
  }

  async function goToHome() {
    goto("/");
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-base-200">
  <h2 class="text-3xl font-bold mb-8">Authentication</h2>

  {#if $user}
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body items-center text-center">
        <h2 class="card-title">Welcome, {$user.displayName || $user.email}</h2>
        <p class="text-success">You are logged in</p>
        <div>
          <button class="btn btn-warning m-2" on:click={signOutSSR}
            >Sign out</button
          >
          <button class="btn btn-warning m-2" on:click={goToHome}>Back</button>
        </div>
      </div>
    </div>
  {:else}
    <CredentialsLogin countriesData={data.countriesData} />
    <div class="divider">OR</div>
    <button class="btn btn-primary" on:click={signInWithGoogle}>
      Sign in with Google
    </button>
  {/if}
</div>
