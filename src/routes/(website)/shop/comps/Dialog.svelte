<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Items } from '$lib/server/db/schema';
	import type { PageData } from '../$types';
	import { enhance } from '$app/forms';


	let { user, item }: { user: PageData['user']; item: Items} = $props();


</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button size="lg" style="font-size: 1.1rem;">Buy</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Buying</Dialog.Title>
			<Dialog.Description>
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name</Label>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="username" class="text-right">Username</Label>
			</div>
		</div>
		<Dialog.Footer>
      {#if user !== null}
        <form action="/shop" method="POST" use:enhance>
          <input type="text" value={item.id} name="itemId" class="hidden">
          <Button type="submit">Confirm purchase</Button>
        </form>
      {/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
