import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { ThunkAction } from 'redux-thunk';

import { List, ListItem } from 'material-ui/List'
import { Link } from 'react-router-dom'
import Drawer   from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import Toggle   from 'material-ui/Toggle'
import Slider   from 'material-ui/Slider'

import { Agency } from '../models'
import { OTState } from '../reducers/opentransports'
import {
	fetchAgencies,
	toggleMenu,
	toggleMap,
	toggleAgency,
	changeRadius } from '../actions'


export interface NavPanelProps {
	dispatch        : Dispatch<any>,
	agencies        : Array<Agency>,
	selectedAgencies: {[name: string]: boolean},
	menuIsOpen      : boolean,
	mapIsOpen      : boolean,
	radius          : number,
}


function mapStateToProps(state: OTState): NavPanelProps {
	return {
		dispatch        : state.dispatch,
		agencies        : state.agencies.items,
		selectedAgencies: state.agencies.selectedAgencies,
		menuIsOpen      : state.drawers.menuIsOpen,
		mapIsOpen       : state.drawers.mapIsOpen,
		radius          : state.radius,
  }
}


class NavPanel extends React.Component<NavPanelProps, any> {
	constructor(props: NavPanelProps) {
		super(props)
		this.handleRadiusChange = this.handleRadiusChange.bind(this)
		this.handleSlideDragStop = this.handleSlideDragStop.bind(this)
		this.state = { radius: this.props.radius }
	}

	handleRadiusChange(event: any, value: number) {
		this.setState({ radius: value })
	}

	handleSlideDragStop() {
		this.props.dispatch(changeRadius(this.state.radius))
	}

	render() {
		const { dispatch, agencies, selectedAgencies, menuIsOpen, mapIsOpen, radius } = this.props
		return (
			<Drawer
				containerStyle={{display: 'flex', flexDirection: 'column'}}
				open={menuIsOpen}
				swipeAreaWidth={mapIsOpen ? 0 : undefined}
				docked={false}
				onRequestChange={()=> dispatch(toggleMenu())}
			>
				<List style={{flexGrow: 1}}>
					{agencies.map((a) =>
						<ListItem key={a.ID}>
							<Toggle
								key={a.ID}
								label={a.name}
								defaultToggled={selectedAgencies[a.ID] != false}
								onToggle={()=> dispatch(toggleAgency(a.ID))}
							>
							</Toggle>
						</ListItem>
					)}
				</List>
				<div style={{margin: '0px 25px'}}>
					Radius: <b>{radius}</b> meters
					<Slider
						min={20}
						max={1000}
						step={10}
						value={radius}
						onChange={this.handleRadiusChange}
						onDragStop={this.handleSlideDragStop}
					/>
				</div>
			</Drawer>
		)
	}
}

export default connect(mapStateToProps)(NavPanel)
