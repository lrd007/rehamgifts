<script lang="ts">
  import { onMount } from "svelte";
  import {
    parsePhoneNumberFromString,
    type CountryCode,
  } from "libphonenumber-js";
  import {
    registerWithEmailAndPassword,
    signInWithCredentials,
    resetPassword,
  } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { writable, type Writable } from "svelte/store";
  import type { Country } from "$lib/types";
  import ForgotPassword from "./ForgotPassword.svelte";

  // Props
  export let userCountry: string;
  export let countriesData: Country[];

  interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    fullName?: string;
    phoneNumber?: string;
    form?: string;
  }

  let email = "";
  let password = "";
  let confirmPassword = "";
  let fullName = "";
  let phoneNumber = "";
  let isRegistering = false;
  let showForgotPassword = false;
  let errors: Writable<FormErrors> = writable({});
  let showPassword = false;
  let showConfirmPassword = false;
  let selectedCountry: Country;
  let searchTerm = "";
  let searchInput: HTMLInputElement;
  let dropdownOpen = false;

  $: filteredCountries = countriesData.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  onMount(() => {
    selectedCountry =
      countriesData.find((c) => c.code === userCountry) || countriesData[0];
  });

  function formatPhoneNumber(number: string, country: Country): string {
    const phoneNumber = parsePhoneNumberFromString(
      number,
      country.code as CountryCode
    );
    return phoneNumber ? phoneNumber.formatInternational() : number;
  }

  function handleCountrySelect(country: Country): void {
    selectedCountry = country;
    phoneNumber = formatPhoneNumber(phoneNumber, country);
  }

  function validateForm() {
    let newErrors: FormErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (isRegistering) {
      if (!fullName) newErrors.fullName = "Full name is required";

      if (!confirmPassword)
        newErrors.confirmPassword = "Confirm password is required";
      else if (password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";

      if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
      else {
        const parsedNumber = parsePhoneNumberFromString(
          phoneNumber,
          selectedCountry.code as CountryCode
        );
        if (!parsedNumber || !parsedNumber.isValid()) {
          newErrors.phoneNumber = "Invalid phone number format";
        }
      }
    }

    errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    try {
      if (isRegistering) {
        await registerWithEmailAndPassword(
          email,
          password,
          fullName,
          phoneNumber
        );
      } else {
        await signInWithCredentials(email, password);
      }
      goto("/"); // Redirect to home page after successful auth
    } catch (err: any) {
      errors.update((e) => ({ ...e, form: err.message }));
    }
  }

  function toggleMode() {
    isRegistering = !isRegistering;
    errors.set({});
  }

  function togglePasswordVisibility(field: "password" | "confirmPassword") {
    if (field === "password") {
      showPassword = !showPassword;
    } else {
      showConfirmPassword = !showConfirmPassword;
    }
  }

  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
    // if (dropdownOpen) {
    //   // Use setTimeout to ensure the input is in the DOM before focusing
    //   setTimeout(() => searchInput?.focus(), 0);
    // }
  }

  function toggleForgotPassword() {
    showForgotPassword = !showForgotPassword;
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
        {email}
        onSubmit={handleForgotPassword}
        onCancel={toggleForgotPassword}
      />
    {:else}
      <h2 class="card-title">{isRegistering ? "Register" : "Login"}</h2>
      <form
        on:submit|preventDefault={handleSubmit}
        class="form-control w-full max-w-xs"
      >
        <!-- Email input -->
        <label class="label" for="email">
          <span class="label-text">Email</span>
        </label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="Email"
          required
          class="input input-bordered w-full max-w-xs"
        />
        {#if $errors.email}<span class="text-error text-sm mt-1"
            >{$errors.email}</span
          >{/if}

        <!-- Password input -->
        <label class="label" for="password">
          <span class="label-text">Password</span>
        </label>
        <div class="relative">
          {#if showPassword}
            <input
              id="password-text"
              type="text"
              bind:value={password}
              placeholder="Password"
              required
              class="input input-bordered w-full max-w-xs pr-10"
            />
          {:else}
            <input
              id="password"
              type="password"
              bind:value={password}
              placeholder="Password"
              required
              class="input input-bordered w-full max-w-xs pr-10"
            />
          {/if}
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            on:click={() => togglePasswordVisibility("password")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d={showPassword
                  ? "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  : "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"}
              />
            </svg>
          </button>
        </div>
        {#if $errors.password}<span class="text-error text-sm mt-1"
            >{$errors.password}</span
          >{/if}

        {#if isRegistering}
          <!-- Confirm Password input -->
          <label class="label" for="confirmPassword">
            <span class="label-text">Confirm Password</span>
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              type="password"
              bind:value={confirmPassword}
              placeholder="Confirm Password"
              required
              class="input input-bordered w-full max-w-xs pr-10"
            />
          </div>
          {#if $errors.confirmPassword}<span class="text-error text-sm mt-1"
              >{$errors.confirmPassword}</span
            >{/if}

          <!-- Full Name input -->
          <label class="label" for="fullName">
            <span class="label-text">Full Name</span>
          </label>
          <input
            id="fullName"
            type="text"
            bind:value={fullName}
            placeholder="Full Name"
            required
            class="input input-bordered w-full max-w-xs"
          />
          {#if $errors.fullName}<span class="text-error text-sm mt-1"
              >{$errors.fullName}</span
            >{/if}

          <!-- Phone Number input -->
          <label class="label" for="phone">
            <span class="label-text">Phone Number</span>
          </label>
          <div class="flex">
            <div class="dropdown">
              <button
                type="button"
                class="btn m-1 flex-nowrap"
                on:click={toggleDropdown}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
              >
                {#if selectedCountry}
                  <img
                    src={selectedCountry.flag}
                    alt={selectedCountry.name}
                    class="w-5 h-5 mr-2"
                  />
                  +{selectedCountry.phoneCode}
                {/if}
              </button>
              {#if dropdownOpen}
                <ul
                  class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-60 overflow-y-auto"
                  role="listbox"
                >
                  <li>
                    <input
                      bind:this={searchInput}
                      type="text"
                      placeholder="Search countries"
                      class="input input-bordered w-full"
                      bind:value={searchTerm}
                    />
                  </li>
                  {#each filteredCountries as country}
                    <li>
                      <button
                        type="button"
                        on:click={() => {
                          handleCountrySelect(country);
                          dropdownOpen = false;
                        }}
                        role="option"
                        aria-selected={selectedCountry?.code === country.code}
                      >
                        <img
                          src={country.flag}
                          alt={country.name}
                          class="w-5 h-5 mr-2"
                        />
                        {country.name} (+{country.phoneCode})
                      </button>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
            <input
              id="phone"
              type="tel"
              bind:value={phoneNumber}
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
      <button on:click={toggleMode} class="btn btn-link mt-2">
        {isRegistering
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </button>
      {#if !isRegistering}
        <button on:click={toggleForgotPassword} class="btn btn-link mt-2">
          Forgot Password?
        </button>
      {/if}
    {/if}
  </div>
</div>
