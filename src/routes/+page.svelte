<script>
	import TableGridView from '../components/TableGridView/TableGridView.svelte';
	import MapView from '../components/MapView/MapView.svelte';
	import ChartView from '../components/ChartView/ChartView.svelte';
	import { onMount } from 'svelte';

	import { fetchLandingPads } from '$lib/api';

	let landingPads = [];
	let statuses = [];
	let isLoading = true;

	onMount(async () => {
		try {
			landingPads = await fetchLandingPads();
			statuses = Array.from(new Set(landingPads.map((pad) => pad.status)));
			// Add 'All' option
			statuses.unshift('All');
		} catch (error) {
			console.error('Error fetching landing pads:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<main class="px-4 py-4">
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
