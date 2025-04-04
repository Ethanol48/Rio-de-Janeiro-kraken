<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let cups = [1, 2, 3];
	let selectedCup: number | null = null;
	let isAnimating = false;
	let gameStarted = false;
	let timeLeft = 30;
	let msgstart = true;
	let timer;
	let resultMessage = '';
	let jeu_a_commencer = false;
	let winningCup = cups[Math.floor(Math.random() * cups.length)];
	let showRose = false;
	let start = false;
	let button_msg = 'Payer 1 point pour jouer';

	onMount(() => {
		resetCupsPosition();
	});

	function resetCupsPosition() {
		cups.forEach((cup, index) => {
			gsap.set(`#cup${cup}`, { x: index * 5, y: 0 });
		});
	}

	async function Checkplay() {
		const response = await fetch('/games/krakball/api/removepoint');
		const data = await response.json();
		console.log(data);
		if (data === 'None') {
			resultMessage = "Vous avez déjà jouer 15 fois aujourd'hui, attendais le lendeamin !";
			return '-1';
		}
		if (data === 'NONON') {
			resultMessage =
				'Et tes points ils sont où?\n Reviens quand tu auras assez de points pour me défier';
			return '-1';
		}
		return '1';
	}
	async function startGame() {
		if (isAnimating) return;
		if (jeu_a_commencer) {
			jeu_a_commencer = false;
			resetGame();
		}
		msgstart = false;

		const checksipeutjouer = await Checkplay();
		if (checksipeutjouer == '-1') {
			return;
		}

		gameStarted = true;
		button_msg = 'Recommencer';
		jeu_a_commencer = true;
		isAnimating = true;
		resultMessage = '';
		selectedCup = null;
		showRose = false;
		winningCup = cups[Math.floor(Math.random() * cups.length)];

		// Étape 1: Lever les gobelets pour afficher la rose au milieu
		gsap.to(`#cup${2}`, {
			y: -100,
			duration: 0.5,
			onComplete: () => {
				start = true;
				// Afficher la rose au milieu
				showRose = true;

				// Attendre un moment pour que la rose soit visible
				setTimeout(() => {
					start = false;
					// Cacher la rose
					showRose = false;

					// Étape 2: Redescendre les gobelets
					gsap.to(`#cup${2}`, {
						y: 0,
						duration: 0.5,
						onComplete: () => {
							// Étape 3: Déplacer le premier et le dernier gobelet vers le milieu
							gsap.to('#cup1', {
								x: 185,
								duration: 1
							});
							gsap.to('#cup3', {
								x: -170,
								duration: 1,
								onComplete: () => {
									// Étape 4: Remettre les gobelets à leur place
									gsap.to('#cup1', {
										x: 0,
										duration: 1
									});
									gsap.to('#cup3', {
										x: 20,
										duration: 1,
										onComplete: () => {
											isAnimating = false;
											startTimer();
										}
									});
								}
							});
						}
					});
				}, 1000); // Temps pendant lequel la rose est visible (1 seconde)
			}
		});
	}

	function startTimer() {
		timeLeft = 30;
		timer = setInterval(() => {
			timeLeft--;
			if (timeLeft <= 0) {
				clearInterval(timer);
				endGame(false);
			}
		}, 1000);
	}

	function selectCup(cup) {
		if (!gameStarted || isAnimating || selectedCup !== null) return;
		selectedCup = cup;

		gsap.to(`#cup${cup}`, {
			y: -100,
			duration: 0.5,
			onComplete: () => {
				if (cup === winningCup) {
					showRose = true;
					resultMessage = 'Quoi?? Tu as trouvé la rose ! 🌹 \n Pfff, bon voila tes 3 points';
				} else {
					resultMessage = 'Dommage, pas cette fois haha !';
				}
				endGame(cup === winningCup);
			}
		});
	}

	async function endGame(isWinner) {
		if (isWinner) {
			const response = await fetch('/games/krakball/api/addpoint');
			const data = await response.json();
			console.log(data);
		}
		gameStarted = false;
		clearInterval(timer);
	}

	function resetGame() {
		clearInterval(timer);
		gameStarted = false;
		isAnimating = false;
		selectedCup = null;
		resultMessage = '';
		showRose = false;
		resetCupsPosition();
	}
</script>

<br /><br /><br />

<title>Samba Dos Krakos - ShuffleCoin</title>
<div class="container">
	<div class="cups-container justify-between">
		{#each cups as cup}
			<div id="cup{cup}" class="cup" on:click={() => selectCup(cup)}>
				{#if (selectedCup === cup && showRose) || (2 === cup && showRose && start)}
					<div class="rose"></div>
				{/if}
			</div>
		{/each}
	</div>
	<button class="button" on:click={startGame} disabled={isAnimating || gameStarted}>
		<span class="button-content"> {button_msg} </span>
	</button>
	{#if resultMessage === 'Dommage, pas cette fois haha !'}
		<div class="message" style="color: red;">{resultMessage}</div>
	{:else}
		<div class="message">{resultMessage}</div>
	{/if}

	{#if msgstart}
		<div style="margin-left: 2%;">
			<br />
			<Dialog.Root>
				<Dialog.Trigger>
					<Button class="cursor-pointer" size="sm"><b>How to play ❔</b></Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Shuffle Coin 🪙</Dialog.Title>
						<Dialog.Description>
							<br />
							<b>Ah, you want to challenge me? </b> Very well, but you will have to give me a point in
							exchange, haha! <br /><br />

							🪙If you find the Gold, I will give you
							<b style="text-decoration: underline;">3 points</b> as a reward! It's up to you to play! 💪
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Close>
						<Button class="mt-2">Close</Button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	{/if}
	{#if gameStarted}
		<div class="timer">Temps restant : {timeLeft} secondes</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.cups-container {
		display: flex;
	}
	.cup {
		width: 150px;
		height: 150px;
		background-image: url('/gobelet_krak.png');
		background-size: cover;
		margin: 10px;
		cursor: pointer;
		position: relative;
	}
	.rose {
		width: 50px;
		height: 50px;
		background-image: url('/CoinKraken.svg');
		background-size: cover;
		position: absolute;
		bottom: -50px;
		left: 50%;
		transform: translateX(-50%);
	}

	.message {
		margin-top: 20px;
		font-size: 20px;
		color: green;
	}
	.timer {
		margin-top: 10px;
		font-size: 18px;
	}

	/* From Uiverse.io by Madflows */
	.button {
		position: relative;
		overflow: hidden;
		height: 3rem;
		padding: 0 2rem;
		border-radius: 1.5rem;
		background: #3d3a4e;
		background-size: 400%;
		color: #fff;
		border: none;
		cursor: pointer;
	}

	.button:hover::before {
		transform: scaleX(1);
	}

	.button-content {
		position: relative;
		z-index: 1;
	}

	.button::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		transform: scaleX(0);
		transform-origin: 0 50%;
		width: 100%;
		height: inherit;
		border-radius: inherit;
		background: linear-gradient(82.3deg, rgb(249, 123, 213) 10.8%, rgba(99, 88, 238, 1) 94.3%);
		transition: all 0.475s;
	}
</style>
