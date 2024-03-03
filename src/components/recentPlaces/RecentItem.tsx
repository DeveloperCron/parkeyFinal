import React, { FC } from "react"
import { View, TextStyle, ViewStyle } from "react-native"
import { Text } from "@/components/Text"

import Icon from "react-native-vector-icons/FontAwesome6"
import { colors } from "@/theme"

export interface RecentItemProps {
	/**
	 * The place name you want to display
	 */
	placeName: string
}
const RecentItem: FC<RecentItemProps> = ({ placeName, ...props }) => {
	return (
		<View style={$container}>
			<Icon name="clock-rotate-left" size={22} color={colors.palette.neutral800} />
			<Text weight="bold" size="xs" style={$textStyle}>
				{placeName}
			</Text>
		</View>
	)
}

const $container: ViewStyle = {
	width: "100%",
	height: 75,
	justifyContent: "flex-start",
	alignItems: "center",
	flexDirection: "row",
	gap: 10,
}

const $textStyle: TextStyle = {
	color: colors.palette.neutral600,
	fontWeight: "700",
}

export default RecentItem
