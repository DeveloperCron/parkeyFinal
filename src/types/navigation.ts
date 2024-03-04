import type { StackScreenProps } from "@react-navigation/stack"

export type ApplicationStackParamList = {
	Startup: undefined
	Example: undefined
	LoginScreen: undefined
	RegisterScreen: undefined
	MapScreen: undefined
	SettingsScreen: undefined
}

export type ApplicationScreenProps = StackScreenProps<ApplicationStackParamList>
