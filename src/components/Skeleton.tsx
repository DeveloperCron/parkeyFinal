/**
 * Skeleton Component - Inspired by React Native Elements
 *
 * A lightweight and customizable skeleton loader component to simulate content loading.
 *
 * @component
 * @example
 * // Basic usage:
 * <Skeleton width={40} height={40} />
 *
 * // Circular skeleton:
 * <Skeleton circle diameter={40} />
 *
 * @param {number} width - The width of the rectangular skeleton (default: 100%).
 * @param {number} height - The height of the rectangular skeleton (default: 16px).
 * @param {number} circle - The diameter of the circular skeleton (overrides width and height if provided).
 * @returns {JSX.Element} - The Skeleton component.
 */

import React, { useEffect, forwardRef, memo, useRef, useState, ReactElement } from "react"
import { Animated, View, Platform, ViewProps, StyleProp, ViewStyle, StyleSheet } from "react-native"
import { colors } from "@/theme"

/**
 * Skeleton Component
 *
 * A customizable skeleton loader to simulate content loading.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.circle - If true, renders a circular skeleton.
 * @param {string | number} props.width - Width of the rectangular skeleton (default: "100%").
 * @param {string | number} props.height - Height of the rectangular skeleton (default: 12).
 * @param {string} props.animation - Type of animation ("pulse" or "wave", default: "pulse").
 * @param {Object} props.style - Custom styles for the container.
 * @param {Object} props.skeletonStyle - Custom styles for the skeleton element.
 * @param {React.ComponentType} props.LinearGradientComponent - Custom gradient component.
 * @returns {JSX.Element} - The Skeleton component.
 */
export interface SkeletonProps extends ViewProps {
	circle?: boolean
	width?: ViewStyle["width"]
	height?: ViewStyle["height"]
	animation?: "none" | "pulse" | "wave"
	skeletonStyle?: StyleProp<ViewStyle>
	LinearGradientComponent?: React.ComponentType<any>
}

const Skeleton = forwardRef<ReactElement, SkeletonProps>(function Skeleton(props: SkeletonProps, ref) {
	const {
		circle,
		width = "100%",
		height,
		animation = "pulse",
		style,
		skeletonStyle,
		LinearGradientComponent,
		...rest
	} = props
	const animationRef = useRef(new Animated.Value(0))
	const animationLoop = useRef<Animated.CompositeAnimation>()

	const [layoutWidth, setLayoutWidth] = useState<number>(0)
	useEffect(() => {
		animationLoop.current = Animated.timing(animationRef.current, {
			toValue: 2,
			delay: 400,
			duration: 1500,
			useNativeDriver: !!Platform.select({
				web: false,
				native: true,
			}),
		})
		animationRef.current.setValue(0)
		Animated.loop(animationLoop.current).start()
	}, [])

	return (
		<View
			accessibilityRole="none"
			accessibilityLabel="loading..."
			accessible={false}
			testID="RNE__Skeleton"
			onLayout={({ nativeEvent }) => {
				setLayoutWidth(nativeEvent.layout.width)
			}}
			style={[
				styles.container,
				{
					width: width,
					height: height || 12,
					backgroundColor: colors.palette.neutral200,
				},
				circle && {
					borderRadius: 50,
					height: height || width,
				},
				style,
			]}
			{...rest}
		>
			{animation !== "none" && (
				<Animated.View
					style={[
						styles.skeleton,
						!LinearGradientComponent && {
							backgroundColor: colors.palette.neutral300,
						},
						animation === "pulse" && {
							width: "100%",
							opacity: animationRef.current.interpolate({
								inputRange: [0, 1, 2],
								outputRange: [1, 0, 1],
							}),
						},
						animation === "wave" && {
							transform: [
								{
									translateX: animationRef.current.interpolate({
										inputRange: [0, 2],
										outputRange: [-layoutWidth * 2, layoutWidth * 2],
									}),
								},
							],
						},
						skeletonStyle,
					]}
				>
					{LinearGradientComponent && (
						<LinearGradientComponent
							style={styles.skeleton}
							colors={[colors.palette.neutral200, colors.palette.neutral300, colors.palette.neutral600]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
					)}
				</Animated.View>
			)}
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
		borderRadius: 2,
	},
	skeleton: {
		height: "100%",
	},
})

export default memo(Skeleton)
