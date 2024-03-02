import React, { useState, memo, FC, useCallback, useRef, useEffect } from "react"
import { Portal } from "react-native-paper"
import { View, ViewStyle, StyleSheet, Pressable, TextStyle } from "react-native"
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated"
import Icon from "react-native-vector-icons/AntDesign"
import { colors } from "@/theme"
import GooglePlacesFlatList, { PredictionType } from "@/components/googlePlaces/GooglePlacesFlatList"
import GooglePlaceSearchbox from "@/components/googlePlaces/GooglePlaceSearchbox"
import { Text } from "@/components"
import { useTranslation } from "react-i18next"
import useStorage from "@/hooks/useStorage"

interface SearchPortalProps {
	onCloseButtonPress: () => void
	onPlaceChosen: () => void
}

const CloseButton: FC<{ onPress: () => void }> = ({ onPress }) => (
	<Pressable style={styles.closeButtonContainer} onPress={onPress}>
		<Icon name="close" size={24} color={colors.palette.neutral500} />
	</Pressable>
)

const SearchPortal: FC<SearchPortalProps> = ({ onCloseButtonPress, onPlaceChosen }) => {
	const [searchResult, setSearchResult] = useState<string>("")
	const searchboxRef = useRef<React.ElementRef<typeof GooglePlaceSearchbox>>(null)
	const { insert, retrieveItems } = useStorage()
	const { t } = useTranslation(["map"])

	const onPlaceItemPress = useCallback((item: PredictionType) => {
		insert(item)
		console.log(retrieveItems())
	}, [])

	return (
		<Portal.Host>
			<View style={styles.container}>
				<Animated.View
					style={styles.contentContainer}
					entering={SlideInDown.duration(1000).springify().mass(0.1)}
					exiting={SlideOutDown.duration(300)}
				>
					<View style={styles.portalHeader}>
						<CloseButton onPress={onCloseButtonPress} />
						<Text style={styles.portalHeaderTitle} size="md">
							{t("searchbarPortalTitle")}
						</Text>
					</View>
					<View style={styles.portalActions}>
						<GooglePlaceSearchbox
							ref={searchboxRef}
							placeHolder={t("map:searchbartext")}
							onChangeText={(text: string) => setSearchResult(text)}
						/>
					</View>
					<View style={styles.portalBody}>
						<GooglePlacesFlatList searchResult={searchResult} placeSelected={onPlaceItemPress} />
					</View>
				</Animated.View>
			</View>
		</Portal.Host>
	)
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: colors.palette.BlackAlpha[300],
	},
	contentContainer: {
		backgroundColor: colors.palette.neutral100,
		height: "90%",
		width: "100%",
		position: "absolute",
		bottom: 0,
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40,
		padding: 10,
	},
	closeButtonContainer: {
		backgroundColor: colors.palette.neutral200,
		height: 50,
		width: 50,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	portalHeader: {
		height: 75,
		width: "100%",
		alignItems: "center",
		justifyContent: "flex-start",
		flexDirection: "row",
		gap: 10,
		padding: 10,
	},
	portalHeaderTitle: {
		color: colors.palette.neutral600,
		fontWeight: "700",
	},
	portalActions: {
		width: "100%",
		height: "auto",
		alignItems: "center",
		alignContent: "center",
		padding: 5,
	},
	portalBody: {
		width: "100%",
		height: "auto",
		justifyContent: "center",
		alignItems: "center",
	},
})

export default memo(SearchPortal)
