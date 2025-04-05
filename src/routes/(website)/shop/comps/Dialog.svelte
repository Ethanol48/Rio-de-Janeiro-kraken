<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Items } from '$lib/server/db/schema';
	import type { PageData } from '../$types';
	import { enhance } from '$app/forms';

  import { Separator } from "$lib/components/ui/separator";

	let { user, item }: { user: PageData['user']; item: Items } = $props();
  let points_user: number = $state(0);

  if (user !== null) {
    points_user = user.points;
  }
</script>

<Dialog.Root>
	<Dialog.Trigger>
    {#if item.stock > 0}
       <!-- content here -->
      <Button size="lg" style="font-size: 1.1rem;">Buy</Button>
    {:else}
       <!-- else content here -->
      <Button size="lg" disabled style="font-size: 1.1rem;">Not available :(</Button>
    {/if}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Buying</Dialog.Title>
			<Dialog.Description></Dialog.Description>
		</Dialog.Header>


    {#if user !== null}
      {#if item.stock > 0}
        <div class="flex justify-center my-6 gap-2">
          <div class="w-8/12">
            <div class="flex justify-between">
              <h4 class="typography" >Actual Points:</h4> 
              <span>{points_user}</span>
            </div>
            <div class="flex justify-between">
              <h4 class="typography">Item cost:</h4>
              <span>{item.price}</span>
            </div>

            <Separator class="mt-4 mb-3" />

            <div class="flex justify-between">
              <h4 class="typography">Points after:</h4>
              <span>{points_user - item.price}</span>
            </div>
          </div>
        </div>
      {/if}
    {/if}

		<Dialog.Footer>
			{#if user !== null}
				<form
					action="/shop"
					method="POST"
					use:enhance={() => {
						return async (e) => {
							e.update({ reset: false });

              if (e.result.type !== 'failure') {
                points_user -= item.price
              }
						};
					}}
				>
					<input type="text" value={item.id} name="itemId" class="hidden" />
          {#if item.stock > 0}
             <!-- content here -->
					  <Button type="submit">Confirm purchase</Button>
          {:else}
             <!-- else content here -->
            <h3>There are no more items left :(</h3>
          {/if}
				</form>
			{:else}
				<Button href="/login">Log-in</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
