import React, { FC } from "react"
import { Pressable, ViewStyle, PressableProps } from "react-native"
import GooglePlaceSearchbox from "./GooglePlaceSearchbox"

export type FakeSearchboxProps = PressableProps
const FakeSearchbox: FC<FakeSearchboxProps> = ({ ...rest }) => {
	return (
		<Pressable style={$pressableStyle} {...rest}>
			<GooglePlaceSearchbox disabled />
		</Pressable>
	)
}

const $pressableStyle: ViewStyle = {
	width: "85%",
	height: "auto",
	alignItems: "center",
	justifyContent: "center",
}

export default FakeSearchbox
