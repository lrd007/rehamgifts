<script lang="ts">
  import { onMount } from "svelte";
  import { getAllVideos } from "$lib/videoFirebase";
  import { logoutUser } from "$lib/services/auth";
  import { invalidateAll } from "$app/navigation";
  import type { VideoWithId, UserData } from "$lib/types";
  import { collection, getDocs, query, limit } from "firebase/firestore";
  import { db } from "$lib/client/firebase";
  import UserManagement from "$lib/components/admin/UserManagement.svelte";
  import VideoManagement from "$lib/components/admin/VideoManagement.svelte";
  import { RefreshCw } from "lucide-svelte";
  import { getCache, setCache, clearCache } from "$lib/utils/cacheUtility";

  let videos: VideoWithId[] = [];
  let users: UserData[] = [];
  let loading = false;
  let activeTab = "users";

  onMount(async () => {
    await loadData();
  });

  async function loadData(forceRefresh = false) {
    loading = true;
    if (activeTab === "videos") {
      await loadVideos(forceRefresh);
    } else {
      await loadUsers(forceRefresh);
    }
    loading = false;
  }

  async function loadVideos(forceRefresh = false) {
    if (!forceRefresh) {
      const cachedVideos = getCache<VideoWithId[]>("videos");
      if (cachedVideos) {
        videos = cachedVideos;
        return;
      }
    }

    try {
      videos = await getAllVideos();
      setCache("videos", videos, 10 * 60 * 1000); // Cache for 10 minutes
    } catch (error) {
      console.error("Error fetching videos:", error);
      alert("Failed to load videos. Please try again later.");
    }
  }

  async function loadUsers(forceRefresh = false, userLimit = 20) {
    if (!forceRefresh) {
      const cachedUsers = getCache<UserData[]>("users");
      if (cachedUsers) {
        users = cachedUsers;
        return;
      }
    }

    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, limit(userLimit));
      const userSnapshot = await getDocs(q);
      users = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        country: doc.data().country,
        phoneNumber: doc.data().phoneNumber,
        watchedVideos: doc.data().watchedVideos || [],
      }));
      setCache("users", users, 5 * 60 * 1000); // Cache for 5 minutes
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users. Please try again later.");
    }
  }

  async function handleLogout() {
    try {
      await logoutUser();
      invalidateAll();
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  }

  async function setActiveTab(tab: string) {
    activeTab = tab;
    await loadData();
  }

  async function refreshData() {
    clearCache(activeTab === "users" ? "users" : "videos");
    await loadData(true);
  }
</script>

<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Admin Dashboard</h1>
    <div class="flex gap-2">
      <button class="btn btn-primary" on:click={refreshData} disabled={loading}>
        <RefreshCw size={20} class={loading ? "animate-spin" : ""} />
        Refresh
      </button>
      <button class="btn btn-secondary" on:click={handleLogout}>Logout</button>
    </div>
  </div>

  <div class="tabs tabs-boxed mb-4">
    <button
      class="tab {activeTab === 'users' ? 'tab-active' : ''}"
      on:click={() => setActiveTab("users")}
    >
      Users
    </button>
    <button
      class="tab {activeTab === 'videos' ? 'tab-active' : ''}"
      on:click={() => setActiveTab("videos")}
    >
      Videos
    </button>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-32">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if activeTab === "users"}
    <UserManagement {users} onRefresh={refreshData} />
  {:else if activeTab === "videos"}
    <VideoManagement {videos} onRefresh={refreshData} />
  {/if}
</div>
