<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: {data : PageServerData} = $props();
</script>

<h1>LeaderBoard</h1>

<div class="flex flex-col w-40">
  {#each data.profiles as profile}
    <!-- content here -->
    <div class="flex flex-row border-black border justify-between">
      <p class="">{profile.login}</p>
      <p class="">{profile.points}</p>
    </div>
  {/each}
</div>
