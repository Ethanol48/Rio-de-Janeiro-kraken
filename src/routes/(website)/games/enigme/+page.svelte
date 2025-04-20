<script lang="ts">
	import { Confetti } from 'svelte-confetti';
	import { type PageServerData, type ActionData } from './$types.js';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let userInput = '';
	let confetti = $state(false);
	let trouve = false;
	function trouverr() {
		trouve = true;
	}
	// Réagit au changement de message pour lancer les confettis
	if (form?.message && form?.message.includes('Well')) {
		confetti = true;
	}
</script>

<form method="POST" action="?/check_result">
	<div class="container">
		<h1 class="enigme-title after:bg-primary">🔎 Daily Riddle</h1>
		{#if data.EnigmeToday === false}
		<br>
			<h3 style="font-size: 20px; font-weight: bold; text-decoration: underline;">
				There is no riddle today!
			</h3>
			<br>
			<h1 style="font-size: 36px;">
				😔
			</h1>
			<br><br><br>
			<div style="margin-left: 2%;">
				<Dialog.Root>
					<Dialog.Trigger>
						<Button class="cursor-pointer" size="sm"><b>How to play❔</b></Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Daily riddle 🔎</Dialog.Title>
							<Dialog.Description>
								<br />
								🌟 <b>You believe yourself clever ?</b> 🌟<br /><br />
								So prove it!🧠💡 An enigma is waiting for you ... A password is hidden in Epita! 🔎✨<br
								/><br />
								Your mission: to find it thanks to the enigma ... 📜🔐<br />

								⚠️ But beware!Every day, he changes campuses! 🎭 <br />
								📍 One day in <b>Villejuif</b>, another at the <b>Kremlin-Bicêtre</b>… Will you be able to follow the track? 👀👣
								<br /><br />
								🚀 The fastest wins the points!🏆 So be ready, go for it and won the victory! 🔥
								<br /><br />
								🍀 <strong style="text-decoration: underline;">Good luck !</strong>🍀
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Close>
							<Button class="mt-2">Close</Button>
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		{:else}
		{#if !confetti}
			<div class="enigme-box">
				<p class="enigme-text">
					{#if data.check === true}
						{data.msg}
						{trouverr()}
					{:else}
						{data.msg}
					{/if}
				</p>
			</div>

			<div class="input-container">
				{#if !trouve}
					<div class="wave-group">
						<input required type="text" class="input" name="userInput" bind:value={userInput} />
						<span class="bar"></span>
						<label class="label">
							<span class="label-char" style="--index: 0">P</span>
							<span class="label-char" style="--index: 1">a</span>
							<span class="label-char" style="--index: 2">s</span>
							<span class="label-char" style="--index: 3">s</span>
							<span class="label-char" style="--index: 4">w</span>
							<span class="label-char" style="--index: 5">o</span>
							<span class="label-char" style="--index: 6">r</span>
							<span class="label-char" style="--index: 7">d</span>
						</label>
					</div>
					<!-- From Uiverse.io by cssbuttons-io -->
					<button type="submit" class="learn-more">
						<span class="circle" aria-hidden="true">
							<span class="icon arrow"></span>
						</span>
						<span class="button-text">Check</span>
					</button>
				{/if}
			</div>
			<br />
			<br />
			
			{/if}
			<div style="margin-left: 2%;">
				<Dialog.Root>
					<Dialog.Trigger>
						<Button class="cursor-pointer" size="sm"><b>How to play❔</b></Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Daily riddle 🔎</Dialog.Title>
							<Dialog.Description>
								<br />
								🌟 <b>You believe yourself clever ?</b> 🌟<br /><br />
								So prove it!🧠💡 An enigma is waiting for you ... A password is hidden in Epita! 🔎✨<br
								/><br />
								Your mission: to find it thanks to the enigma ... 📜🔐<br />

								⚠️ But beware!Every day, he changes campuses! 🎭 <br />
								📍 One day in <b>Villejuif</b>, another at the <b>Kremlin-Bicêtre</b>… Will you be
								able to follow the track? 👀👣
								<br /><br />
								🚀 The fastest wins the points!🏆 So be ready, go for it and won the victory! 🔥
								<br /><br />
								🍀 <strong style="text-decoration: underline;">Good luck !</strong>🍀
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Close>
							<Button class="mt-2">Close</Button>
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		{/if}
		{#if form?.message && form?.message.includes('Bravo')}
			<p class="message" style="color: green;">{form?.message}</p>
		{:else}
			<p class="message" style="color: red;">{form?.message}</p>
		{/if}
	</div>

	<div
		style="
 position: fixed;
 top: -50px;
 left: 0;
 height: 100vh;
 width: 100vw;
 display: flex;
 justify-content: center;
 overflow: hidden;
 pointer-events: none;"
	>
		{#if confetti}
			<Confetti
				x={[-5, 5]}
				y={[0, 0.1]}
				duration={2000}
				delay={[0, 2000]}
				infinite
				amount={300}
				fallDistance={'100vh'}
			/>
		{/if}
	</div>
</form>
<title>Sambas Dos Krakos - DailyRiddle</title>

<style>
	@keyframes slideUnderline {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: translateY(-20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.message {
		margin-top: 15px;
		font-size: 1.5rem;
		font-weight: bold;
		color: #333;
		text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		text-align: center;
		padding: 10px;
	}
	.enigme-title {
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--background);
		margin-bottom: 20px;
		text-decoration: none;
		position: relative;
	}
	.enigme-title::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -5px;
		width: 100%;
		height: 4px;
		animation: slideUnderline 1s ease-in-out;
	}
	.enigme-box {
		border: 2px solid #32881d;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		margin: 30px 0;
		animation: fadeIn 1s ease-in-out;
		width: 100%;
		max-width: 600px;
	}
	.enigme-text {
		font-size: 1.5rem;
		font-weight: bold;
		color: #333;
	}
	.input-container {
		display: flex;
		gap: 10px;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 600px;
		margin-top: 20px;
	}
	/* Stylisation de la wave-group */
	.wave-group {
		position: relative;
		width: 100%;
		max-width: 200px;
	}
	.wave-group .input {
		font-size: 16px;
		padding: 10px 10px 10px 5px;
		display: block;
		width: 100%;
		border: none;
		border-bottom: 1px solid #000000;
		background: transparent;
	}
	.wave-group .input:focus {
		outline: none;
	}
	.wave-group .label {
		color: #000000;
		font-size: 18px;
		font-weight: normal;
		position: absolute;
		pointer-events: none;
		left: 5px;
		top: 10px;
		display: flex;
	}
	.wave-group .label-char {
		transition: 0.2s ease all;
		transition-delay: calc(var(--index) * 0.05s);
	}
	.wave-group .input:focus ~ .label .label-char,
	.wave-group .input:valid ~ .label .label-char {
		transform: translateY(-20px);
		font-size: 14px;
		color: #000;
	}
	.wave-group .bar {
		position: relative;
		display: block;
		width: 100%;
	}
	.wave-group .bar:before,
	.wave-group .bar:after {
		content: '';
		height: 2px;
		width: 0;
		bottom: 1px;
		position: absolute;
		background: var(--background);
		transition: 0.2s ease all;
	}
	.wave-group .bar:before {
		left: 50%;
	}
	.wave-group .bar:after {
		right: 50%;
	}
	.wave-group .input:focus ~ .bar:before,
	.wave-group .input:focus ~ .bar:after {
		width: 50%;
	}

	@keyframes fly-1 {
		from {
			transform: translateY(0.1em);
		}
		to {
			transform: translateY(-0.1em);
		}
	}
	.message {
		margin-top: 15px;
		font-size: 1.5rem;
		font-weight: bold;
		color: #333;
		text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
	}

	/* Responsive styles */
	@media (max-width: 667px) {
		.enigme-title {
			font-size: 1.8rem;
			margin-bottom: 10px;
		}
		.enigme-box {
			padding: 10px;
			margin: 10px 0;
		}
		.enigme-text {
			font-size: 1rem;
		}
		.input-container {
			flex-direction: column;
			gap: 15px;
		}
		.wave-group {
			max-width: 90%;
		}
	}
	@media (max-width: 400px) {
		.enigme-title {
			font-size: 1.2rem;
		}
		.enigme-box {
			padding: 8px;
		}
		.enigme-text {
			font-size: 0.9rem;
		}
		.wave-group {
			max-width: 100%;
		}
	}

	/* From Uiverse.io by cssbuttons-io */
	button {
		position: relative;
		display: inline-block;
		cursor: pointer;
		outline: none;
		border: 0;
		vertical-align: middle;
		text-decoration: none;
		background: transparent;
		padding: 0;
		font-size: inherit;
		font-family: inherit;
	}

	button.learn-more {
		width: 12rem;
		height: auto;
	}

	button.learn-more .circle {
		transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
		position: relative;
		display: block;
		margin: 0;
		width: 3rem;
		height: 3rem;
		background: #0a9338;
		border-radius: 1.625rem;
	}

	button.learn-more .circle .icon {
		transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
		position: absolute;
		top: 0;
		bottom: 0;
		margin: auto;
		background: #fff;
	}

	button.learn-more .circle .icon.arrow {
		transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
		left: 0.625rem;
		width: 1.125rem;
		height: 0.125rem;
		background: none;
	}

	button.learn-more .circle .icon.arrow::before {
		position: absolute;
		content: '';
		top: -0.29rem;
		right: 0.0625rem;
		width: 0.625rem;
		height: 0.625rem;
		border-top: 0.125rem solid #fff;
		border-right: 0.125rem solid #fff;
		transform: rotate(45deg);
	}

	button.learn-more .button-text {
		transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0.75rem 0;
		margin: 0 0 0 1.85rem;
		color: #282936;
		font-weight: 700;
		line-height: 1.6;
		text-align: center;
		text-transform: uppercase;
	}

	button:hover .circle {
		width: 100%;
	}

	button:hover .circle .icon.arrow {
		background: #fff;
		transform: translate(1rem, 0);
	}

	button:hover .button-text {
		color: #fff;
	}
</style>
