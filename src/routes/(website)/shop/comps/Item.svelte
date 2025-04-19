<script lang="ts">
	import type { Items } from '$lib/server/db/schema';
	import * as Card from '$lib/components/ui/card/index.js';
	import Dialog from './Dialog.svelte';
	import type { LayoutData } from '../../$types';

	let { item, user }: { user: LayoutData['user']; item: Items } = $props();
</script>

<Card.Root class="w-[30vw] min-w-[200px] max-w-[300px]">
	<Card.Header>
		<div class="flex justify-between">
			<h2 class="typography">{item.name}</h2>
			<p>Stock left: <span class:text-red-500={item.stock <= 5}>{item.stock}</span></p>
		</div>
	</Card.Header>
	<Card.Content class="">
		{item.desc}
	</Card.Content>
	<Card.Footer class="flex flex-row justify-between">
		<div class="flex flex-row items-end gap-2">
			<p style="font-size: 1.4rem;">Price:</p>
			<p class="" style="font-size: 1.6rem;">{item.price}</p>
		</div>
		<Dialog {user} {item}></Dialog>
	</Card.Footer>
</Card.Root>
