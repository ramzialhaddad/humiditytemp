<script lang="ts">
    import type { PageData } from './$types';
    import Graph from "./Graph.svelte";

    let { data }: { data: PageData } = $props();

</script>
<div class="bg-gray-600">
	<div class="flex flex-col justify-between gap-4 p-10">
		{#each data.devices.items as device}
			<div class="flex-col bg-gray-300 shadow-xl shadow-gray-800 rounded">
				<div class="text-xl font-sans underline pt-2 pl-2">{device.deviceName} {device.id}</div>
				<div class="flex-1">
					<Graph data={device.id}/>
				</div>
			</div>
		{/each}
	</div>
</div>