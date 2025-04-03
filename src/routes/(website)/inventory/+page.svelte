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
<div class="flex min-h-screen w-full flex-col items-center justify-center p-4">
	<!-- Box principale -->
	<div class="w-full max-w-xl rounded-xl bg-white/80 p-6 shadow-xl backdrop-blur-md">
		<!-- En-tête -->
		<div class="mb-6 text-center">
			<h1 class="text-2xl font-bold text-gray-800 md:text-3xl">
				Bonjour {data.user.username}, voici ton inventaire
			</h1>
			<p class="mt-2 text-lg text-gray-600 md:text-xl">
				Points actuels : {data.user.points}
			</p>
		</div>

		<!-- Liste des items -->
		<div class="max-h-96 space-y-4 overflow-y-auto">
			{#each data.items as item, i (item.product + item.itemsDesc + i)}
				<div
					class="transform rounded-md bg-white p-4 shadow transition-transform hover:-translate-y-1 hover:shadow-lg"
					in:fly={{ y: 20, duration: 300 }}
					out:fade
				>
					<h2 class="text-lg font-semibold text-gray-700">{item.product}</h2>
					<p class="text-gray-500">{item.itemsDesc}</p>
				</div>
			{/each}
		</div>

		<!-- Bouton de réclamation centré -->
		<div class="mt-6 flex justify-center">
			<form method="POST" action="?/Claim">
				<Button
					type="submit"
					disabled={data.claimed}
					class="rounded bg-primary p-3 text-lg font-semibold text-white"
				>
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
