import * as React from 'react'

import { Marker, Popup, MapComponent } from 'react-leaflet'
import * as Leaflet from 'leaflet'

import { Position, TransportsCluster } from '../../models'
import TransportComp from '../Transport'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

type TransportsClusterMarkerProp = {
	cluster     : TransportsCluster
	userPosition: Position
	onDirectionRequest: (transportID: string) => void
}

export default class TransportsClusterMarker extends MapComponent<TransportsClusterMarkerProp, any> {

	constructor(props) {
		super(props)
	}

	componentDidUpdate() {
		console.log(this)
		console.log(this['leafletElement'])
	}

	render() {
		const { userPosition, cluster, onDirectionRequest } = this.props
		const iconURL = cluster.transports.length > 1 ? cluster.agency.iconsURL[cluster.type] : cluster.transports[0].iconURL
		return (
			<Marker
				position={{lat: cluster.position.latitude, lng: cluster.position.longitude}}
				alt={cluster.agency.typesString[cluster.agency.types.indexOf(cluster.type)]}
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
							{cluster.transports.map(t =>
								<TransportComp
									key={t.ID}
									transport={t}
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
