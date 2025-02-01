<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index';
	import type { PageServerData } from './$types';
	import type { ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	console.log(data);
</script>

<form method="POST" action="?/foundSecret">
	<Button type="submit" disabled={data.claimed} class="rounded bg-primary p-2 text-white">
		{#if data.claimed}
			Already claimed 🎉
		{:else}
			Claim Secret
		{/if}
	</Button>
</form>

<!--
{#if form.errorMessage}
	<p class="text-red-500">{form.errorMessage}</p>
{/if}
-->
