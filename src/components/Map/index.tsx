import * as React from 'react'
import { Map, TileLayer } from 'react-leaflet'
// import Control from 'react-leaflet-control'
// import AntPath from 'react-leaflet-ant-path'
import 'leaflet/dist/leaflet.css'

import { Position, Transport, TransportsCluster } from '../../models'
import TransportsClusterMarker from './TransportsClusterMarker'
import UserPositionMarker from './UserPositionMarker'

import './style.css'


interface TransportsMapProps {
	clusters          : TransportsCluster[]
	userPosition      : Position
	selectedTransport : string
	onDirectionRequest: (transportID) => void
}

type Viewport = {
  center: [number, number],
  zoom: number,
}

export default class TransportsMap extends React.Component<TransportsMapProps, {viewport: Viewport}> {

	constructor(props) {
		super(props)
		// this.locateUser = this.locateUser.bind(this)
		this.state = {viewport:{center: [this.props.userPosition.latitude, this.props.userPosition.longitude], zoom: 15}}
	}

	// TODO - use when find a way to recenter the map
	// locateUser() {
	// 	this.setState(prevState => {
	// 		return {
	// 			viewport: {
	// 				zoom: prevState.viewport.zoom,
	// 				center: [this.props.userPosition.latitude, this.props.userPosition.longitude],
	// 			}
	// 		}
	// 	})
	// }

	render(){
		const { userPosition, clusters, selectedTransport, onDirectionRequest } = this.props

		return (
			<Map
				center={{lat: userPosition.latitude, lng: userPosition.longitude}}
				zoom={15}
				maxZoom={18}
				bounceAtZoomLimits={true}
				style={{height: '100%'}}
			>
				<TileLayer
					url='https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'
					attribution='Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				/>
				<UserPositionMarker position={userPosition}/>
				{clusters.map(cluster =>
					<TransportsClusterMarker
						key={cluster.transports[0].ID}
						cluster={cluster}
						userPosition={userPosition}
						onDirectionRequest={onDirectionRequest}
					/>
				)}
			</Map>
		)
	}
}

// TODO - When I now how to import a non typed libs, add the following lines
// {selectedTransport &&
// 	<AntPath
// 	positions={[
// 		{lat: selectedTransport.position.latitude, lng: selectedTransport.position.longitude},
// 		{lat: position.latitude, lng: position.longitude},
// 	]}
// 	/>
// }
// <Control position="bottomright" >
// <button
// >
// </button>
// </Control>
