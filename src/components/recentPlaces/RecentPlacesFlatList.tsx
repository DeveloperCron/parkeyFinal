import React, { useEffect, useState, memo, FC } from "react"
import { ViewStyle, TextStyle, FlatList } from "react-native"
import useStorage from "@/hooks/useStorage"
import { Divider } from "react-native-paper"
import crashlytics from "@react-native-firebase/crashlytics"

import { PredictionType } from "../googlePlaces/GooglePlacesFlatList"
import RecentItem from "./RecentItem"
import { colors } from "@/theme"

export interface RecentPlacesFlatListProps {
	onItemSelected: () => void
}

const RecentPlacesFlatList: FC<RecentPlacesFlatListProps> = ({ onItemSelected }) => {
	const { retrieveItems } = useStorage()
	const [items, setItems] = useState<PredictionType[]>()

	// Retrieve the items upon mount
	useEffect(() => {
		const fetchItems = async () => {
			try {
				const items = await retrieveItems()
				setItems(items)
			} catch {
				crashlytics().log("Cannot fetch items")
			}
		}

		fetchItems()
	}, [])

	return (
		<FlatList
			style={$container}
			data={items}
			ItemSeparatorComponent={Divider}
			nestedScrollEnabled
			contentContainerStyle={{ flexGrow: 1 }}
			renderItem={({ item }) => <RecentItem placeName={item.description} />}
			keyExtractor={(item) => item.place_id.toString()}
		/>
	)
}

const $container: ViewStyle = {
	width: "95%",
	display: "flex",

	backgroundColor: colors.palette.neutral100,
}

export default memo(RecentPlacesFlatList)
