<script lang="ts">
  import { writable, type Writable } from "svelte/store";

  export let email: string;
  export let onSubmit: (email: string) => Promise<void>;
  export let onCancel: () => void;

  let forgotPasswordEmail = email;
  let errors: Writable<{ email?: string; form?: string }> = writable({});

  function validateEmail() {
    let newErrors: { email?: string } = {};

    if (!forgotPasswordEmail) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail))
      newErrors.email = "Invalid email format";

    errors.update((e) => ({ ...e, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateEmail()) return;

    try {
      await onSubmit(forgotPasswordEmail);
    } catch (err: any) {
      errors.update((e) => ({ ...e, form: err.message }));
    }
  }
</script>

<h2 class="card-title">Forgot Password</h2>
<form
  on:submit|preventDefault={handleSubmit}
  class="form-control w-full max-w-xs"
>
  <label class="label" for="forgotPasswordEmail">
    <span class="label-text">Email</span>
  </label>
  <input
    id="forgotPasswordEmail"
    type="email"
    bind:value={forgotPasswordEmail}
    placeholder="Enter your email"
    required
    class="input input-bordered w-full max-w-xs"
  />
  {#if $errors.email}<span class="text-error text-sm mt-1">{$errors.email}</span
    >{/if}

  {#if $errors.form}<p class="text-error mt-2">{$errors.form}</p>{/if}

  <button type="submit" class="btn btn-primary mt-4"> Reset Password </button>
  <button type="button" on:click={onCancel} class="btn btn-link mt-2">
    Back to Login
  </button>
</form>
