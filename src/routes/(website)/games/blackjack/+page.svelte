<script lang="ts">
	import type { PageServerData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';

	let { data }: { data: PageServerData } = $props();

	async function callGet() {
		const resp = await fetch('/games/blackjack', {
			method: 'GET'
		});

		console.log(resp);
	}
</script>

<div>
	{#if data.user !== null}
		{#if data.game !== null}
			<Button>Re-join game</Button>
		{:else}
			<Button onclick={callGet}>Play</Button>
		{/if}

		<h1>Hola</h1>

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
