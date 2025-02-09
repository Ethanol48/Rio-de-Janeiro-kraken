<script>
	import { Carta, Color } from '$lib/games/blackjack';
	import Blackjack from './comps/Blackjack.svelte';
	import Card from './comps/Card.svelte';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let cartas = [
		{ color: Color.HEARTS, symbol: Carta.Ace },
		{ color: Color.DIAMONDS, symbol: Carta.Queen },
		{ color: Color.SPADES, symbol: Carta.King },
		{ color: Color.CLOVERS, symbol: Carta.Ace }
	];

	const incrementX = 17;
	const incrementY = 20;
</script>

<Blackjack points={data.points} />


<!--
<div class="bottom relative">
	{#each cartas as carta, i}
		<Card
			class={cn(`absolute `)}
			style={`bottom: ${i * incrementY}px; left: ${i * incrementX}px;`}
			color={carta.color}
			symbol={carta.symbol}
		/>
	{/each}
</div>

<Card class={cn('')} turned={true} style={``} color={Color.CLOVERS} symbol={Carta.Queen} />
-->
