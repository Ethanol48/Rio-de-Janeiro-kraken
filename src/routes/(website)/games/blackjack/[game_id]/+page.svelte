<script>
	import Blackjack from './comps/Blackjack.svelte';

	let { data } = $props();
</script>

<Blackjack points={data.points} />
