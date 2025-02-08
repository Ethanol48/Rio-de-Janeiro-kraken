<script lang="ts">
	import type { ActionData } from './$types';
  import * as Tabs from "$lib/components/ui/tabs/index.js";

  import Login from "./login.svelte";
  import Register from "./register.svelte";

	let { form }: { form: ActionData } = $props();


	let login = $state('');
	let password = $state('');
</script>

<Tabs.Root>
  <Tabs.List tabindex={0} class="grid w-full grid-cols-2">
    <Tabs.Trigger value="login">Login</Tabs.Trigger>
    <Tabs.Trigger value="register">Register</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="login">
    <Login {login} {password} />
  </Tabs.Content>
  <Tabs.Content value="register">
    <Register {login} {password} />
  </Tabs.Content>
</Tabs.Root>



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

<style>
	/*form {*/
	/*  display: flex;*/
	/*  flex-flow: column;*/
	/**/
	/*  label {*/
	/*    margin-top: 20px;*/
	/*  }*/
	/*}*/
</style>
