<!-- src/lib/components/admin/UserManagement.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { UserData } from "$lib/types";

  export let userData: {
    users: UserData[];
    totalUsers: number;
    currentPage: number;
    usersPerPage: number;
  };

  $: ({ users, totalUsers, currentPage, usersPerPage } = userData);
  $: totalPages = Math.ceil(totalUsers / usersPerPage);

  const dispatch = createEventDispatcher();

  function handlePageChange(newPage: number) {
    dispatch("pageChange", newPage);
  }

  function handleUsersPerPageChange(event: Event) {
    const newUsersPerPage = parseInt((event.target as HTMLSelectElement).value);
    dispatch("usersPerPageChange", newUsersPerPage);
  }

  async function exportUsers() {
    try {
      const response = await fetch("/api/admin/users/export");
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "users_export.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting users:", error);
      alert("Failed to export users. Please try again.");
    }
  }

  function getPaginationRange(
    current: number,
    total: number,
    max: number = 10
  ) {
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

    let start = Math.max(1, current - Math.floor(max / 2));
    let end = Math.min(total, start + max - 1);

    if (end - start + 1 < max) {
      start = Math.max(1, end - max + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  $: paginationRange = getPaginationRange(currentPage, totalPages);
</script>

<div>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">User Management</h2>
    <button class="btn btn-primary" on:click={exportUsers}>
      Export All Users
    </button>
  </div>

  <div class="mb-4">
    <label for="usersPerPage">Users per page: </label>
    <select
      id="usersPerPage"
      value={usersPerPage}
      on:change={handleUsersPerPageChange}
      class="select select-bordered w-full max-w-xs"
    >
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  </div>

  <div class="overflow-x-auto">
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
        {#each users as user (user.id)}
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.country}</td>
            <td>{user.phoneNumber}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="flex justify-center items-center mt-4">
    <div class="join">
      <button
        class="join-item btn"
        on:click={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        «
      </button>
      {#each paginationRange as page}
        <button
          class="join-item btn {page === currentPage ? 'btn-active' : ''}"
          on:click={() => handlePageChange(page)}
        >
          {page}
        </button>
      {/each}
      <button
        class="join-item btn"
        on:click={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </div>
  </div>
  <div class="text-center mt-2">
    Page {currentPage} of {totalPages} (Total Users: {totalUsers})
  </div>
</div>
