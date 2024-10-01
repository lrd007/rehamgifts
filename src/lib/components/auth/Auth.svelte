<script lang="ts">
  import { writable, derived } from "svelte/store";
  import type { Country } from "$lib/types";
  import ForgotPassword from "./ForgotPassword.svelte";
  import { createEventDispatcher } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { t } from "$lib/stores/language";
  import {
    registerWithEmailAndPassword,
    signInWithCredentials,
    resetPassword,
  } from "$lib/services/auth";
  import { isRegistering, setIsRegistering } from "$lib/stores/auth";
  import LoginForm from "./LoginForm.svelte";
  import RegisterForm from "./RegisterForm.svelte";
  import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

  export let countriesData: Country[];
  export let isLoading = false;

  const dispatch = createEventDispatcher();

  const form = writable({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    country: null,
    phoneNumber: "",
    selectedCountry: null,
  });

  let errors = writable({});
  let showForgotPassword = false;

  const isFormValid = derived(
    [form, errors, isRegistering],
    ([$form, $errors, $isRegistering]) => {
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
          $form.email && $form.password && Object.keys($errors).length === 0
        );
      }
    }
  );

  async function handleAuth(event: { detail: any }) {
    const formData = event.detail;
    if (!$isFormValid) return;
    isLoading = true;

    try {
      const userResult = $isRegistering
        ? await registerWithEmailAndPassword(
            formData.email,
            formData.password,
            formData.name,
            formData.country.name,
            getFullPhoneNumber(formData)
          )
        : await signInWithCredentials(formData.email, formData.password);

      toast.push(
        $isRegistering ? $t("registrationSuccessful") : $t("loginSuccessful"),
        {
          theme: {
            "--toastBackground": "#48BB78",
            "--toastBarBackground": "#2F855A",
          },
        }
      );
      dispatch("loginSuccess");
    } catch (error: any) {
      let errorMessage = error.message;

      // For registration errors related to the transaction
      if ($isRegistering && error.message.includes("transaction")) {
        errorMessage = $t("registrationFailed");
      }

      toast.push(errorMessage, {
        theme: {
          "--toastBackground": "#F56565",
          "--toastBarBackground": "#C53030",
        },
      });

      // Clear the password fields on error
      form.update((f) => ({ ...f, password: "", confirmPassword: "" }));
    } finally {
      isLoading = false;
    }
  }

  function getFullPhoneNumber(formData: {
    selectedCountry: { phoneCode: string };
    phoneNumber: string;
  }): string {
    if (formData.selectedCountry && formData.phoneNumber) {
      const phoneNumber = formData.phoneNumber.replace(/^0+/, "");
      const fullNumber = `+${formData.selectedCountry.phoneCode}${phoneNumber}`;

      if (isValidPhoneNumber(fullNumber)) {
        return parsePhoneNumber(fullNumber).format("E.164");
      } else {
        throw new Error($t("invalidPhoneNumber"));
      }
    }
    return "";
  }

  function toggleMode() {
    setIsRegistering(!$isRegistering);
    errors.set({});
    form.set({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      country: null,
      phoneNumber: "",
      selectedCountry: null,
    });
  }

  async function handleForgotPassword(email: string) {
    try {
      await resetPassword(email);
      toast.push($t("passwordResetEmailSent"), {
        theme: {
          "--toastBackground": "#48BB78",
          "--toastBarBackground": "#2F855A",
        },
      });
      showForgotPassword = false;
    } catch (err: any) {
      let errorMessage = $t("passwordResetFailed");

      if (err.code === "auth/user-not-found") {
        errorMessage = $t("noAccountFound");
      } else if (err.code === "auth/invalid-email") {
        errorMessage = $t("invalidEmailAddress");
      }

      toast.push(errorMessage, {
        theme: {
          "--toastBackground": "#F56565",
          "--toastBarBackground": "#C53030",
        },
      });
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
      {#if $isRegistering}
        <RegisterForm
          {form}
          {errors}
          {countriesData}
          {isLoading}
          {isFormValid}
          on:submit={handleAuth}
        />
      {:else}
        <LoginForm
          {form}
          {errors}
          {isLoading}
          {isFormValid}
          on:submit={handleAuth}
          on:forgotPassword={() => (showForgotPassword = true)}
        />
      {/if}
      <button on:click={toggleMode} class="btn btn-link mt-2">
        {$isRegistering ? $t("alreadyHaveAccount") : $t("needAccount")}
      </button>
    {/if}
  </div>
</div>
