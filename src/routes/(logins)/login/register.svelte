<script>
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';

	let { login, password } = $props();

	let claseBoton =
		'focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow h-9 px-4 py-2';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl" style="color: black;">Register</Card.Title>
	</Card.Header>
	<Card.Content class="w-[250px]">
		<form method="post" action="?/register">
			<label>
				<!--
      <Card.Description class="mb-1">Login</Card.Description>
-->
				<Input bind:value={login} placeholder="username" style="color: black;" />
				<input bind:value={login} class="invisible m-0 h-0 w-0 p-0" name="login" />
			</label>
			<label>
				<Card.Description class="mb-1 font-bold" style="color: black;">Password</Card.Description>
				<!--
      <div class="text-lg">Password</div>
-->
				<Input
					bind:value={password}
					placeholder="super-secure-password"
					type="password"
					style="color: black;"
				/>
				<input
					class="invisible m-0 h-0 w-0 p-0"
					bind:value={password}
					type="password"
					name="password"
				/>
			</label>
			<div class="mt-3 flex flex-col gap-3">
				<button class={claseBoton} formaction="?/register">Register</button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
