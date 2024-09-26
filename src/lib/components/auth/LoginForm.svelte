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
    validateForm();
    if ($isFormValid) {
      dispatch("submit", $form);
    }
  }

  function validateForm() {
    $errors = {};

    if (!$form.email) {
      $errors.email = $t("emailRequired");
    } else if (!/\S+@\S+\.\S+/.test($form.email)) {
      $errors.email = $t("invalidEmail");
    }

    if (!$form.password) {
      $errors.password = $t("passwordRequired");
    }
  }

  $: {
    if (attemptedSubmit) {
      validateForm();
    }
  }
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="form-control w-full max-w-xs space-y-4"
>
  <div>
    <label for="email" class="label">
      <span class="label-text">{$t("email")}</span>
    </label>
    <input
      id="email"
      type="email"
      bind:value={$form.email}
      placeholder={$t("emailPlaceholder")}
      class="input input-bordered w-full"
      required
    />
    {#if $errors.email}<span class="text-error text-sm mt-1"
        >{$errors.email}</span
      >{/if}
  </div>

  <PasswordInput
    id="password"
    bind:value={$form.password}
    error={$errors.password}
    placeholder={$t("enterPassword")}
    required
  >
    {$t("password")}
  </PasswordInput>

  <button type="submit" class="btn btn-primary w-full" disabled={isLoading}>
    {#if isLoading}
      <span class="loading loading-spinner loading-sm"></span>
    {/if}
    {$t("login")}
  </button>

  <button
    on:click={() => dispatch("forgotPassword")}
    class="btn btn-link w-full"
  >
    {$t("forgotPassword")}
  </button>
</form>
