<script lang="ts">
    import Chart, {type ChartData} from 'chart.js/auto';
	import {onMount} from "svelte";

    let {data} = $props();
	let selectedButton = $state('1d');

	onMount(()=> {
        let url =`/tempHumidity?filter=(device='${data}')`;

        let tempHumidityReq = fetch(url).then(r => r.json()).then(data => {makeChart(data.items)});
    });

	function handleButtonClick(button: string){
		selectedButton = button;
	}

    function makeChart(input) {
        const options = {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit'
        };
        const labels = input.map(item => new Date(item.created).toLocaleString('en-US', options)).reverse();

        const tempData = input.map(item => parseFloat(item.temp)).reverse();
        const humidityData = input.map(item => parseFloat(item.humidity)).reverse();

        const minYTemperature = 18;
        const maxYTemperature = 25;

        const minYHumidity = 15;
        const maxYHumidity = 40;

        //console.log(data, labels[0], "ee");

        const tempCanvas = document.getElementById(data+"-temp") as HTMLCanvasElement;
        const tempGraphCtx = tempCanvas.getContext('2d')!;
        const humidityCanvas = document.getElementById(data+"-humidity") as HTMLCanvasElement;
        const humidityGraphCtx = humidityCanvas.getContext('2d')!;


        const tempChart = new Chart(tempGraphCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: tempData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.1 // Smooth lines
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow the chart to fill the container
                scales: {
                    y: {
                        //min: minYTemperature,
						//max: maxYTemperature,
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)', // Light grid lines
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 1)', // Bright white text for x-axis
                        }
                    },
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 30, // Adjust as needed
                            color: 'rgba(255, 255, 255, 1)', // Bright white text for x-axis
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 1)', // Bright white text for legend
                        }
                    },
                    tooltip: {
                        intersect: false,
						position: 'nearest',
                        titleColor: 'rgba(255, 255, 255, 1)', // Bright white text for tooltip title
                        bodyColor: 'rgba(255, 255, 255, 1)', // Bright white text for tooltip body
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background for tooltip
                        borderColor: 'rgba(255, 255, 255, 0.5)', // Light border for tooltip
                        borderWidth: 1,
                    }
                },
            },
        });

        const humidityChart = new Chart(humidityGraphCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Humidity (%)',
                    data: humidityData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                    tension: 0.1 // Smooth lines
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow the chart to fill the container
                scales: {
                    y: {
                        //min: minYHumidity,
						//max: maxYHumidity,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)', // Light grid lines
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 1)', // Bright white text for x-axis
                        },
                        beginAtZero: false
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)', // Light grid lines
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 1)', // Bright white text for x-axis
                            autoSkip: true,
                            maxTicksLimit: 30 // Adjust as needed
                        },
                        time: {
                            unit: 'hour', // Display labels by hour
                            tooltipFormat: 'YYYY-MM-DD HH:mm', // Format for tooltips
                            displayFormats: {
                                hour: 'HH:mm', // Format for x-axis labels
                            }
                        }
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 1)', // Bright white text for legend
                        }
                    },
                    tooltip: {
                        intersect: false,
                        position: 'nearest',
                        titleColor: 'rgba(255, 255, 255, 1)', // Bright white text for tooltip title
                        bodyColor: 'rgba(255, 255, 255, 1)', // Bright white text for tooltip body
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background for tooltip
                        borderColor: 'rgba(255, 255, 255, 0.5)', // Light border for tooltip
                        borderWidth: 1,
                    }
                }
            }
        });
    }
</script>

<div>
	<div class="flex min-h-[32rem] flex-wrap">
		<div class="flex lg:flex-1 w-full">
			<canvas id="{data}-temp" class="w-full h-full"></canvas>
		</div>
		<div class="flex lg:flex-1 w-full">
			<canvas id="{data}-humidity" class="w-full h-full"></canvas>
		</div>
	</div>
	<div class="bg-black p-4 rounded">
		<div class="flex justify-between items-center">
			<button class="px-6 py-3 rounded-lg mr-4 sm:mr-0 transition-colors
				{selectedButton == '1d' ? 'bg-gray-400 text-black font-bold' : 'bg-gray-700 text-white'}"

					onclick={()=> handleButtonClick('1d')}
			>1D</button>

			<button class="px-6 py-3 rounded-lg mr-4 sm:mr-0 transition-colors
				{selectedButton == '3d' ? 'bg-gray-400 text-black font-bold' : 'bg-gray-700 text-white'}"

					onclick={()=> handleButtonClick('3d')}
			>3D</button>

			<button class="px-6 py-3 rounded-lg mr-4 sm:mr-0 transition-colors
				{selectedButton == '1w' ? 'bg-gray-400 text-black font-bold' : 'bg-gray-700 text-white'}"

					onclick={()=> handleButtonClick('1w')}
			>1W</button>

			<button class="px-6 py-3 rounded-lg mr-4 sm:mr-0 transition-colors
				{selectedButton == 'at' ? 'bg-gray-400 text-black font-bold' : 'bg-gray-700 text-white'}"

					onclick={()=> handleButtonClick('at')}
			>All</button>
		</div>
	</div>


</div>



<!--<div class="grid grid-flow-col h-72">-->
<!--	<canvas class="" id="{data}-temp"></canvas>-->
<!--	<canvas class="" id="{data}-humidity"></canvas>-->
<!--</div>-->
