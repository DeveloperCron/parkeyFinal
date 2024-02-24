import React, { useState, useEffect } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"

import { Example, Startup, LoginScreen } from "@/screens"
import { useTheme } from "@/theme"

import type { ApplicationStackParamList } from "@/types/navigation"

const Stack = createStackNavigator<ApplicationStackParamList>()

function ApplicationNavigator() {
	const { navigationTheme, changeTheme } = useTheme()
	const [initializing, setInitializing] = useState<boolean>(true)
	const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(null)

	function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
		setCurrentUser(user)
		if (initializing) setInitializing(false)
	}

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged)
		return unsubscribe
	}, [])

	useEffect(() => {
		changeTheme("default")
	}, [])

	GoogleSignin.configure({
		webClientId: "362563148147-a8900c1kpvefggfpbfeadrser6o4t7j1.apps.googleusercontent.com",
		scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
	})

	return (
		<NavigationContainer theme={navigationTheme}>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{currentUser ? (
					<></>
				) : (
					<>
						<Stack.Screen name="LoginScreen" component={LoginScreen} />
						<Stack.Screen name="Startup" component={Startup} />
						<Stack.Screen name="Example" component={Example} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default ApplicationNavigator
