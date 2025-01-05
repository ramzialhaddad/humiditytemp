<script lang="ts">
    import Chart, {type ChartData} from 'chart.js/auto';
	import {onMount} from "svelte";

    let {data} = $props();
    let canvasId = crypto.randomUUID();

	onMount(()=> {
        let url =`/tempHumidity?filter=(device='${data}')`;

        let tempHumidityReq = fetch(url).then(r => r.json()).then(data => {makeChart(data.items)});
    });


    function makeChart(input) {
        const labels = input.map(item => new Date(item.created).toLocaleString()).reverse();
        const tempData = input.map(item => parseFloat(item.temp)).reverse();
        const humidityData = input.map(item => parseFloat(item.humidity)).reverse();

        console.log(data, input[input.length-1].created)

        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: tempData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                        yAxisID: 'yTemp', // Link to the temperature Y-axis
                    },
                    {
                        label: 'Humidity (%)',
                        data: humidityData,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false,
                        yAxisID: 'yHumidity', // Link to the humidity Y-axis
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    yTemp: {
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        },
                        beginAtZero: true,
                        min: 15, // Set minimum value for temperature
                        max: 30, // Adjust maximum value for temperature as needed
                        position: 'left', // Position on the left
                        grid: {
                            color: 'rgba(255, 99, 132, 0.5)', // Color for grid lines
                        },
                        ticks: {
                            color: 'rgba(255, 99, 132, 1)', // Color for tick labels
                        }
                    },
                    yHumidity: {
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        },
                        beginAtZero: false,
                        min: 15, // Set minimum value for humidity
                        max: 50, // Adjust maximum value for humidity as needed
                        position: 'right', // Position on the right
                        grid: {
                            color: 'rgba(54, 162, 235, 0.5)', // Color for grid lines
                        },
                        ticks: {
                            color: 'rgba(54, 162, 235, 1)', // Color for tick labels
                        }
                    }
                }
            }
        });
    }
</script>

<div>
	<canvas id="{canvasId}"></canvas>
</div>
