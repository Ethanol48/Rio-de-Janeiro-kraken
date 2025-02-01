<script lang="ts">
  import type { LayoutServerData } from './$types';

  let { data }: { data: LayoutServerData } = $props();

</script>


{#if data.user !== null}
  <h1>Hi, {data.user.login}!</h1>
  <p>Your user ID is {data.user.id}.</p>
{/if}

<h1>Hello how r u doing</h1>
