export type GeolocationPosition = {
	coords: {
		latitude: number
		longitude: number
		altitude: number | null
		accuracy: number
		altitudeAccuracy: number | null
		heading: number | null
		speed: number | null
	}
	timestamp: number
}

export type GeolocationError = {
	code: number
	message: string
	PERMISSION_DENIED: number
	POSITION_UNAVAILABLE: number
	TIMEOUT: number
}
