<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let cups = [1, 2, 3];
	let selectedCup: number | null = null;
	let isAnimating = $state(false);
	let gameStarted = $state(false);
	let timeLeft = $state(30);
	let msgstart = $state(true);
	let timer;
	let resultMessage = $state('');
	let jeu_a_commencer = $state(false);
	let showRose = $state(false);
	let start = $state(false);
	let button_msg = $state('Payer 1 point pour jouer');
	let showButtons = $state(false);

	let showConfirmation = false;
	let cupToValidate: number | null = null;

	let isSmallScreen = false;

	// Vérifier la taille de l'écran
	function updateScreenSize() {
		isSmallScreen = window.innerWidth < 518;
	}

	onMount(() => {
		updateScreenSize();
		window.addEventListener('resize', updateScreenSize);
		resetCupsPosition();
	});

	function confirmSelection() {
		if (cupToValidate !== null) {
			selectCup(cupToValidate);
			showConfirmation = false;
		}
	}

	function resetCupsPosition() {
		cups.forEach((cup, index) => {
			// Pour les petits écrans, rapprocher les gobelets (offset réduit)
			let offset = isSmallScreen ? index * 2 : index * 5;
			gsap.set(`#cup${cup}`, { x: offset, y: 0 });
		});
	}

	async function startGame() {
		if (isAnimating) return;
		if (jeu_a_commencer) {
			jeu_a_commencer = false;
			resetGame();
		}
		msgstart = false;

		gameStarted = true;
		button_msg = 'Recommencer';
		jeu_a_commencer = true;
		isAnimating = true;
		resultMessage = '';
		selectedCup = null;
		showRose = false;

		// Animation adaptée selon la taille de l'écran
		if (isSmallScreen) {
			// Animation pour petits écrans : mouvement réduit
			gsap.to(`#cup2`, {
				y: -50,
				duration: 0.5,
				onComplete: () => {
					start = true;
					showRose = true;
					setTimeout(() => {
						start = false;
						showRose = false;
						gsap.to(`#cup2`, {
							y: 0,
							duration: 0.5,
							onComplete: () => {
								gsap.to('#cup1', { x: 90, duration: 1 });
								gsap.to('#cup3', {
									x: -90,
									duration: 1,
									onComplete: () => {
										gsap.to('#cup1', { x: 0, duration: 1 });
										gsap.to('#cup3', {
											x: 10,
											duration: 1,
											onComplete: () => {
												isAnimating = false;
												showButtons = true;
												startTimer();
											}
										});
									}
								});
							}
						});
					}, 1000);
				}
			});
		} else {
			// Animation pour écrans normaux
			gsap.to(`#cup2`, {
				y: -100,
				duration: 0.5,
				onComplete: () => {
					start = true;
					showRose = true;
					setTimeout(() => {
						start = false;
						showRose = false;
						gsap.to('#cup1', { x: 185, duration: 1 });
						gsap.to('#cup3', {
							x: -170,
							duration: 1,
							onComplete: () => {
								gsap.to('#cup1', { x: 0, duration: 1 });
								gsap.to('#cup3', {
									x: 20,
									duration: 1,
									onComplete: () => {
										isAnimating = false;
										showButtons = true;
										startTimer();
									}
								});
							}
						});
					}, 1000);
				}
			});
		}
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

	async function selectCup(cup) {
		if (!gameStarted || isAnimating || selectedCup !== null) return;
		selectedCup = cup;
		showButtons = false;

		try {
			const formData = new FormData();
			formData.append('cup', `${cup}`);

			const response = await fetch(`/games/shuffleCoin`, {
				method: 'POST',
				body: formData
			});

			let data = await response.json();
			// const data = await JSON.parse(actionResponse.data);

			console.log('data: ', data);

			let animationY = isSmallScreen ? -50 : -100;
			gsap.to(`#cup${cup}`, {
				y: animationY,
				duration: 0.5,
				onComplete: () => {
					resultMessage = data.message;
					if (data.isWinner) {
						showRose = true;
					}

					endGame(data.isWinner);
				}
			});
		} catch (error) {
			console.error(error);
			resultMessage = 'Erreur lors de la vérification';
			endGame(false);
		}
	}

	function onCupClick(cup: number) {
		if (!gameStarted || isAnimating || selectedCup !== null) return;
		cupToValidate = cup;

		selectCup(cup);
		//showConfirmation = true;
	}

	function endGame(isWinner) {
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
		showButtons = false;
		resetCupsPosition();
	}
</script>

<br /><br /><br />

<title>Krak'n Roses - Krak'Rose</title>
<div class="container">
	<div class="cups-container justify-between">
		{#each cups as cup}
			<div
				id="cup{cup}"
				class="cup"
				on:click={() => onCupClick(cup)}
				style="pointer-events: {showButtons ? 'auto' : 'none'}"
			>
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

	<!--
	{#if showConfirmation}
		<Dialog.Root open={true} on:openChange={(e) => { if (!e.detail) showConfirmation = false }}>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Confirmer votre choix</Dialog.Title>
					<Dialog.Description>
						Voulez-vous choisir le gobelet numéro <b>{cupToValidate}</b> ?
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer class="mt-4 flex justify-end gap-2">
					<Button variant="secondary" on:click={() => showConfirmation = false}>Annuler</Button>
					<Button on:click={confirmSelection}>Valider</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{/if}
  -->

	{#if msgstart}
		<div style="margin-left: 2%;">
			<br />
			<Dialog.Root>
				<Dialog.Trigger>
					<Button class="cursor-pointer" size="sm"><b>Comment jouer ❔</b></Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>La Roue Chanceuse</Dialog.Title>
						<Dialog.Description>
							<br />
							<b>Ah, tu veux me défier ?</b> Très bien, mais il faudra me donner un point en
							échange, haha ! <br /><br />
							🌹 Si tu trouves la rose de Cupidon, je te donnerai
							<b style="text-decoration: underline;">3 points</b> en récompense ! À toi de jouer ! 💪
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Close>
						<Button class="mt-2">Fermer</Button>
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
	.cup-buttons {
		display: flex;
		gap: 10px;
		margin-top: 10px;
	}
	.cup-button {
		padding: 8px 16px;
		background-color: #3d3a4e;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.cup-button:hover {
		background-color: #4a4563;
	}
	.message {
		margin-top: 20px;
		font-size: 20px;
		color: green;
		white-space: pre-line;
		text-align: center;
	}
	.timer {
		margin-top: 10px;
		font-size: 18px;
	}

	/* Bouton style Uiverse.io par Madflows */
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
		margin-top: 20px;
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

	/* Ajustements responsives pour petits écrans */
	@media (max-width: 518px) {
		.cup {
			width: 100px;
			height: 100px;
			margin: 5px;
		}
		.rose {
			width: 35px;
			height: 35px;
			bottom: -35px;
		}
	}
</style>
