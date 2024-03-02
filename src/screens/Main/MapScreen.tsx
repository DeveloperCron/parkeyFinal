import React, { FC, createRef, useCallback, useEffect, useRef, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import crashlytics from "@react-native-firebase/crashlytics"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import { Alert, PermissionsAndroid, Platform, StyleSheet } from "react-native"
import Geolocation from "@react-native-community/geolocation"
import { LocationButton } from "@/components"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { GeolocationError, GeolocationPosition } from "@/types/geolocation"
import FakeSearchbox from "@/components/googlePlaces/FakeSearchbox"
import { Screen } from "@/components"
import SearchPortal from "@/screens/Main/SearchPortal"
import { MAP_STYLING } from "@/constants"

const ANIMATION_DURATION = 2000
const GEOLOCATION_TIMEOUT = 20000
const MAXIMUM_AGE = 1000
const ENABLE_HIGH_ACCURACY = false

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
})

// eslint-disable-next-line @typescript-eslint/ban-types
export type MapScreenProps = {}
const MapScreen: FC<MapScreenProps> = observer(function MapScreen() {
	const [searchPortalVisible, setSearchPortalVisible] = useState<boolean>(false)
	const [index, setIndex] = useState<number>(0)
	const bottomSheetRef = useRef<BottomSheet>(null)
	const mapRef = createRef<MapView>()

	const snapPoints = useMemo(() => ["15%", "40%", "50%"], [])

	// callbacks
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
						longitudeDelta: 0.003,
						latitudeDelta: 0.003,
					},
					ANIMATION_DURATION,
				)
			},
			(error: GeolocationError) => Alert.alert("Error", JSON.stringify(error)),
			{ enableHighAccuracy: ENABLE_HIGH_ACCURACY, timeout: GEOLOCATION_TIMEOUT, maximumAge: MAXIMUM_AGE },
		)
	}, [mapRef])

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

	const handleSearchboxVisibility = useCallback(() => {
		setSearchPortalVisible((prevState) => !prevState)

		bottomSheetRef.current?.collapse()
	}, [])

	return (
		<Screen contentContainerStyle={styles.container}>
			<MapView
				provider={PROVIDER_GOOGLE}
				style={styles.map}
				showsUserLocation
				showsMyLocationButton={false}
				followsUserLocation
				userLocationCalloutEnabled
				ref={mapRef}
				customMapStyle={MAP_STYLING}
				region={{
					latitude: 37.78825,
					longitude: -122.4324,
					latitudeDelta: 0.015,
					longitudeDelta: 0.0121,
				}}
			/>

			<LocationButton onPress={getCurrentUserPosition} bottomInset={snapPoints[index]} />
			<BottomSheet ref={bottomSheetRef} onChange={handleSheetChanges} index={index} snapPoints={snapPoints}>
				<BottomSheetView style={styles.bottomSheetContainer}>
					<FakeSearchbox onPress={handleSearchboxVisibility} />
				</BottomSheetView>
			</BottomSheet>
			{searchPortalVisible && <SearchPortal onCloseButtonPress={handleSearchboxVisibility} />}
		</Screen>
	)
})

export default MapScreen
