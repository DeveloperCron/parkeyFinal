import { LatLng } from "react-native-maps"

export const RECENT_PLACES_KEY = "RECENT_PLACES"
export const MAP_STYLING = [
	{
		elementType: "geometry",
		stylers: [
			{
				color: "#f5f5f5",
			},
		],
	},
	{
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#616161",
			},
		],
	},
	{
		elementType: "labels.text.stroke",
		stylers: [
			{
				color: "#f5f5f5",
			},
		],
	},
	{
		featureType: "administrative.land_parcel",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#bdbdbd",
			},
		],
	},
	{
		featureType: "poi",
		elementType: "geometry",
		stylers: [
			{
				color: "#eeeeee",
			},
		],
	},
	{
		featureType: "poi",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#757575",
			},
		],
	},
	{
		featureType: "poi.park",
		elementType: "geometry",
		stylers: [
			{
				color: "#e5e5e5",
			},
		],
	},
	{
		featureType: "poi.park",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#9e9e9e",
			},
		],
	},
	{
		featureType: "road",
		elementType: "geometry",
		stylers: [
			{
				color: "#ffffff",
			},
		],
	},
	{
		featureType: "road.arterial",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#757575",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "geometry",
		stylers: [
			{
				color: "#dadada",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#616161",
			},
		],
	},
	{
		featureType: "road.local",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#9e9e9e",
			},
		],
	},
	{
		featureType: "transit.line",
		elementType: "geometry",
		stylers: [
			{
				color: "#e5e5e5",
			},
		],
	},
	{
		featureType: "transit.station",
		elementType: "geometry",
		stylers: [
			{
				color: "#eeeeee",
			},
		],
	},
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [
			{
				color: "#c9c9c9",
			},
		],
	},
	{
		featureType: "water",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#9e9e9e",
			},
		],
	},
]

export type GateProps = {
	place_id: string
	coords: LatLng
}

export const GATES_DICTIONARY: GateProps[] = [
	{
		place_id: "ChIJD-ON5V04HRURTUeqmfNG2vc",
		coords: {
			latitude: 32.192566176397065,
			longitude: 34.88499234442484,
		},
	},
	{
		place_id: "ChIJjWSOylcSHRURj2uBM4vs-LY",
		coords: {
			latitude: 32.43756443360308,
			longitude: 34.90900079323606,
		},
	},
	{
		place_id: "ChIJodmJ3-QSHRURgrG8tBcI0H0",
		coords: {
			latitude: 32.44337951531229,
			longitude: 34.895491093155556,
		},
	},
	{
		place_id: "ChIJu_9NFJ1LHRURqnCPWAarsj0",
		coords: {
			latitude: 32.07114555211065,
			longitude: 34.78735166660025,
		},
	},
	{
		place_id: "ChIJvW6B69Y2HRURBZdxAwOWV3k",
		coords: {
			latitude: 32.09675036303834,
			longitude: 34.942846353804754,
		},
	},
]
