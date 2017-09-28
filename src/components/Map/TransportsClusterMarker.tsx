import * as React from 'react'

import { Marker, Popup, MapComponent } from 'react-leaflet'
import * as Leaflet from 'leaflet'

import { Position, TransportsCluster } from '../../models'
import TransportComp from '../Transport'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

type TransportsClusterMarkerProp = {
	cluster           : TransportsCluster
	userPosition      : Position
	onDirectionRequest: (transportID: string) => void
}

export default class TransportsClusterMarker extends MapComponent<TransportsClusterMarkerProp, any> {

	constructor(props) {
		super(props)
	}

	render() {
		const { userPosition, cluster, onDirectionRequest } = this.props
		const genericIcon = cluster.agency.types[cluster.type].icon
		// If the custom one is null, fall back to the generic one
		const customIcon = cluster.transports[0].iconURL || genericIcon
		// If cluster has more than one transports, take the generic icon, else the custom one
		var iconURL = cluster.transports.length > 1 ? genericIcon : customIcon
		return (
			<Marker
				position={{lat: cluster.position.latitude, lng: cluster.position.longitude}}
				alt={cluster.agency.types[cluster.type].name}
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
							{cluster.transports.map(transport =>
								<TransportComp
									key={transport.ID}
									transport={transport}
									agency={cluster.agency}
									userPosition={userPosition}
									onDirectionRequest={onDirectionRequest}
								/>
							)}
						</div>
					</MuiThemeProvider>
				</Popup>
			</Marker>
		)
	}
}
