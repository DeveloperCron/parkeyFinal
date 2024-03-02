import React, { FC } from "react"
import { Pressable, PressableProps, ViewStyle, View, TextStyle } from "react-native"
import { Text } from "@/components"
import Icon from "react-native-vector-icons/FontAwesome6"
import { colors } from "@/theme"

export interface PlaceItemProps extends PressableProps {
	/**
	 * placeName string -- The place name fetched from google maps
	 */
	placeName: string
}

const PlaceItem: FC<PlaceItemProps> = ({ placeName, ...props }) => {
	return (
		<Pressable style={$pressableContainer} {...props}>
			<Icon name="location-dot" size={24} color={colors.palette.neutral600} />
			<View style={$textContainer}>
				<Text size="xs" weight="semiBold" style={$textStyle}>
					{placeName}
				</Text>
			</View>
		</Pressable>
	)
}

const $pressableContainer: ViewStyle = {
	width: "100%",
	height: 70,
	flexDirection: "row",
	alignItems: "center",
	gap: 12,
}

const $textContainer: ViewStyle = {
	width: "auto",
	height: "100%",
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "column",
}

const $textStyle: TextStyle = {
	color: colors.palette.neutral600,
	fontWeight: "bold",
}

export default PlaceItem
