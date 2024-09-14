<!-- CountryDropdown.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import type { Country } from "$lib/types";

  export let countriesData: Country[];
  export let selectedCountry: Country;
  export let onSelect: (country: Country) => void;

  let dropdownOpen = false;
  let searchTerm = "";
  let searchInput: HTMLInputElement;
  let dropdownContainer: HTMLDivElement;

  $: filteredCountries = countriesData.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleDropdownClick(event: Event) {
    if (
      dropdownContainer &&
      !dropdownContainer.contains(event.target as Node)
    ) {
      dropdownOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener("click", handleDropdownClick);
    document.addEventListener("touchend", handleDropdownClick);

    return () => {
      document.removeEventListener("click", handleDropdownClick);
      document.removeEventListener("touchend", handleDropdownClick);
    };
  });
</script>

<div class="dropdown" bind:this={dropdownContainer}>
  <button
    type="button"
    class="btn m-1 flex-nowrap"
    on:click|stopPropagation={() => (dropdownOpen = !dropdownOpen)}
    aria-haspopup="listbox"
    aria-expanded={dropdownOpen}
    aria-label="Select country"
  >
    {#if selectedCountry}
      <img
        src={selectedCountry.flag}
        alt={selectedCountry.name}
        class="w-5 h-5 mr-2"
      />
      +{selectedCountry.phoneCode}
    {/if}
  </button>
  {#if dropdownOpen}
    <ul
      class="dropdown-content z-[1000] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-60 overflow-y-auto absolute left-0 mt-1"
      role="listbox"
    >
      <li>
        <input
          bind:this={searchInput}
          type="text"
          placeholder="Search countries"
          class="input input-bordered w-full"
          bind:value={searchTerm}
        />
      </li>
      {#each filteredCountries as country}
        <li>
          <button
            type="button"
            on:click|stopPropagation={() => {
              onSelect(country);
              dropdownOpen = false;
            }}
            role="option"
            aria-selected={selectedCountry?.code === country.code}
          >
            <img src={country.flag} alt={country.name} class="w-5 h-5 mr-2" />
            {country.name} (+{country.phoneCode})
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
  }

  .dropdown-content {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
  }
</style>
