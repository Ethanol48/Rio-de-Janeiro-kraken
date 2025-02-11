<script lang="ts">
	import Card from './Card.svelte';
	import Bet from './Bet.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Carta, Color, Decision, Hand, StringToCards } from '$lib/games/blackjack';
	import { goto, invalidate } from '$app/navigation';
	import type { PageServerData } from '../$types';
	import Decitions from './Decitions.svelte';

	let {
		points,
		playerHand,
		dealerHand,
		game
	}: {
		points: number;
		playerHand: Hand;
		dealerHand: Hand;
		game: NonNullable<PageServerData['game']>;
	} = $props();

	console.log('carts of dealer: ', dealerHand.cards.length);

	let bet = $state([0]);
	let betting_num = $derived(bet[0]);
	let dealerHandLength = $state(dealerHand.cards.length);

	// for cards user
	const incrementX = 17;
	const incrementY = 20;

	let gameEnded = $state(game.ended!);
	let gameStarted = $state(game.started!);
	let gameStand = $state(game.stand!);
	let betting = $state(game.firstPlay!);
	let puntos = $state(points);
	let decitions = $derived(gameStarted === true && gameEnded === false);
	let message = $state('');
	let totalBet = $state(game.totalbet);
	let submitted21 = $state(false);

	async function startGame() {
		betting = false;
		totalBet = bet[0];

		const resp = await fetch(`/games/blackjack`, {
			method: 'POST',
			body: JSON.stringify({
				points: bet[0],
				gameId: game.id,
				decition: 'start'
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		points -= betting_num;

		const enJson = await resp.json();
		//console.log(enJson);

		playerHand = new Hand(StringToCards(enJson.data.player_cards));
		dealerHand = new Hand(StringToCards(enJson.data.dealer_cards));

		await wait(300);

		gameStarted = true;
		gameEnded = false;

		game.started = true;
		game.ended = false;

		if (playerHand.sumOfCards() === 21) {
			// TODO: ad toast

			play(Decision.STAND);
		}
	}

	async function play(decition: Decision) {
		let decitionToSend: string = '';

		switch (decition) {
			case Decision.STAND:
				decitionToSend = 'stand';
				game.stand = true;
				game.ended = false;

				break;
			case Decision.HIT:
				decitionToSend = 'hit';
				break;

			case Decision.DOUBLE:
				decitionToSend = 'double';
				totalBet += totalBet;

				break;

			case Decision.UNKOWN:
				return;
		}

		const resp = await fetch(`/games/blackjack`, {
			method: 'POST',
			body: JSON.stringify({
				points: 0,
				gameId: game.id,
				decition: decitionToSend
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		points -= betting_num;

		const enJson = await resp.json();
		//console.log('enJson: ', enJson);

		playerHand = new Hand(StringToCards(enJson.data.player_cards));
		dealerHand = new Hand(StringToCards(enJson.data.dealer_cards));
		dealerHandLength = dealerHand.cards.length;

		await wait(300);

		if (decition === Decision.STAND) {
			gameStand = true;
			gameEnded = false;
		}

		gameEnded = !enJson.canreplay;

		if (enJson.canreplay === false) {
			gameEnded = true;

			if (enJson.playerWon === true) {
				/// player won
				console.log('PLAYER WON!!!');
				message = 'won';
			} else if (enJson.playerNeutral === true) {
				/// player neutral
				console.log('PLAYER Neutral');
				message = 'neutral';
			} else {
				console.log('PLAYER LOST');
				message = 'lost';
				// player lost
			}
		}
	}

	let totalBetWon = $derived(totalBet * 2);

	let waiting = $state(false);

	function wait(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function callGet() {
		waiting = true;
		invalidate('/games/blackjack');
		await wait(1000);
		goto(location.href, { replaceState: true });

		const resp = await fetch('/games/blackjack', { method: 'GET' });
		const id = await resp.json();

		console.log('id: ', id);
		goto(`/games/blackjack/${id.id}`);

		await wait(1000);
		window.location.reload();
	}

	// flow of game
	// place bet, confirm

	//give cards to everyone

	//if dealer has a ten
</script>

{#if waiting}
	<h2 class="typography border-0">Loading....</h2>
{:else}
	<div class="flex h-full flex-col justify-center gap-y-12">
		<div class="flex flex-row justify-between">
			<div class="relative h-fit w-full">
				{#if gameStarted}
					<div class="mb-[-60px]">
						<h2 class="text-center">Player Cards</h2>
						<p class="text-center">Card Count: {playerHand.sumOfCards()}</p>
					</div>
					{#each playerHand.cards as carta, i}
						<Card
							class={'absolute'}
							turned={false}
							style={`bottom: ${i * incrementY + 30}px; left: ${i * incrementX + 15}px;`}
							color={carta.color}
							symbol={carta.symbol}
						/>
					{/each}
				{/if}
			</div>
			<div class="relative w-full justify-center">
				{#if gameStarted}
					<div class="mb-[-60px] text-center">
						<h2>Dealer Cards</h2>
						<p>Card Count: {dealerHand.sumOfCards()}</p>
					</div>
				{/if}

				{#if decitions === true}
					<Card
						class={'absolute'}
						turned={true}
						style={`bottom: 30px; left: 15px;`}
						color={Color.SPADES}
						symbol={Carta.PLACEHOLDER}
					/>
					<Card
						class={'absolute'}
						turned={false}
						style={`bottom: ${incrementY + 30}px; left: ${incrementX + 15}px;`}
						color={dealerHand.cards[0].color}
						symbol={dealerHand.cards[0].symbol}
					/>
				{:else}
					{#each dealerHand.cards as carta, i}
						<Card
							class={'absolute'}
							turned={false}
							style={`bottom: ${incrementY * i + 30}px; left: ${incrementX * i + 15}px;`}
							color={carta.color}
							symbol={carta.symbol}
						/>
					{/each}
				{/if}
			</div>
		</div>

		<div class="flex min-w-[300px] flex-col justify-center">
			{#if gameStarted}
				{#if gameEnded === false}
					<div class="my-4 text-center">
						<p class="">Current Pot:</p>
						<b>{totalBet} points</b>
					</div>
				{:else if message === 'won' || game.playerWon}
					<div
						class="mx-auto my-4 rounded-md border border-green-500 bg-green-100 p-3 px-6 text-center"
					>
						<h2>Congratss!!! you won {totalBetWon} points 🎉</h2>
						<h3>Try your luck with another game!!</h3>
					</div>
				{:else if message === 'neutral' || game.neutral}
					<div class="mx-auto my-4 rounded-md border bg-white p-3 px-6 text-center">
						<h2>You gained {totalBet} back!</h2>
						<h3>Try again with another game!</h3>
					</div>
				{:else if message === 'lost' || game.playerWon === false}
					<div class="mx-auto my-4 rounded-md border bg-white p-3 px-6 text-center">
						<h2>You lost {totalBet} points :(</h2>
						<h3>Better luck next time..</h3>
					</div>
				{/if}
			{/if}

			{#if gameStarted === false}
				<div class="flex w-full justify-center">
					<Bet bind:value={bet} points={puntos} startGameFunc={startGame} />
				</div>
			{/if}

			{#if decitions}
				<div class="flex w-full justify-center">
					<Decitions {points} {totalBet} playFunc={play} />
				</div>
			{/if}
			{#if gameEnded === true}
				<div class="flex w-full justify-center">
					<Button onclick={callGet} class="w-fit" size="lg" disabled={waiting}>
						{#if waiting}
							Creating Room
						{:else}
							Replay ??
						{/if}
					</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!--
<Card class={cn('')} turned={true} style={``} color={Color.CLOVERS} symbol={Carta.Queen} />
-->
