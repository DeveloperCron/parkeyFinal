import { types } from "mobx-state-tree"

export type IUserLocation = {
	longitude: number
	latitude: number
}

const LocationStore = types
	.model("LocationStore", {
		locationRegion: types.maybe(
			types.model("Region", {
				latitude: types.number,
				longitude: types.number,
				latitudeDelta: types.number,
				longitudeDelta: types.number,
			}),
		),
	})
	.actions((self) => ({
		setLocation(region: IUserLocation) {
			self.locationRegion = {
				latitude: region.latitude,
				longitude: region.longitude,
				longitudeDelta: 0.003,
				latitudeDelta: 0.003,
			}
		},
	}))

export default LocationStore.create()
