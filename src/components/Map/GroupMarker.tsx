import * as React from 'react'

import { Marker, Popup } from 'react-leaflet'
import * as Leaflet from 'leaflet'

import { Position, Transport } from '../../models'
import TransportComp from '../Transport'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

type GroupMarkerProp = {
	group       : Array<Transport>
	userPosition: Position
}

export default function GroupMarker(props: GroupMarkerProp) {
	const { userPosition, group } = props
	const position = group[0].position
	const iconURL  = `${group[0].serverURL}/medias/${group[0].agencyID}/${group[0].image}`
	return (
		<Marker
			position={{lat: position.latitude, lng: position.longitude}}
			alt={group[0].name}
			icon={Leaflet.icon({
				iconUrl  : iconURL,
				iconSize : [30, 30],
				className: 'map-transport-marker-icon',
			})}
		>
			<Popup
				maxWidth={250}
				maxHeight={400}
				offset={[0, -10]}
				className={'map-transport-marker-popup'}
			>
				<MuiThemeProvider>
					<div>
						{group.map(t =>
							<TransportComp
								key={t.ID}
								transport={t}
								userPosition={userPosition}
							/>
						)}
					</div>
				</MuiThemeProvider>
			</Popup>
		</Marker>
	)
}
