import * as React from 'react'

import { Marker } from 'react-leaflet'
import * as Leaflet from 'leaflet'

import { Position } from '../../models'


type UserPositionMarkerProp = {
	position: Position
}

export default function UserPositionMarker({position}: UserPositionMarkerProp) {
	return (
		<Marker
			icon={Leaflet.divIcon({
				html: position.heading ?
					`<div class='map-user-position-marker-icon map-user-position-heading-marker-icon' style='transform: rotate(${position.heading}deg);'></div>` :
					`<div class='map-user-position-marker-icon'></div>`
			})}
			position={{lat: position.latitude, lng: position.longitude }}
		/>
	)
}
