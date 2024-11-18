<script>
	import { onMount } from 'svelte';
	import 'ol/ol.css';
	import { Map, View } from 'ol';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import Point from 'ol/geom/Point';
	import Feature from 'ol/Feature';
	import VectorSource from 'ol/source/Vector';
	import VectorLayer from 'ol/layer/Vector';
	import { Icon, Style } from 'ol/style';
	import { fromLonLat } from 'ol/proj';
	import { Card } from 'flowbite-svelte';
	import { fetchLandingPads } from '../../lib/api';

	let map;
	let landingPads = [];

	const plotLandingPads = () => {
		const vectorSource = new VectorSource();

		landingPads.forEach((pad) => {
			const marker = new Feature({
				geometry: new Point(fromLonLat([pad.location.longitude, pad.location.latitude])),
				name: pad.full_name
			});

			const markerStyle = new Style({
				image: new Icon({
					src: pad.status === 'active' ? '/map-marker.png' : '/inactive-marker.webp',
					scale: 0.1
				})
			});

			marker.setStyle(markerStyle);
			vectorSource.addFeature(marker);
		});

		const vectorLayer = new VectorLayer({
			source: vectorSource
		});

		map.addLayer(vectorLayer);
	};

	onMount(async () => {
		map = new Map({
			target: 'map',
			layers: [
				new TileLayer({
					source: new OSM()
				})
			],
			view: new View({
				center: fromLonLat([-118.2437, 34.0522]), // Default center (Los Angeles)
				zoom: 6
			})
		});

		try {
			// Call fetchLandingPads from your API file and set the response
			landingPads = await fetchLandingPads();
			plotLandingPads(); // Plot landing pads after fetching the data
		} catch (error) {
			console.error('Error fetching landing pads:', error);
		}
	});
</script>

<Card>
	<h5 class="me-1 text-xl font-bold leading-none text-gray-900 dark:text-white">Map View</h5>
	<div id="map" class="mt-4 h-[500px] w-full rounded-lg shadow-md"></div>
</Card>

<style>
	#map {
		width: 100%;
		height: 400px;
	}
</style>
