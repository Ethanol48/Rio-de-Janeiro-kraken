<script>
	import { Button } from '$lib/components/ui/button/index';

	let { data } = $props();

	console.log('Congrats!! you found the secret arrow of Cupid!');
</script>

<h1 class="typography">La Flèche Perdue de Cupidon</h1>

<div class="my-5 w-2/3">
	<p class="typography">
		Pendant des siècles, Cupidon a tiré ses flèches dorées pour unir les âmes destinées à se
		rencontrer. Chacune d'elles portait en elle l'étincelle de l'amour éternel, un lien
		indestructible entre deux coeurs. Mais ce que peu de gens savent, c'est que toutes ses flèches
		n'ont pas atteint leur cible… et l'une d'elles, la plus puissante de toutes, <span
			class="font-bold">a disparu</span
		>.
	</p>

	<p class="typography">
		Ce n'était pas une flèche comme les autres. On dit qu'elle a été forgée dans la forge d'Éros
		avec le feu des étoiles les plus anciennes. Sa pointe ne se contentait pas d'unir des cœurs,
		elle avait le pouvoir de modifier le destin lui-même. Un seul tir pouvait changer l'histoire,
		réécrire le passé ou créer un amour si fort qu'il défierait le temps.
	</p>

	<p class="typography">
		Les dieux la considérèrent comme une erreur, une arme trop dangereuse pour être laissée entre
		les mains de Cupidon. Ainsi, ils tentèrent de la cacher, de la dissimuler dans les recoins
		oubliés du monde. Mais à un moment donné, quelque part, <span class="font-bold"
			>la flèche se perdit</span
		>.
	</p>

	<blockquote class="typography">
		<span class="font-bold">"Où est-elle ?! Elle ne peut pas avoir disparu !"</span> — murmura
		Cupidon fouillant son carquois avec désespoir.

		<p class="typography">
			<span class="font-bold">
				"Tu ne comprends pas… Cette flèche n'est pas comme les autres. Si elle tombe entre de
				mauvaises mains, elle pourrait altérer le destin lui-même."
			</span>
		</p>

		<p class="typography">
			<span class="font-bold"
				>"Les dieux diront que c'était une erreur… mais je connais la vérité. Ils l'ont cachée. Ils
				me l'ont enlevée. Et maintenant… quelqu'un l'a trouvée."
			</span>
			Certains disent qu'elle a été volée par des dieux jaloux. D'autres croient que Cupidon lui-même
			l'a cachée, redoutant son pouvoir. Mais une chose est sûre :
			<span class="font-bold">si tu es arrivé jusqu'ici, c'est que tu l'as peut-être trouvée.</span>
		</p>
	</blockquote>

	<p class="typography">
		<span class="font-bold">"Si tu lis ceci… c'est que la flèche t'a choisi."</span> La question
		est… <span class="font-bold">que vas-tu en faire ?</span>
	</p>
</div>

<form method="POST" action="?/foundSecret">
	<Button type="submit" disabled={data.claimed} class="mt-5 rounded bg-primary p-2 text-white">
		{#if data.claimed}
			Déjà réclamé 🎉
		{:else}
			Réclamer la Fleche
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
