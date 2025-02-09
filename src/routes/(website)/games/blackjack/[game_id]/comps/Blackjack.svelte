<script lang="ts">
	let { points } = $props();

	const DECITIONS = ['hit', 'double', 'stand'];

	// for cards
	const incrementX = 17;
	const incrementY = 20;

	// flow of game
	// place bet, confirm

	//give cards to everyone

	//if dealer has a ten
</script>

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
