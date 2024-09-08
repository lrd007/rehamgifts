<script lang="ts">
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import VideoGrid from "$lib/components/VideoGrid.svelte";
  export let data;
</script>

<div class="flex flex-col min-h-screen">
  <Header userID={data.userID} />

  <main class="relative overflow-hidden main-pattern">
    <div class="container mx-auto px-4 py-8 relative z-10">
      <div class="col-span-12 md:col-span-9 lg:col-span-10">
        <VideoGrid />
      </div>
    </div>
    <div class="pattern left"></div>
    <div class="pattern right"></div>
  </main>

  <Footer />
</div>

<style lang="postcss">
  .main-pattern {
    position: relative;
    overflow-x: hidden;
  }

  .pattern {
    content: " ";
    position: fixed;
    background-image: url("$lib/assets/reham-assets/pattern-light-3x.png");
    background-size: cover;
    opacity: 1;
    pointer-events: none;
    width: 544px;
    height: 497px;
    transition: transform 0.1s ease-out;
    top: 0;
    animation-name: translateAnimation;
    animation-duration: 1ms; /* Firefox requires this to apply the animation */
    animation-direction: alternate;
    animation-timeline: scroll(block nearest);
  }

  .pattern.left {
    left: -20%;
  }

  .pattern.right {
    top: 15%;
    right: -10%;
    transform: scaleX(-1);
  }

  @media (min-width: 641px) {
    @keyframes translateAnimation {
      from {
        transform: translateX(0%);
      }
      to {
        transform: translateX(50%);
      }
    }

    .pattern.right {
      animation-direction: alternate-reverse;
    }
  }

  @media (max-width: 640px) {
    .pattern.left {
      display: none;
    }

    .pattern.right {
      top: 20%;
      left: 45%;
      /* transform: translateX(-50%) rotate(-30deg) scaleX(-1); */
    }

    @keyframes translateAnimation {
      from {
        transform: translate(0%, 0%) rotate(0deg) scaleX(-1);
      }
      to {
        transform: translate(-50%, 0%) rotate(-30deg) scaleX(-1);
      }
    }
  }
</style>
