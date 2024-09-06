<script>
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import VideoGrid from "$lib/components/VideoGrid.svelte";
</script>

<!-- <a class="btn" href="/login">Login</a> -->

<Header />

<main class="container mx-auto px-4 py-8 grid  gap-4">
  <!-- Main content area -->
  <div class="col-span-12 md:col-span-9 lg:col-span-10">
    <VideoGrid />
  </div>
</main>

<Footer />
