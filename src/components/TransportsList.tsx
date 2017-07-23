import * as React from 'react'

import { List, ListItem } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import { grey100 } from 'material-ui/styles/colors'

import { Position, Transport } from '../models'
import TransportComp from './Transport'


interface TransportsListProps {
	transports  : Array<Transport>
	userPosition: Position
}

export function TransportsList(props: TransportsListProps) {
	const { transports, userPosition } = props

	return (
		<List style={{
			backgroundColor: grey100,
			overflow: 'scroll',
			flexGrow: 1,
		}}>
			{transports
				.sort((t1, t2) => t1.position.distanceFrom(userPosition) - t2.position.distanceFrom(userPosition))
				.map(t =>
				<ListItem key={t.ID} innerDivStyle={{padding: '16px 10px'}}>
					<Paper style={{backgroundColor: 'white'}}>
						<TransportComp
							transport={t}
							userPosition={userPosition}
						/>
					</Paper>
				</ListItem>
			)}
		</List>
	)
}
