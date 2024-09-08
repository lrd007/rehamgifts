<!-- CredentialsLogin.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import {
    parsePhoneNumberFromString,
    type CountryCode,
  } from "libphonenumber-js";
  import { writable, type Writable } from "svelte/store";
  import type { Country } from "$lib/types";
  import {
    registerWithEmailAndPassword,
    signInWithCredentials,
    resetPassword,
  } from "$lib/firebase";
  import ForgotPassword from "./ForgotPassword.svelte";
  import CountryDropdown from "./CountryDropdown.svelte";
  import PasswordInput from "./PasswordInput.svelte";

  export let userCountry: string;
  export let countriesData: Country[];

  interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phoneNumber: string;
  }

  interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    fullName?: string;
    phoneNumber?: string;
    form?: string;
  }

  let formData: Writable<FormData> = writable({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
  });
  let errors: Writable<FormErrors> = writable({});
  let isRegistering = false;
  let showForgotPassword = false;
  let selectedCountry =
    countriesData.find((c) => c.code === userCountry) || countriesData[0];

  $: {
    // Automatically format phone number when country changes
    if ($formData.phoneNumber) {
      $formData.phoneNumber = formatPhoneNumber(
        $formData.phoneNumber,
        selectedCountry
      );
    }
  }

  function validateForm(data: FormData): FormErrors {
    let newErrors: FormErrors = {};

    if (!data.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = "Invalid email format";

    if (!data.password) newErrors.password = "Password is required";
    else if (data.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (isRegistering) {
      if (!data.fullName) newErrors.fullName = "Full name is required";

      if (!data.confirmPassword)
        newErrors.confirmPassword = "Confirm password is required";
      else if (data.password !== data.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";

      if (!data.phoneNumber) newErrors.phoneNumber = "Phone number is required";
      else {
        const parsedNumber = parsePhoneNumberFromString(
          data.phoneNumber,
          selectedCountry.code as CountryCode
        );
        if (!parsedNumber || !parsedNumber.isValid()) {
          newErrors.phoneNumber = "Invalid phone number format";
        }
      }
    }

    return newErrors;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault(); // Prevent default form submission
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const currentFormData = Object.fromEntries(
      formData.entries()
    ) as unknown as FormData;

    const newErrors = validateForm(currentFormData);
    errors.set(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        if (isRegistering) {
          await registerWithEmailAndPassword(
            currentFormData.email,
            currentFormData.password,
            currentFormData.fullName,
            currentFormData.phoneNumber
          );
        } else {
          await signInWithCredentials(
            currentFormData.email,
            currentFormData.password
          );
        }
        goto("/"); // Redirect to home page after successful auth
      } catch (err: any) {
        errors.update((e) => ({ ...e, form: err.message }));
      }
    }
  }

  function handleCountrySelect(country: Country) {
    selectedCountry = country;
    formData.update((data) => ({
      ...data,
      phoneNumber: formatPhoneNumber(data.phoneNumber, country),
    }));
  }

  function formatPhoneNumber(number: string, country: Country): string {
    const phoneNumber = parsePhoneNumberFromString(
      number,
      country.code as CountryCode
    );
    return phoneNumber ? phoneNumber.formatInternational() : number;
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
        email={$formData.email}
        onSubmit={handleForgotPassword}
        onCancel={() => (showForgotPassword = false)}
      />
    {:else}
      <h2 class="card-title">{isRegistering ? "Register" : "Login"}</h2>
      <form on:submit={handleSubmit} class="form-control w-full max-w-xs">
        <label class="label" for="email">
          <span class="label-text">Email</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          bind:value={$formData.email}
          placeholder="Email"
          required
          class="input input-bordered w-full max-w-xs"
        />
        {#if $errors.email}<span class="text-error text-sm mt-1"
            >{$errors.email}</span
          >{/if}

        <PasswordInput
          name="password"
          bind:value={$formData.password}
          label="Password"
          error={$errors.password}
        />

        {#if isRegistering}
          <PasswordInput
            name="confirmPassword"
            bind:value={$formData.confirmPassword}
            label="Confirm Password"
            error={$errors.confirmPassword}
          />

          <label class="label" for="fullName">
            <span class="label-text">Full Name</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            bind:value={$formData.fullName}
            placeholder="Full Name"
            required
            class="input input-bordered w-full max-w-xs"
          />
          {#if $errors.fullName}<span class="text-error text-sm mt-1"
              >{$errors.fullName}</span
            >{/if}

          <label class="label" for="phone">
            <span class="label-text">Phone Number</span>
          </label>
          <div class="flex">
            <CountryDropdown
              {countriesData}
              {selectedCountry}
              onSelect={handleCountrySelect}
            />
            <input
              id="phone"
              name="phoneNumber"
              type="tel"
              bind:value={$formData.phoneNumber}
              placeholder="Phone Number"
              required
              class="input input-bordered w-full max-w-xs ml-2"
            />
          </div>
          {#if $errors.phoneNumber}<span class="text-error text-sm mt-1"
              >{$errors.phoneNumber}</span
            >{/if}
        {/if}

        {#if $errors.form}<p class="text-error mt-2">{$errors.form}</p>{/if}

        <button type="submit" class="btn btn-primary mt-4">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      <button
        on:click={() => {
          isRegistering = !isRegistering;
          errors.set({});
        }}
        class="btn btn-link mt-2"
      >
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
