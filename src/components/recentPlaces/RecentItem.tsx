import React, { FC } from "react"
import { TextStyle, ViewStyle, Pressable, PressableProps } from "react-native"
import { Text } from "@/components/Text"

import Icon from "react-native-vector-icons/FontAwesome6"
import { colors } from "@/theme"

export interface RecentItemProps extends PressableProps {
	/**
	 * The place name you want to display
	 */
	placeName: string
	onRecentItemPress: () => void
}
const RecentItem: FC<RecentItemProps> = ({ placeName, onRecentItemPress }) => {
	return (
		<Pressable
			style={$container}
			onPress={onRecentItemPress}
			android_ripple={{ color: colors.palette.neutral300, borderless: false }}
		>
			<Icon name="clock-rotate-left" size={22} color={colors.palette.neutral800} />
			<Text weight="bold" size="xs" style={$textStyle}>
				{placeName}
			</Text>
		</Pressable>
	)
}

const $container: ViewStyle = {
	width: "100%",
	height: 75,
	justifyContent: "flex-start",
	alignItems: "center",
	flexDirection: "row",
	gap: 10,
	backgroundColor: colors.palette.neutral100,
}

const $textStyle: TextStyle = {
	color: colors.palette.neutral600,
	fontWeight: "700",
}

export default RecentItem
