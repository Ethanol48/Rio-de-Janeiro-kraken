<script lang="ts">
	import type { PageServerData } from './$types';
	import Item from './comps/Item.svelte';
	let { data }: { data: PageServerData } = $props();
</script>

<title>Krak'n Roses - Shop</title>
<div class="flex flex-col gap-2 justify-center">
	<div class="flex h-[20vw] flex-col justify-center gap-3 text-center">
		<h1 class="typography mb-3 text-lg text-gray-900">SHOP</h1>
	</div>

	<div class="flex gap-6  flex-wrap justify-center">
		{#each data.items as item}
			<Item user={data.user} {item} />
		{/each}
	</div>
</div>
