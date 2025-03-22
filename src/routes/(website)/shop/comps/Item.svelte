<script lang="ts">
	import type { Items } from '$lib/server/db/schema';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	let { item }: { item: Items } = $props();
</script>

<Card.Root class="w-[25vw]">
	<Card.Header>
		<h2 class="typography">{item.name}</h2>
	</Card.Header>
	<Card.Content></Card.Content>
	<Card.Footer>
		<Button>Buy</Button>
	</Card.Footer>
</Card.Root>
