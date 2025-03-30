<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { fly, fade } from 'svelte/transition';
  
	// Les données sont fournies par la fonction load du serveur
	export let data: {
	  user: { username: string; points: number };
	  name: string;
	  point: number;
	  items: Array<{ product: string; itemsDesc: string }>;
	  claimed: any;
	};
</script>

<!-- Container principal qui s’adapte à toute la page -->
<div class="flex flex-col items-center justify-center w-full min-h-screen p-4 ">
	<!-- Box principale -->
	<div class="w-full max-w-xl bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6">
	  
	  <!-- En-tête -->
	  <div class="text-center mb-6">
		<h1 class="text-2xl md:text-3xl font-bold text-gray-800">
		  Bonjour {data.user.username}, voici ton inventaire
		</h1>
		<p class="mt-2 text-lg md:text-xl text-gray-600">
		  Points actuels : {data.user.points}
		</p>
	  </div>

	  <!-- Liste des items -->
	  <div class="max-h-96 overflow-y-auto space-y-4">
		{#each data.items as item, i (item.product + item.itemsDesc + i)}
		  <div
			class="bg-white p-4 rounded-md shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
			in:fly={{ y: 20, duration: 300 }} 
			out:fade
		  >
			<h2 class="text-lg font-semibold text-gray-700">{item.product}</h2>
			<p class="text-gray-500">{item.itemsDesc}</p>
		  </div>
		{/each}
	  </div>

	  <!-- Bouton de réclamation centré -->
	  <div class="flex justify-center mt-6">
		<form method="POST" action="?/Claim">
			<Button type="submit" disabled={data.claimed} class="rounded bg-primary p-3 text-white text-lg font-semibold">
				{#if data.claimed}
					Déjà réclamé 
				{:else}
					Réclamer la commande
				{/if}
			</Button>
		</form>
	  </div>

	</div>
</div>
