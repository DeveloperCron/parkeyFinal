import React, { useCallback, useState, memo, FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Screen, Button, Text, OrSection, GoogleSignInButton } from "@/components"
import { Snackbar, TextInput } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { colors, spacing } from "@/theme"

import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import crashlytics from "@react-native-firebase/crashlytics"
import TextButton from "@/components/TextButton"
import { AppStackNavigator } from "@/navigators/Application"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IRegisterScreenProps {
	navigation: AppStackNavigator
}
const RegisterScreen: FC<IRegisterScreenProps> = ({ navigation }) => {
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState<boolean>(true)
	const [errorVisible, setErrorVisible] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string>("")
	const { t } = useTranslation(["register"])

	const onDismissSnackBar = () => setErrorVisible(false)
	const onLoginButtonPress = useCallback(() => {
		// Auth can't receive empty text that has 0 chars
		if (email.length != 0 && password.length != 0) {
			auth()
				.createUserWithEmailAndPassword(email, password)
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
		} else {
			setErrorMessage("One of the fields are empty")
			setErrorVisible(true)
		}
	}, [])

	return (
		<Screen contentContainerStyle={$container} safeAreaEdges={["top"]}>
			<View style={$header}>
				<Text style={$headerTitle} size="xl" weight="bold">
					{t("register:header")}
				</Text>
				<Text style={$headerDescription} size="xs" weight="bold">
					{t("register:header-description")}
				</Text>
			</View>
			<View style={$inputsContainer}>
				<TextInput
					label={t("register:emailField")}
					inputMode="email"
					value={email}
					onChangeText={(text) => setEmail(text)}
					autoCapitalize="none"
					autoCorrect={false}
					autoComplete="email"
				/>

				<TextInput
					label={t("register:passwordField")}
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
					text={t("register:signup-button")}
					style={$signInButton}
					preset="reversed"
					onPress={onLoginButtonPress}
				/>
				<OrSection />
				<GoogleSignInButton />
			</View>
			<TextButton
				text={t("register:signin-button")}
				alignment="center"
				onPress={() => navigation.navigate("LoginScreen")}
			/>
			<Snackbar visible={errorVisible} onDismiss={onDismissSnackBar}>
				{errorMessage}
			</Snackbar>
		</Screen>
	)
}

export default memo(RegisterScreen)

const $container: ViewStyle = {
	width: "100%",
	height: "100%",
	alignItems: "center",
	display: "flex",
	gap: 10,
	padding: 10,
}

const $header: ViewStyle = {
	width: "95%",
	height: 220,
	gap: 10,
	justifyContent: "center",
}

const $headerTitle: TextStyle = {
	color: colors.palette.neutral800,
	fontWeight: "bold",
	fontSize: 32,
}

const $headerDescription: TextStyle = {
	color: colors.palette.neutral600,
	fontSize: 16,
}

const $actionsContainer: ViewStyle = {
	width: "95%",
	height: "auto",
	display: "flex",
	flexDirection: "column",
	gap: 6,
}

const $inputsContainer: ViewStyle = {
	width: "95%",
	display: "flex",
	height: "auto",
	flexDirection: "column",
	gap: 20,
}

const $signInButton: ViewStyle = {
	marginTop: spacing.xs,
	backgroundColor: colors.blue[500],
	borderRadius: 50,
	height: 60,
}
