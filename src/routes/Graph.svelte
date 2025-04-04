<script lang="ts">
    import Chart, {type ChartData} from 'chart.js/auto';
	import {onMount} from "svelte";
    import {page} from "$app/stores";

    let {data} = $props();
	let selectedButton = $state('1d');

    let totalPages: any;

    let tempChart: Chart;
    let humidityChart: Chart;

	onMount(()=> {
        fetchData({deviceId:data}).then(d => {
            totalPages = d.totalPages;
            makeChart(d.items);
            console.log('On Mount!');
		});


        // let url =`/tempHumidity?filter=(device='${data}')`;
		//
        // fetch(url).then(r => r.json()).then(data => {
        //     chartData = data.items;
        //     makeChart(chartData);
        // });
    });

    async function fetchData({deviceId, page = 1, perPage = 720 }: { deviceId: string; page?: number; perPage?: number;}) {
        try {
            let fetchUrl = new URL(`http://raspberrypi.local:8090/api/collections/tempandhumidity/records`);
            fetchUrl.searchParams.set('sort', "-created");
            fetchUrl.searchParams.set('perPage', String(perPage));
            fetchUrl.searchParams.set('page', String(page));
            fetchUrl.searchParams.set('filter', `(device='${deviceId}')`);

            let response = await fetch(fetchUrl);

            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

	async function handleButtonClick(button: string){
        if(button == selectedButton) return;

		selectedButton = button;

        let days = 1;
        switch(button){
            case '1d':
                days = 1;
                break;
			case '3d':
                days = 3;
                break;
			case '1w':
                days = 7;
                break;
			case 'at':
                days = totalPages;
                break;
		}

        tempChart.data.labels = [];
        tempChart.data.datasets[0].data = [];

        humidityChart.data.labels = [];
        humidityChart.data.datasets[0].data = [];

        tempChart.update();
        humidityChart.update();

        let tempChartData = [];
        let humidityChartData = [];
        let labelsChartData = [];

        for (let i = 0; i < days; i++) {
			let d = await fetchData({deviceId: data, page: i + 1});

            const options =
				{
					year: '2-digit',
					month: '2-digit',
					day: '2-digit',
					weekday: 'short',
					hour: '2-digit',
					minute: '2-digit',
				};

			let labels = d.items.map(item => new Date(item.created).toLocaleString('en-CA', options)).reverse();

			let tempData = d.items.map(item => parseFloat(item.temp)).reverse();
			let humidityData = d.items.map(item => parseFloat(item.humidity)).reverse();

			// tempChartData.splice(0, 0, ...tempData);
            // humidityChartData.splice(0, 0, ...humidityData);
            // labelsChartData.splice(0, 0, ...labels);

			// USE OF SPLICE IS EXPLAINED IN LARGER COMMENT AT END OF FUNCTION
            // Adding new data
            tempChart.data.datasets[0].data.splice(0, 0, ...tempData);
            humidityChart.data.datasets[0].data.splice(0, 0, ...humidityData);

            // Adding new labels
            humidityChart.data.labels!.splice(0, 0, ...labels);
            tempChart.data.labels!.splice(0, 0, ...labels);

            tempChart.update();
            humidityChart.update();

        }

        // // Adding new data
        // tempChart.data.datasets[0].data.push(...tempChartData);
        // humidityChart.data.datasets[0].data.push(...humidityChartData);
		//
        // // Adding new labels
        // humidityChart.data.labels!.push(...labelsChartData);
        // tempChart.data.labels!.push(...labelsChartData);
		//
        // tempChart.update();
        // humidityChart.update();


		/***
		 NOTE FOR FUTURE:
			 THE USE OF SPLICE IS TO KEEP THE PROPER ORDER OF DATA WHEN STITCHING MULTIPLE API REQUESTS
			 EXAMPLE OF THE PROBLEM IS BELOW

         [27, 25]    		  API RESPONSE
         [25, 27]    		  REVERSE FOR ARRAY
         [25, 27]   		  ARRAY STATUS

         [23, 21]		      API RESPONSE
         [21, 23]    		  REVERSE FOR ARRAY
         [25, 27, 21, 23]	  ARRAY STATUS
		 */
	}

    function makeChart(input) {
        const options =
        {
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


        tempChart = new Chart(tempGraphCtx, {
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

        humidityChart = new Chart(humidityGraphCtx, {
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
		<div class="flex min-h-[18rem] lg:flex-1 w-full">
			<canvas id="{data}-temp" class="w-full h-full"></canvas>
		</div>
		<div class="flex min-h-[18rem] lg:flex-1 w-full">
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