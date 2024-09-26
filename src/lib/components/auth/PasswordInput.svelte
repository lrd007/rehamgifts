<!-- PasswordInput.svelte -->
<script lang="ts">
  import { onMount } from "svelte";

  export let id: string;
  export let value: string;
  export let placeholder: string = "Password";
  export let required: boolean = true;
  export let minlength: number = 8;
  export let error: string | null | undefined = undefined;

  let showPassword = false;
  let inputElement: HTMLInputElement;

  onMount(() => {
    updateInputType();
  });

  function togglePasswordVisibility() {
    showPassword = !showPassword;
    updateInputType();
  }

  function updateInputType() {
    if (inputElement) {
      inputElement.type = showPassword ? "text" : "password";
    }
  }
</script>

<div class="form-control w-full">
  <label class="label" for={id}>
    <span class="label-text"><slot>Password</slot></span>
  </label>
  <div class="relative">
    <input
      {id}
      bind:this={inputElement}
      bind:value
      {placeholder}
      {required}
      {minlength}
      class="input input-bordered w-full pr-10"
    />
    <button
      type="button"
      class="absolute inset-y-0 right-0 pr-3 flex items-center"
      on:click={togglePasswordVisibility}
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
  {#if error}
    <label class="label">
      <span class="label-text-alt text-error">{error}</span>
    </label>
  {/if}
</div>
