import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { ThunkAction } from 'redux-thunk';

import { List, ListItem } from 'material-ui/List'
import { Link } from 'react-router-dom'
import Drawer   from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import Toggle   from 'material-ui/Toggle'
import Slider   from 'material-ui/Slider'


export interface NavDrawerProps {
	agencies      : { ID: string, name: string, activated: boolean}[],
	radius        : number
	lock          : boolean
	isOpen        : boolean
	toggleOpen    : () => void
	onRadiusChange: (number) => void
	onAgencyToggle: (string) => void
}


export class NavDrawer extends React.Component<NavDrawerProps, any> {
	constructor(props: NavDrawerProps) {
		super(props)
		this.state = { radius: this.props.radius }
	}

	handleRadiusChange(event: any, value: number) {
		this.setState({ radius: value })
	}

	render() {
		const {
			agencies, onAgencyToggle,
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
					{agencies.map(agency =>
						<ListItem key={agency.ID}>
							<Toggle
								label={agency.name}
								defaultToggled={agency.activated}
								onToggle={onAgencyToggle}
							>
							</Toggle>
						</ListItem>
					)}
				</List>
				<div style={{margin: '0px 25px'}}>
					Radius: <b>{this.state.radius}</b> meters
					<Slider
						min={20}
						max={1000}
						step={10}
						value={radius}
						onChange={this.handleRadiusChange}
						onDragStop={onRadiusChange}
					/>
				</div>
			</Drawer>
		)
	}
}
