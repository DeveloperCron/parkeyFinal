import React, { useState, memo, FC } from "react"
import { Portal } from "react-native-paper"
import { View, ViewStyle, ViewProps, StyleSheet, Pressable, PressableProps, TextStyle } from "react-native"
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated"
import Icon from "react-native-vector-icons/AntDesign"
import { colors } from "@/theme"

// Custom made google components for this project wrapped in memorize
import GooglePlacesFlatList from "@/components/googlePlaces/GooglePlacesFlatList"
import GooglePlaceSearchbox from "@/components/googlePlaces/GooglePlaceSearchbox"
import { Text } from "@/components"
import { useTranslation } from "react-i18next"

interface SearchPortalProps extends ViewProps {
	onCloseButtonPress: () => void
	onPlaceChosen: () => void
}

const CloseButton: FC<PressableProps> = (props) => {
	return (
		<Pressable style={$closeButtonContainer} {...props}>
			<Icon name="close" size={24} color={colors.palette.neutral500} />
		</Pressable>
	)
}

const SearchPortal: FC<SearchPortalProps> = ({ onCloseButtonPress, onPlaceChosen: onPlaceChoosen, ...rest }) => {
	const [searchResult, setSearchResult] = useState<string>("")
	const { t } = useTranslation(["map"])

	return (
		<Portal.Host>
			{/** Main Portal container */}
			<View style={$container}>
				{/** Portal content container */}
				<Animated.View
					style={contentContainer}
					entering={SlideInDown.duration(50).springify().mass(0.1)}
					exiting={SlideOutDown.duration(50)}
					{...rest}
				>
					{/** Portal header */}
					<View style={$portalHeader}>
						<CloseButton onPress={onCloseButtonPress} />
						<Text style={$portalHeaderTitle} size="md">
							{t("searchbarPortalTitle")}
						</Text>
					</View>
					{/** Portal actions */}
					<View style={$portalActions}>
						<GooglePlaceSearchbox
							placeHolder={t("map:searchbartext")}
							onChangeText={(text: string) => setSearchResult(text)}
						/>
					</View>
					{/** Portal body */}
					<View style={$portalBody}>
						<GooglePlacesFlatList searchResult={searchResult} />
					</View>
				</Animated.View>
			</View>
		</Portal.Host>
	)
}

const $container: ViewStyle = {
	...StyleSheet.absoluteFillObject,
	backgroundColor: colors.palette.BlackAlpha[300],
}

const contentContainer: ViewStyle = {
	backgroundColor: colors.palette.neutral100,
	height: "90%",
	width: "100%",
	position: "absolute",
	bottom: 0,
	borderTopLeftRadius: 40,
	borderTopRightRadius: 40,
	padding: 10,
}

const $closeButtonContainer: ViewStyle = {
	backgroundColor: colors.palette.neutral200,
	height: 50,
	width: 50,
	borderRadius: 50,
	justifyContent: "center",
	alignItems: "center",
}

const $portalHeader: ViewStyle = {
	height: 75,
	width: "100%",
	alignItems: "center",
	justifyContent: "flex-start",
	flexDirection: "row",
	gap: 10,
	padding: 10,
}

const $portalHeaderTitle: TextStyle = {
	color: colors.palette.neutral600,
	fontWeight: "700",
}

const $portalActions: ViewStyle = {
	width: "100%",
	height: "auto",
	alignItems: "center",
	alignContent: "center",
	padding: 5,
}

const $portalBody: ViewStyle = {
	width: "100%",
	height: "auto",
	justifyContent: "center",
	alignItems: "center",
}

export default memo(SearchPortal)
