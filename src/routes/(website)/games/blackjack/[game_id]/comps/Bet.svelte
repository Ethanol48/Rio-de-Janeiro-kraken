<script lang="ts">
	import { Slider } from '$lib/components/ui/slider';
	import Button from '$lib/components/ui/button/button.svelte';

	// how to bind the value to the outside
	let { points, value = $bindable([0]) } = $props();
</script>

<div class="flex w-[300px] flex-col justify-center gap-6 rounded-xl bg-pink-50 p-6 shadow">
	<div class="flex flex-row justify-between">
		<h3 class="typography">Place your bet</h3>
		<p>{value} points</p>
	</div>

	<div class="flex gap-6">
		<p>0</p>
		<Slider bind:value max={points} step={1} />
		<p>{points}</p>
	</div>

	<Button
		class="mx-auto w-1/3"
		onclick={() => {
			// TODO: if value == 0 toast, it must be grater than 0
			// else close this window
			//console.log(value[0]);
		}}>Confirm Bet</Button
	>
</div>
