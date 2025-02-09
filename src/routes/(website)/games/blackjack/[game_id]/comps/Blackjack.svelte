<script lang="ts">
	import Card from './Card.svelte';
	import Bet from './Bet.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Carta, Color, Decision, Hand, StringToCards } from '$lib/games/blackjack';
	import { goto } from '$app/navigation';

	let {
		points,
		playerHand,
		dealerHand,
		gameId,
		firstPlay,
		ended
	}: {
		points: number;
		playerHand: Hand;
		dealerHand: Hand;
		gameId: string;
		firstPlay: boolean;
		ended: boolean;
	} = $props();

	let bet = $state([0]);
	let betting_num = $derived(bet[0]);

	const DECITIONS = ['start', 'hit', 'double', 'stand'];

	// for cards user
	const incrementX = 17;
	const incrementY = 20;

	let betting = $state(true);

	async function startGame() {
		const resp = await fetch(`/games/blackjack`, {
			method: 'POST',
			body: JSON.stringify({
				points: bet[0],
				gameId: gameId,
				decition: 'start'
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		points -= betting_num;

		const enJson = await resp.json();
		//console.log(enJson);

		ended = !enJson.canreplay;
		playerHand = new Hand(StringToCards(enJson.data.player_cards));
		dealerHand = new Hand(StringToCards(enJson.data.dealer_cards));

		if (dealerHand.cards.length == 1) {
			firstPlay = true;
		} else if (dealerHand.cards.length > 1) {
			firstPlay = false;
		}
	}

	async function play(decition: Decision) {
		let decitionToSend: string = '';

		switch (decition) {
			case Decision.STAND:
				decitionToSend = 'stand';
				break;
			case Decision.HIT:
				decitionToSend = 'hit';
				break;
			case Decision.DOUBLE:
				decitionToSend = 'double';
				break;
			case Decision.UNKOWN:
				return;
		}

		const resp = await fetch(`/games/blackjack`, {
			method: 'POST',
			body: JSON.stringify({
				points: 0,
				gameId: gameId,
				decition: decitionToSend
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		points -= betting_num;

		const enJson = await resp.json();
		console.log(enJson);

		ended = !enJson.canreplay;
		playerHand = new Hand(StringToCards(enJson.data.player_cards));
		dealerHand = new Hand(StringToCards(enJson.data.dealer_cards));

		if (dealerHand.cards.length == 1) {
			firstPlay = true;
		} else if (dealerHand.cards.length > 1) {
			firstPlay = false;
		}
	}

	let waiting = $state(false);

	async function callGet() {
		waiting = true;
		console.log('calling callGet()');

		const resp = await fetch('/games/blackjack', { method: 'GET' });
		const id = await resp.json();

		console.log('id: ', id);

		goto(`/games/blackjack/${id.id}`);
		waiting = false;
	}

	// flow of game
	// place bet, confirm

	//give cards to everyone

	//if dealer has a ten
</script>

<div class="flex flex-col justify-center gap-32">
	<div class="flex flex-row justify-between">
		<div class="relative w-full">
			<h2 class="absolute -bottom-[40px] w-fit text-center">Player Cards</h2>

			{#each playerHand.cards as carta, i}
				<Card
					class={'absolute'}
					turned={false}
					style={`bottom: ${i * incrementY}px; left: ${i * incrementX}px;`}
					color={carta.color}
					symbol={carta.symbol}
				/>
			{/each}
		</div>
		<div class="relative w-full">
			<h2 class="absolute -bottom-[40px] text-center">Dealer Cards</h2>
			{#if firstPlay}
				{#if playerHand.cards.length > 0}
					<Card
						class={'absolute'}
						turned={true}
						style={`bottom: 0px; left: 0px;`}
						color={Color.SPADES}
						symbol={Carta.PLACEHOLDER}
					/>
				{/if}
				{#each dealerHand.cards as carta, i}
					<Card
						class={'absolute'}
						turned={false}
						style={`bottom: ${incrementY}px; left: ${incrementX}px;`}
						color={carta.color}
						symbol={carta.symbol}
					/>
				{/each}
			{:else}
				{#each dealerHand.cards as carta, i}
					<Card
						class={'absolute'}
						turned={false}
						style={`bottom: ${i * incrementY}px; left: ${i * incrementX}px;`}
						color={carta.color}
						symbol={carta.symbol}
					/>
				{/each}
			{/if}
		</div>
	</div>

	{#if betting}
		<Bet bind:value={bet} {points} />
	{/if}
</div>

<div class="mt-5 flex flex-row gap-5">
	<Button onclick={startGame}>Start Game</Button>
	<Button
		onclick={() => {
			play(Decision.HIT);
		}}>Hit</Button
	>
	<Button
		onclick={() => {
			play(Decision.STAND);
		}}>Stand</Button
	>
	<Button
		onclick={() => {
			play(Decision.DOUBLE);
		}}>Double</Button
	>
</div>

<!--
<Card class={cn('')} turned={true} style={``} color={Color.CLOVERS} symbol={Carta.Queen} />
-->

{#if ended}
	<Button onclick={callGet} class="mt-6" disabled={waiting}>
		{#if waiting}
			Creating Room
		{:else}
			Replay ??
		{/if}
	</Button>
{/if}
