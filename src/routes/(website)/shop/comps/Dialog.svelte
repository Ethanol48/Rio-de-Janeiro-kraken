<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Items } from '$lib/server/db/schema';
	import type { PageData } from '../$types';
	import { enhance } from '$app/forms';

	let { user, item }: { user: PageData['user']; item: Items } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button size="lg" style="font-size: 1.1rem;">Buy</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>
				<div class="flex justify-between">
					<p>Buying: {item.name}</p>
					<p class="pr-4">
						Stock left: <span class:text-red-500={item.stock <= 5}>{item.stock}</span>
					</p>
				</div>
			</Dialog.Title>
			<Dialog.Description>{item.desc}</Dialog.Description>
		</Dialog.Header>

		<div>
			<h3 class="typography">Price: {item.price}</h3>
		</div>

		<Dialog.Footer>
			{#if user !== null}
				<form
					action="/shop"
					method="POST"
					use:enhance={() => {
						return async ({ update }) => {
							update({ reset: false });
						};
					}}
				>
					<input type="text" value={item.id} name="itemId" class="hidden" />
					<Button type="submit">Confirm purchase</Button>
				</form>
			{:else}
				<Button href="/login">Log-in</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
