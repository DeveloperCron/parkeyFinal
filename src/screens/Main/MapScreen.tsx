// Importing necessary modules and types
import React, { FC, createRef, useCallback, useEffect, useRef, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import crashlytics from "@react-native-firebase/crashlytics"
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps"
import { Alert, PermissionsAndroid, Platform, StyleSheet, View, Pressable } from "react-native"
import Geolocation from "@react-native-community/geolocation"
import { GeolocationError, GeolocationPosition } from "@/types/geolocation"
import { LocationButton } from "@/components"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { Screen } from "@/components"
import SearchPortal from "@/screens/Main/SearchPortal"
import RecentPlacesFlatList from "@/components/recentPlaces/RecentPlacesFlatList"
import { colors } from "@/theme"
import Icon from "react-native-vector-icons/Feather"
import { PredictionType } from "@/components/googlePlaces/GooglePlacesFlatList"
import { usePlaceDetails } from "@/hooks/usePlaceDetails"
import FakeSearchbox from "@/components/googlePlaces/FakeSearchbox"

// Constants
const ANIMATION_DURATION = 2000
const GEOLOCATION_TIMEOUT = 20000
const MAXIMUM_AGE = 1000
const ENABLE_HIGH_ACCURACY = false
const LATITUDES = 0.003

// Typings for the component props
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MapScreenProps {}

// Main component
const MapScreen: FC<MapScreenProps> = observer(function MapScreen() {
	// State and ref declarations
	const [searchPortalVisible, setSearchPortalVisible] = useState<boolean>(false)
	const [searchResultLocation, setSearchResultLocation] = useState<Region | undefined>(undefined)
	const [index, setIndex] = useState<number>(0)
	const bottomSheetRef = useRef<BottomSheet>(null)
	const mapRef = createRef<MapView>()
	const snapPoints = useMemo(() => ["15%", "40%", "60%"], [])

	// Custom hook for fetching place details
	const { getDetails } = usePlaceDetails()

	// Callback for BottomSheet changes
	const handleSheetChanges = useCallback((newIndex: number) => {
		setIndex(newIndex)
	}, [])

	// Requesting permissions on mount
	useEffect(() => {
		const subscription = async () => {
			await requestPermissions()
		}

		subscription()
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
		Geolocation.requestAuthorization(
			() => crashlytics().log("Authorization complete"),
			() => crashlytics().recordError(new Error("Error occurred in requestAuthorization")),
		)

		Geolocation.getCurrentPosition(
			(position: GeolocationPosition) => {
				const { coords } = position

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
			(error: GeolocationError) => Alert.alert("Error", JSON.stringify(error)),
			{ enableHighAccuracy: ENABLE_HIGH_ACCURACY, timeout: GEOLOCATION_TIMEOUT, maximumAge: MAXIMUM_AGE },
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

	return (
		<Screen contentContainerStyle={styles.container}>
			{/* MapView component */}
			<MapView
				provider={PROVIDER_GOOGLE}
				style={styles.map}
				showsUserLocation
				showsMyLocationButton={true}
				loadingEnabled
				loadingIndicatorColor={colors.palette.neutral400}
				onMapLoaded={getCurrentUserPosition}
				followsUserLocation
				userLocationCalloutEnabled
				ref={mapRef}
			></MapView>

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
						<MenuButton onPress={() => console.log("TO DO")} />

						{/* FakeSearchbox component */}
						<FakeSearchbox onPress={handleSearchboxVisibility} />
					</View>

					{/* RecentPlacesFlatList component */}
					<RecentPlacesFlatList />
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
		<Icon name="menu" size={24} color={colors.palette.neutral500} />
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
