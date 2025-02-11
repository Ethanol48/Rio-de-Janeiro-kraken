<script lang="ts">
	import { Hand, StringToCards } from '$lib/games/blackjack';
	import Blackjack from './comps/Blackjack.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let { data } = $props();

	const puntos = data.points!;
	console.log('dealer cards: ', data.game?.dealerCards);
	console.log('game ended: ', data.game?.ended);
	console.log('playerWon?? from game object: ', data.game?.playerWon);
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
	<h2 class="typography" style="border-bottom: 0px;">We didn't found any game with this id :(</h2>
	<Button href="/games/blackjack" variant="destructive" class="typography"
		>Go Back and start a new game!!!</Button
	>
{/if}
