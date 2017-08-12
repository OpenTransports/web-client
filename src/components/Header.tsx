import * as React from 'react'

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton'
import NavigationRefreshIcon from 'material-ui/svg-icons/navigation/refresh'
import LinearProgress from 'material-ui/LinearProgress'
import MapIcon from 'material-ui/svg-icons/maps/map'
import { greenA700 } from 'material-ui/styles/colors'


type HeaderProps = {
	toggleMenu: (Event) => void
	toggleMap : (Event) => void
	refresh   : (Event) => void
	fetching  : number
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

			{props.fetching > 0 && <LinearProgress color={greenA700} style={{flexShrink: 0}}/>}
		</header>
	)
}
