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

	export let landingPads = [];

	let map;

	onMount(() => {
		map = new Map({
			target: 'map',
			layers: [
				new TileLayer({
					source: new OSM()
				})
			],
			view: new View({
				center: fromLonLat([-118.2437, 34.0522]),
				zoom: 6
			})
		});

		const vectorSource = new VectorSource();

		landingPads.forEach((pad) => {
			const marker = new Feature({
				geometry: new Point(fromLonLat([pad.location.longitude, pad.location.latitude])),
				name: pad.name
			});

			const markerStyle = new Style({
				image: new Icon({
					src: pad.status === 'active' ? '/active-marker-icon.png' : '/inactive-marker-icon.png',
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
	});
</script>

<div id="map" class="h-96 w-full"></div>

<style>
	#map {
		height: 100%;
		width: 100%;
	}
</style>
