<script lang="ts">
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';
	import Item from './comps/Item.svelte';
	let { data, form }: PageProps = $props();

	$effect(() => {
		if (form?.success === true) {
			toast.success('The item has successfully being bought');
		} else if (form?.error.length > 0) {
			toast.error(form?.error);
		}
	});
</script>

<title>Samba Dos Krakos - Shop</title>
<div class="flex flex-col justify-center gap-2">
	<div class="flex h-[18vw] flex-col justify-center gap-3 text-center">
		<h1 class="typography text-lg text-gray-900">SHOP</h1>
	</div>

	<div class="flex flex-wrap justify-center gap-4">
		{#each data.items as item}
			<Item user={data.user} {item} />
		{/each}
	</div>
</div>
