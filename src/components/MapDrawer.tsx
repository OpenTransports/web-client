import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import Drawer from 'material-ui/Drawer'

import { Position, Transport } from '../models'
import TransportsPanel from './Map'


interface MapDrawerProps {
	transports       : Transport[]
	selectedTransport: Transport
	userPosition     : Position
	mapIsOpen        : boolean
	toggleOpen       : () => void
}


export function MapDrawer(props: MapDrawerProps) {
	const { transports, selectedTransport, userPosition, mapIsOpen, toggleOpen } = props

	const groupsOfTransports = transports
		.reduce(((groups, t) => {
			for (let g of groups) {
				if (t.position.isEqual(g[0].position)) {
					g.push(t)
					return groups
				}
			}
			groups.push([t])
			return groups
		}), [] as Transport[][])


	return (
		<Drawer
			open={mapIsOpen}
			openSecondary={true}
			docked={!mapIsOpen}
			overlayStyle={{opacity: 1, backgroundColor: 'white'}}
			width={"95%"}
			onRequestChange={toggleOpen}
		>
			<TransportsPanel
				groups={groupsOfTransports}
				position={userPosition}
				selectedTransport={selectedTransport}
			/>
		</Drawer>
	)
}
