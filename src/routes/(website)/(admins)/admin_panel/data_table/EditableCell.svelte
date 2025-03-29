<script lang="ts">
	import { BodyRow, DataColumn } from 'svelte-headless-table';
	import { Input } from '$lib/components/ui/input';
	import { enhance } from '$app/forms';

	type Item = $$Generic;

	//export let row; /*: BodyRow<Item>*/
	//export let column; /*: DataColumn<Item>*/
	//export let value; /*: unknown;*/
	//export let onUpdateValue:

	let {
		row,
		column,
		value,
		onUpdateValue
	}: {
		row: BodyRow<Item>;
		column: DataColumn<Item>;
		value: unknown;
		onUpdateValue: (rowDataId: string, columnId: string, newValue: unknown) => void;
	} = $props();

	let isEditing = $state(false);

	const handleCancel = () => {
		isEditing = false;
	};
	const handleSubmit = () => {
		isEditing = false;
		if (row.isData()) {
			console.log(`id: ${row.dataId}, column: ${column.id}  newValue: ${value}`);
			onUpdateValue(row.dataId, column.id, value);
		}
	};
</script>

<div>
	{#if !isEditing}
		<div onclick={() => (isEditing = true)}>
			{value}
		</div>
	{:else}
		<form onsubmit={handleSubmit}>
			<Input type="text" bind:value />
			<button type="submit">✅</button>
			<button onclick={handleCancel}>❌</button>
		</form>
	{/if}
</div>

<style>
	form {
		display: flex;
		gap: 0.5rem;
	}

	button {
		padding: 0;
		border: none;
		background: transparent;
	}
</style>
