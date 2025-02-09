<script lang="ts">
	import type { PageServerData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	let { data }: { data: PageServerData } = $props();

	let waiting = $state(false);

	async function callGet() {
		waiting = true;

		const resp = await fetch('/games/blackjack', {
			method: 'GET'
		});

		const id = await resp.json();

		goto(`/games/blackjack/${id.id}`);
	}
</script>

<div>
	{#if data.user !== null}
		{#if data.game !== null}
			<Button>Re-join game</Button>
		{:else}
			<Button onclick={callGet} disabled={waiting}>
				{#if waiting}
					Creating Room
				{:else}
					Play
				{/if}
			</Button>
		{/if}

		<!--
  get gameSession if any and button to go to session
  
  load game session id, if any show button pursue last game?
-->
		<!-- juego -->
	{:else}
		<h2>Sign in to play!!</h2>
		<!-- else content here -->
	{/if}
</div>
