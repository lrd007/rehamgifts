<script lang="ts">
  import {
    collection,
    query,
    limit,
    startAfter,
    getDocs,
  } from "firebase/firestore";
  import { db } from "$lib/client/firebase";
  import type { UserData } from "$lib/types";
  import { RefreshCw } from "lucide-svelte";
  import { getCache, setCache, clearCache } from "$lib/utils/cacheUtility";

  export let users: UserData[];
  export let onRefresh: () => Promise<void>;

  let currentPage = 1;
  let usersPerPage = 10;
  let lastVisible: any = null;
  let loading = false;

  async function loadMoreUsers() {
    loading = true;
    const cacheKey = `users_page_${currentPage}`;
    const cachedUsers = getCache<UserData[]>(cacheKey);

    if (cachedUsers) {
      users = [...users, ...cachedUsers];
      currentPage++;
      loading = false;
      return;
    }

    try {
      const usersCollection = collection(db, "users");
      let q = query(usersCollection, limit(usersPerPage));

      if (lastVisible) {
        q = query(
          usersCollection,
          startAfter(lastVisible),
          limit(usersPerPage)
        );
      }

      const userSnapshot = await getDocs(q);
      const newUsers = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        country: doc.data().country,
        phoneNumber: doc.data().phoneNumber,
        watchedVideos: doc.data().watchedVideos || [],
      }));

      setCache(cacheKey, newUsers, 5 * 60 * 1000); // Cache for 5 minutes

      users = [...users, ...newUsers];
      lastVisible = userSnapshot.docs[userSnapshot.docs.length - 1];
      currentPage++;
    } catch (error) {
      console.error("Error loading more users:", error);
      alert("Failed to load more users. Please try again later.");
    } finally {
      loading = false;
    }
  }

  async function refreshUsers() {
    clearCache("users");
    for (let i = 1; i < currentPage; i++) {
      clearCache(`users_page_${i}`);
    }
    currentPage = 1;
    lastVisible = null;
    await onRefresh();
  }
</script>

<div>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">User Management</h2>
    <button class="btn btn-primary" on:click={refreshUsers} disabled={loading}>
      <RefreshCw size={20} class={loading ? "animate-spin" : ""} />
      Refresh
    </button>
  </div>
  <table class="table w-full">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Country</th>
        <th>Phone Number</th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <tr>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.country}</td>
          <td>{user.phoneNumber}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <button
    class="btn btn-primary mt-4"
    on:click={loadMoreUsers}
    disabled={loading}
  >
    {loading ? "Loading..." : "Load More Users"}
  </button>
</div>
