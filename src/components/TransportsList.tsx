import * as React from 'react'

import { List, ListItem } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import { grey100 } from 'material-ui/styles/colors'

import { Position, Transport } from '../models'
import TransportComp from './Transport'


interface TransportsListProps {
	transports        : Transport[]
	userPosition      : Position
	onDirectionRequest: (transportID: string) => void
}

export function TransportsList(props: TransportsListProps) {
	const { transports, userPosition, onDirectionRequest } = props

	return (
		<List style={{
			backgroundColor: grey100,
			overflow: 'scroll',
			flexGrow: 1,
		}}>
			{transports
				.sort((t1, t2) => t1.position.distanceFrom(userPosition) - t2.position.distanceFrom(userPosition))
				.map(transport =>
					<ListItem key={transport.ID} innerDivStyle={{padding: '16px 10px'}}>
						<Paper style={{backgroundColor: 'white'}}>
							<TransportComp
								transport={transport}
								userPosition={userPosition}
								onDirectionRequest={onDirectionRequest}
							/>
						</Paper>
					</ListItem>
				)
			}
		</List>
	)
}
