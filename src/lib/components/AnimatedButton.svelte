<script lang="ts">
    export let buttonText = "Button";
    let y: number;
    let isTopOfPage: boolean;
    let isAnimating = false;
  
    $: isTopOfPage = y === 0;
    $: if (isTopOfPage && !isAnimating) {
      isAnimating = true;
      setTimeout(() => {
        isAnimating = false;
      }, 1000); // Animation duration
    }
  </script>
  
  <svelte:window bind:scrollY={y} />
  
  <a
    href="/your-link-page"
    class="rainbow-button relative inline-flex items-center justify-center h-10 px-6 font-medium text-white bg-pink-400 rounded-full overflow-hidden transition-all duration-300 hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
    class:animate={isAnimating}
  >
    <span class="relative z-10">{buttonText}</span>
  </a>
  
  <style lang="postcss">
    .rainbow-button::before {
      content: '';
      @apply absolute -top-full left-0 w-[100%] h-[300%] opacity-0 transition-opacity duration-300 ease-in-out;
      background: conic-gradient(
        #ea8bb9,
        #ff3366,
        #ff9933,
        #66ccff,
        #ff66cc,
        #ea8bb9
      );
      z-index: 1;
    }
  
    .rainbow-button::after {
      content: '';
      @apply absolute inset-[0.175rem] bg-pink-400 rounded-[calc(1.25rem-0.175rem)] z-[2];
    }
  
    .rainbow-button.animate::before {
      @apply opacity-100;
      animation: rotate 1s linear;
    }
  
    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(350deg);
      }
    }
  </style>