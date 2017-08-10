import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { ThunkAction } from 'redux-thunk';

import { List, ListItem } from 'material-ui/List'
import { Link } from 'react-router-dom'
import Drawer   from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import Toggle   from 'material-ui/Toggle'
import Slider   from 'material-ui/Slider'
import { pink500, pink100 } from 'material-ui/styles/colors'

import { AgenciesState, TransportsState } from '../reducers'
import { TransportType } from '../models'

export interface NavDrawerProps {
	agencies      : AgenciesState
	radius        : number
	lock          : boolean
	isOpen        : boolean
	toggleOpen    : () => void
	onRadiusChange: (newRadius: number) => void
	onAgencyToggle: (agencyID: string) => void
	onTypeToggle  : (agencyID: string, typeID: TransportType) => void
}


export class NavDrawer extends React.Component<NavDrawerProps, any> {

	constructor(props: NavDrawerProps) {
		super(props)
		this.state = { radius: this.props.radius }
	}

	render() {
		const {
			agencies,
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
						<ListItem
							key={agencyID}
							nestedItems={agencies.items[agencyID].types.map((typeID, i) =>
								<ListItem
									key={typeID}
									style={{height: 40}}>
									<Toggle
										label={agencies.items[agencyID].typesString[i]}
										defaultToggled={agencies.activatedTypes.indexOf(agencyID+String(typeID)) != -1}
										onToggle={() => onTypeToggle(agencyID, typeID)}
										thumbSwitchedStyle={{backgroundColor: pink500}}
										trackSwitchedStyle={{backgroundColor: pink100}}
									/>
								</ListItem>
							)}
						>
							<Toggle
								label={agencies.items[agencyID].name}
								defaultToggled={agencies.activated.indexOf(agencyID) != -1}
								onToggle={() => onAgencyToggle(agencyID)}
								thumbSwitchedStyle={{backgroundColor: pink500}}
								trackSwitchedStyle={{backgroundColor: pink100}}
							/>
						</ListItem>
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
