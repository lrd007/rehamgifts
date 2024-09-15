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

  // Props
  export let countriesData: Country[];
  export let isLoading = false;

  interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phoneNumber: string;
    selectedCountry: Country | null;
  }

  interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    fullName?: string;
    phoneNumber?: string;
  }

  const form: Writable<FormData> = writable({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    selectedCountry: null,
  });

  let isRegistering = false;
  let showForgotPassword = false;
  let errors: Writable<FormErrors> = writable({});
  const dispatch = createEventDispatcher();

  const isFormValid = derived([form, errors], ([$form, $errors]) => {
    if (isRegistering) {
      return (
        $form.email &&
        $form.password &&
        $form.confirmPassword &&
        $form.fullName &&
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

    if (isRegistering) {
      if (!$form.fullName.trim()) newErrors.fullName = $t("fullNameRequired");

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

  async function handleAuth() {
    if (!$isFormValid) return;
    isLoading = true;

    try {
      const user = isRegistering
        ? await registerWithEmailAndPassword(
            $form.email,
            $form.password,
            $form.fullName,
            formatPhoneNumber($form.phoneNumber, $form.selectedCountry!)
          )
        : await signInWithCredentials($form.email, $form.password);

      showSuccess(
        isRegistering ? $t("registrationSuccessful") : $t("loginSuccessful")
      );
      dispatch("loginSuccess");
    } catch (error : any) {
      showError(error.message);
    } finally {
      isLoading = false;
    }
  }

  function formatPhoneNumber(number: string, country: Country): string {
    const phoneNumber = parsePhoneNumberFromString(
      number,
      country.code as CountryCode
    );
    return phoneNumber ? phoneNumber.formatInternational() : number;
  }

  function toggleMode() {
    isRegistering = !isRegistering;
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

<div class="card w-96 bg-base-100 shadow-xl">
  <div class="card-body">
    {#if showForgotPassword}
      <ForgotPassword
        email={$form.email}
        onSubmit={handleForgotPassword}
        onCancel={() => (showForgotPassword = false)}
      />
    {:else}
      <h2 class="card-title">{isRegistering ? $t("register") : $t("login")}</h2>
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

        {#if isRegistering}
          <PasswordInput
            id="confirmPassword"
            bind:value={$form.confirmPassword}
            error={$errors.confirmPassword}
            placeholder={$t("confirmPassword")}
          >
            {$t("confirmPassword")}
          </PasswordInput>

          <label class="label" for="fullName">
            <span class="label-text">{$t("fullName")}</span>
          </label>
          <input
            id="fullName"
            type="text"
            bind:value={$form.fullName}
            placeholder={$t("fullNamePlaceholder")}
            class="input input-bordered w-full max-w-xs"
          />
          {#if $errors.fullName}<span class="text-error text-sm mt-1"
              >{$errors.fullName}</span
            >{/if}

          <label class="label" for="phone">
            <span class="label-text">{$t("phoneNumber")}</span>
          </label>
          <div class="flex items-center space-x-2 w-full max-w-2xl">
            <div class="w-1/2">
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
            <div class="w-1/2">
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
          {isRegistering ? $t("register") : $t("login")}
        </button>
      </form>
      <button on:click={toggleMode} class="btn btn-link mt-2">
        {isRegistering ? $t("alreadyHaveAccount") : $t("needAccount")}
      </button>
      {#if !isRegistering}
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
