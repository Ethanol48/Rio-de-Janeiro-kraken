<script lang="ts">
	import { Slider } from '$lib/components/ui/slider';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { Decision } from '$lib/games/blackjack';

	// how to bind the value to the outside
	let { points, totalBet, playFunc }: { points: number; totalBet: number; playFunc: Function } =
		$props();
</script>

<div class="flex w-[230px] flex-col justify-center gap-6 rounded-xl bg-primary-foreground p-3 shadow">
	<div class="flex flex-col justify-center gap-5">
		<h3 class="typography text-center">Take an action</h3>

		<div class="flex w-full flex-row justify-around">
			<Button
				onclick={() => {
					playFunc(Decision.HIT);
				}}>Hit</Button
			>
			<Button
				onclick={() => {
					playFunc(Decision.STAND);
				}}>Stand</Button
			>
			<Button
				onclick={() => {
					playFunc(Decision.DOUBLE);
				}}>Double</Button
			>
		</div>
	</div>
</div>
