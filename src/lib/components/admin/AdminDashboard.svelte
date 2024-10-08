<!-- src/lib/components/admin/AdminDashboard.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import UserManagement from "./UserManagement.svelte";
  import VideoManagement from "./VideoManagement.svelte";

  let activeTab = "users";
  let userData = { users: [], totalUsers: 0, currentPage: 1, usersPerPage: 20 };
  let loading = true;

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    const usersResponse = await fetch(
      `/api/admin/users?page=${userData.currentPage}&limit=${userData.usersPerPage}`
    );

    if (usersResponse.ok) {``
      const usersJson = await usersResponse.json();
      userData = {
        users: usersJson.users,
        totalUsers: usersJson.totalUsers,
        currentPage: userData.currentPage,
        usersPerPage: userData.usersPerPage,
      };
    } else {
      console.error("Failed to fetch user data");
    }
    loading = false;
  }

  function setActiveTab(tab: string) {
    activeTab = tab;
  }

  async function refreshData() {
    await loadData();
  }

  async function handleUserPageChange(event: CustomEvent<number>) {
    userData.currentPage = event.detail;
    await loadData();
  }

  async function handleUsersPerPageChange(event: CustomEvent<number>) {
    userData.usersPerPage = event.detail;
    userData.currentPage = 1;
    await loadData();
  }

  function handleVideoChange() {
    // This function is called when a video is added, updated, or deleted
    // You can add any additional logic here if needed
    console.log("Video data changed");
  }
</script>

<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Admin Dashboard</h1>
    <div class="space-x-2">
      <button class="btn btn-primary" on:click={refreshData} disabled={loading}>
        Refresh Data
      </button>
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

  {#if loading && activeTab === "users"}
    <div class="flex justify-center items-center h-32">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if activeTab === "users"}
    <UserManagement
      {userData}
      on:pageChange={handleUserPageChange}
      on:usersPerPageChange={handleUsersPerPageChange}
    />
  {:else if activeTab === "videos"}
    <VideoManagement on:videoChange={handleVideoChange} />
  {/if}
</div>
