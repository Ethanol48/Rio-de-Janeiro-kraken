<script>
	import { Button } from '$lib/components/ui/button/index';

	let { data } = $props();

	console.log('Congrats!! you found the secret arrow of Cupid!');
</script>

<title>Krak'n Roses - SecretPage</title>
<h1 class="typography">The Lost Golden Mask</h1>
<div class="my-5 w-2/3">
	<br>
	<p class="typography">
		For centuries, the <span class="font-bold">Golden Mask</span> has been the ultimate symbol of Rio’s Carnival, 
		granting its wearer glory, luck, and an unstoppable festive energy. 
		Forged by the spirits of the carnival and blessed by the rhythm of the drums, 
		it embodied the very soul of the celebration.
	</p>

	<p class="typography">
		But one night, under the dazzling fireworks and hypnotic samba beats, 
		the mask mysteriously <span class="font-bold">vanished</span>. 
		No carnival king has seen it since. Some say it was stolen by envious rivals, 
		others believe it hid itself, waiting for the right soul to claim it.
	</p>

	<p class="typography">
		Old samba masters whisper that it’s lost somewhere between the wild dances, 
		the golden confetti, and the challenges of the festival. 
		Only those who prove their daring spirit, passion, and carnival energy 
		may have a chance to find it.
	</p>

	<blockquote class="typography">
		<span class="font-bold">"It can’t have just disappeared!"</span> — cried an old samba master, scanning the crowd.  
		
		<p class="typography">
			<span class="font-bold">
				"You don’t understand… This mask is the essence of the carnival. 
				If it falls into the wrong hands, the festival may never be the same."
			</span>
		</p>

		<p class="typography">
			<span class="font-bold">
				"Legends say it will choose its own wearer. And if you’ve made it this far… maybe it has chosen you."
			</span>
		</p>
	</blockquote>

	<p class="typography">
		<span class="font-bold">"If you’re reading this… the Golden Mask has found you."</span>  
		The question is… <span class="font-bold">are you worthy?</span>
	</p>
</div>


<form method="POST" action="?/foundSecret">
	<Button type="submit" disabled={data.claimed} class="mt-5 rounded bg-primary p-2 text-white">
		{#if data.claimed}
			Already claimed 🎉
		{:else}
			Claim the mask
		{/if}
	</Button>
</form>

<!--
{#if form.errorMessage}
<p class="text-red-500">{form.errorMessage}</p>
{/if}
-->

<style>
</style>
