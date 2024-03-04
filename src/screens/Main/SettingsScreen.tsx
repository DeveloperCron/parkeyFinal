import { Screen, Text } from "@/components"
import { AppStackNavigator } from "@/navigators/Application"
import { colors } from "@/theme"
import React, { FC } from "react"
import { useTranslation } from "react-i18next"
import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from "react-native"
import Icon from "react-native-vector-icons/AntDesign"

interface SettingsScreenProps {
	navigation: AppStackNavigator
}

const CloseButton: FC<PressableProps> = ({ ...rest }) => (
	<Pressable style={$closeButtonContainer} {...rest}>
		<Icon name="close" size={24} color={colors.palette.neutral500} />
	</Pressable>
)

const SettingsScreen: FC<SettingsScreenProps> = ({ navigation }) => {
	const { t } = useTranslation(["settings"])

	return (
		<Screen safeAreaEdges={["bottom", "top"]} style={$container}>
			<View style={$header}>
				<CloseButton onPress={() => navigation.navigate("MapScreen")} />
				<Text weight="bold" size="md">
					{t("settings:hello_parker")}
				</Text>
			</View>
		</Screen>
	)
}

const $container: ViewStyle = {
	...StyleSheet.absoluteFillObject,
	flexDirection: "column",
}

const $header: ViewStyle = {
	width: "100%",
	height: 60,
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "center",
}

const $closeButtonContainer: ViewStyle = {
	backgroundColor: colors.palette.neutral200,
	height: 50,
	width: 50,
	borderRadius: 50,
	justifyContent: "center",
	alignItems: "center",
}

export default SettingsScreen
