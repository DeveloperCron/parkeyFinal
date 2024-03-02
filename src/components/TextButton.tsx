import React, { FC, memo } from "react"
import { Button, ButtonProps } from "./Button"
import { StyleProp, TextStyle, ViewStyle } from "react-native"
import { colors } from "@/theme"

export interface TextButtonProps extends ButtonProps {
	/**
	 * Where do you want your text to be aligned in the container
	 */
	alignment?: "center" | "end" | "start"
}

const alignmentStyles: Record<string, ViewStyle> = {
	center: {
		backgroundColor: colors.transparent,
		height: "auto",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		borderColor: colors.transparent,
	},
	start: {
		backgroundColor: colors.transparent,
		height: "auto",
		width: "100%",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		borderColor: colors.transparent,
	},
	end: {
		backgroundColor: colors.transparent,
		height: "auto",
		width: "100%",
		alignItems: "flex-end",
		justifyContent: "flex-end",
		borderColor: colors.transparent,
	},
}

const $textStyle: TextStyle = {
	color: colors.palette.neutral800,
	fontWeight: "700",
	fontSize: 14,
}

const TextButton: FC<TextButtonProps> = ({ alignment, ...props }) => {
	/**
	 * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
	 * @param {boolean} root0.pressed - The pressed state.
	 * @returns {StyleProp<ViewStyle>} The view style based on the pressed state.
	 */
	function $viewStyle(): StyleProp<ViewStyle> {
		return alignmentStyles[alignment || "center"] || {}
	}

	return <Button {...props} style={$viewStyle()} textStyle={$textStyle} />
}

export default memo(TextButton)
