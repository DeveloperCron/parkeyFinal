import React, { forwardRef, ForwardedRef, ReactElement } from "react"
import { TextInput, TextInputProps } from "react-native-paper"
import { TextInput as RNTextInput, TextStyle, View, ViewStyle } from "react-native"
import { colors } from "@/theme"
import { useTranslation } from "react-i18next"

import Icon from "react-native-vector-icons/FontAwesome"

export interface GooglePlaceSearchboxProps extends TextInputProps {
	/**
	 * Display icon/button on the right
	 */
	RightAccessory?: ReactElement
}

const GooglePlaceSearchbox = forwardRef<RNTextInput, GooglePlaceSearchboxProps>(function GooglePlaceSearchbox(
	{ RightAccessory, ...rest },
	ref: ForwardedRef<RNTextInput>,
) {
	const { t } = useTranslation(["map"])

	return (
		<View style={$searchbarContainer}>
			<Icon name="search" size={22} color={colors.palette.neutral500} />
			<TextInput
				theme={undefined}
				placeholderTextColor={colors.palette.neutral500}
				textColor={colors.palette.neutral500}
				placeholder={t("map:searchbartext")}
				outlineStyle={$outlineStyle}
				style={$textInputStyle}
				mode="outlined"
				ref={ref}
				{...rest}
			/>
			{!!RightAccessory && RightAccessory}
		</View>
	)
})

const $searchbarContainer: ViewStyle = {
	width: "100%",
	height: 65,
	borderRadius: 50,
	justifyContent: "center",
	alignItems: "center",
	display: "flex",
	flexDirection: "row",
	backgroundColor: colors.palette.neutral200,
}

const $textInputStyle: TextStyle = {
	width: "80%",
	fontSize: 15,
	backgroundColor: colors.palette.neutral200,
}

const $outlineStyle: ViewStyle = {
	borderWidth: 0,
}

export default GooglePlaceSearchbox
