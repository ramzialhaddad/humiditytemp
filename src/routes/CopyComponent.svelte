<script lang="ts">
	let {text} = $props();
    let copied:boolean = $state(false);

    async function copyID(id: string){
        try{
            await navigator.clipboard.writeText(id);
            copied = true;
            setTimeout(()=>{copied = false;}, 1500);
        }catch (err){
            console.error("Failed to copy: ", err);
        }
    }
</script>

<div class="flex justify-center mb-6">

	<span class="bg-blue-950 rounded text-white text-center text-base font-mono
					 mx-auto w-fit absolute transition-opacity duration-300 ease-in-out {copied ? 'opacity-100' : 'opacity-0'}">Copied!</span>

	<button class="bg-blue-950 rounded text-white text-center text-base font-mono
					 mx-auto w-fit absolute transition-opacity duration-300 ease-in-out {copied ? 'opacity-0' : 'opacity-100'}"
			onclick={()=>copyID(text)}>
		{text}
		<i class="fa-solid fa-copy"></i>
	</button>

</div>