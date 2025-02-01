<script lang="ts">
  import "../app.css";
	let { children }: { children: any } = $props();
</script>



<div class="flex flex-col justify-center align-middle h-[100vh] items-center relative">
{@render children()}
</div>
