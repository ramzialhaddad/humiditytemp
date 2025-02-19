<script lang="ts">
    import type { PageData } from './$types';
    import Graph from "./Graph.svelte";

    let { data }: { data: PageData } = $props();

    async function copyID(id: string){
        try{
            await navigator.clipboard.writeText(id);
		}catch (err){
            console.error("Failed to copy: ", err);
		}
	}
</script>
<div>
	<div class="flex flex-col justify-between gap-4 p-1">
		{#each data.devices.items as device}
			<div class="flex flex-col bg-black shadow-xl shadow-gray-800 rounded">
				<div class="w-fit mx-auto mt-2  rounded flex flex-col align-middle">
					<div class="text-white text-center text-2xl font-sans">{device.deviceName}</div>
					<button class="bg-blue-950 rounded text-white text-center text-base font-mono
					 mx-auto w-fit"
					onclick={()=>copyID(device.id)}>
						{device.id}
						<i class="fa-solid fa-copy"></i>
					</button>
				</div>
				<div class="flex-1">
					<Graph data={device.id}/>
				</div>
			</div>
		{/each}
	</div>
</div>