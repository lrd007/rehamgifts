<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import PasswordInput from "./PasswordInput.svelte";
  import { t } from "$lib/stores/language";

  export let form;
  export let errors;
  export let countriesData;
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

  <PasswordInput
    id="confirmPassword"
    bind:value={$form.confirmPassword}
    error={attemptedSubmit ? $errors.confirmPassword : null}
    placeholder={$t("confirmPassword")}
    minlength={8}
  >
    {$t("confirmPassword")}
  </PasswordInput>

  <label class="label" for="name">
    <span class="label-text">{$t("name")}</span>
  </label>
  <input
    id="name"
    type="text"
    bind:value={$form.name}
    placeholder={$t("namePlaceholder")}
    class="input input-bordered w-full max-w-xs"
  />
  {#if attemptedSubmit && $errors.name}<span class="text-error text-sm mt-1"
      >{$errors.name}</span
    >{/if}

  <label class="label" for="country">
    <span class="label-text">{$t("country")}</span>
  </label>
  <select
    id="country"
    bind:value={$form.country}
    class="select select-bordered w-full max-w-xs"
  >
    <option value={null} disabled selected>{$t("selectCountry")}</option>
    {#each countriesData as country}
      <option value={country}>
        {country.name}
      </option>
    {/each}
  </select>
  {#if attemptedSubmit && $errors.country}<span class="text-error text-sm mt-1"
      >{$errors.country}</span
    >{/if}

  <label class="label" for="phone">
    <span class="label-text">{$t("phoneNumber")}</span>
  </label>
  <div class="flex items-center space-x-2 w-full max-w-2xl">
    <div class="w-1/3">
      <select
        id="country-select"
        class="select select-bordered w-full"
        bind:value={$form.selectedCountry}
      >
        <option value={null} disabled selected>{$t("selectCountry")}</option>
        {#each countriesData as country}
          <option value={country}>
            {country.name} (+{country.phoneCode})
          </option>
        {/each}
      </select>
    </div>
    <div class="">
      <input
        id="phone"
        type="tel"
        bind:value={$form.phoneNumber}
        placeholder={$t("phoneNumberPlaceholder")}
        class="input input-bordered w-full"
      />
    </div>
  </div>
  {#if attemptedSubmit && $errors.phoneNumber}<span
      class="text-error text-sm mt-1">{$errors.phoneNumber}</span
    >{/if}

  <button type="submit" class="btn btn-primary mt-4" disabled={isLoading}>
    {#if isLoading}
      <span class="loading loading-spinner loading-sm"></span>
    {/if}
    {$t("register")}
  </button>
</form>
