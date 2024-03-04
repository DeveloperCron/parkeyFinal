import React, { useEffect, useState, memo, FC } from "react"
import { ViewStyle, FlatList } from "react-native"
import useStorage from "@/hooks/useStorage"
import { Divider } from "react-native-paper"
import crashlytics from "@react-native-firebase/crashlytics"

import { PredictionType } from "../googlePlaces/GooglePlacesFlatList"
import RecentItem from "./RecentItem"
import { colors } from "@/theme"
import SkeletonList from "../SkeletonList"

export interface RecentPlacesFlatListProps {
	onItemSelected: (item: PredictionType) => void
}

const RecentPlacesFlatList: FC<RecentPlacesFlatListProps> = ({ onItemSelected }) => {
	const [items, setItems] = useState<PredictionType[]>()
	const [isFetching, setIsFetching] = useState<boolean>(false)
	const { retrieveItems } = useStorage()

	// Retrieve the items upon mount
	useEffect(() => {
		const fetchItems = async () => {
			setIsFetching(true)

			try {
				const items = await retrieveItems()
				setItems(items)

				setIsFetching(false)
			} catch {
				setIsFetching(false)
				crashlytics().log("Cannot fetch items")
			}
		}

		fetchItems()
	}, [])

	return isFetching ? (
		<SkeletonList renders={6} />
	) : (
		<FlatList
			style={$container}
			data={items}
			ItemSeparatorComponent={Divider}
			nestedScrollEnabled
			scrollEnabled
			contentContainerStyle={{ flexGrow: 1 }}
			renderItem={({ item }) => (
				<RecentItem placeName={item.description} onRecentItemPress={() => onItemSelected(item)} />
			)}
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
