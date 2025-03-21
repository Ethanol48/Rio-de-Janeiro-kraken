<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import Custom from '$lib/components/custom-sonner.svelte';
	import MadeWithLove from '$lib/components/MadeWithLove.svelte';

	let { data } = $props();

	let noUser = data.user === null;
	let claimed = data.claimed === true;

	const submitFoundButton: SubmitFunction = () => {
		toast.custom(Custom, { componentProps: { texto: 'Points réclamés', emoji: ' 🎉' } });
	};
</script>

<title>Krak'n Roses - Home</title>
<div class="header">
	<img src="/kraken.png" alt="Logo" class="logo animate-fade-in" />
</div>
<br /><br />

{#if data.user !== null}
	<h1 class="animate-slide-in">Salut, <b>{data.user.username}</b> !</h1>
	<br />
	<p style="font-size: 12px;" class="animate-slide-in">
		Tu as actuellement <b>{data.points}</b> points !
	</p>
{/if}

<h1 class="animate-slide-in">Cupidon t’attend… Saura-tu relever le défi ? 🏹</h1>
<p class="animate-slide-in">
	Plonge dans l’aventure, relève les défis et amuse-toi pour cette <b
		style="text-decoration: underline;">Saint-Valentin !</b
	>
</p>

<br />
<br />
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
						<br /><br />
						Username : {data.username}
						<br /><br />
						Email: {data.user?.login}
						<br /><br />
						ID: {data.user?.id}
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Close>
					<Button class="mt-2">Fermer</Button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root>
	{/if}

  {#if !(noUser || claimed)}
	<div class="invisible-custom absolute bottom-4 left-5">
		<Dialog.Root>
			<Dialog.Trigger>
				<Button class="cursor-pointer" size="sm">Secret</Button>
			</Dialog.Trigger>

			<Dialog.Content class="justify-center sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>T'as trouver le button secret!!!</Dialog.Title>
					<Dialog.Description class="text-center">Reclame en ta recompense</Dialog.Description>
				</Dialog.Header>
				<div class="flex justify-center">
					<form method="POST" action="?/foundButton">
						<Button
							type="submit"
							disabled={data.claimed}
							class="mt-2 rounded bg-primary p-2 text-white"
						>
							{#if data.claimed}
								Déjà réclamé 🎉
							{:else}
								Réclamer
							{/if}
						</Button>
					</form>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	</div>
{/if}


	<Dialog.Root>
		<Dialog.Trigger>
			<Button class="cursor-pointer" size="sm">❔ • Informations</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>❔ • Informations</Dialog.Title>
				<Dialog.Description>
					<br />
					Dans le royaume de l'amour, <b style="text-decoration: underline;">Cupidon</b> a décidé de
					vous mettre à l’épreuve. <br />
					Différents mini-jeux ont été créés pour tester vos capacités et déterminer si vous êtes l’élu
					! <br /> <br />

					🎯 Votre <b>mission</b> ? Gagnez un maximum de points à travers les mini-jeux,
					échangez-les dans le shop contre des récompenses et tentez de décrocher une place pour la
					soirée Krak’n Roses ! <br /> <br />

					💘 Mais ce n’est pas tout… Cupidon a perdu l’une de ses flèches dans les jeux. Serez-vous
					capable de découvrir sa cachette <b>secrète</b> ? <br /> <br />

					✨
					<b style="text-decoration: underline; font-size:20px"
						>Bonne chance et que les jeux commencent !</b
					> ✨
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
					<br />
					>
					<a
						style="text-decoration: underline;"
						href="https://armand-ms.fr"
						target="_blank"
						rel="noopener noreferrer"
						>ArmandMS
					</a>
					<br /><br />
					>
					<a
						style="text-decoration: underline;"
						href="https://github.com/Ethanol48/"
						target="_blank"
						rel="noopener noreferrer">Ethan Rouimi</a
					>
					<br /><br />
					>
					<a
						style="text-decoration: underline;"
						href="https://www.instagram.com/kraken_bde_epita/"
						target="_blank"
						rel="noopener noreferrer">Kraken - EPITA</a
					>

          <MadeWithLove class={"pt-3 pb-2"} />
				</Dialog.Description>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
</div>

<style lang="scss">
	div.invisible-custom {
		opacity: 0;
		* {
			opacity: 0;
		}
	}

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
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slide-in {
		from {
			transform: translateY(-20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
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
