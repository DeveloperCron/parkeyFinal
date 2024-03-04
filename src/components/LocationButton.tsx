import React, { FC } from "react"
import { Pressable, PressableProps, ViewStyle } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome6"
import Animated, { FadeInRight, CurvedTransition } from "react-native-reanimated"
import { colors } from "@/theme"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export interface LocationButtonProps extends PressableProps {
	iconSize?: number
	iconColor?: string
	isVisible?: boolean
	bottomInset?: string
}
const LocationButton: FC<LocationButtonProps> = ({
	iconSize = 26,
	iconColor = colors.palette.neutral100,
	bottomInset = "15%",
	...props
}) => {
	return (
		<AnimatedPressable
			android_ripple={{ color: colors.palette.neutral300, borderless: false }}
			style={[$pressableStyle, { bottom: bottomInset }]}
			{...props}
			entering={FadeInRight.duration(120).springify().mass(0.3)}
			layout={CurvedTransition.duration(100).delay(120)}
			key="fede3"
		>
			<Icon name="location-crosshairs" size={iconSize} color={iconColor} />
		</AnimatedPressable>
	)
}

// Default style for the pressable container
const $pressableStyle: ViewStyle = {
	backgroundColor: colors.blackAlpha[800],
	borderRadius: 50,
	width: 70,
	height: 70,
	justifyContent: "center",
	alignItems: "center",
	position: "absolute",
	bottom: "20%",
	right: 15,
	marginBottom: 10,
}

export { LocationButton }
