<script lang="ts">
	import type { PageServerData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
  import Tutorial from './Tutorial.svelte';

	let { data }: { data: PageServerData } = $props();

	let waiting = $state(false);

	async function callGet() {
		waiting = true;

		const resp = await fetch('/games/blackjack', { method: 'GET' });
		const id = await resp.json();

		//console.log('id: ', id);
		goto(`/games/blackjack/${id.id}`);
	}

	console.log(data.game);
</script>

<div class="flex flex-col items-center">
  <Tutorial />
  <div>
    {#if data.user !== null}
      {#if data.game !== null && data.game !== undefined}
        <Button onclick={callGet}>Re-join game</Button>
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
</div>
