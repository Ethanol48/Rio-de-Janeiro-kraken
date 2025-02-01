<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card";

	let { form }: { form: ActionData } = $props();

  let claseBoton = "focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow h-9 px-4 py-2"

  let login = $state("")
  let password = $state("")
</script>



<Card.Root>
  <Card.Header>
    <Card.Title class="text-2xl">
      Login
    </Card.Title>
  </Card.Header>
  <Card.Content>
  <form method="post" action="?/login" use:enhance>
    <label>
<!--
      <Card.Description class="mb-1">Login</Card.Description>
-->
      <Input bind:value={login} placeholder="name.surname" />
      <input bind:value={login} class="invisible h-0 w-0 m-0 p-0" name="login" />
    </label>
    <label>
      <Card.Description class="mb-1">Password</Card.Description>
<!--
      <div class="text-lg">Password</div>
-->
      <Input bind:value={password} placeholder="super-secure-password" type="password" />
      <input class="invisible h-0 w-0 m-0 p-0" bind:value={password} type="password" name="password" />
    </label>
    <div class="flex flex-col gap-3 mt-3">
      <button class={claseBoton}>Login</button>
      <button class={claseBoton} formaction="?/register">Register</button>
    </div>
  </form>
  </Card.Content>
</Card.Root>

<!--
<div class="bg-white rounded-xl p-5 border-[1px] w-80 shadow">
  <form method="post" action="?/login" use:enhance>
    <label>
      <div class="text-lg">Login</div>
      <Input />
      <input class="invisible h-0 w-0 m-0 p-0" name="login" />
    </label>
    <label>
      <div>Password</div>
      <Input />
      <input class="invisible" type="password" name="password" />
    </label>
    <div class="flex flex-col gap-3 ">
      <button class={claseBoton}>Login</button>
      <button class={claseBoton} formaction="?/register">Register</button>
    </div>

  </form>
</div>

-->

<div class="mt-5">
  <p style="color: red">{form?.message ?? ''}</p>
</div>



<style lang="scss">
// form {
//   display: flex;
//   flex-flow: column;
//
//   label {
//     margin-top: 20px;
//   }
// }
</style>
