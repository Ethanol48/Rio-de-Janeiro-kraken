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
		<Button size="default" style="font-size: 1.1rem;" class="">Buy</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>
				<div class="flex flex-col gap-2">
					<p>Buying: {item.name}</p>
					<p class="pr-4">
						Stock left:
						<span class:text-red-500={item.stock <= 5}>
							{item.stock}

							{#if item.stock === 0}
								<span class="pl-1 text-slate-800">:(</span>
							{/if}
						</span>
					</p>
				</div>
			</Dialog.Title>
			<Dialog.Description class="p-2">{item.desc}</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer class="flex flex-row justify-between">
			<h4 class="typography mr-auto">Price: {item.price}</h4>

			<div>
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
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
