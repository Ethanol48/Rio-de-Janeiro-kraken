<script lang="ts">
	import '../app.css';
	let { children }: { children: any } = $props();
</script>

<div class="relative flex h-[100vh] flex-col items-center justify-center align-middle">
	{@render children()}
</div>

<style lang="scss">
</style>
