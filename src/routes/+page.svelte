<script>
	import TableGridView from '../components/TableGridView/TableGridView.svelte';
	import MapView from '../components/MapView/MapView.svelte';
	import ChartView from '../components/ChartView/ChartView.svelte';
	import { fetchLandingPads } from '$lib/api';

	let landingPads = [];
	let statuses = [];
	let isLoading = true;

	async function fetchData() {
		try {
			isLoading = true;
			landingPads = await fetchLandingPads();
			statuses = ['All', ...new Set(landingPads.map((pad) => pad.status))];
		} catch (error) {
			console.error('Error fetching landing pads:', error);
		} finally {
			isLoading = false;
		}
	}

	fetchData();
</script>

<main class="px-4 py-4">
	<nav class="text-white shadow-md">
		<div class="flex h-16 items-center justify-center">
			<img src="/logo.png" alt="Logo" class="w-auto" />
		</div>
	</nav>
	
	<div class="flex py-4">
		<div class="flex w-full flex-col px-2 sm:w-4/6 sm:flex-row">
			<TableGridView {landingPads} {statuses} {isLoading} />
		</div>
		<div class="w-full px-4 sm:w-2/6">
			<MapView />
			<div class="mt-5">
				<ChartView />
			</div>
		</div>
	</div>
</main> 
