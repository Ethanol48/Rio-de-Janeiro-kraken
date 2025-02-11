<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { LayoutServerData } from './$types';
	import userIcon from '$lib/svgs/userIcon.svg';

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
	<nav class="rounded p-3 shadow">
		<div class="flex max-w-20 flex-col sm:flex-row flex-wrap gap-2 w-fit sm:max-w-xl">
			<Button href="/home">
				<p class="ml-[-1px] text-xl">🏠</p>
				<p class="invisible w-0 h-0 sm:visible sm:w-fit sm:h-fit">• Home</p>
			</Button>
			<Button href="/leaderboard">
				<p class="ml-[-1px] text-xl">📜</p>
				<p class="invisible w-0 h-0 sm:visible sm:w-fit sm:h-fit">• Leaderboard</p>
			</Button>
			<Button href="/games">
				<p class="ml-[-1px] text-xl">🕹️</p>
				<p class="invisible w-0 h-0 sm:visible sm:w-fit sm:h-fit">• Games</p>
			</Button>
			<Button href="/shop">
				<p class="ml-[-1px] text-xl">🎁</p>
				<p class="invisible w-0 h-0 sm:visible sm:w-fit sm:h-fit">• SHOP</p>
			</Button>
		</div>
	</nav>
</div>
<!-- else content here -->

{@render children()}
