<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { LayoutServerData } from './$types';
	import userIcon from '$lib/svgs/userIcon.svg';
	import userInventory from '$lib/svgs/inventory.png';

	let isMenuOpen = $state(false);
	let isUserMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function toggleUserMenu() {
		isUserMenuOpen = !isUserMenuOpen;
	}

	let { data, children }: { data: LayoutServerData; children: any } = $props();
</script>

<!-- Partie droite : Affichage sur grands écrans -->
<div class="absolute right-5 top-5 hidden md:flex flex-col items-end z-10">
	{#if data.user === null}
		<Button size="lg" href="/login">Log in</Button>
	{:else}
		<div class="flex flex-col justify-center gap-2">
			<div class="mb-2 rounded bg-primary p-4 text-center text-white flex flex-row items-center">
				<img src={userIcon} class="mr-2 h-6 w-6" alt="" />
				<div>{data.user.username}</div>
			</div>
			<Button href="/inventory" class="mb-2 rounded bg-primary p-4 text-center text-white flex flex-row items-center">
				<img src={userInventory} class="mr-2 h-6 w-6" alt="" />
				<div>My Inventory</div>
			</Button>
			<Button size="lg" href="/signout">Sign out</Button>
		</div>
	{/if}
</div>

<!-- Partie droite sur mobile : bouton pour afficher/cacher la liste déroulante -->
<div class="absolute right-3 top-3 z-10 md:hidden ">
	{#if data.user !== null}
		<!-- Bouton avec l'icône utilisateur -->
		<button class="p-2 rounded transition-transform hover:scale-110" style="font-size: 2rem;" onclick={toggleUserMenu}>
			<img src={userIcon} class="h-6 w-6" alt="Menu utilisateur" />
		</button>

		{#if isUserMenuOpen}
			<!-- Liste déroulante pour mobile -->
			<div class="absolute right-3 top-12 flex flex-col gap-2 p-3 rounded shadow-md backdrop-blur-md/50 bg-[#f2eeeedd] animate-slide-down">
				<div class="rounded bg-primary p-4 text-center text-white">
					{data.user.username}
				</div>
				<Button class="bg-primary" href="/inventory">
					<div class="flex flex-row items-center">
						<div>My Inventory</div>
					</div>
				</Button>
				<Button size="lg" href="/signout">Sign out</Button>
			</div>
		{/if}
	{:else}
		<Button size="lg" href="/login">Log in</Button>
	{/if}
</div>

<!-- Partie gauche inchangée -->
<div class="absolute left-3 top-3 z-10">
	<!-- Icône de menu burger affichée sur mobile -->
	<button class="md:hidden p-2 rounded transition-transform hover:scale-110" style="font-size: 2rem;" onclick={toggleMenu}>
		☰
	</button>

	<!-- Liste déroulante affichée lorsque le menu est ouvert -->
	{#if isMenuOpen}
		<div class="absolute left-3 top-12 flex flex-col gap-2 p-3 rounded shadow-md backdrop-blur-md/50 bg-[#f2eeeedd] animate-slide-down md:hidden">
			<Button class="bg-primary/80" href="/home">🏠 Home</Button>
			<Button class="bg-primary/80" href="/leaderboard">📜 Leaderboard</Button>
			<Button class="bg-primary/80" href="/games">🕹️ Games</Button>
			<Button class="bg-primary/80" href="/shop">🎁 SHOP</Button>
			{#if data.admin}
				<Button class="bg-primary/80" href="/shop_commande">📬 Orders</Button>
			{/if}
		</div>
	{/if}

	<!-- Navigation affichée sur les grands écrans -->
	<nav class="hidden md:block rounded p-3 shadow">
		<div class="flex w-fit max-w-20 flex-col flex-wrap gap-2 md:max-w-xl md:flex-row">
			<Button href="/home" class="bg-primary/80">
				<p class="ml-[-1px] text-xl">🏠</p>
				<p class="hidden md:inline">• Home</p>
			</Button>
			<Button href="/leaderboard" class="bg-primary/80">
				<p class="ml-[-1px] text-xl">📜</p>
				<p class="hidden md:inline">• Leaderboard</p>
			</Button>
			<Button href="/games" class="bg-primary/80">
				<p class="ml-[-1px] text-xl">🕹️</p>
				<p class="hidden md:inline">• Games</p>
			</Button>
			<Button href="/shop" class="bg-primary/80">
				<p class="ml-[-1px] text-xl">🎁</p>
				<p class="hidden md:inline">• SHOP</p>
			</Button>
			{#if data.admin}
				<Button href="/shop_commande" class="bg-primary/80">
					<p class="ml-[-1px] text-xl">📬</p>
					<p class="hidden md:inline">• Orders</p>
				</Button>
			{/if}
		</div>
	</nav>
</div>

<!-- Contenu principal -->
{@render children()}

<style>
	@keyframes slide-down {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-slide-down {
		animation: slide-down 0.2s ease-out;
	}
</style>
