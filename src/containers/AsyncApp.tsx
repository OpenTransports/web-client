import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { ThunkAction } from 'redux-thunk';

import RaisedButton from 'material-ui/RaisedButton'
import LocationOnIcon from 'material-ui/svg-icons/communication/location-on'

import { Header, NavDrawer, MapDrawer, TransportsList } from '../components'

import { Position, Transport } from '../models'
import { RootState } from '../reducers/configureStore'
import {
	fetchTransports, fetchAgencies,
	toggleMenu, toggleMap,
	watchPosition, changeRadius,
	selectTransport,
	toggleAgency, toggleType } from '../actions'


function mapStateToProps(state: RootState): RootState {
	return state
}


class AsyncApp extends React.Component<RootState, any> {

	constructor(props: RootState) {
		super(props)
	}

	render()  {
		const { dispatch, agencies, transports, routes, userPosition, radius, drawers } = this.props

		// 0 - Map items to Transports array
		// 1 - Filter: Don't display Transports that are to fare
		// 2 - Filter: Don't display Transports from non activated agencies
		// 3 - Filter: Don't display Transports from non activated types
		// 4 - Filter: Don't display Transports without an incomming passage
		// 5 - Sort  : Order by distance from the user
		// 6 - Reduce: Only allow transports of same line if they have at least one passage with a different direction
		const visibleTransports = Object.keys(transports.items)
			.map(transportID => transports.items[transportID])
			.filter(transport => transport.position.distanceFrom(userPosition) <= radius)
			.filter(transport => agencies.activated.indexOf(transport.agencyID) != -1 )
			.filter(transport => agencies.activatedTypes.indexOf(transport.agencyID+String(transport.type)) != -1 )
			.filter(transport => transport.passages.length > 0)
			.sort((t1, t2) => t1.position.distanceFrom(userPosition) - t2.position.distanceFrom(userPosition))
			.reduce(((allTransports, t1) => {
				// Get all passages from allTransports for the line of t1
				const sameLinePassages = allTransports
					.filter(t2 => t1.line == t2.line)
					.reduce(((passages, t2) => passages.concat(t2.passages)), [])
				// Get unique passage in t1
				const uniquesPassages = t1.passages
					.filter(p1 => sameLinePassages.find(p2 => p1.direction == p2.direction) == undefined)
				// If t1 contains uniques passages, add it to allTransports
				if (uniquesPassages.length > 0) {
					allTransports.push(t1)
				}
				return allTransports
			}), [] as Transport[])

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
			}}>

				<Header
					isFetching = {agencies.isFetching || transports.isFetching}
					toggleMenu = {() => this.props.dispatch(toggleMenu())}
					toggleMap  = {() => this.props.dispatch(toggleMap())}
					refresh    = {() => {
						this.props.dispatch(fetchAgencies())
						this.props.dispatch(fetchTransports())
					}}
				/>

				<NavDrawer
					agencies       = {agencies}
					radius         = {radius}
					lock           = {drawers.mapIsOpen}
					isOpen         = {drawers.menuIsOpen}
					toggleOpen     = {() => dispatch(toggleMenu())}
					onRadiusChange = {(radius) => dispatch(changeRadius(radius))}
					onAgencyToggle = {agencyID => dispatch(toggleAgency(agencyID))}
					onTypeToggle   = {(agencyID, typeID) => dispatch(toggleType(agencyID, typeID))}
				/>

				<MapDrawer
					transports        = {visibleTransports}
					agencies          = {agencies.items}
					selectedTransport = {transports.selected}
					route             = {routes.items[routes.display]}
					userPosition      = {userPosition}
					mapIsOpen         = {drawers.mapIsOpen}
					toggleOpen        = {() => dispatch(toggleMap())}
					onDirectionRequest={(transportID) => dispatch(selectTransport(transportID))}
				/>


				{userPosition.latitude === 0 && userPosition.latitude === 0 &&
					<RaisedButton
						onClick={() => dispatch(watchPosition())}
						label="OpenTransports needs your location"
						secondary={true}
						icon={<LocationOnIcon/>}
					/>
				}

				{userPosition.latitude !== 0 && userPosition.latitude !== 0 &&
					<TransportsList
						transports={visibleTransports}
						userPosition={userPosition}
						onDirectionRequest={(transportID) => dispatch(selectTransport(transportID))}
					/>
				}
			</div>
		)
	}
}


export default connect(mapStateToProps)(AsyncApp)
