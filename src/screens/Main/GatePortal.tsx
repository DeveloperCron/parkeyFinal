import React, { forwardRef, memo, useImperativeHandle, useRef, useState, FC, useCallback, useEffect } from "react"
import { StyleSheet, View, ViewStyle, Pressable, Image, TextStyle } from "react-native"
import Icon from "react-native-vector-icons/AntDesign"
import MUIcon from "react-native-vector-icons/MaterialIcons"
import Octicons from "react-native-vector-icons/Octicons"
import Skeleton from "@/components/Skeleton"
import { Text, Button } from "@/components"

import { Portal, Chip, Divider } from "react-native-paper"
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated"

import { colors, spacing } from "@/theme"
import { GateMarkerType } from "@/constants"
import { Result, usePlaceDetails } from "@/hooks/usePlaceDetails"

import crashlytics from "@react-native-firebase/crashlytics"

export interface GatePortalRef {
	handlePortalVisibility: () => void
	fetchPlaceDetails: (item: GateMarkerType) => Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GatePortalProps {}

const GatePortal = forwardRef<GatePortalRef, GatePortalProps>(function GatePortal(props, ref) {
	const portalRef = useRef(null)
	const [showPortal, setShowPortal] = useState<boolean>(false)
	const [portalContent, setPortalContent] = useState<Result>()
	const [image, setImage] = useState<string>()
	const { getDetails, retrieveImageFromReference } = usePlaceDetails()

	const handlePortalVisibility = () => {
		setShowPortal((prevState) => !prevState)
	}

	const fetchPlaceDetails = useCallback(async (item: GateMarkerType) => {
		try {
			const { data } = await getDetails(item.place_id)
			if (data.result) setPortalContent(data.result)
		} catch (e: any) {
			crashlytics().log(e)
		}
	}, [])

	useEffect(() => {
		const fetchImage = async () => {
			try {
				if (portalContent && portalContent.photos && portalContent.photos.length > 0) {
					const result = await retrieveImageFromReference(portalContent.photos[0].photo_reference)
					if (result) {
						setImage(result)
					} else {
						console.log("Image not available")
					}
				}
			} catch (error) {
				console.error("Error fetching image:", error)
			}
		}

		fetchImage().catch(() => console.log("error occured"))
	}, [portalContent, retrieveImageFromReference])

	// Expose functions to the root
	useImperativeHandle(
		ref,
		() => {
			return {
				handlePortalVisibility,
				fetchPlaceDetails,
			}
		},
		[],
	)

	return (
		<>
			{showPortal && (
				<Portal.Host ref={portalRef}>
					<View style={$container}>
						<Animated.View
							style={$contentContainer}
							entering={SlideInDown.duration(1000).springify().mass(0.1)}
							exiting={SlideOutDown.duration(300)}
						>
							<View style={$portalHeader}>
								<Text style={$portalHeaderTitle}>{portalContent?.name}</Text>
								<CloseButton onPress={handlePortalVisibility} />
							</View>
							<View style={$portalBody}>
								{image ? (
									<Image
										source={{ uri: image }}
										style={{ height: 140, width: "100%", borderRadius: 15 }}
									/>
								) : (
									<Skeleton width={"100%"} height={150} />
								)}
								<View
									style={{
										width: "100%",
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
										gap: spacing.sm,
										marginTop: spacing.md,
									}}
								>
									<MUIcon name="location-pin" size={24} color={colors.palette.neutral600} />
									<Text style={$placeAddress}>{portalContent?.formatted_address}</Text>
								</View>
								{portalContent?.opening_hours && (
									<View
										style={{
											width: "100%",
											flexDirection: "row",
											justifyContent: "flex-start",
											alignItems: "center",
											gap: spacing.sm,
										}}
									>
										<Octicons name="clock" size={20} color={colors.palette.neutral600} />
										<Text size="xs" style={$placeAddress}>
											Place is currently:
										</Text>
										{portalContent?.opening_hours.open_now ? (
											<Chip disabled mode="outlined" compact textStyle={{ color: "#48BB78" }}>
												Open
											</Chip>
										) : (
											<Chip disabled textStyle={{ color: "#F56565" }} mode="outlined" compact>
												Closed
											</Chip>
										)}
									</View>
								)}
								{portalContent?.wheelchair_accessible_entrance && (
									<View
										style={{
											width: "100%",
											justifyContent: "flex-start",
											alignItems: "center",
											flexDirection: "row",
											gap: 10,
										}}
									>
										<MUIcon name="accessible" color={colors.palette.neutral600} size={25} />
										<Text style={$placeAddress}>Place is accessible</Text>
									</View>
								)}
								<Button text={"Choose Place"} style={$openGateButton} preset="reversed" />
							</View>
						</Animated.View>
					</View>
				</Portal.Host>
			)}
		</>
	)
})

const CloseButton: FC<{ onPress: () => void }> = ({ onPress }) => (
	<Pressable style={$closeButtonContainer} onPress={onPress}>
		<Icon name="close" size={20} color={colors.palette.neutral800} />
	</Pressable>
)

const $container: ViewStyle = {
	...StyleSheet.absoluteFillObject,
	backgroundColor: colors.palette.BlackAlpha[300],
}

const $contentContainer: ViewStyle = {
	backgroundColor: colors.palette.neutral100,
	height: "55%",
	width: "100%",
	position: "absolute",
	bottom: 0,
	borderTopLeftRadius: 40,
	borderTopRightRadius: 40,
	alignItems: "center",
	padding: spacing.sm,
}

const $closeButtonContainer: ViewStyle = {
	backgroundColor: colors.palette.neutral200,
	height: 30,
	width: 30,
	borderRadius: 50,
	justifyContent: "center",
	alignItems: "center",
}

const $portalHeader: ViewStyle = {
	width: "90%",
	height: 60,
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
}

const $portalHeaderTitle: TextStyle = {
	color: colors.palette.neutral800,
	fontWeight: "bold",
	fontSize: 18,
}

const $portalBody: ViewStyle = {
	width: "95%",
	height: "auto",
	gap: spacing.xxs,
	justifyContent: "flex-start",
	alignItems: "center",
}

const $placeAddress: TextStyle = {
	color: colors.palette.neutral600,
	fontWeight: "bold",
	fontSize: 14,
}

const $openGateButton: ViewStyle = {
	marginTop: spacing.lg,
	backgroundColor: colors.blue[400],
	borderRadius: 60,
	height: 65,
	maxHeight: 70,
	width: "100%",
}

export default memo(GatePortal)
