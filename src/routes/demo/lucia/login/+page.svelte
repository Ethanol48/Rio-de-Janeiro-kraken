<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
  import { Button } from "$lib/components/ui/button/index"
  import { Input } from "$lib/components/ui/input/index.js";

	let { form }: { form: ActionData } = $props();

  let claseBoton = "focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow h-9 px-4 py-2"
</script>


<div class="bg-white rounded-xl p-5 border-[1px]">
  <form method="post" action="?/login" use:enhance>
    <label>
      <div>Login</div>
      <Input />
      <input class="invisible h-0 w-0"  name="login" />
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

<div class="mt-5">
  <p style="color: red">{form?.message ?? ''}</p>
</div>

<style lang="scss">
form {
  display: flex;
  flex-flow: column;

  label {
    margin-top: 20px;
  }
}
</style>
