import * as React from 'react'
import { Map, TileLayer } from 'react-leaflet'
// import Control from 'react-leaflet-control'
// import AntPath from 'react-leaflet-ant-path'
import 'leaflet/dist/leaflet.css'

import { Position, Transport } from '../../models'
import GroupMarker from './GroupMarker'
import UserPositionMarker from './UserPositionMarker'

import './style.css'


interface MapPanelProps {
	groups            : Array<Array<Transport>>,
	position          : Position,
	selectedTransport : Transport,
}

type Viewport = {
  center: [number, number],
  zoom: number,
}

export default class MapPanel extends React.Component<MapPanelProps, {viewport: Viewport}> {

	constructor(props) {
		super(props)
		// this.locateUser = this.locateUser.bind(this)
		this.state = {viewport:{center: [this.props.position.latitude, this.props.position.longitude], zoom: 15}}
	}

	// TODO - use when find a way to recenter the map
	// locateUser() {
	// 	this.setState(prevState => {
	// 		return {
	// 			viewport: {
	// 				zoom: prevState.viewport.zoom,
	// 				center: [this.props.position.latitude, this.props.position.longitude],
	// 			}
	// 		}
	// 	})
	// }

	render(){
		const { position, groups, selectedTransport } = this.props

		return (
			<Map
				center={{lat: position.latitude, lng: position.longitude}}
				zoom={15}
				maxZoom={18}
				bounceAtZoomLimits={true}
				style={{height: '100%'}}
			>
				<TileLayer
					url='https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png'
					attribution='Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				/>
				<UserPositionMarker position={position}/>
				{groups.map(group =>
					<GroupMarker
						key={group[0].ID}
						group={group}
						userPosition={position}
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
