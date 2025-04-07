<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { fly, fade } from 'svelte/transition';
	import * as Dialog from '$lib/components/ui/dialog/index.js';


	// Les données sont fournies par la fonction load du serveur
	export let data: {
		user: { username: string; points: number };
		name: string;
		point: number;
		items: Array<{ product: string; itemsDesc: string }>;
		claimed: any;
	};
	let showConfirmation = false;
</script>

<title>Samba Dos Krakos - Your Inventory</title>
<!-- Container principal qui s’adapte à toute la page -->
<div class="flex min-h-screen w-full flex-col items-center justify-center p-4">
	<!-- Box principale -->
	<div class="w-full max-w-xl rounded-xl bg-white/80 p-6 shadow-xl backdrop-blur-md">
		<!-- En-tête -->
		<div class="mb-6 text-center">
			<h1 class="text-2xl font-bold text-gray-800 md:text-3xl">
				Hi {data.user.username}, <br> here is your inventory
			</h1>
			<br>
			<p class="mt-2 text-lg text-gray-600 md:text-xl">
				Current points: {data.user.points}
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
		{#if data.items.length === 0}
		

		<!--
		<div class="mt-6 flex justify-center">
			
				<Button
					on:click={() => (showConfirmation = true)}
					disabled={data.claimed}
					class="rounded bg-primary p-3 text-lg font-semibold text-white"
				>
					{#if data.claimed}
						Already claimed 📦
					{:else}
						Claim
					{/if}
				</Button>
				{#if showConfirmation}
				
				<Dialog.Root open={true} on:openChange={(e) => { if (!e.detail) showConfirmation = false }}>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Confirm your choice</Dialog.Title>
							<br>
							<Dialog.Description>
								Do you really want to recover your order?
								<br>
								<br>
								<strong style="color: red; text-decoration:underline; font-size:15px">After that, you will no longer be able to recover new gifts!</strong>
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Footer class="mt-4 flex justify-end gap-2">
							<Button variant="secondary" on:click={() => showConfirmation = false}>Cancel</Button>
							<form action="?/Claim" method="post">
							<Button type="submit">To validate</Button>
							</form>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
				{/if}
		</div>
		-->

		{/if}
	</div>
</div>
