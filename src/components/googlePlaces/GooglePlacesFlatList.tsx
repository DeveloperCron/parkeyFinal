import React, { useState, useEffect, memo, FC } from "react"
import { FlatList, ViewStyle } from "react-native"
import axios from "axios"

import { Divider } from "react-native-paper"
import PlaceItem from "./PlaceItem"
import { colors } from "@/theme"

const GOOGLE_PLACES_API_BASE_URL = "https://maps.googleapis.com/maps/api/place"
const API_KEY = "AIzaSyCWIrR-oS50Gi1Ot1fC6UeONYwyheHbyZU"

export type PredictionType = {
	description: string
	place_id: string
	reference: string
	matched_substrings: any[]
	tructured_formatting: object
	terms: object[]
	types: string[]
}

export interface GooglePlaceFlatlistProps {
	searchResult: string
	placeSelected: (item: PredictionType) => void
}
const GooglePlaceFlatlist: FC<GooglePlaceFlatlistProps> = ({ searchResult, placeSelected, ...rest }) => {
	const [predictions, setPredictions] = useState<PredictionType[]>([])

	const requestPlaces = async (): Promise<void> => {
		if (!searchResult || searchResult.length < 4) return

		const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}/autocomplete/json?key=${API_KEY}&input=${searchResult}`
		try {
			const result = await axios.request({
				method: "post",
				url: apiUrl,
			})

			if (result && result.data && result.data.predictions) {
				const { predictions }: { predictions: PredictionType[] } = result.data
				setPredictions(predictions)

				console.log(predictions)
			}
		} catch (e) {
			console.log(e)
		}
	}

	// Call the function when searchResult changes
	useEffect(() => {
		requestPlaces()
	}, [searchResult])

	return (
		<FlatList
			{...rest}
			style={$flatListStyle}
			data={predictions}
			ItemSeparatorComponent={Divider}
			renderItem={({ item }) => <PlaceItem placeName={item.description} onPress={() => placeSelected(item)} />}
			keyExtractor={(item) => item.place_id.toString()}
		/>
	)
}

const $flatListStyle: ViewStyle = {
	width: "90%",
	height: "60%",
	backgroundColor: colors.palette.neutral100,
}

export default memo(GooglePlaceFlatlist)
