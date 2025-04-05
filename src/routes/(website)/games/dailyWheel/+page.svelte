<script lang="ts">
	import { gsap } from 'gsap';
	import wheel from '$lib/images/wheel.png';
	import fleche from '$lib/images/fleche.png';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { type PageServerData, type ActionData } from './$types.js';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let spinning = false;
	let intromsg = true;
	let result: string | null = null;
	let errorMessage: string | null = null;
	let afficher = $state(false);

	let wheelElement: HTMLImageElement;
	import { enhance } from '$app/forms';
	
	function spinWheel() {
		intromsg = false;
		if (spinning) return;
		spinning = true;
		errorMessage = null;
		try {
			if (form === null) return '';
			const segment = form.segment;

			// Calcul de la rotation
			const targetRotation = segment * 72 + 360 * 8; // 8 tours

			gsap.to(wheelElement, {
				rotation: targetRotation,
				duration: 4,
				ease: 'power3.out',
				onComplete: () => {
					spinning = false;
					result = form.message;
					afficher = true;
				}
			});
		} catch (error) {
			console.error('Erreur:', error);
			errorMessage = 'An error occurred. Please try again later.';
			spinning = false;
		}
		return '';
	}
</script>

<title>Samba Dos Krakos - The Luck Wheel</title>

<div class="container">
	<div class="wheel-frame">
		<img class="wheel" src={wheel} alt="Roue de la chance" bind:this={wheelElement} />
		<img class="arrow" src={fleche} alt="Flèche indicateur" />
	</div>

	{#if intromsg}
		<div class="dialog-container">
			<Dialog.Root>
				<Dialog.Trigger>
					<Button class="cursor-pointer" size="sm"><b>How to play❔</b></Button>
				</Dialog.Trigger>
				<Dialog.Content class="dialog-content">
					<Dialog.Header>
						<Dialog.Title>The Lucky Wheel</Dialog.Title>
						<Dialog.Description>
							<br />
							Hahaha! You come to try your <b>luck</b>? <br /><br />
							Very well, here is the deal: you can win incredible <b>rewards</b>, and
							maybe even a secret <b>gift</b>... 🎁 But beware, you can only play once
							every 3 hours.
							<br /><br />
							So come back to see me and try your <b>luck</b>! 🍀
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Close>
						<Button class="mt-2">Close</Button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	{/if}

	<form method="POST" use:enhance action="?/LaunchRoue" class="form-container">
		<button type="submit" disabled={spinning}>
			{spinning ? 'Rotation in progress...' : 'Play'}
		</button>

		{#if form?.status === 'failure'}
			
			<div class="error-box">
				{form.message}
			</div>
		{/if}

		{#if form?.status === 'success' }
			{spinWheel()}
		{/if}

		{#if afficher && form?.status === 'success'}
			<div class="result-box">
				<strong>{form!.message}</strong>
			</div>
		{/if}
	</form>
</div>

<style>
	/* Conteneur principal centré */
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
		box-sizing: border-box;
		text-align: center;
	}

	/* Cadre de la roue */
	.wheel-frame {
		position: relative;
		width: 90vw;
		max-width: 500px;
		height: 90vw;
		max-height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 2rem;
	}

	/* La roue */
	.wheel {
		width: 100%;
		height: 100%;
		transition: transform 0.1s;
	}

	/* La flèche centrée */
	.arrow {
		position: absolute;
		top: 0%;
		left: 50%;
		transform: translateX(-50%);
		width: 15%;
		z-index: 2;
	}

	/* Conteneur du dialogue */
	.dialog-container {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.dialog-content {
		text-align: center;
	}

	/* Formulaire et bouton */
	.form-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	button {
		padding: 1rem 2rem;
		font-size: 1.1rem;
		background: #e74c3c;
		color: white;
		margin-top: 1.5rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: transform 0.2s;
	}

	button:hover {
		transform: scale(1.05);
	}

	/* Boîtes de message */
	.error-box,
	.result-box {
		margin-top: 1rem;
		padding: 1rem;
		border-radius: 8px;
		text-align: center;
		width: 80%;
		max-width: 400px;
	}

	.error-box {
		background: #ffebee;
		color: #c62828;
		border: 1px solid #c62828;
	}

	.result-box {
		background: #e8f5e9;
		color: #2e7d32;
		border: 1px solid #2e7d32;
	}

	/* Responsive */
	@media (max-width: 667px) {
		.container {
			padding: 1rem;
		}

		.wheel-frame {
			width: 90vw;
			height: 90vw;
		}

		.arrow {
			width: 10%;
			top: 5%;
		}

		button {
			font-size: 1rem;
			padding: 0.8rem 1.5rem;
		}
	}
</style>
