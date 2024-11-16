import { BASE_URL } from "../config";

export const fetchLandingPads = async () => {
	const response = await fetch(BASE_URL);
	if (!response.ok) {
		throw new Error('Failed to fetch landing pads');
	}
	return await response.json();
};
