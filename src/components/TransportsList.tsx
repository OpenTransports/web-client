import * as React from 'react';

import { List, ListItem } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import { grey100, white } from 'material-ui/styles/colors'

import { Transport, Position } from '../models'
import TransportComp from './Transport'


interface TransportsListProps {
	transports: Array<Transport>
	userPosition: Position
}


export default class TransportsList extends React.Component<TransportsListProps, undefined> {
	render() {
		const { transports, userPosition } = this.props
		return (
			<List style={{
				backgroundColor: grey100,
				overflow: 'scroll',
				flexGrow: 1,
			}}>
				{transports.map(t =>
					<ListItem key={t.ID} innerDivStyle={{padding: '16px 10px'}}>
						<Paper style={{backgroundColor: white}}>
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
}
