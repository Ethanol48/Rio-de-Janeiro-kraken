<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { LayoutServerData } from './$types';
	import userIcon from '$lib/svgs/userIcon.svg';

	let { data, children }: { data: LayoutServerData; children: any } = $props();
</script>

<div class="absolute right-7 top-7 flex h-fit w-fit">
	{#if data.user === null}
		<Button size="lg" href="/login">Log in</Button>
	{:else}
		<div>
			<div class="flex flex-col justify-center">
				<div class="mb-2 rounded bg-primary p-4 text-center text-white">
					<div class="flex flex-row">
						<img src={userIcon} class="mr-2 h-6 w-6" alt="" />
						<div>
							{data.user.login}
						</div>
					</div>
				</div>
				<Button size="lg" href="/signout">Sign out</Button>
			</div>
		</div>
	{/if}
</div>

<div class="absolute left-7 top-7">
	<nav class=" rounded p-3 shadow">
		<div class="flex w-[40px] flex-row flex-wrap gap-2 sm:w-fit">
			<Button href="/home">
				<p class="ml-[-1px] text-xl">🏠</p>
				<p class="invisible w-0 sm:visible sm:w-fit">• Home</p>
			</Button>
			<Button href="/leaderboard">
				<p class="ml-[-1px] text-xl">📜</p>
				<p class="invisible w-0 sm:visible sm:w-fit">• Leaderboard</p>
			</Button>
			<Button href="/games">
				<p class="ml-[-1px] text-xl">🕹️</p>
				<p class="invisible w-0 sm:visible sm:w-fit">• Games</p>
			</Button>
			<Button href="/shop">
				<p class="ml-[-1px] text-xl">🎁</p>
				<p class="invisible w-0 sm:visible sm:w-fit">• SHOP</p>
			</Button>
		</div>
	</nav>
</div>
<!-- else content here -->

{@render children()}
