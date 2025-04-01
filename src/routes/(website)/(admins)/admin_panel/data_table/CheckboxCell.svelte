<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	let { checked }: { checked: boolean } = $props();
</script>

<div>
	<Checkbox {checked} disabled style="cursor: default;" />
</div>
