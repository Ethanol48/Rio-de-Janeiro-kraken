<script lang="ts">
	import { Ellipsis } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import type { Writable } from 'svelte/store';

	let { id, row }: { id: string; row: any; rowState: Writable<any>; rowIndex: number } = $props();

	let isAdmin: any = row.cellForId['isAdmin']['value'];

	function handleMakeAdmin() {
		fetch(
			'/admin_panel?' +
				new URLSearchParams({ operation: 'isAdmin', value: !isAdmin, userId: id }).toString(),
			{
				method: 'POST'
			}
		);

		toast.success('reload the page');
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item on:click={handleMakeAdmin}>
				{#if isAdmin === true}
					Demote Admin
				{:else}
					Make an Admin
				{/if}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
