<script lang="ts">
  export let left: boolean = false;
  export let right: boolean = false;
  export let animate: boolean = false;
  export let mdScreen: boolean = false;
  $: console.log(mdScreen);
</script>

{#if left}
  <div class="pattern left" class:mdScreen={mdScreen} class:parallax={animate}></div>
{/if}
{#if right}
  <div class="pattern right" class:parallax={animate}></div>
{/if}

<style lang="postcss">
  .pattern {
    opacity: 0.5;
    content: " ";
    position: fixed;
    background-image: url("$lib/assets/reham-assets/patterns/pattern-light-3x.png");
    background-size: cover;
    pointer-events: none;
    width: 544px;
    height: 497px;
    transition: transform 0.1s ease-out;
    top: 0;
    z-index: -1;
  }

  .pattern.left {
    left: -20%;
  }

  .pattern.right {
    top: 15%;
    right: -10%;
    transform: scaleX(-1);
  }

  .pattern.parallax {
    animation-name: translateAnimation;
    animation-duration: 1ms; /* Firefox requires this to apply the animation */
    animation-direction: alternate;
    animation-timeline: scroll(block nearest);
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
    .pattern.right {
      display: none;
    }

    .pattern.left {
      top: 20%;
      left: 45%;
      /* transform: translateX(-50%) rotate(-30deg) scaleX(-1); */
    }

    .mdScreen {
      display: none;
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
