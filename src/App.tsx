/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import React from "react"
import "react-native-gesture-handler"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MMKV } from "react-native-mmkv"
import { PaperProvider } from "react-native-paper"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { ThemeProvider, PaperTheme } from "@/theme"

import ApplicationNavigator from "./navigators/Application"
import "./translations"
import { ViewStyle } from "react-native"

const queryClient = new QueryClient()

export const storage = new MMKV()

function App() {
	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider storage={storage}>
					<PaperProvider theme={PaperTheme}>
						<GestureHandlerRootView style={$container}>
							<ApplicationNavigator />
						</GestureHandlerRootView>
					</PaperProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</SafeAreaProvider>
	)
}

const $container: ViewStyle = {
	flex: 1,
}
export default App
