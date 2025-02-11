<script lang="ts">
	import { gsap } from 'gsap';
	import wheel from '$lib/images/wheel.png';
	import fleche from '$lib/images/fleche.png';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	const SEGMENTS = 5;
	const SEGMENT_NAMES = [
		'2 points',
		'20 points, INCROYABLE!!🪙',
		'10 points',
		'6 points',
		'4 points'
	];

	let spinning = false;
	let intromsg = true;
	let result: string | null = null;
	let errorMessage: string | null = null;
	let wheelElement: HTMLImageElement;

	async function spinWheel() {
		intromsg = false;
		if (spinning) return;
		spinning = true;
		errorMessage = null; // Réinitialiser le message d'erreur

		try {
			// Appel de l'API
			const response = await fetch('/games/roue_random/api/spin');
			const data = await response.json();

			if (!response.ok) {
				// Si l'utilisateur ne peut pas jouer
				if (response.status === 403) {
					errorMessage = data.error; // Afficher le message d'erreur
				} else {
					throw new Error(`Erreur HTTP : ${response.status}`);
				}
				return;
			}
			// Si l'utilisateur peut jouer
			const { segment } = data;

			// Calcul de la rotation
			const targetRotation = segment * 72 + 360 * 8; // 8 tours

			gsap.to(wheelElement, {
				rotation: targetRotation,
				duration: 4,
				ease: 'power3.out',
				onComplete: () => {
					spinning = false;
					result = SEGMENT_NAMES[segment]; // Afficher le résultat
				}
			});
		} catch (error) {
			console.error('Erreur:', error);
			errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
			spinning = false;
		}
	}
</script>

<title>Krak'n Roses - RoueChanceuse</title>
<div class="container">
	<div class="wheel-frame">
		<img class="wheel" src={wheel} alt="Roue de la chance" bind:this={wheelElement} />
		<img class="arrow" src={fleche} alt="Flèche indicateur" />
	</div>

	{#if intromsg}
		<div style="margin-left: 2%;">
			<Dialog.Root>
				<Dialog.Trigger>
					<Button class="cursor-pointer" size="sm"><b>Comment jouer ❔</b></Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>La Roue Chanceuse</Dialog.Title>
						<Dialog.Description>
							<br />
							HAHAHA ! Tu viens tenter ta <b>chance</b> ? <br /> <br />
							Très bien, voici le deal : tu peux gagner d'incroyables <b>récompenses</b>, et
							peut-être même un cadeau <b>secret</b>... 🎁 Mais attention, tu ne peux jouer qu'une
							fois toutes les 3 heures.
							<br /><br />
							Alors, reviens me voir et tente ta <b>chance</b> ! 🍀
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Close>
						<Button class="mt-2">Fermer</Button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	{/if}

	<br />
	<button on:click={spinWheel} disabled={spinning}>
		{spinning ? 'Rotation en cours...' : 'Jouer maintenant'}
	</button>

	{#if errorMessage}
		<div class="error-box">
			{errorMessage}
		</div>
	{/if}

	{#if result}
		<div class="result-box">
			Félicitations, vous avez gagné <strong>{result}</strong>
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
	}

	.wheel-frame {
		position: relative;
		width: 500px;
		height: 500px;
	}

	.wheel {
		width: 80%;
		height: 80%;
		margin-left: 15%;
		margin-right: auto;
		margin-top: 20%;
		transition: transform 0.1s;
	}

	.arrow {
		position: absolute;
		top: 100px;
		left: 55%;
		transform: translateX(-50%);
		width: 60px;
		z-index: 2;
	}

	button {
		padding: 1rem 2rem;
		font-size: 1.1rem;
		background: #e74c3c;
		color: white;
		margin-left: 2%;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: transform 0.2s;
	}

	button:hover {
		transform: scale(1.05);
	}

	.error-box {
		margin-top: 1rem;
		padding: 1rem;
		background: #ffebee;
		color: #c62828;
		border: 1px solid #c62828;
		border-radius: 8px;
	}

	.result-box {
		margin-top: 1rem;
		padding: 1rem;
		background: #e8f5e9;
		color: #2e7d32;
		border: 1px solid #2e7d32;
		border-radius: 8px;
	}
</style>
