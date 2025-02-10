<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
</script>

<title>Krak'n Roses - LeaderBoard</title>
<div class="flex w-2/4 flex-col justify-center">
	<h1 class="typography mb-3 ml-auto mr-auto text-lg text-gray-900">Leaderboard</h1>

	<div class="my-6 w-full overflow-y-auto">
		<table class="w-full">
			<thead>
				<tr>
					<th class="w-[20px]"> # </th>
					<th> Login </th>
					<th style="text-align: center;" class="w-[100px]"> Points </th>
				</tr>
			</thead>
			<tbody>
				{#each data.profiles as profile, i}
					<tr>
						<td style="text-align: center;"> {i + 1} </td>
						<td> {profile.username} </td>
						<td style="text-align: center;"> {profile.points} </td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style lang="postcss">
	tr {
		@apply m-0 border-t p-0 even:bg-muted;
	}

	td {
		@apply border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right;
	}

	th {
		@apply border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right;
	}
</style>
