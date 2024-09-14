<script lang="ts">
  import { enhance } from '$app/forms';
  import { Pattern } from '$lib/components';
  import type { ActionData } from './$types';

  export let form: ActionData;

  let submitting = false;

  function getErrorMessage(error: string): string {
    switch (error) {
      case 'MISSING_FIELDS':
        return 'Please fill in all fields.';
      case 'INVALID_LENGTH':
        return 'One or more fields exceed the maximum allowed length.';
      case 'INVALID_EMAIL':
        return 'Please enter a valid email address.';
      case 'TOO_MANY_REQUESTS':
        return 'Too many requests. Please try again later.';
      case 'SERVER_STORAGE_FULL':
        return 'The server is currently unable to process new submissions. Please try again later.';
      case 'SERVER_ERROR':
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }
</script>

<div class="container mx-auto px-4 py-8 flex flex-col items-center">
  <h1 class="text-3xl font-bold mb-6 text-center">Contact Us</h1>
  <div class="card w-full max-w-lg bg-base-100 shadow-xl">
    <div class="card-body">
      <form method="POST" use:enhance={() => {
        submitting = true;
        return ({ result }) => {
          submitting = false;
          if (result.type === 'success') {
            // Optionally clear the form fields here
          }
        };
      }}>
        <div class="form-control">
          <label for="name" class="label">
            <span class="label-text">Name</span>
          </label>
          <input type="text" id="name" name="name" class="input input-bordered" required maxlength="100" />
        </div>
        <div class="form-control">
          <label for="email" class="label">
            <span class="label-text">Email</span>
          </label>
          <input type="email" id="email" name="email" class="input input-bordered" required maxlength="100" />
        </div>
        <div class="form-control">
          <label for="subject" class="label">
            <span class="label-text">Subject</span>
          </label>
          <input type="text" id="subject" name="subject" class="input input-bordered" required maxlength="200" />
        </div>
        <div class="form-control">
          <label for="message" class="label">
            <span class="label-text">Message</span>
          </label>
          <textarea id="message" name="message" class="textarea textarea-bordered h-24" required maxlength="1000"></textarea>
        </div>
        <div class="form-control mt-6">
          <button type="submit" class="rounded-full bg-rgHighlight hover:bg-rgHighlightHover py-2 text-xl text-white" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>

      {#if form?.success}
        <div class="alert alert-success mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Your message has been sent successfully!</span>
        </div>
      {:else if form?.error}
        <div class="alert alert-error mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{getErrorMessage(form.error)}</span>
        </div>
      {/if}
    </div>
  </div>
</div>

<Pattern left />