<script lang="ts">
	import { Carta, Color, Hand, StringToCards } from '$lib/games/blackjack';
	import Blackjack from './comps/Blackjack.svelte';

	let { data } = $props();

	const puntos = data.points!;
	console.log(data.game?.dealerCards);
	console.log('game ended: ', data.game?.ended);
</script>

{#if data.game !== undefined && data.game !== null}
	<Blackjack
		points={puntos}
		game={data.game}
		playerHand={new Hand(StringToCards(data.game.playerCards))}
		dealerHand={new Hand(StringToCards(data.game.dealerCards))}
	/>
{:else}
	<!-- else content here -->
{/if}
