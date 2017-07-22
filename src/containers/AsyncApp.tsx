import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { ThunkAction } from 'redux-thunk';

import IconButton from 'material-ui/IconButton'
import NavigationRefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import MapIcon from 'material-ui/svg-icons/maps/map'
import { blueA700 } from 'material-ui/styles/colors'
import LinearProgress from 'material-ui/LinearProgress'

import AppBar from 'material-ui/AppBar';
import NavPanel from './NavPanel'
import MapPanel from './MapPanel'
import Content from './Content'

import { Position } from '../models'
import { OTState } from '../reducers/opentransports'
import {
	fetchTransports,
	fetchAgencies,
	toggleMenu,
	toggleMap,
	watchPosition,
} from '../actions'


export interface AsyncAppProps {
	isFetching: boolean,
	dispatch: Dispatch<any>,
	position: Position
}


function mapStateToProps(state: OTState): AsyncAppProps {
	return {
		dispatch   : state.dispatch,
		isFetching : state.transports.isFetching || state.agencies.isFetching,
		position   : state.position,
	}
}


class AsyncApp extends React.Component<AsyncAppProps, any> {

	constructor(props: AsyncAppProps) {
		super(props)
		this.refreshTransports = this.refreshTransports.bind(this)
		this.toggleMenu        = this.toggleMenu.bind(this)
		this.toggleMap         = this.toggleMap.bind(this)
	}

	componentDidMount() {
		this.props.dispatch(watchPosition())
	}

	refreshTransports() {
		this.props.dispatch(fetchAgencies(this.props.position))
		this.props.dispatch(fetchTransports(this.props.position))
	}

	toggleMenu() {
		this.props.dispatch(toggleMenu())
	}

	toggleMap() {
		this.props.dispatch(toggleMap())
	}

	render()  {
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
			}}>
				<AppBar
					style={{flexShrink: 0, backgroundColor: blueA700}}
					title="OpenTransport"
					iconElementRight={
						<div >
							<IconButton
								iconStyle={{color: 'white'}}
								onTouchTap={this.refreshTransports}>
								<NavigationRefreshIcon/>
							</IconButton>
							<IconButton
								iconStyle={{color: 'white'}}
								onTouchTap={this.toggleMap}>
								<MapIcon/>
							</IconButton>
						</div>}
					onLeftIconButtonTouchTap={this.toggleMenu}
				/>
				{this.props.isFetching && <LinearProgress style={{flexShrink: 0}}/>}
				<NavPanel/>
				<MapPanel/>
				<Content/>
			</div>
		)
	}
}


export default connect(mapStateToProps)(AsyncApp)
