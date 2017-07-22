import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { ThunkAction } from 'redux-thunk';

import { Header, NavDrawer, MapDrawer, TransportsList } from '../components'

import { Position } from '../models'
import { RootState } from '../reducers/configureStore'
import {
	fetchTransports, fetchAgencies,
	toggleMenu, toggleMap,
	watchPosition,
	changeRadius,
	toggleAgency
} from '../actions'


function mapStateToProps(state: RootState): RootState {
	return state
}


class AsyncApp extends React.Component<RootState, any> {

	constructor(props: RootState) {
		super(props)
	}

	componentDidMount() {
		this.props.dispatch(watchPosition())
	}

	render()  {
		const { dispatch, agencies, transports, userPosition, radius, drawers } = this.props

		// Filter 1: Don't display Transports from non activated agencies
		// Filter 2: Don't display Transports without an incomming passage
		// Filter 3: Don't display Transports that are to fare
		const visibleTransports = Object.keys(transports.items)
			.map(transportID => transports.items[transportID])
			.filter(transport => agencies.activated.indexOf[transport.agencyID] != -1)
			.filter(transport => transport.passages.length > 0)
			.filter(transport => transport.position.distanceFrom(userPosition) <= radius)

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
					agencies       = {
						Object.keys(agencies.items).map(agencyID => {
							return {
								ID: agencyID,
								name: agencies.items[agencyID].name,
								activated: agencies.activated.indexOf(agencyID) != -1,
							}
						})}
					radius         = {radius}
					lock           = {drawers.mapIsOpen}
					isOpen         = {drawers.menuIsOpen}
					toggleOpen     = {() => dispatch(toggleMenu())}
					onRadiusChange = {radius => dispatch(changeRadius(radius))}
					onAgencyToggle = {agencyID => dispatch(toggleAgency(agencyID))}
				/>

				<MapDrawer
					transports        = {visibleTransports}
					selectedTransport = {transports.selected}
					userPosition      = {userPosition}
					mapIsOpen         = {drawers.mapIsOpen}
					toggleOpen        = {() => dispatch(toggleMap())}
				/>

				<TransportsList
					transports={visibleTransports}
					userPosition={userPosition}
				/>
			</div>
		)
	}
}


export default connect(mapStateToProps)(AsyncApp)
