import React, { FC } from "react"
import { ViewStyle, View } from "react-native"
import { colors } from "@/theme"

import { Text } from "./Text"

export const OrSection: FC = () => {
	return (
		<View style={$container}>
			<View style={$divider} />
			<Text size="sm" weight="bold">
				Or
			</Text>
			<View style={$divider} />
		</View>
	)
}

const $container: ViewStyle = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "center",
}

const $divider: ViewStyle = {
	flex: 1,
	height: 1,
	backgroundColor: colors.palette.neutral300,
	marginHorizontal: 5,
}
