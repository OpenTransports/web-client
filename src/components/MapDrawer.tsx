import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import Drawer from 'material-ui/Drawer'

import { Normalized } from '../reducers/normalize'
import { Position, Transport, Agency, Server, TransportsCluster } from '../models'
import TransportsMap from './Map'


interface MapDrawerProps {
	transports        : Transport[]
	agencies          : Normalized<Agency>
	selectedTransport : string
	userPosition      : Position
	mapIsOpen         : boolean
	toggleOpen        : () => void
	onDirectionRequest: (transportID: string) => void
}


export function MapDrawer(props: MapDrawerProps) {
	const { transports, agencies, selectedTransport, onDirectionRequest, userPosition, mapIsOpen, toggleOpen } = props

	const clustersOfTransports = transports.reduce(
		((clusters, transport) => {
			for (let cluster of clusters) {
				if (transport.position.isEqual(cluster.position)) {
					cluster.addTransport([transport])
					return clusters
				}
			}
			clusters.push(
				new TransportsCluster(agencies[transport.agencyID], [transport])
			)
			return clusters
		}),
		[] as TransportsCluster[]
	)


	return (
		<Drawer
			open={mapIsOpen}
			openSecondary={true}
			docked={!mapIsOpen}
			overlayStyle={{opacity: 1, backgroundColor: 'white'}}
			width={"95%"}
			onRequestChange={toggleOpen}
		>
			<TransportsMap
				clusters={clustersOfTransports}
				userPosition={userPosition}
				selectedTransport={selectedTransport}
				onDirectionRequest={onDirectionRequest}
			/>
		</Drawer>
	)
}
