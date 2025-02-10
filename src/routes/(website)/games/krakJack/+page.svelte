<script lang="ts">
	import { gsap } from 'gsap';
	import wheel from '$lib/images/wheel.png';
	import fleche from '$lib/images/fleche.png';

</script>

<title>Krak'n Roses - Krak Jack</title>
<div class="container">
	<h1> <b><i>Bientot Disponible</i></b></h1>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
	}

	h1{
		font-size: 44px;
		text-decoration: underline;
		color: rgb(0, 0, 0);
	}

	.wheel-frame {
		position: relative;
		width: 500px;
		height: 500px;
		margin: 2rem 0;
	}

	.wheel {
		width: 100%;
		height: 100%;
		transition: transform 0.1s;
	}

	.arrow {
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		z-index: 2;
	}

	button {
		padding: 1rem 2rem;
		font-size: 1.1rem;
		background: #e74c3c;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: transform 0.2s;
	}

	button:hover {
		transform: scale(1.05);
	}

	.error-box {
		margin-top: 1rem;
		padding: 1rem;
		background: #ffebee;
		color: #c62828;
		border: 1px solid #c62828;
		border-radius: 8px;
	}

	.result-box {
		margin-top: 1rem;
		padding: 1rem;
		background: #e8f5e9;
		color: #2e7d32;
		border: 1px solid #2e7d32;
		border-radius: 8px;
	}
</style>