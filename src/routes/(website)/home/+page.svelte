<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { toast } from 'svelte-sonner';
	import MadeWithLove from '$lib/components/MadeWithLove.svelte';

	let { data, form } = $props();

	let noUser = data.user === null;
	let claimed = data.claimed === true;

	if (form?.success === true) {
		toast.success('Points réclamés    🎉');
	}
</script>

<title>Samba Dos Krakos - Home</title>
<div class="header">
	<img src="/kraken.png" alt="Logo" class="logo animate-fade-in" />
</div>

<br /><br />

{#if data.user !== null}
	<h1 class="animate-slide-in">Hi, <b>{data.user.username}</b> !</h1>
	<br />
	<p style="font-size: 12px;" class="animate-slide-in">
		You've got <b>{data.points}</b> points! Time to light up the carnival! 🎭🔥
	</p>
	<br />
{/if}

<h1 class="animate-slide-in">
	Are you ready to tear up the dance floor, conquer the samba, and set the party on fire? 💃🕺
</h1>
<p class="animate-slide-in">
	Show off your best moves, crush the challenges, and soak in the wild vibes of <b
		style="text-decoration: underline;">Rio</b
	>
	! 🌴🔥
	<br />
</p>
<br />

<p class="animate-slide-in">You in? LET’S GO! 🚀</p>

<br />
<br />
<div class="animate-fade-in mt-[20px] flex justify-center gap-[10px]">
	{#if data.user !== null}
		<Dialog.Root>
			<Dialog.Trigger>
				<Button class="cursor-pointer" size="sm">🪪 • My profil</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Here is your confidential information</Dialog.Title>
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
					<Button class="mt-2">Close</Button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root>
	{/if}

	{#if !(noUser || claimed)}
		<div class="invisible-custom absolute bottom-4 left-5">
			<Dialog.Root>
				<Dialog.Trigger>
					<Button class="cursor-pointer" size="sm">secret</Button>
				</Dialog.Trigger>

				<Dialog.Content class="justify-center sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>You have found the secret button !!!</Dialog.Title>
						<Dialog.Description class="text-center">Claim</Dialog.Description>
					</Dialog.Header>
					<div class="flex justify-center">
						<form method="POST" action="?/foundButton">
							<Button
								type="submit"
								disabled={data.claimed}
								class="mt-2 rounded bg-primary p-2 text-white"
							>
								{#if data.claimed}
									Already claimed 🎉
								{:else}
									Claim
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
		<Dialog.Content class="w-10/12">
			<Dialog.Header>
				<Dialog.Title>❔ • Informations</Dialog.Title>
				<Dialog.Description>
					<br />

					<strong style="font-size: 15px; text-align:center"
						>🎭🔥 Rio Carnival: The Quest for the Golden Mask! 🔥🎭</strong
					>
					<br /><br />
					In the electrifying streets of Rio, where samba beats fill the air and confetti rains from
					the sky, an ancient legend comes to life…

					<br /><br />
					🌟 The Golden Mask, the ultimate symbol of the carnival, has vanished! Only those who prove
					their skill, daring, and festive spirit can uncover its secret and claim the spotlight.
					<br /><br />
					🎯 Your mission? Shine in the mini-games, rack up as many points as possible, and trade them
					in for dazzling rewards in the shop. Every challenge conquered brings you closer to the crown
					of the carnival!
					<br /><br />
					🎭 But beware… Rumor has it the Golden Mask is hidden somewhere within the games, waiting to
					be found by the ultimate party legend. Can you crack the mystery and become Rio’s next carnival
					icon?
					<br /><br />

					✨
					<b style="text-decoration: underline; font-size:15px">Good luck—let the carnival begin!</b
					> ✨
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Close>
				<Button class="mt-2">Close</Button>
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

					<MadeWithLove class={'pb-2 pt-3'} />
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
</style>
