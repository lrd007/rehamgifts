<!-- /program/+page.svelte -->
<script lang="ts">
  import VideoGrid from "$lib/components/layout/VideoGrid.svelte";
  export let data;
</script>

<VideoGrid videos={data.videos} />
