import React, { useCallback, useState, memo, FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Screen, Button, Text } from "@/components"
import { Snackbar, TextInput } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { colors, spacing } from "@/theme"

import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import crashlytics from "@react-native-firebase/crashlytics"
import GoogleSignInButton from "@/components/GoogleSignInButton"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ILoginScreenProps {}
const LoginScreen: FC<ILoginScreenProps> = () => {
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState<boolean>(true)
	const [errorVisible, setErrorVisible] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string>("")
	const { t } = useTranslation(["login"])

	const onDismissSnackBar = () => setErrorVisible(false)
	const onLoginButtonPress = useCallback(() => {
		auth()
			.signInWithEmailAndPassword(email, password)
			.catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
				crashlytics().recordError(new Error(error.code))

				const { message, code } = error
				if (code === "auth/invalid-email") {
					if (!error) setErrorVisible(!error)
					setErrorMessage(message)
				}

				if (code === "auth/invalid-password") {
					if (!error) setErrorVisible(!error)
					setErrorMessage(message)
				}
			})
	}, [])

	return (
		<Screen contentContainerStyle={$container}>
			<View style={$header}>
				<Text style={$headerTitle} size="xxl" weight="bold">
					{t("login:header")}
				</Text>
				<Text style={$headerDescription} size="sm" weight="bold">
					{t("login:header-description")}
				</Text>
			</View>
			<View style={$inputsContainer}>
				<TextInput
					label={t("login:emailField")}
					inputMode="email"
					value={email}
					onChangeText={(text) => setEmail(text)}
					autoCapitalize="none"
					autoCorrect={false}
					autoComplete="email"
				/>

				<TextInput
					label={t("login:passwordField")}
					inputMode="text"
					value={password}
					secureTextEntry={isAuthPasswordHidden}
					right={
						<TextInput.Icon
							icon={isAuthPasswordHidden ? "eye" : "eye-off"}
							onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
						/>
					}
					onChangeText={(text) => setPassword(text)}
					autoCapitalize="none"
					autoCorrect={false}
					autoComplete="password"
				/>
			</View>
			<View style={$actionsContainer}>
				<Button
					text={t("login:signin-button")}
					style={$signInButton}
					preset="reversed"
					onPress={onLoginButtonPress}
				/>
				<GoogleSignInButton />
			</View>
			<Snackbar visible={errorVisible} onDismiss={onDismissSnackBar}>
				{errorMessage}
			</Snackbar>
		</Screen>
	)
}

const $container: ViewStyle = {
	width: "100%",
	height: "100%",
	justifyContent: "center",
	alignItems: "center",
	display: "flex",
	gap: 20,
	padding: 10,
}

const $header: ViewStyle = {
	width: "100%",
	height: "auto",
	display: "flex",
}

const $headerTitle: TextStyle = {
	color: colors.palette.neutral800,
}

const $headerDescription: TextStyle = {
	color: colors.palette.neutral600,
}

const $actionsContainer: ViewStyle = {
	width: "100%",
	height: "auto",
	display: "flex",
	flexDirection: "column",
}

const $inputsContainer: ViewStyle = {
	width: "95%",
	display: "flex",
	height: "auto",
	flexDirection: "column",
	gap: 5,
}

const $signInButton: ViewStyle = {
	marginTop: spacing.xs,
	backgroundColor: colors.blue[400],
	borderRadius: 12,
}

export default memo(LoginScreen)
