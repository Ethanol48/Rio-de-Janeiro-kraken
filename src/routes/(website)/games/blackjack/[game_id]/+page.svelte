<script>
	import { Carta, Color, Hand, StringToCards } from '$lib/games/blackjack';
	import Blackjack from './comps/Blackjack.svelte';
	import Card from './comps/Card.svelte';
	import { cn } from '$lib/utils';

	const cartas_str = 'H7;S2;H4;SA;S6';
	const hand = new Hand(StringToCards(cartas_str));

	let { data } = $props();

	//let cartas = [
	//	{ color: Color.HEARTS, symbol: Carta.Ace },
	//	{ color: Color.DIAMONDS, symbol: Carta.Queen },
	//	{ color: Color.SPADES, symbol: Carta.King },
	//	{ color: Color.CLOVERS, symbol: Carta.Ace }
	//];
</script>

<p class="text-2xl">Sum of cards: {hand.sumOfCards()}</p>

<Blackjack points={data.points} />
