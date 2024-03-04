import React, { FC, memo, useMemo } from "react"
import { VirtualizedList, ViewStyle } from "react-native"
import Skeleton from "./Skeleton"

export interface ListSkeletonProps {
	/**
	 * how many skeleton items you want on the list
	 */
	renders: number
}

const getItem = (_data: unknown, index: number): unknown => ({
	id: Math.random().toString(12).substring(0),
	title: `Item ${index + 1}`,
})

const getItemCount = (_data: unknown) => 10

const SkeletonList: FC<ListSkeletonProps> = ({ renders }) => {
	const SkeletonItem = useMemo(
		() =>
			function SkeletonItem() {
				return <Skeleton style={$visualizedListItemStyle} animation="pulse" />
			},
		[],
	)
	return (
		<VirtualizedList
			style={$visualizedListStyle}
			initialNumToRender={renders}
			renderItem={() => <SkeletonItem />}
			getItemCount={getItemCount}
			getItem={getItem}
		/>
	)
}

const $visualizedListItemStyle: ViewStyle = {
	width: "100%",
	height: 65,
	marginBottom: 10,
	borderRadius: 15,
}

const $visualizedListStyle: ViewStyle = {
	width: "95%",
	height: "70%",
	marginTop: 10,
}

export default memo(SkeletonList)
