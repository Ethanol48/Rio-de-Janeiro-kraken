<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	let { data } = $props();
	function goTo(url: string) {
		window.location.href = url;
	}
</script>

<h1 class="text-xl">Hi, {data.user.login}!</h1>
<h2 class="mt-5">There are so many games, choose yours !</h2>

<div class="mt-5 flex w-fit flex-row flex-wrap justify-center gap-2">
	<button onclick={() => goTo('/games/roue_random')}>
		<span class="box"> Roue de la Chance 🍀 </span>
	</button>
	<button onclick={() => goTo("/games/krakball")}>
		<span class="box"> Trouve ta Rose 🌹 </span>
	</button>
	<button onclick={() => goTo("/games/krakJack")}>
		<span class="box">
			<p>Krak'Jack</p>
			<p>♠️</p>
		</span>
	</button>

	<button onclick={() => (window.location.href = "https://kraken-run.armand-ms.fr")}>
		<span class="box">
		  <p>Krak'Run</p>
		  <p>🪸</p>
		</span>
	  </button>
	  
</div>

<style>
	h1 {
		font-size: 20px;
	}

	/* From Uiverse.io by Cornerstone-04 */
	.box {
		width: 140px;
		height: auto;
		float: left;
		transition: 0.5s linear;
		position: relative;
		display: block;
		overflow: hidden;
		padding: 15px;
		text-align: center;
		margin: 0 5px;
		background: transparent;
		text-transform: uppercase;
		font-weight: 900;
	}

	.box:before {
		position: absolute;
		content: '';
		left: 0;
		bottom: 0;
		height: 4px;
		width: 100%;
		border-bottom: 4px solid transparent;
		border-left: 4px solid transparent;
		box-sizing: border-box;
		transform: translateX(100%);
	}

	.box:after {
		position: absolute;
		content: '';
		top: 0;
		left: 0;
		width: 100%;
		height: 4px;
		border-top: 4px solid transparent;
		border-right: 4px solid transparent;
		box-sizing: border-box;
		transform: translateX(-100%);
	}

	.box:hover {
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
	}

	.box:hover:before {
		border-color: #262626;
		height: 100%;
		transform: translateX(0);
		transition:
			0.3s transform linear,
			0.3s height linear 0.3s;
	}

	.box:hover:after {
		border-color: #262626;
		height: 100%;
		transform: translateX(0);
		transition:
			0.3s transform linear,
			0.3s height linear 0.5s;
	}

	button {
		color: black;
		text-decoration: none;
		cursor: pointer;
		outline: none;
		border: none;
		background: transparent;
	}
</style>
