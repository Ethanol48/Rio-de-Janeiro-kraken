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
		toast.custom(Custom, { componentProps: { texto: 'Points reclamer', emoji: ' 🎉' } });
	};
</script>

{#if data.user !== null}
	<h1>Hi, {data.user.login}!</h1>
	<p>Your user ID is {data.user.id}.</p>
{/if}

<h1>Hello how r u doing</h1>

{#if !(noUser || claimed)}
	<div class="invisible-custom absolute bottom-4 left-5">
		<Dialog.Root>
			<Dialog.Trigger>
				<Button class="cursor-pointer" size="sm">Secret</Button>
			</Dialog.Trigger>

			<Dialog.Content class="justify-center sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>T'as trouver le button secret!!!</Dialog.Title>
					<Dialog.Description class="text-center">Reclame ta recompense</Dialog.Description>
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
	div.invisible-custom {
		opacity: 0;
		* {
			opacity: 0;
		}
	}
</style>
