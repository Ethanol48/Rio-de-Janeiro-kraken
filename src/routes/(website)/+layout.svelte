<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import type { LayoutServerData } from './$types';

	let { data, children }: { data: LayoutServerData, children: any } = $props();

</script>


{#if data.user === null}
  

  <Button class="absolute top-5 right-5" size="lg" href="/login">Log in</Button>


{:else}
  
  <Button class="absolute top-3 right-3" href="/signout">Sign out</Button>
  <!-- else content here -->


{/if}

{@render children()}
