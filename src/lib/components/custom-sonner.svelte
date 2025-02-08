<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let { texto, emoji } = $props();

	const dispatch = createEventDispatcher();
</script>

<div class="headless flex scale-x-105 flex-row gap-3 overflow-hidden rounded bg-pink-200">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#f44881" height="20" width="20">
		<path
			fill-rule="evenodd"
			d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
			clip-rule="evenodd"
		/>
	</svg>

	<p class="headlessTitle">{texto}</p>
	<p class="headlessTitle">{emoji}</p>
	<!-- <p class="headlessDescription"></p> -->
</div>

<style>
	.headless {
		padding: 16px;
		width: 356px;
		box-sizing: border-box;
		/*border-radius: 8px;*/
		/*background: var(--pink5);*/
		/*border: 1px solid var(--gray4);*/
		position: relative;
	}

	.headlessDescription {
		margin: 0;
		/*color: var(--gray10);*/
		font-size: 14px;
		line-height: 1;
	}

	.headlessTitle {
		font-size: 14px;
		margin: 0 0 0 0px;
		/*color: var(--gray12);*/
		font-weight: 500;
		/*line-height: 1;*/
	}
</style>
