<script lang="ts">
	import '../app.css';
	let { children }: { children: any } = $props();
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<div class="relative flex h-[100vh] flex-col items-center justify-center align-middle">
	{@render children()}
</div>

<Toaster />

<style lang="scss">
</style>
