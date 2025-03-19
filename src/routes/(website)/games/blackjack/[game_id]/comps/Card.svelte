<script lang="ts">
	import { Carta, Color, symbolToString } from '$lib/games/blackjack';
	import Icon from '$lib/games/Icon.svelte';
	import WhiteHeart from '$lib/svgs/white-heart.svelte';
	import { cn } from '$lib/utils';
	import { fly } from 'svelte/transition';

	let {
		color,
		symbol,
		turned = false,
		class: classes = '',
		style: styles = ''
	}: { color: Color; symbol: Carta; class?: any; style?: any; turned?: Boolean } = $props();

	let simbolo = symbolToString(symbol);
</script>

<div
	in:fly={{
		delay: 100,
		duration: 300
	}}
	class={cn(classes)}
	style={styles}
>
	{#if !turned}
		<div
			class={'relative flex h-[100px] w-[70px] flex-col items-center justify-center rounded border border-black bg-white p-2 align-middle'}
		>
			<div class="absolute left-2 top-2 flex flex-row items-center">
				{#if color === Color.HEARTS}
					<p
						class="mb-[2px] mr-[4px] font-bold"
						class:text-[#e01b24]={color === Color.HEARTS || color === Color.DIAMONDS}
					>
						{simbolo}
					</p>
					<Icon {color} class={' h-[10px] w-[10px]'} />
				{:else}
					<p
						class="mb-[1px] mr-[4px] font-bold"
						class:text-[#e01b24]={color === Color.DIAMONDS}
						class:text-black={color === Color.SPADES || color === Color.CLOVERS}
					>
						{simbolo}
					</p>
					<Icon {color} class={' h-[11px] w-[11px]'} />
				{/if}
			</div>

			{#if color === Color.HEARTS}
				<Icon {color} class={'h-[28px] w-[28px]'} />
			{:else}
				<Icon {color} class={'h-[30px] w-[30px]'} />
			{/if}

			<div class="absolute bottom-2 right-2">
				{#if color === Color.HEARTS}
					<Icon {color} class={'h-[10px] w-[10px] rotate-180'} />
				{:else}
					<Icon {color} class={'h-[11px] w-[11px] rotate-180'} />
				{/if}
			</div>
		</div>
	{:else}
		<div
			class={'relative flex h-[100px] w-[70px] flex-col items-center justify-center rounded border border-gray-500 bg-white p-[4px] align-middle'}
		>
			<div
				class="flex h-full w-full flex-col items-center justify-center rounded bg-pink-500 align-middle opacity-40"
			>
				<WhiteHeart style="fill: #ffffff;" class={' h-[28px] w-[28px] fill-white opacity-40'} />
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
</style>
