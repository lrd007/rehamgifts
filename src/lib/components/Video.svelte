<script lang="ts">
    import { onMount } from 'svelte';

    let videoUrl: string | undefined = '';
    let isLoading: boolean = false;
    let error: string | null = null;
    let videoElement: HTMLVideoElement;

    // onMount(async () => {
    //     try {
    //         const userId = 'user123'; // Replace with actual user ID
    //         const response = await fetch('/api/get-video-url', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ userId })
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch video URL');
    //         }
    //         const data = await response.json();
    //         console.log(data)
    //         videoUrl = data.url;
    //     } catch (err) {
    //         console.error('Error fetching video URL:', err);
    //         error = 'Failed to load video. Please try again later.';
    //     } finally {
    //         isLoading = false;
    //     }
    // });

    function disableRightClick(event: MouseEvent) {
        event.preventDefault();
    }
</script>

<video controls preload="metadata">
    <source src="api/get-video-url" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
{#if isLoading}
    <p>Loading video...</p>
{:else if error}
    <p>{error}</p>
{:else if videoUrl}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- <div class="video-container" on:contextmenu={disableRightClick}>
        <video 
            bind:this={videoElement}
            src="/api/get-video-url"
            controls 
            controlsList="nodownload"
        >
            Your browser does not support the video tag.
        </video>
    </div> -->
    
{/if}

<style>
    .video-container {
        position: relative;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    }
</style>