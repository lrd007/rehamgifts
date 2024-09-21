<!-- CredentialsLogin.svelte -->
<script lang="ts">
  import {
    parsePhoneNumberFromString,
    type CountryCode,
  } from "libphonenumber-js";
  import { writable, derived, type Writable } from "svelte/store";
  import type { Country } from "$lib/types";
  import ForgotPassword from "./ForgotPassword.svelte";
  import PasswordInput from "./PasswordInput.svelte";
  import { createEventDispatcher } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { t } from "$lib/stores/language";
  import {
    registerWithEmailAndPassword,
    signInWithCredentials,
    resetPassword,
  } from "$lib/services/auth";
  import { isRegistering, setIsRegistering } from "$lib/stores/auth";

  // Props
  export let countriesData: Country[];
  export let isLoading = false;

  interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    country: Country | null;
    phoneNumber: string;
    selectedCountry: Country | null;
  }

  interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    country?: string;
    phoneNumber?: string;
  }

  const form: Writable<FormData> = writable({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    country: null,
    phoneNumber: "",
    selectedCountry: null,
  });

  let showForgotPassword = false;
  let errors: Writable<FormErrors> = writable({});
  const dispatch = createEventDispatcher();

  const isFormValid = derived([form, errors], ([$form, $errors]) => {
    if ($isRegistering) {
      return (
        $form.email &&
        $form.password &&
        $form.confirmPassword &&
        $form.name &&
        $form.country &&
        $form.phoneNumber &&
        $form.selectedCountry &&
        Object.keys($errors).length === 0
      );
    } else {
      return (
        $form.email && $form.password && !$errors.email && !$errors.password
      );
    }
  });

  $: {
    validateForm($form);
  }

  function showError(message: string) {
    toast.push(message, {
      theme: {
        "--toastBackground": "#F56565",
        "--toastBarBackground": "#C53030",
      },
    });
  }

  function showSuccess(message: string) {
    toast.push(message, {
      theme: {
        "--toastBackground": "#48BB78",
        "--toastBarBackground": "#2F855A",
      },
    });
  }

  function validateForm($form: FormData) {
    let newErrors: FormErrors = {};

    if (!$form.email.trim()) newErrors.email = $t("emailRequired");
    else if (!/\S+@\S+\.\S+/.test($form.email))
      newErrors.email = $t("invalidEmailFormat");

    if (!$form.password) newErrors.password = $t("passwordRequired");
    else if ($form.password.length < 8)
      newErrors.password = $t("passwordMinLength");

    if ($isRegistering) {
      if (!$form.name.trim()) newErrors.name = $t("nameRequired");
      if (!$form.country) newErrors.country = $t("countryRequired");

      if (!$form.confirmPassword)
        newErrors.confirmPassword = $t("confirmPasswordRequired");
      else if ($form.password !== $form.confirmPassword)
        newErrors.confirmPassword = $t("passwordsMismatch");

      if (!$form.phoneNumber.trim())
        newErrors.phoneNumber = $t("phoneNumberRequired");
      else if ($form.selectedCountry) {
        const parsedNumber = parsePhoneNumberFromString(
          $form.phoneNumber,
          $form.selectedCountry.code as CountryCode
        );
        if (!parsedNumber || !parsedNumber.isValid()) {
          newErrors.phoneNumber = $t("invalidPhoneFormat");
        }
      } else {
        newErrors.phoneNumber = $t("selectCountry");
      }
    }

    errors.set(newErrors);
  }

  function getFullPhoneNumber($form: FormData): string {
    if ($form.selectedCountry && $form.phoneNumber) {
      return `+${$form.selectedCountry.phoneCode}${$form.phoneNumber.replace(/^0+/, "")}`;
    }
    return "";
  }

  async function handleAuth() {
    if (!$isFormValid) return;
    isLoading = true;

    try {
      const user = $isRegistering
        ? await registerWithEmailAndPassword(
            $form.email,
            $form.password,
            $form.name,
            $form.country!.name,
            getFullPhoneNumber($form)
          )
        : await signInWithCredentials($form.email, $form.password);

      showSuccess(
        $isRegistering ? $t("registrationSuccessful") : $t("loginSuccessful")
      );
      dispatch("loginSuccess");
    } catch (error: any) {
      showError(error.message);
    } finally {
      isLoading = false;
    }
  }

  function toggleMode() {
    setIsRegistering(!$isRegistering);
    errors.set({});
  }

  async function handleForgotPassword(email: string) {
    try {
      await resetPassword(email);
      showSuccess($t("passwordResetEmailSent"));
      showForgotPassword = false;
    } catch (err: any) {
      let errorMessage = $t("passwordResetFailed");

      if (err.code === "auth/user-not-found") {
        errorMessage = $t("noAccountFound");
      } else if (err.code === "auth/invalid-email") {
        errorMessage = $t("invalidEmailAddress");
      }

      showError(errorMessage);
    }
  }
</script>

<div id="login" class="card sm:w-96 bg-base-100 mx-auto mt-10 shadow-xl">
  <div class="card-body">
    {#if showForgotPassword}
      <ForgotPassword
        email={$form.email}
        onSubmit={handleForgotPassword}
        onCancel={() => (showForgotPassword = false)}
      />
    {:else}
      <h2 class="card-title">
        {$isRegistering ? $t("register") : $t("login")}
      </h2>
      <form
        on:submit|preventDefault={handleAuth}
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
        {#if $errors.email}<span class="text-error text-sm mt-1"
            >{$errors.email}</span
          >{/if}

        <PasswordInput
          id="password"
          bind:value={$form.password}
          error={$errors.password}
          placeholder={$t("enterPassword")}
        >
          {$t("password")}
        </PasswordInput>

        {#if $isRegistering}
          <PasswordInput
            id="confirmPassword"
            bind:value={$form.confirmPassword}
            error={$errors.confirmPassword}
            placeholder={$t("confirmPassword")}
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
          {#if $errors.name}<span class="text-error text-sm mt-1"
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
            <option value={null} disabled selected>{$t("selectCountry")}</option
            >
            {#each countriesData as country}
              <option value={country}>
                {country.name}
              </option>
            {/each}
          </select>
          {#if $errors.country}<span class="text-error text-sm mt-1"
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
                <option value={null} disabled selected
                  >{$t("selectCountry")}</option
                >
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
          {#if $errors.phoneNumber}<span class="text-error text-sm mt-1"
              >{$errors.phoneNumber}</span
            >{/if}
        {/if}

        <button
          type="submit"
          class="btn btn-primary mt-4"
          disabled={!$isFormValid || isLoading}
        >
          {#if isLoading}
            <span class="loading loading-spinner loading-sm"></span>
          {/if}
          {$isRegistering ? $t("register") : $t("login")}
        </button>
      </form>
      <button on:click={toggleMode} class="btn btn-link mt-2">
        {$isRegistering ? $t("alreadyHaveAccount") : $t("needAccount")}
      </button>
      {#if !$isRegistering}
        <button
          on:click={() => (showForgotPassword = true)}
          class="btn btn-link mt-2"
        >
          {$t("forgotPassword")}
        </button>
      {/if}
    {/if}
  </div>
</div>
