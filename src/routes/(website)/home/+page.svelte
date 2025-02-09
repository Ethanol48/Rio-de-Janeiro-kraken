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
	<img src="/kraken.png" alt="Logo" class="logo" />
</div>
<br><br>

{#if data.user !== null}
	<h1>Salut, <b> {data.user.login}</b> !</h1><br>
	<p style="font-size: 12px;">Ton ID utilisateur est {data.user.id}.</p>
{/if}

<h1>Bienvenue dans notre monde d'amour et de jeux ❤️</h1>
<p>Joue et amuse-toi pour cette <b style="text-decoration: underline;">Saint-Valentin !</b></p>

{#if !(noUser || claimed)}
	<div class="invisible-custom absolute bottom-4 left-5">
		<Dialog.Root>
			<Dialog.Trigger>
				<Button class="cursor-pointer secret-button" size="sm">Secret</Button>
			</Dialog.Trigger>

			<Dialog.Content class="justify-center sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>T'as trouvé le bouton secret !!!</Dialog.Title>
					<Dialog.Description class="text-center">Réclame ta récompense</Dialog.Description>
				</Dialog.Header>
				<div class="flex justify-center">
					<form method="POST" action="?/foundButton" use:enhance={submitFoundButton}>
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

	div.invisible-custom {
		opacity: 0;
		* {
			opacity: 0;
		}
	}

	.secret-button {
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
