<script lang="ts">
	import DataTable from './data_table/data-table.svelte';
	import { type PageServerData, type ActionData } from './$types.js';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { enhance } from '$app/forms';


	let showConfirmation = $state(false);

	function toggleConfirmation() {
		showConfirmation = !showConfirmation;
	}

	

	let { data ,form}: { data: PageServerData ,form: ActionData} = $props();
	let showNotif = $state(false);
	
	if (form?.success !== undefined) {
		showNotif = true;
		setTimeout(() => showNotif = false, 3000);
	}
</script>

<div class="container mx-auto flex justify-center">
	<DataTable users={data.users} />
</div>

<br>

<title>Samba Dos Krakos - LeaderBoard</title>
<div class="flex w-4/5 flex-col justify-center mx-auto">
	<h1 class="typography mb-3 text-lg text-center text-gray-900">Enigme</h1>

	<!-- Conteneur avec fond blanc et scroll -->
	<div class="bg-white shadow-lg rounded-xl p-4 max-h-[200px] overflow-y-auto">
		<table class="w-full border border-gray-300">
			<thead class="bg-gray-100 sticky top-0">
				<tr>
					<th class="py-2 px-4 border">#</th>
					<th class="py-2 px-4 border text-left">Question</th>
					<th class="py-2 px-4 border text-left">Réponse</th>
					<th class="py-2 px-4 border text-center">Points</th>
					<th class="py-2 px-4 border text-center">Mois</th>
					<th class="py-2 px-4 border text-center">Jour</th>
				</tr>
			</thead>
			<tbody>
				{#each data.enigmes as item, i}
					<tr class="hover:bg-gray-50">
						<td class="py-2 px-4 border text-center">{i + 1}</td>
						<td class="py-2 px-4 border">{item.question}</td>
						<td class="py-2 px-4 border">{item.reponse}</td>
						<td class="py-2 px-4 border text-center">{item.points }</td>
						<td class="py-2 px-4 border text-center">{item.month +1}</td>
						<td class="py-2 px-4 border text-center">{item.day}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<div>
	<Button on:click={() => toggleConfirmation()} size="lg" class="mt-5">
		Créer/Modifier une énigme
	</Button>

	{#if showConfirmation}
	<Dialog.Root open={true} on:openChange={(e) => { if (!e.detail) showConfirmation = false }}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Nouvelle énigme</Dialog.Title>
			</Dialog.Header>

			<form action="?/CreateQuestion" method="post" >
				<Dialog.Description class="space-y-4 mt-4">
					<div>
						<label for="question" class="block font-semibold">Question</label>
						<input id="question" name="question" type="text" required class="w-full border p-2 rounded bg-white" />
					</div>
					
					

					<div>
						<label for="answer" class="block font-semibold">Réponse</label>
						<input id="answer" name="answer" type="text" required class="w-full border p-2 rounded bg-white" />
					</div>

					<div>
						<label for="day" class="block font-semibold">Jour</label>
						<input id="day" name="day" type="text" required class="w-full border p-2 rounded bg-white" />
					</div>
					<div>
						<label for="mois" class="block font-semibold">Mois</label>
						<input id="mois" name="mois" type="text" required class="w-full border p-2 rounded bg-white" />
					</div>
					<div>
						<label for="point" class="block font-semibold">Points</label>
						<input id="point" name="point" type="text" required class="w-full border p-2 rounded bg-white" />
					</div>
				</Dialog.Description>

				<Dialog.Footer class="mt-6 flex justify-end gap-2">
					<Button variant="secondary" on:click={() => showConfirmation = false}>Quitter</Button>
					<Button type="submit">Créer/Modifier l'enigme</Button>
					
				</Dialog.Footer>

				

			</form>
		</Dialog.Content>
	</Dialog.Root>
	{/if}

	{#if showNotif}
			<Dialog.Root open={true}>
				<Dialog.Content class="bg-white p-4 rounded-lg shadow-lg max-w-sm mx-auto text-center">
					<Dialog.Description>
						{#if form?.success}
							<p class="text-green-600 font-semibold">✅ { form!.message}</p>
						{:else}
							<p class="text-red-600 font-semibold">❌ { form!.message}</p>
						{/if}
					</Dialog.Description>
				</Dialog.Content>
			</Dialog.Root>
	{/if}

	


</div>
