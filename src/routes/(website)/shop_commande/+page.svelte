<script lang="ts">
  import { type PageServerData, type ActionData } from './$types.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Button } from '$lib/components/ui/button';
  import { slide, fade } from 'svelte/transition';

  let { data, form }: { data: PageServerData, form: ActionData } = $props(); 
  
  let categories = $state([
    {
      name: "À préparer",
      items: [
        { user: "kj", product: "Produit A", checked: false },
        { user: "mariemariemariemariemariemariemarie", product: "Produit B", checked: false },
        { user: "Pierre", product: "Produit C", checked: false },
      ],
      expanded: false,
    },
    {
      name: "À récupérer",
      items: [
        { user: "Lucie", product: "Produit D", checked: false },
        { user: "Paul", product: "Produit E", checked: false },
      ],
      expanded: false,
    },
    {
      name: "Récupéré",
      items: [
        { user: "Sophie", product: "Produit F", checked: true },
      ],
      expanded: false,
    },
  ]);

  function toggleCategory(index: number) {
    categories[index].expanded = !categories[index].expanded;
    categories = categories;
  }

  function handleCheckboxClick(item ) {
    console.log(`Checkbox cliquée pour : ${item.user}`);
  }
</script>

<!-- Container principal en flex, limité à 70vh pour éviter de dépasser l'écran -->
<div class="flex flex-col p-4">
  <div class="flex flex-col w-full max-w-screen-xl flex-grow bg-white rounded-xl shadow-lg overflow-hidden max-h-[70vh]">
    <!-- Header -->
    <header class="p-6 border-b">
      <h2 class="text-2xl font-bold text-gray-800">📦 • Gestion des commandes</h2>
    </header>

    <!-- Contenu principal scrollable -->
    <main class="flex-grow overflow-y-auto p-6 space-y-4">
      {#each categories as category, index}
        <div class="border rounded-lg overflow-hidden">
          <button
            class="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-pink-300 to-pink-400 text-white font-semibold hover:from-pink-400 hover:to-pink-500 transition-colors"
            onclick={() => toggleCategory(index)}
          >
            <span>{category.name}</span>
            <span class="text-sm">({category.items.length})</span>
          </button>
          {#if category.expanded}
            <div transition:slide class="bg-gray-50 p-4 space-y-3">
              {#each category.items as item, i}
                <div class="flex items-center space-x-4 p-4 bg-white rounded-md shadow hover:shadow-md transition-shadow" in:fade={{duration:300}}>
                  <input
                    type="checkbox"
                    bind:checked={item.checked}
                    class="h-5 w-5 text-blue-600 form-checkbox"
                    onchange={() => handleCheckboxClick(item)}
                    />
                  <div class="flex-1">
                    <p class="text-gray-800 font-medium">{item.user}</p>
                    <p class="text-gray-500 text-sm">{item.product}</p>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </main>

    <!-- Footer -->
  </div>
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
</style>
