<script>
	import TableGridView from '../components/TableGridView/TableGridView.svelte';
	import MapView from '../components/MapView/MapView.svelte';
</script>

<main class="py-4 px-10">
	<div class="flex">
		<div class="flex w-full flex-col sm:w-4/6 sm:flex-row px-4">
			<TableGridView />
		</div>

		<div class="w-full sm:w-2/6 px-4">
			<MapView />
		</div>
	</div>
</main>
