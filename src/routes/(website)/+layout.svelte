<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { LayoutServerData } from './$types';
	import userIcon from '$lib/svgs/userIcon.svg';

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	let { data, children }: { data: LayoutServerData; children: any } = $props();
</script>

<div class="absolute right-5 top-5 flex h-fit w-fit">
	{#if data.user === null}
		<Button size="lg" href="/login">Log in</Button>
	{:else}
		<div>
			<div class="flex flex-col justify-center">
				<div class="mb-2 rounded bg-primary p-4 text-center text-white">
					<div class="flex flex-row">
						<img src={userIcon} class="mr-2 h-6 w-6" alt="" />
						<div>
							{data.user.username}
						</div>
					</div>
				</div>
				<Button size="lg" href="/signout">Sign out</Button>
			</div>
		</div>
	{/if}
</div>

<div class="absolute left-3 top-3">
	<!-- Icône de menu burger affichée sur mobile -->
	<button class="sm:hidden p-2 rounded  transition-transform hover:scale-110" style="font-size: 2rem;" onclick={toggleMenu}>
		☰
	</button>

	<!-- Liste déroulante affichée lorsque le menu est ouvert -->
	{#if isMenuOpen}
		<div class="absolute left-3 top-12 flex flex-col gap-2 p-3 rounded shadow-md backdrop-blur-md/50 
		            animate-slide-down sm:hidden">
			<Button class="bg-primary/80"  href="/home">🏠 Home</Button>
			<Button class="bg-primary/80" href="/leaderboard">📜 Leaderboard</Button>
			<Button class="bg-primary/80" href="/games">🕹️ Games</Button>
			<Button class="bg-primary/80" href="/shop">🎁 SHOP</Button>
		</div>
	{/if}

	<!-- Navigation affichée sur les grands écrans -->
	<nav class="hidden sm:block rounded p-3 shadow">
		<div class="flex w-fit max-w-20 flex-col flex-wrap gap-2 sm:max-w-xl sm:flex-row">
			<Button href="/home" class="bg-primary/80">
				<p class="ml-[-1px] text-xl">🏠</p>
				<p class="hidden sm:inline">• Home</p>
			</Button>
			<Button href="/leaderboard" class="bg-primary/80">
				<p class="ml-[-1px] text-xl">📜</p>
				<p class="hidden sm:inline">• Leaderboard</p>
			</Button>
			<Button href="/games" class="bg-primary/80">
				<p class="ml-[-1px] text-xl">🕹️</p>
				<p class="hidden sm:inline">• Games</p>
			</Button>
			<Button href="/shop" class="bg-primary/80">
				<p class="ml-[-1px] text-xl">🎁</p>
				<p class="hidden sm:inline">• SHOP</p>
			</Button>

      {#if data.admin}
        <Button href="/shop_commande" class="bg-primary/80">
          <p class="ml-[-1px] text-xl">📬</p>
          <p class="hidden sm:inline">• Orders</p>
        </Button>
      {/if}
		</div>
	</nav>
</div>
<!-- else content here -->


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
