import React, { FC, useCallback } from "react"
import { View, ViewStyle, TextStyle, StyleSheet, Pressable, PressableProps, Alert, ToastAndroid } from "react-native"
import { Text } from "@/components"
import { Screen } from "@/components"

import { Appbar, Divider } from "react-native-paper"
import { AppStackNavigator } from "@/navigators/Application"
import { colors } from "@/theme"

import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import auth from "@react-native-firebase/auth"
import useStorage from "@/hooks/useStorage"

interface SettingsScreenProps {
	navigation: AppStackNavigator
}
const SettingsScreen: FC<SettingsScreenProps> = ({ navigation, ...rest }) => {
	const { removeAll } = useStorage()

	// Navigate back to MapScreen
	const onBackActionPress = useCallback(() => {
		navigation.goBack()
	}, [])

	const onLogoutPress = useCallback(async () => {
		await auth().signOut()
	}, [])

	const onClearRecentPlacesPress = useCallback(() => {
		removeAll()

		ToastAndroid.show("Cleared recent places", ToastAndroid.SHORT)
	}, [])

	return (
		<Screen safeAreaEdges={["bottom"]} contentContainerStyle={$screenContainer}>
			<Appbar.Header mode="large" style={$appbarStyle}>
				<Appbar.BackAction onPress={onBackActionPress} />
				<Appbar.Content
					title={"Settings"}
					titleStyle={{
						fontWeight: "bold",
						fontSize: 25,
					}}
				/>
			</Appbar.Header>
			<View style={$screenBody}>
				<Text style={$bodyTitle}>General</Text>
				<View style={$customDivider} />
				<View style={$bodyActions}>
					<SettingButton icon="account-outline" label="Account" />
					<Divider />
					<SettingButton
						label="Clear recent places"
						icon="trash-can-outline"
						onPress={onClearRecentPlacesPress}
					/>
					<Divider />
					<SettingButton icon="help-rhombus-outline" label="Help and feedback" />
					<Divider />
					<SettingButton icon="map-outline" label="Map display" />
					<Divider />
					<SettingButton icon="eye-outline" label="Appearance" />
					<Divider />
					<SettingButton label="Sign Out" icon="logout" onPress={onLogoutPress} />
				</View>
			</View>
		</Screen>
	)
}

/**
 * Interface representing the props for a setting button component.
 * Extends PressableProps to inherit Pressable component properties.
 */
interface SettingButtonProps extends PressableProps {
	/**
	 * The icon to be displayed on the setting button.
	 * Should be a string representing the icon, such as an image source or icon name.
	 */
	icon: string

	/**
	 * The label or text associated with the setting button.
	 * This text provides additional information about the purpose of the button.
	 */
	label: string
}

const SettingButton: FC<SettingButtonProps> = ({ icon, label, ...rest }) => (
	<Pressable
		{...rest}
		style={$settingButtonContainer}
		android_ripple={{ color: colors.palette.neutral300, borderless: false }}
	>
		<MaterialIcon name={icon} size={28} color={colors.palette.neutral800} />
		<Text style={$settingButtonText}>{label}</Text>
	</Pressable>
)

const $screenContainer: ViewStyle = {
	...StyleSheet.absoluteFillObject,
	backgroundColor: colors.palette.neutral100,
}

const $appbarStyle: ViewStyle = {
	backgroundColor: colors.palette.neutral100,
}

const $screenBody: ViewStyle = {
	width: "100%",
	height: "auto",
	justifyContent: "center",
	alignItems: "center",
	display: "flex",
	padding: 20,
	flexDirection: "column",
}

const $bodyTitle: TextStyle = {
	width: "100%",
	fontSize: 16,
	fontWeight: "bold",
	marginBottom: 10,
}

const $bodyActions: ViewStyle = {
	flexDirection: "column",
	width: "95%",
	height: "auto",
	justifyContent: "center",
}

const $customDivider: ViewStyle = {
	backgroundColor: colors.palette.neutral200,
	width: "95%",
	height: 1,
}

const $settingButtonContainer: ViewStyle = {
	width: "100%",
	height: 65,
	flexDirection: "row",
	justifyContent: "flex-start",
	alignItems: "center",
	gap: 10,
}

const $settingButtonText: TextStyle = {
	fontSize: 15,
}

export default SettingsScreen
