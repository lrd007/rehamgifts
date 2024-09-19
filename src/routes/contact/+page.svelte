<script lang="ts">
  import { enhance } from "$app/forms";
  import { Pattern } from "$lib/components";
  import { t, language } from "$lib/stores/language";
  import type { ActionData } from "./$types";

  export let form: ActionData;

  let submitting = false;

  function getErrorMessage(error: string): string {
    switch (error) {
      case "MISSING_FIELDS":
        return $t("pleaseFillAllFields");
      case "INVALID_LENGTH":
        return $t("fieldsTooLong");
      case "INVALID_EMAIL":
        return $t("pleaseEnterValidEmail");
      case "TOO_MANY_REQUESTS":
        return $t("tooManyRequests");
      case "SERVER_STORAGE_FULL":
        return $t("serverStorageFull");
      case "SERVER_ERROR":
      default:
        return $t("unexpectedError");
    }
  }
</script>

<div
  class="container mx-auto px-4 py-8 flex flex-col items-center"
  class:rtl={$language === "ar"}
>
  <h1 class="text-3xl font-bold mb-6 text-center">{$t("contact")}</h1>
  <div class="card w-full max-w-lg bg-base-100 shadow-xl">
    <div class="card-body">
      <form
        method="POST"
        use:enhance={() => {
          submitting = true;
          return ({ result }) => {
            submitting = false;
            if (result.type === "success") {
              // Optionally clear the form fields here
            }
          };
        }}
      >
        <div class="form-control">
          <label for="name" class="label">
            <span class="label-text">{$t("name")}</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            class="input input-bordered"
            required
            maxlength="100"
            placeholder={$t("namePlaceholder")}
          />
        </div>
        <div class="form-control">
          <label for="email" class="label">
            <span class="label-text">{$t("email")}</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            class="input input-bordered"
            required
            maxlength="100"
            placeholder={$t("emailPlaceholder")}
          />
        </div>
        <div class="form-control">
          <label for="subject" class="label">
            <span class="label-text">{$t("subject")}</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            class="input input-bordered"
            required
            maxlength="200"
            placeholder={$t("subjectPlaceholder")}
          />
        </div>
        <div class="form-control">
          <label for="message" class="label">
            <span class="label-text">{$t("message")}</span>
          </label>
          <textarea
            id="message"
            name="message"
            class="textarea textarea-bordered h-24"
            required
            maxlength="1000"
            placeholder={$t("messagePlaceholder")}
          ></textarea>
        </div>
        <div class="form-control mt-6">
          <button
            type="submit"
            class="rounded-full bg-rgHighlight hover:bg-rgHighlightHover py-2 text-xl text-white"
            disabled={submitting}
          >
            {submitting ? $t("sending") : $t("sendMessage")}
          </button>
        </div>
      </form>

      {#if form?.success}
        <div class="alert alert-success mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
          >
          <span>{$t("messageSentSuccess")}</span>
        </div>
      {:else if form?.error}
        <div class="alert alert-error mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
          >
          <span>{getErrorMessage(form.error)}</span>
        </div>
      {/if}
    </div>
  </div>
</div>

<Pattern left mdScreen />
