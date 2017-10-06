import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { ThunkAction } from 'redux-thunk';

import { List, ListItem } from 'material-ui/List'
import { Link } from 'react-router-dom'
import Drawer   from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import Toggle   from 'material-ui/Toggle'
import Slider   from 'material-ui/Slider'
import Divider   from 'material-ui/Divider'
import { greenA700, green100 } from 'material-ui/styles/colors'

import { AgenciesState, TransportsState } from '../reducers'
import { Transport, TransportTypeDefaultName } from '../models'

export interface NavDrawerProps {
	agencies         : AgenciesState
	visibleTransports: Transport[]
	radius           : number
	lock             : boolean
	isOpen           : boolean
	toggleOpen       : () => void
	onRadiusChange   : (newRadius: number) => void
	onAgencyToggle   : (agencyID: string) => void
	onTypeToggle     : (agencyID: string, typeID: string) => void
}


export class NavDrawer extends React.Component<NavDrawerProps, any> {

	constructor(props: NavDrawerProps) {
		super(props)
		this.state = { radius: this.props.radius }
	}

	render() {
		const {
			agencies, visibleTransports,
			onAgencyToggle, onTypeToggle,
			radius, onRadiusChange,
			isOpen, lock, toggleOpen } = this.props

		return (
			<Drawer
				containerStyle={{display: 'flex', flexDirection: 'column'}}
				open={isOpen}
				swipeAreaWidth={lock ? 0 : undefined}
				docked={false}
				onRequestChange={toggleOpen}
			>
				<List style={{flexGrow: 1}}>
					{Object.keys(agencies.items).map(agencyID =>
						// Only display agencies that have some transports visible
						// {visibleTransports.filter(transport => transport.agencyID === agencyID).length > 0 &&
							<ListItem
								key={agencyID}
								primaryText={agencies.items[agencyID].name}
								// If only one type, don't show nested item
								// Else show a toggle for each types
								nestedItems={Object.keys(agencies.items[agencyID].types).length > 1 ?
									Object.keys(agencies.items[agencyID].types).map(typeID =>
										<ListItem
											key={typeID}
											style={{height: 40}}>
											<Toggle
												label={agencies.items[agencyID].types[typeID].name || TransportTypeDefaultName[typeID]}
												defaultToggled={agencies.activatedTypes.indexOf(agencyID+typeID) != -1}
												onToggle={() => onTypeToggle(agencyID, typeID)}
												thumbSwitchedStyle={{backgroundColor: greenA700}}
												trackSwitchedStyle={{backgroundColor: green100}}
												disabled={agencies.activated.indexOf(agencyID) == -1}
											/>
										</ListItem>
									) : undefined
								}
								rightToggle={Object.keys(agencies.items[agencyID].types).length == 1 ?
									<Toggle
										defaultToggled={agencies.activated.indexOf(agencyID) != -1}
										onToggle={() => onAgencyToggle(agencyID)}
										thumbSwitchedStyle={{backgroundColor: greenA700}}
										trackSwitchedStyle={{backgroundColor: green100}}
									/> : undefined
								}
							>
							</ListItem>
						// }
					)}
				</List>
				<div className={'radius-slider-container'}>
					Radius: <b>{this.state.radius} m</b>
					<Slider
						min={20}
						max={2000}
						step={10}
						value={radius}
						onChange={(event, newRadius: number) => this.setState({ radius: newRadius })}
						onDragStop={() => onRadiusChange(this.state.radius)}
					/>
				</div>
			</Drawer>
		)
	}
}
