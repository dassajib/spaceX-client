<script>
	import { onMount } from 'svelte';
	import {
		Modal,
		Spinner,
		Button,
		Dropdown,
		DropdownItem,
		Progressbar
	} from 'flowbite-svelte';
	import {
		AdjustmentsVerticalSolid,
		ChevronDownOutline,
		ListOutline,
		GridSolid,
		LinkOutline
	} from 'flowbite-svelte-icons';

	import { fetchLandingPads } from '$lib/api';

	let landingPads = [];
	let filteredPads = [];
	let statuses = [];
	let selectedStatus = 'All';
	let isLoading = true;
	let isGridView = false;
	let showModal = false;
	let selectedPad = null;

	onMount(async () => {
		try {
			landingPads = await fetchLandingPads();
			// Extract unique statuses
			statuses = Array.from(new Set(landingPads.map((pad) => pad.status)));
			statuses.unshift('All'); // Add 'All' option for no filter

			// Initially, show all pads
			filteredPads = landingPads;
		} catch (error) {
			console.error('Error fetching landing pads:', error);
		} finally {
			isLoading = false;
		}
	});

	// Update filteredPads when selectedStatus changes
	$: filteredPads = selectedStatus === 'All'
		? landingPads
		: landingPads.filter((pad) => pad.status === selectedStatus);

	const openModal = (pad) => {
		selectedPad = pad;
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
		selectedPad = null;
	};
</script>

<div class="mb-4 w-full">
	<div class="mb-4 flex items-center justify-between">
		<div>
			<button
				class="btn btn-sm btn-primary mr-2"
				on:click={() => (isGridView = false)}
				aria-pressed={!isGridView}
			>
				<ListOutline class="ms-2 h-6 w-6 text-gray-800" />
			</button>
			<button
				class="btn btn-sm btn-secondary"
				on:click={() => (isGridView = true)}
				aria-pressed={isGridView}
			>
				<GridSolid class="ms-2 h-6 w-6 text-gray-800" />
			</button>
		</div>
		<div>
			<Button class="bg-gray-100 text-black">
				<AdjustmentsVerticalSolid />Filter By Status
				<ChevronDownOutline class="ms-2 h-6 w-6 text-black" />
			</Button>
			<Dropdown>
				{#each statuses as status}
					<DropdownItem on:click={() => (selectedStatus = status)}>
						{status}
					</DropdownItem>
				{/each}
			</Dropdown>
		</div>
	</div>

	<div class="w-full overflow-x-auto">
		{#if isLoading}
			<div class="flex items-center justify-center">
				<Spinner color="purple" />
			</div>
		{:else if filteredPads.length === 0}
			<p>No landing pads available for status: {selectedStatus}.</p>
		{:else if isGridView}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredPads as pad}
					<div class="card rounded-lg p-4 shadow-md">
						<h3 class="mb-2 text-lg font-bold">{pad.full_name}</h3>
						<p>{pad.location.region}</p>
						<p>{pad.successful_landings}/{pad.attempted_landings}</p>
						<p>{pad.details}</p>
						<a href={pad.wikipedia} target="_blank" class="text-blue-500">More Info</a>
					</div>
				{/each}
			</div>
		{:else}
			<table class="w-full table-auto border-collapse text-left">
				<thead class="bg-gray-100">
					<tr>
						<th class="whitespace-nowrap px-4 py-2 text-xs opacity-40">FULL NAME</th>
						<th class="whitespace-nowrap px-4 py-2 text-xs opacity-40">LOCATION NAME</th>
						<th class="whitespace-nowrap px-4 py-2 text-xs opacity-40">REGION</th>
						<th class="whitespace-nowrap px-4 py-2 text-xs opacity-40">DETAILS</th>
						<th class="whitespace-nowrap px-4 py-2 text-xs opacity-40">SUCCESS RATE</th>
						<th class="whitespace-nowrap px-4 py-2 text-xs opacity-40">WIKIPEDIA LINK</th>
						<th class="whitespace-nowrap px-4 py-2 text-xs opacity-40">STATUS</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredPads as pad}
						<tr class="hover:bg-gray-100">
							<td class="border px-4 py-2 text-xs font-medium">{pad.full_name}</td>
							<td class="border px-4 py-2 text-xs font-medium">{pad.location.name}</td>
							<td class="border px-4 py-2 text-xs font-medium">{pad.location.region}</td>
							<td class="border px-4 py-2 text-xs font-medium">
								<button class="btn btn-sm btn-primary" on:click={() => openModal(pad)}>
									View Details
								</button>
							</td>
							<td class="border px-4 py-2 text-xs font-medium">
								<Progressbar
									progress={(pad.successful_landings / pad.attempted_landings) * 100}
									size="h-6"
									labelInside
								/>
							</td>
							<td class="border px-4 py-2 text-xs font-medium">
								<a href={pad.wikipedia} target="_blank" class="text-blue-500">
									<LinkOutline />
								</a>
							</td>
							<td class="border px-4 py-2 text-xs font-medium">{pad.status}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<!-- details modal -->
	{#if showModal}
		<Modal title={`Details - ${selectedPad?.full_name}`} bind:open={showModal}>
			<p>{selectedPad?.details}</p>
		</Modal>
	{/if}
</div>
