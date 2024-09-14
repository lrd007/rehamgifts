<script>
  import footerLogo from "$lib/assets/reham-assets/branding/rehamdiva-arabic-logo.svg";
  import { base } from "$app/paths";
  import { t } from "$lib/stores/language";

  $: currentYear = new Date().getFullYear();
</script>

<footer
  class="footer footer-center bg-rgPrimary text-white p-4 gap-y-2 relative overflow-hidden footer-pattern"
>
  <aside>
    <a href="https://reham.com/" target="_blank" class="flex items-center">
      <img src={footerLogo} alt={$t("rehamDivaLogo")} class="h-24 w-auto" />
    </a>
    <p class="text-xs sm:text-sm">
      {$t("copyright").replace("{year}", currentYear.toString())}
    </p>
  </aside>
  <div class="grid grid-flow-col gap-4">
    <a href="{base}/about">{$t("about")}</a>
    <a href="{base}/contact">{$t("contact")}</a>
  </div>
  <nav>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="mailto:hello@reham.com" class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-mail"
        >
          <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          ></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        <span>hello@reham.com</span>
      </a>
      <a
        href="https://reham.com/home"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-globe"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path
            d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
          ></path>
        </svg>
        <span>reham.com</span>
      </a>
      <a href="tel:+96550406406" class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-phone"
        >
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
          ></path>
        </svg>
        <span>+965 504 06406</span>
      </a>
    </div>
  </nav>
  <nav>
    <div class="grid grid-flow-col gap-4">
      <a
        href="https://x.com/rehamhouse1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={$t("twitter")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="fill-current"
        >
          <path
            d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
          ></path>
        </svg>
      </a>
      <a
        href="https://www.instagram.com/rehamhouse/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={$t("instagram")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="instagram-icon"
        >
          <path
            d="M7.75 2h8.5C19.99 2 22 4.01 22 7.75v8.5C22 19.99 19.99 22 16.25 22h-8.5C4.01 22 2 19.99 2 16.25v-8.5C2 4.01 4.01 2 7.75 2zm8.5 1.5h-8.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25zm-4.25 3.5a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.62-.37a1.12 1.12 0 1 1 0 2.25 1.12 1.12 0 0 1 0-2.25z"
          />
        </svg>
      </a>
    </div>
  </nav>
</footer>

<style lang="postcss">
  .footer-pattern::before,
  .footer-pattern::after {
    content: " ";
    @apply absolute bg-cover opacity-20 pointer-events-none;
    background-image: url("$lib/assets/reham-assets/patterns/pattern-transparent.png");
    aspect-ratio: 1032 / 942;
  }

  .footer-pattern::before {
    @apply left-0 bottom-0;
    width: 516px; /* 50% of original width */
    transform: translate(-30%, 30%) rotate(45deg);
  }

  .footer-pattern::after {
    @apply right-0 top-0;
    width: 516px; /* 50% of original width */
    transform: translate(20%, -20%) rotate(15deg);
  }

  @media (max-width: 640px) {
    .footer-pattern::before {
      transform: translate(-25%, 0%) rotate(0deg);
    }

    .footer-pattern::after {
      display: none;
    }
  }
</style>
