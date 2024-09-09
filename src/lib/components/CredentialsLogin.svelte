<script lang="ts">
  import {
    parsePhoneNumberFromString,
    type CountryCode,
  } from "libphonenumber-js";
  import {
    registerWithEmailAndPassword,
    signInWithCredentials,
    resetPassword,
  } from "$lib/firebase";
  import { writable, derived, type Writable } from "svelte/store";
  import type { Country } from "$lib/types";
  import ForgotPassword from "./ForgotPassword.svelte";
  import PasswordInput from "./PasswordInput.svelte";
  import { createEventDispatcher } from "svelte";

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
    form?: string;
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

  function validateForm($form: FormData) {
    let newErrors: FormErrors = {};

    if (!$form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test($form.email))
      newErrors.email = "Invalid email format";

    if (!$form.password) newErrors.password = "Psuccessassword is required";
    else if ($form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (isRegistering) {
      if (!$form.fullName.trim()) newErrors.fullName = "Full name is required";

      if (!$form.confirmPassword)
        newErrors.confirmPassword = "Confirm password is required";
      else if ($form.password !== $form.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";

      if (!$form.phoneNumber.trim())
        newErrors.phoneNumber = "Phone number is required";
      else if ($form.selectedCountry) {
        const parsedNumber = parsePhoneNumberFromString(
          $form.phoneNumber,
          $form.selectedCountry.code as CountryCode
        );
        if (!parsedNumber || !parsedNumber.isValid()) {
          newErrors.phoneNumber = "Invalid phone number format";
        }
      } else {
        newErrors.phoneNumber = "Please select a country";
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

      const idToken = await user.getIdToken();
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      dispatch("loginSuccess");
    } catch (err: any) {
      errors.update((e) => ({ ...e, form: err.message }));
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
      alert("Password reset email sent. Please check your inbox.");
      showForgotPassword = false;
    } catch (err: any) {
      errors.update((e) => ({ ...e, form: err.message }));
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
      <h2 class="card-title">{isRegistering ? "Register" : "Login"}</h2>
      <form
        on:submit|preventDefault={handleAuth}
        class="form-control w-full max-w-xs"
      >
        <label class="label" for="email">
          <span class="label-text">Email</span>
        </label>
        <input
          id="email"
          type="email"
          bind:value={$form.email}
          placeholder="Email"
          class="input input-bordered w-full max-w-xs"
        />
        {#if $errors.email}<span class="text-error text-sm mt-1"
            >{$errors.email}</span
          >{/if}

        <PasswordInput
          id="password"
          bind:value={$form.password}
          error={$errors.password}
          placeholder="Enter password"
        >
          Password
        </PasswordInput>

        {#if isRegistering}
          <PasswordInput
            id="confirmPassword"
            bind:value={$form.confirmPassword}
            error={$errors.confirmPassword}
            placeholder="Confirm password"
          >
            Confirm Password
          </PasswordInput>

          <label class="label" for="fullName">
            <span class="label-text">Full Name</span>
          </label>
          <input
            id="fullName"
            type="text"
            bind:value={$form.fullName}
            placeholder="Full Name"
            class="input input-bordered w-full max-w-xs"
          />
          {#if $errors.fullName}<span class="text-error text-sm mt-1"
              >{$errors.fullName}</span
            >{/if}

          <label class="label" for="phone">
            <span class="label-text">Phone Number</span>
          </label>
          <div class="flex items-center space-x-2 w-full max-w-2xl">
            <div class="w-1/2">
              <select
                id="country-select"
                class="select select-bordered w-full"
                bind:value={$form.selectedCountry}
              >
                <option value={null} disabled selected>Select country</option>
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
                placeholder="Phone Number"
                class="input input-bordered w-full"
              />
            </div>
          </div>
          {#if $errors.phoneNumber}<span class="text-error text-sm mt-1"
              >{$errors.phoneNumber}</span
            >{/if}
        {/if}

        {#if $errors.form}<p class="text-error mt-2">{$errors.form}</p>{/if}

        <button
          type="submit"
          class="btn btn-primary mt-4"
          disabled={!$isFormValid || isLoading}
        >
          {#if isLoading}
            <span class="loading loading-spinner loading-sm"></span>
          {/if}
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      <button on:click={toggleMode} class="btn btn-link mt-2">
        {isRegistering
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </button>
      {#if !isRegistering}
        <button
          on:click={() => (showForgotPassword = true)}
          class="btn btn-link mt-2"
        >
          Forgot Password?
        </button>
      {/if}
    {/if}
  </div>
</div>
