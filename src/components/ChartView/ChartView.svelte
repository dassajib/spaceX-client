<script>
	import { fetchLandingPads } from '$lib/api';
	import { onMount } from 'svelte';
	import { Chart, Card } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		ArrowDownToBracketOutline,
		ChevronDownOutline,
		ChevronRightOutline,
		PenSolid,
		DownloadSolid,
		ShareNodesSolid
	} from 'flowbite-svelte-icons';

	let totalLandingPads = [];

	const options = {
		series: [],
		colors: ['#1C64F2', '#16BDCA', '#FDBA8C', '#E74694'],
		chart: {
			height: 320,
			width: '100%',
			type: 'donut'
		},
		stroke: {
			colors: ['transparent'],
			lineCap: ''
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						name: {
							show: true,
							fontFamily: 'Inter, sans-serif',
							offsetY: 20
						},
						total: {
							showAlways: true,
							show: true,
							label: 'Landing Pads',
							fontFamily: 'Inter, sans-serif',
							formatter: function (w) {
								return `${totalLandingPads}`;
							}
						},
						value: {
							show: true,
							fontFamily: 'Inter, sans-serif',
							offsetY: -20,
							formatter: function (value) {
								const numericValue = Number(value);
								if (!isNaN(numericValue)) {
									return numericValue.toFixed(2) + '%';
								} else {
									return value;
								}
							}
						}
					},
					size: '80%'
				}
			}
		},
		grid: {
			padding: {
				top: -2
			}
		},
		labels: [],
		dataLabels: {
			enabled: false
		},
		legend: {
			position: 'bottom',
			fontFamily: 'Inter, sans-serif'
		},
		yaxis: {
			labels: {
				formatter: function (value) {
					return value + 'k';
				}
			}
		},
		xaxis: {
			labels: {
				formatter: function (value) {
					return value + 'k';
				}
			},
			axisTicks: {
				show: true
			},
			axisBorder: {
				show: true
			}
		}
	};

	// Fetch data when the component is mounted
	onMount(async () => {
		try {
			const response = await fetchLandingPads();
			totalLandingPads = response.length;
			// series, labels calculation
			options.series = response.map((item) => {
				if (!item.attempted_landings || item.attempted_landings === 0) {
					// handle invalid or zero attempted_landings
					console.warn(`Invalid or zero attempted_landings for item: ${item.full_name}`);
					return 0;
				}
				const successRate = (item.successful_landings / item.attempted_landings) * 100;
				return successRate;
			});

			options.labels = response.map((item) => item.full_name);
		} catch (error) {
			console.error('Error fetching chart data:', error);
		}
	});
</script>

<Card>
	<div class="flex w-full items-start justify-between">
		<div class="flex-col items-center">
			<div class="mb-1 flex items-center">
				<h5 class="me-1 text-xl font-bold leading-none text-gray-900 dark:text-white">
					Success Rate Chart
				</h5>
			</div>
		</div>
	</div>

	<Chart {options} class="py-6" />
</Card>
