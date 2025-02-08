<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex w-2/4 flex-col justify-center">
	<h1 class="typography mb-3 ml-auto mr-auto text-lg text-gray-900">SHOP</h1>

	
</div>

<style lang="postcss">
	tr {
		@apply m-0 border-t p-0 even:bg-muted;
	}

	td {
		@apply border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right;
	}

	th {
		@apply border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right;
	}
</style>
