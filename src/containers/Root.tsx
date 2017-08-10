import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { blueA700, pink500 } from 'material-ui/styles/colors'

import * as injectTapEventPlugin from 'react-tap-event-plugin'
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// TODO - stay alert and remove when this become unecessary
injectTapEventPlugin();

import "./main.css"

import configureStore from '../reducers/configureStore'
import AsyncApp from './AsyncApp'

const store = configureStore()

const customTheme = {
	...lightBaseTheme,
	palette: {
		...lightBaseTheme.palette,
		primary1Color: blueA700,
		accent1Color: pink500,
	},
}

ReactDOM.render(
	<Provider store={store}>
		<MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
			<AsyncApp/>
		</MuiThemeProvider>
	</Provider>,
	document.getElementById('root')
);
