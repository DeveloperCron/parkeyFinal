import React, { FC } from "react"
import { Pressable, ViewStyle, PressableProps } from "react-native"
import GooglePlaceSearchbox from "./GooglePlaceSearchbox"
import { useTranslation } from "react-i18next"

export type FakeSearchboxProps = PressableProps
const FakeSearchbox: FC<FakeSearchboxProps> = ({ ...rest }) => {
	const { t } = useTranslation(["map"])

	return (
		<Pressable style={$pressableStyle} {...rest}>
			<GooglePlaceSearchbox disabled placeHolder={t("map:searchbartext")} />
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
