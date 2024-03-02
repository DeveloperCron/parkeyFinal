import React, { FC, useCallback, useMemo, ComponentType } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import Icon from "react-native-vector-icons/AntDesign"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import crashlytics from "@react-native-firebase/crashlytics"
import { colors, spacing } from "@/theme"

import { Button, ButtonAccessoryProps } from "./Button"
import { useTranslation } from "react-i18next"

// eslint-disable-next-line @typescript-eslint/ban-types
type IGoogleSignInButtonProps = {}
export const GoogleSignInButton: FC<IGoogleSignInButtonProps> = () => {
	const { t } = useTranslation(["login", "common"])

	async function loginWithGoogle() {
		await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
		const { idToken } = await GoogleSignin.signIn()
		const googleCredential = auth.GoogleAuthProvider.credential(idToken)
		return auth().signInWithCredential(googleCredential)
	}

	const onButtonTap = useCallback(() => {
		loginWithGoogle()
			.then(() => console.log("Sign in with google"))
			.catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) =>
				crashlytics().recordError(new Error(error.code)),
			)
	}, [])

	const GoogleLeftAccessory: ComponentType<ButtonAccessoryProps> = useMemo(
		() =>
			function GoogleRightAccessory(_: ButtonAccessoryProps) {
				return <Icon name="google" size={24} color={colors.palette.BlackAlpha["700"]} />
			},
		[],
	)

	return (
		<Button
			testID="google-button"
			text={t("common:google-button")}
			style={$buttonContainerStyle}
			preset="reversed"
			textStyle={$buttonTextStyle}
			LeftAccessory={GoogleLeftAccessory}
			onPress={onButtonTap}
		/>
	)
}

const $buttonContainerStyle: ViewStyle = {
	backgroundColor: colors.blackAlpha[200],
	borderRadius: 50,
	height: 60,
	gap: spacing.sm,
}

const $buttonTextStyle: TextStyle = {
	color: colors.blackAlpha[700],
}
