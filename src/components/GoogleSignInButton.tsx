import React, { FC, useCallback, memo, useMemo, ComponentType } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import Icon from "react-native-vector-icons/AntDesign"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import crashlytics from "@react-native-firebase/crashlytics"
import { colors, spacing } from "@/theme"

import { Button, ButtonAccessoryProps } from "./Button"
import { useTranslation } from "react-i18next"

type IGoogleSignInButtonProps = {}
const GoogleSignInButton: FC<IGoogleSignInButtonProps> = () => {
	const { t } = useTranslation(["login", "common"])

	async function loginWithGoogle() {
		await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
		const { idToken } = await GoogleSignin.signIn()
		const googleCredential = auth.GoogleAuthProvider.credential(idToken)
		return auth().signInWithCredential(googleCredential)
	}

	const onButtonTap = useCallback(() => {
		loginWithGoogle().catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) =>
			crashlytics().recordError(new Error(error.code)),
		)
	}, [])

	const GoogleLeftAccessory: ComponentType<ButtonAccessoryProps> = useMemo(
		() =>
			function GoogleRightAccessory(_: ButtonAccessoryProps) {
				return <Icon name="google" size={24} color={colors.palette.neutral800} />
			},
		[],
	)

	return (
		<Button
			testID="google-button"
			text={t("common:google-button")}
			style={$buttonStyle}
			preset="reversed"
			textStyle={$buttonText}
			LeftAccessory={GoogleLeftAccessory}
			onPress={onButtonTap}
		/>
	)
}

const $buttonStyle: ViewStyle = {
	backgroundColor: colors.blackAlpha[400],
	borderRadius: 12,
	gap: spacing.sm,
}

const $buttonText: TextStyle = {
	color: colors.text,
}

export default memo(GoogleSignInButton)
