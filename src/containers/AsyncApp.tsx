import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { ThunkAction } from 'redux-thunk';

import RaisedButton from 'material-ui/RaisedButton'
import LocationOnIcon from 'material-ui/svg-icons/communication/location-on'

import { Header, NavDrawer, MapDrawer, TransportsList } from '../components'

import { Position, Transport, TransportType } from '../models'
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

	componentDidMount() {
		this.props.dispatch(watchPosition())
	}

	render()  {
		const {
			dispatch, agencies, transports,
			itineraries, userPosition, radius,
			drawers, linesRoutes
		} = this.props


		const visibleTransports = transports.visible.map(transportID => transports.items[transportID])

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
			}}>

				<Header
					fetching   = {agencies.fetching + transports.fetching}
					toggleMenu = {() => this.props.dispatch(toggleMenu())}
					toggleMap  = {() => this.props.dispatch(toggleMap())}
					refresh    = {() => {
						this.props.dispatch(fetchAgencies())
						this.props.dispatch(fetchTransports())
					}}
				/>

				<NavDrawer
					agencies          = {agencies}
					visibleTransports = {visibleTransports}
					radius            = {radius}
					lock              = {drawers.mapIsOpen}
					isOpen            = {drawers.menuIsOpen}
					toggleOpen        = {() => dispatch(toggleMenu())}
					onRadiusChange    = {radius => dispatch(changeRadius(radius))}
					onAgencyToggle    = {agencyID => dispatch(toggleAgency(agencyID))}
					onTypeToggle      = {(agencyID, typeID) => dispatch(toggleType(agencyID, typeID))}
				/>

				<MapDrawer
					transports         = {visibleTransports}
					agencies           = {agencies.items}
					linesRoutes        = {linesRoutes.items}
					selectedTransport  = {transports.selected}
					itinerary          = {itineraries.items[itineraries.display]}
					userPosition       = {userPosition}
					mapIsOpen          = {drawers.mapIsOpen}
					toggleOpen         = {() => dispatch(toggleMap())}
					onDirectionRequest = {transportID => dispatch(selectTransport(transportID))}
				/>

				{userPosition.latitude !== 0 && userPosition.longitude !== 0 &&
					<TransportsList
						agencies           = {agencies.items}
						transports         = {visibleTransports}
						userPosition       = {userPosition}
						onDirectionRequest = {transportID => dispatch(selectTransport(transportID))}
					/>
				}
			</div>
		)
	}
}


export default connect(mapStateToProps)(AsyncApp)
