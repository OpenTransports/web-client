import * as React from 'react'

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton'
import NavigationRefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import LinearProgress from 'material-ui/LinearProgress'
import MapIcon from 'material-ui/svg-icons/maps/map'
import { pink500 } from 'material-ui/styles/colors'


type HeaderProps = {
	toggleMenu: (Event) => void
	toggleMap : (Event) => void
	refresh   : (Event) => void
	isFetching: boolean
}

export function Header(props: HeaderProps) {
	return (
		<header>
			<AppBar
				style={{flexShrink: 0}}
				title="OpenTransport"
				iconElementRight={
					<div >
						<IconButton
							iconStyle={{color: 'white'}}
							onTouchTap={props.refresh}>
							<NavigationRefreshIcon/>
						</IconButton>
						<IconButton
							iconStyle={{color: 'white'}}
							onTouchTap={props.toggleMap}>
							<MapIcon/>
						</IconButton>
					</div>}
				onLeftIconButtonTouchTap={props.toggleMenu}
			/>
			{props.isFetching && <LinearProgress color={pink500} style={{flexShrink: 0}}/>}
		</header>
	)
}
