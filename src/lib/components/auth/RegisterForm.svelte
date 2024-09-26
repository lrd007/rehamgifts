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
    } else if ($form.password.length < 8) {
      $errors.password = $t("passwordTooShort");
    }

    if (!$form.confirmPassword) {
      $errors.confirmPassword = $t("confirmPasswordRequired");
    } else if ($form.password !== $form.confirmPassword) {
      $errors.confirmPassword = $t("passwordsMismatch");
    }

    if (!$form.name) {
      $errors.name = $t("nameRequired");
    }

    if (!$form.country) {
      $errors.country = $t("countryRequired");
    }

    if (!$form.selectedCountry || !$form.phoneNumber) {
      $errors.phoneNumber = $t("phoneNumberRequired");
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

  <PasswordInput
    id="confirmPassword"
    bind:value={$form.confirmPassword}
    error={$errors.confirmPassword}
    placeholder={$t("confirmPassword")}
    required
  >
    {$t("confirmPassword")}
  </PasswordInput>

  <div>
    <label for="name" class="label">
      <span class="label-text">{$t("name")}</span>
    </label>
    <input
      id="name"
      type="text"
      bind:value={$form.name}
      placeholder={$t("namePlaceholder")}
      class="input input-bordered w-full"
      required
    />
    {#if $errors.name}<span class="text-error text-sm mt-1">{$errors.name}</span
      >{/if}
  </div>

  <div>
    <label for="country" class="label">
      <span class="label-text">{$t("country")}</span>
    </label>
    <select
      id="country"
      bind:value={$form.country}
      class="select select-bordered w-full"
      required
    >
      <option value={null} disabled selected>{$t("selectCountry")}</option>
      {#each countriesData as country}
        <option value={country}>
          {country.name}
        </option>
      {/each}
    </select>
    {#if $errors.country}<span class="text-error text-sm mt-1"
        >{$errors.country}</span
      >{/if}
  </div>

  <div>
    <label for="phone" class="label">
      <span class="label-text">{$t("phoneNumber")}</span>
    </label>
    <div class="flex items-center space-x-2">
      <select
        id="country-select"
        class="select select-bordered w-1/3"
        bind:value={$form.selectedCountry}
        required
      >
        <option value={null} disabled selected>{$t("selectCountry")}</option>
        {#each countriesData as country}
          <option value={country}>
            {country.name} (+{country.phoneCode})
          </option>
        {/each}
      </select>
      <input
        id="phone"
        type="tel"
        bind:value={$form.phoneNumber}
        placeholder={$t("phoneNumberPlaceholder")}
        class="input input-bordered flex-1"
        required
      />
    </div>
    {#if $errors.phoneNumber}<span class="text-error text-sm mt-1"
        >{$errors.phoneNumber}</span
      >{/if}
  </div>

  <button type="submit" class="btn btn-primary w-full" disabled={isLoading}>
    {#if isLoading}
      <span class="loading loading-spinner loading-sm"></span>
    {/if}
    {$t("register")}
  </button>
</form>
