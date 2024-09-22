<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import PasswordInput from "./PasswordInput.svelte";
  import { t } from "$lib/stores/language";

  export let form;
  export let errors;
  export let isLoading;
  export let isFormValid;

  const dispatch = createEventDispatcher();

  let attemptedSubmit = false;

  function handleSubmit() {
    attemptedSubmit = true;
    if ($isFormValid) {
      dispatch("submit", $form);
    }
  }
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="form-control w-full max-w-xs"
>
  <label class="label" for="email">
    <span class="label-text">{$t("email")}</span>
  </label>
  <input
    id="email"
    type="email"
    bind:value={$form.email}
    placeholder={$t("emailPlaceholder")}
    class="input input-bordered w-full max-w-xs"
  />
  {#if attemptedSubmit && $errors.email}<span class="text-error text-sm mt-1"
      >{$errors.email}</span
    >{/if}

  <PasswordInput
    id="password"
    bind:value={$form.password}
    error={attemptedSubmit ? $errors.password : null}
    placeholder={$t("enterPassword")}
    minlength={8}
  >
    {$t("password")}
  </PasswordInput>

  <button type="submit" class="btn btn-primary mt-4" disabled={isLoading}>
    {#if isLoading}
      <span class="loading loading-spinner loading-sm"></span>
    {/if}
    {$t("login")}
  </button>
</form>

<button on:click={() => dispatch("forgotPassword")} class="btn btn-link mt-2">
  {$t("forgotPassword")}
</button>
