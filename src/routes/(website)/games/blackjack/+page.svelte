<script lang="ts">
	import type { PageServerData } from "./$types";
  import Blackjack from "./comps/Blackjack.svelte"

	let { data }: { data: PageServerData } = $props();
</script>



{#if data.user !== null}

  <Blackjack points={data.points} />
  <!-- juego -->

{:else}

  <h2>Sign in to play!!</h2>
   <!-- else content here -->
{/if}
