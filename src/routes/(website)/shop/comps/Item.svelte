<script lang="ts">
	import type { Items } from '$lib/server/db/schema';
	import * as Card from '$lib/components/ui/card/index.js';
	import Dialog from './Dialog.svelte';
	import type { LayoutData } from '../../$types';

	let { item, user }: { user: LayoutData['user']; item: Items } = $props();

	function truncate(text: string, num: number) {
		if (text.length > num) {
			return text.slice(0, num) + '...';
		} else {
			return text;
		}
	}
</script>

<Card.Root class="w-[30vw] min-w-[200px] max-w-[300px]">
	<Card.Header>
		<div class="flex flex-col justify-between">
			<h3 class="typography name">{item.name}</h3>
			<p>
				Stock left:
				<span class:text-red-500={item.stock <= 5}>
					{item.stock}

					{#if item.stock === 0}
						<span class="pl-1 text-slate-800">:(</span>
					{/if}
				</span>
			</p>
		</div>
	</Card.Header>
	<Card.Content>
		{truncate(item.desc, 60)}
	</Card.Content>
	<Card.Footer class="flex flex-row justify-between">
		<div class="flex flex-row items-end gap-2">
			<p class="" style="font-size: 1.6rem;">{item.price}</p>
		</div>
		<Dialog {user} {item}></Dialog>
	</Card.Footer>
</Card.Root>

<style>
	@media (width <= 500px) {
		.name {
			font-size: 1.2rem;
		}
	}
</style>
