<script lang="ts">
	import { Slider } from '$lib/components/ui/slider';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { MouseEventHandler } from 'svelte/elements';
  
  import { Input } from "$lib/components/ui/input/index.js";
	import { point } from 'drizzle-orm/pg-core';

	// how to bind the value to the outside
	let {
		points,
		value = $bindable([0]),
		startGameFunc
	}: { points: number; value: number[]; startGameFunc: MouseEventHandler<HTMLElement> } = $props();

  let increment10 = Math.ceil(points / 10);
  let increment33 = Math.ceil(points / 3);
</script>

<div class="flex flex-col">
	<div class="flex w-fit flex-col justify-center gap-6 rounded-xl bg-pink-50 p-6 shadow">
		<div class="flex flex-row justify-between">
			<h3 class="typography">Place your bet</h3>
			<p>{value} points</p>
		</div>

		<div class="flex gap-6">
			<p>0</p>
			<Slider bind:value max={points} step={1} />
			<p>{points}</p>
		</div>


		<div class="flex flex-row justify-between gap-2">
			<Button
				size="default"
				class=""
				onclick={() => {
					value = [value[0] - increment33];
				}}>- 33%</Button
			>
			<Button
				size="default"
				class=""
				onclick={() => {
					value = [value[0] - increment10];
				}}>- 10%</Button
			>
			<Button
				size="default"
				class=""
				onclick={() => {
					value = [value[0] + increment10];
				}}>+ 10%</Button
			>
			<Button
				size="default"
				class=""
				onclick={() => {
					value = [value[0] + increment33];
				}}>+ 33%</Button
			>
		</div>
		<div class="flex flex-row justify-around gap-3">
			<Button
				size="lg"
				class=""
				onclick={() => {
					value = [1];
				}}>Min</Button
			>
			<Button
				size="lg"
				class=""
				onclick={() => {
					value = [points / 2];
				}}>Middle</Button
			>
			<Button
				size="lg"
				class=""
				onclick={() => {
					value = [points];
				}}>All-in</Button
			>
		</div>
	</div>

	<Button class="mx-auto mt-12 w-1/3" onclick={startGameFunc}>Confirm Bet</Button>
</div>
