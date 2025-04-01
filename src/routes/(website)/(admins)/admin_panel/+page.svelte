<script lang="ts">
	import DataTable from './data_table/data-table.svelte';
	import { type PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="container mx-auto flex justify-center">
	<DataTable users={data.users} />
</div>
