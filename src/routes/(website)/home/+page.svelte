<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import Custom from '$lib/components/custom-sonner.svelte';

	let { data } = $props();

	let noUser = data.user === null;
	let claimed = data.claimed === true;

	const submitFoundButton: SubmitFunction = () => {
		toast.custom(Custom, { componentProps: { texto: 'Points réclamés', emoji: ' 🎉' } });
	};
</script>

<div class="header">
	<img src="/kraken.png" alt="Logo" class="logo animate-fade-in" />
</div>
<br><br>

{#if data.user !== null}
	<h1 class="animate-slide-in">Salut, <b> {data.user.username}</b> !</h1><br>
	<p style="font-size: 12px;" class="animate-slide-in">Tu as actuellement {data.points} points !</p>
{/if}

<h1 class="animate-slide-in">Bienvenue dans notre monde d'amour et de jeux ❤️</h1>
<p class="animate-slide-in">Joue et amuse-toi pour cette <b style="text-decoration: underline;">Saint-Valentin !</b></p>

<br>
<br>
<div class="button-group animate-fade-in">
	{#if data.user !== null}
	<Dialog.Root>
		<Dialog.Trigger>
			<Button class="cursor-pointer" size="sm">🪪 • Mon profil</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Voici tes informations confidentielles</Dialog.Title>
				<Dialog.Description>
					<br><br>
					Username :  {data.usename}
					<br><br>
					Email: {data.user?.login}
					<br><br>
					ID: {data.user?.id}


				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Close>
				<Button class="mt-2">Fermer</Button>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Root>
	{/if}
	

	<Dialog.Root>
		<Dialog.Trigger>
			<Button class="cursor-pointer" size="sm">❔ • Informations</Button>
		</Dialog.Trigger>
		<Dialog.Content >
			<Dialog.Header>
				<Dialog.Title>❔ • Informations</Dialog.Title>
				<Dialog.Description>
					Bienvenue sur notre jeu, amuse toi !
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Close>
				<Button class="mt-2">Fermer</Button>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Root>
	<Dialog.Root>
		<Dialog.Trigger>
			<Button class="cursor-pointer" size="sm">💖 • Crédits</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Thanks to:</Dialog.Title>
				<Dialog.Description>
					<br>
					• ArmandMS
					<br><br>
					• Ethan Rouimi
					<br><br>
					• Kraken - EPITA
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Close>
				<Button class="mt-2">Fermer</Button>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Root>
</div>

<style lang="scss">
	.header {
		display: flex;
		justify-content: center;
		padding: 10px;
	}

	.logo {
		width: 80px;
		height: auto;
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slide-in {
		from { transform: translateY(-20px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	.animate-fade-in {
		animation: fade-in 2s ease-out;
	}

	.animate-slide-in {
		animation: slide-in 3s ease-out;
	}

	.button-group {
		display: flex;
		gap: 10px;
		justify-content: center;
		margin-top: 20px;
	}
</style>
