import { recentPlaces } from "@/App"
// import crashlytics from "@react-native-firebase/crashlytics"
import type { PredictionType } from "@/components/googlePlaces/GooglePlacesFlatList"
import { RECENT_PLACES_KEY } from "@/constants"

export interface useStorageHook {
	insert(item: PredictionType): void
	// remove(item: PredictionType): void
	retrieveItems(): PredictionType[]
	removeAll(): void
}

export function useStorage(): useStorageHook {
	const insert = (item: PredictionType) => {
		let serializedArray: PredictionType[] = recentPlaces.getArray(RECENT_PLACES_KEY)

		if (serializedArray == null) {
			serializedArray = [item]
		}

		if (!checkForDuplicates(serializedArray, item)) {
			serializedArray.push(item)
		}

		recentPlaces.setArray(RECENT_PLACES_KEY, serializedArray)
	}

	const removeAll = () => {
		recentPlaces.setArray(RECENT_PLACES_KEY, [])
	}

	const retrieveItems = () => {
		const serializedArray: PredictionType[] = recentPlaces.getArray(RECENT_PLACES_KEY)
		return serializedArray
	}

	return { insert, retrieveItems, removeAll }
}

const checkForDuplicates = (dictionary: PredictionType[], item: PredictionType) => {
	return dictionary.some((serializedItem: PredictionType) => serializedItem.place_id === item.place_id)
}

export default useStorage
