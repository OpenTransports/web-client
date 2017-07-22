import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import Drawer from 'material-ui/Drawer'

import { Position, Transport } from '../models'
import { toggleMap } from '../actions'
import { OTState } from '../reducers/opentransports'
import Map from '../components/Map'


interface MapPanelProps {
	dispatch          : Dispatch<any>
	position          : Position
	transports        : Array<Transport>
	selectedTransport : Transport
	selectedAgencies  : {[name: string]: boolean}
	mapIsOpen         : boolean
	radius            : number
}

function mapStateToProps(state: OTState): MapPanelProps {
	return {
		dispatch         : state.dispatch,
		position         : state.position,
		transports       : state.transports.items,
		selectedTransport: state.transports.selectedTransport,
		selectedAgencies : state.agencies.selectedAgencies,
		mapIsOpen        : state.drawers.mapIsOpen,
		radius           : state.radius,
	}
}

function MapPanel(props: MapPanelProps) {
	const { position, transports, selectedTransport, selectedAgencies, mapIsOpen, dispatch, radius } = props

	const groupsOfTransports = transports
		.filter(t => t.position.distanceFrom(position) <= radius)
		.filter(t => selectedAgencies[t.agencyID])
		.filter(t => t.passages.length > 0)
		.reduce(((groups, t) => {
			for (let g of groups) {
				if (t.position.isEqual(g[0].position)) {
					g.push(t)
					return groups
				}
			}
			groups.push([t])
			return groups
		}), [] as Array<Array<Transport>>)


	return (
		<Drawer
			open={mapIsOpen}
			openSecondary={true}
			docked={!mapIsOpen}
			overlayStyle={{opacity: 1, backgroundColor: 'white'}}
			width={"95%"}
			onRequestChange={()=> dispatch(toggleMap())}
		>
			<Map
				groups={groupsOfTransports}
				position={position}
				selectedTransport={selectedTransport}
			/>
		</Drawer>
	)
}

export default connect(mapStateToProps)(MapPanel)
