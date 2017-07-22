import * as React from 'react'

import { Marker } from 'react-leaflet'
import * as Leaflet from 'leaflet'

import { Position } from '../../models'


type UserPositionMarkerProp = {
	position: Position
}

export default function UserPositionMarker(props: UserPositionMarkerProp) {
	return (
		<Marker
			icon={Leaflet.divIcon({className: 'map-user-position-marker-icon'})}
			position={{lat: props.position.latitude, lng: props.position.longitude }}
		/>
	)
}
