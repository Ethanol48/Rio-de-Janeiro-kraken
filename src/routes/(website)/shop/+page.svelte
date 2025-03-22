<script lang="ts">
	import type { PageServerData } from './$types';
	import Item from './comps/Item.svelte';
	let { data }: { data: PageServerData } = $props();
</script>

<title>Krak'n Roses - Shop</title>
<div class="grid grid-cols-1 place-items-center gap-32">
	<div class="flex h-[40vw] w-2/4 flex-col justify-center gap-3 text-center">
		<h1 class="typography mb-3 text-lg text-gray-900">SHOP</h1>

		<h3 style="text-align: center; font-size:20px">
			Un shop arrivent dès mercredi matin! <br /><br />De nombreuses récompenses seront disponibles
			alors préparez vos points car les stocks sont limités ! 🎁
		</h3>
	</div>

	<div class="grid w-3/4 grid-cols-1 place-items-center gap-3 sm:grid-cols-2 xl:grid-cols-3">
		{#each data.items as item}
			<Item {item} />
		{/each}
	</div>
</div>
