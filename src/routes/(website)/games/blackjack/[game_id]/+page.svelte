<script>
	import { Carta, Color, Hand, StringToCards } from '$lib/games/blackjack';
	import Blackjack from './comps/Blackjack.svelte';
	import Card from './comps/Card.svelte';
	import { cn } from '$lib/utils';

	const decitions = ['start', 'hit', 'double', 'stand'];

	const cartas_str = 'HQ;S2;H4;SA;S6';
	const hand = new Hand(StringToCards(cartas_str));

	const c = hand.cards.shift();

	let { data } = $props();

	//let cartas = [
	//	{ color: Color.HEARTS, symbol: Carta.Ace },
	//	{ color: Color.DIAMONDS, symbol: Carta.Queen },
	//	{ color: Color.SPADES, symbol: Carta.King },
	//	{ color: Color.CLOVERS, symbol: Carta.Ace }
	//];

	console.log(data.game);
</script>

<p class="text-2xl">Card: {c?.ToString()}</p>
<p class="text-2xl">Card Value: {c?.Value()}</p>

<p class="text-2xl">Sum of cards: {hand.sumOfCards()}</p>
<p class="text-2xl">Sum of cards: {hand.cards.length}</p>

<Blackjack points={data.points} />
