<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>


<div class="flex flex-col justify-center align-middle h-[100vh] items-center">
  {@render children()}
</div>
