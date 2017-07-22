import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { ThunkAction } from 'redux-thunk'

import TransportsList from '../components/TransportsList'

import { OTState } from '../reducers/opentransports'
import { Position, Transport, Agency } from '../models'
import { fetchTransports } from '../actions'

interface ContentProps {
	dispatch         : Dispatch<any>
	selectedAgencies : {[name: string]: boolean}
	transports       : Array<Transport>
	position         : Position
	radius            : number
}

function mapStateToProps(state: OTState): ContentProps {
	return {
		dispatch         : state.dispatch,
		selectedAgencies : state.agencies.selectedAgencies,
		transports       : state.transports.items,
		position         : state.position,
		radius            : state.radius,
	}
}

class Content extends React.Component<ContentProps, any> {

	constructor(props: ContentProps) {
		super(props)
	}

	render() {
		// Filter 1: don't display Transports from non selected agencies
		// Filter 2: Don't display Transports without an incomming passage
		// Sort: Sort Transports by distance from user
		const { position, radius } = this.props
		let visibleTransports =
			this.props.transports
				.filter(t => t.position.distanceFrom(position) <= radius)
				.filter(t => this.props.selectedAgencies[t.agencyID])
				.filter(t => t.passages.length > 0)
				.sort((t1, t2) => t1.position.distanceFrom(this.props.position) - t2.position.distanceFrom(this.props.position))

		return <TransportsList
			transports={visibleTransports}
			userPosition={position}
		/>
	}
}


export default connect(mapStateToProps)(Content)
