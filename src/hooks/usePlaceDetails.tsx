import axios, { AxiosResponse } from "axios"

const GOOGLE_PLACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place/details/json"
const API_KEY = "AIzaSyCWIrR-oS50Gi1Ot1fC6UeONYwyheHbyZU"

interface AddressComponent {
	long_name: string
	short_name: string
	types: string[]
}

interface OpeningHoursPeriod {
	close: { day: number; time: string }
	open: { day: number; time: string }
}

interface Review {
	author_name: string
	author_url: string
	language: string
	profile_photo_url: string
	rating: number
	relative_time_description: string
	text: string
	time: number
}

interface GeometryLocation {
	lat: number
	lng: number
}

interface GeometryViewport {
	northeast: GeometryLocation
	southwest: GeometryLocation
}

interface Photo {
	height: number
	html_attributions: string[]
	photo_reference: string
	width: number
}

interface PlusCode {
	compound_code: string
	global_code: string
}

interface Result {
	address_components: AddressComponent[]
	adr_address: string
	business_status: string
	formatted_address: string
	formatted_phone_number: string
	geometry: {
		location: GeometryLocation
		viewport: GeometryViewport
	}
	icon: string
	icon_background_color: string
	icon_mask_base_uri: string
	international_phone_number: string
	name: string
	opening_hours: {
		open_now: boolean
		periods: OpeningHoursPeriod[]
		weekday_text: string[]
	}
	photos: Photo[]
	place_id: string
	plus_code: PlusCode
	rating: number
	reference: string
	reviews: Review[]
	types: string[]
	url: string
	user_ratings_total: number
	utc_offset: number
	vicinity: string
	website: string
}

export interface PlaceDetailsResponse {
	html_attributions: string[]
	result: Result
	status: string
}
export interface usePlaceDetailsHook {
	/**
	 *
	 * 	@param placeId string we get it from the place from the autocomplete
	 *	the any type is just broken
	 */
	getDetails(placeId: string): Promise<AxiosResponse<PlaceDetailsResponse, any>>
}

export function usePlaceDetails(): usePlaceDetailsHook {
	const getDetails = async (placeId: string) => {
		const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}?place_id=${placeId}&key=${API_KEY}`

		try {
			const response = await axios.request({
				method: "get", // Assuming you are making a GET request
				url: apiUrl,
			})

			return response
		} catch (e) {
			console.error(e)
			throw e // Re-throw the error to propagate it to the caller
		}
	}

	return { getDetails }
}
