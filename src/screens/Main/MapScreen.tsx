// Importing necessary modules and types
import React, { FC, useCallback, useEffect, useRef, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import crashlytics from "@react-native-firebase/crashlytics"
import MapView, { PROVIDER_GOOGLE, Region, Marker, LatLng } from "react-native-maps"
import { PermissionsAndroid, Platform, StyleSheet, View, Pressable } from "react-native"
import Geolocation, { GeoError, GeoPosition } from "react-native-geolocation-service"
import { LocationButton } from "@/components"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { Screen } from "@/components"
import SearchPortal from "@/screens/Main/SearchPortal"
import RecentPlacesFlatList from "@/components/recentPlaces/RecentPlacesFlatList"
import { colors } from "@/theme"
import { PredictionType } from "@/components/googlePlaces/GooglePlacesFlatList"
import { usePlaceDetails } from "@/hooks/usePlaceDetails"
import FakeSearchbox from "@/components/googlePlaces/FakeSearchbox"
import { GATES_DICTIONARY } from "@/constants"

import FeatherIcon from "react-native-vector-icons/Feather"
import Ionicons from "react-native-vector-icons/Ionicons"
import FAIcon from "react-native-vector-icons/FontAwesome6"
import useStorage from "@/hooks/useStorage"
import { AppStackNavigator } from "@/navigators/Application"

// Constants
const ANIMATION_DURATION = 1000
const LATITUDES = 0.003

// Typings for the component props
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MapScreenProps {
	navigation: AppStackNavigator
}

// Main component
const MapScreen: FC<MapScreenProps> = observer(function MapScreen({ navigation }) {
	// State and ref declarations
	const [searchPortalVisible, setSearchPortalVisible] = useState<boolean>(false)
	const [searchResultLocation, setSearchResultLocation] = useState<Region | undefined>(undefined)
	const [currentUserLocation, setCurrentUserLocation] = useState<LatLng>({
		latitude: 32.6432432466,
		longitude: 32.58283,
	})
	const [index, setIndex] = useState<number>(0)
	const bottomSheetRef = useRef<BottomSheet>(null)
	const mapRef = useRef<MapView>(null)
	const snapPoints = useMemo(() => ["15%", "40%", "60%"], [])
	const { insert } = useStorage()

	// Custom hook for fetching place details
	const { getDetails } = usePlaceDetails()

	// Callback for BottomSheet changes
	const handleSheetChanges = useCallback((newIndex: number) => {
		setIndex(newIndex)
	}, [])

	// Requesting permissions on componentWillMount
	useEffect(() => {
		const subscription = async () => {
			try {
				await requestPermissions()
			} catch {
				crashlytics().log("Request permissions failed")
			}
		}

		subscription()
	}, [])

	// Fire on componentWillUnmount
	useEffect(() => {
		const clearGeolocationCache = async () => {
			try {
				await Geolocation.stopObserving()
			} catch {
				crashlytics().log("Cannot clearGeolocationCache")
			}
		}

		return () => {
			clearGeolocationCache().catch((e) => crashlytics().log(e))
		}
	}, [])

	useEffect(() => {
		const latitude = searchResultLocation?.latitude
		const longitude = searchResultLocation?.longitude

		if (latitude !== undefined && longitude !== undefined) {
			mapRef.current?.animateToRegion({
				latitude: latitude,
				longitude: longitude,
				longitudeDelta: LATITUDES,
				latitudeDelta: LATITUDES,
			})
		}
	}, [searchResultLocation])

	// Function to get current user position
	const getCurrentUserPosition = useCallback(() => {
		if (Platform.OS === "ios") {
			Geolocation.requestAuthorization("whenInUse").catch((e) => crashlytics().log(e))
		}
		Geolocation.getCurrentPosition(
			(position: GeoPosition) => {
				const { coords } = position
				setCurrentUserLocation(coords)

				mapRef.current?.animateToRegion(
					{
						latitude: coords.latitude,
						longitude: coords.longitude,
						longitudeDelta: LATITUDES,
						latitudeDelta: LATITUDES,
					},
					ANIMATION_DURATION,
				)
			},
			(error: GeoError) => {
				crashlytics().recordError(new Error(error.message))
			},
			{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
		)
	}, [mapRef])

	// Function to request permissions
	const requestPermissions = async () => {
		if (Platform.OS === "ios") {
			getCurrentUserPosition()
		} else {
			try {
				const hasPermission = await PermissionsAndroid.check(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				)

				if (!hasPermission) {
					const granted = await PermissionsAndroid.request(
						PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
						{
							title: "Device current location",
							message: "Allow app to get current location",
							buttonPositive: "Allow",
							buttonNegative: "Cancel",
						},
					)

					if (granted === PermissionsAndroid.RESULTS.GRANTED) {
						getCurrentUserPosition()
					}
				} else {
					// Permission already granted, handle accordingly
					getCurrentUserPosition()
				}
			} catch {
				crashlytics().recordError(new Error("Error occurred in getting permission"))
			}
		}
	}

	// Toggle searchbox visibility
	const handleSearchboxVisibility = useCallback(() => {
		setSearchPortalVisible((prevState) => !prevState)
		bottomSheetRef.current?.collapse()
	}, [])

	// Function to handle selected place
	const onPlaceSelected = useCallback((item: PredictionType) => {
		insert(item)
		// Uncomment and modify as needed
		const tryToFetchResult = () => {
			getDetails(item.place_id).then(({ data }) => {
				setSearchResultLocation({
					latitude: data.result.geometry.location.lat,
					longitude: data.result.geometry.location.lng,
					latitudeDelta: LATITUDES, // Adjust the value as needed
					longitudeDelta: LATITUDES, // Adjust the value as needed
				})

				setSearchPortalVisible((prevState) => !prevState)
			})
		}
		tryToFetchResult()
	}, [])

	const onRecentItemSelected = useCallback((item: PredictionType) => {
		const fetchDetails = () => {
			getDetails(item.place_id).then(({ data }) => {
				setSearchResultLocation({
					latitude: data.result.geometry.location.lat,
					longitude: data.result.geometry.location.lng,
					latitudeDelta: LATITUDES, // Adjust the value as needed
					longitudeDelta: LATITUDES, // Adjust the value as needed
				})
			})
		}

		fetchDetails()
	}, [])

	return (
		<Screen contentContainerStyle={styles.container}>
			{/* MapView component */}
			<MapView
				provider={PROVIDER_GOOGLE}
				style={styles.map}
				loadingEnabled
				loadingIndicatorColor={colors.palette.neutral400}
				onMapLoaded={getCurrentUserPosition}
				ref={mapRef}
			>
				{/** User location marker */}
				<Marker key={index} coordinate={currentUserLocation} tracksViewChanges={false} title="Your location">
					<Ionicons name="location-sharp" size={35} color={colors.palette.Blue[400]} />
				</Marker>

				{GATES_DICTIONARY.map((item, index) => (
					<Marker key={index} coordinate={item.coords} tracksViewChanges={false}>
						<FAIcon name="square-parking" size={30} color={colors.palette.neutral700} />
					</Marker>
				))}
			</MapView>

			{/* LocationButton component */}
			<LocationButton onPress={getCurrentUserPosition} bottomInset={snapPoints[index]} />

			{/* BottomSheet component */}
			<BottomSheet
				ref={bottomSheetRef}
				onChange={handleSheetChanges}
				enableContentPanningGesture={false}
				index={index}
				snapPoints={snapPoints}
			>
				<BottomSheetView style={styles.bottomSheetContainer}>
					{/* BottomSheet header */}
					<View style={styles.bottomSheetHeaderContainer}>
						{/* CloseButton component */}
						<MenuButton onPress={() => navigation.navigate("SettingsScreen")} />

						{/* FakeSearchbox component */}
						<FakeSearchbox onPress={handleSearchboxVisibility} />
					</View>

					{/* RecentPlacesFlatList component */}
					<RecentPlacesFlatList onItemSelected={onRecentItemSelected} />
				</BottomSheetView>
			</BottomSheet>

			{/* SearchPortal component */}
			{searchPortalVisible && (
				<SearchPortal onCloseButtonPress={handleSearchboxVisibility} onPlaceChosen={onPlaceSelected} />
			)}
		</Screen>
	)
})

const MenuButton: FC<{ onPress: () => void }> = ({ onPress }) => (
	<Pressable style={styles.menuButtonContainer} onPress={onPress}>
		<FeatherIcon name="menu" size={24} color={colors.palette.neutral500} />
	</Pressable>
)

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
	bottomSheetContainer: {
		flex: 1,
		alignItems: "center",
		width: "100%",
		height: "auto",
		padding: 15,
	},
	screenContainer: {
		...StyleSheet.absoluteFillObject,
	},
	menuButtonContainer: {
		backgroundColor: colors.palette.neutral200,
		height: 65,
		width: 65,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	bottomSheetHeaderContainer: {
		width: "100%",
		height: "auto",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 5,
	},
})

export default MapScreen
