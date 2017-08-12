declare var jest, describe, it, expect, require

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import TransportComp from './index'
import { Position, Transport, Agency } from '../../models'

const transport = new Transport({
	ID      : "transport-ID",
	agencyID: "transport-agencyID",
	name    : "transport-name",
	position: {latitude: 0, longitude: 0},
	iconURL : "transport-image",
	group   : "transport-group",
	passages: []
})

const agency = new Agency({
	ID        : "agency-ID",
	name      : "agency-name",
	types     : [0],
	typesIcons: ["type-icon"],
}, "server-url")

describe('Transport', () => {

	it('renders without crashing', () => {
		ReactDOM.render(
			<MuiThemeProvider>
				<TransportComp
					agency={agency}
					transport={transport}
					userPosition={new Position()}
					onDirectionRequest={(transportID) => null}
				/>
			</MuiThemeProvider>
			,document.createElement('div')
		)
	})
})
